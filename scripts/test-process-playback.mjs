import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function importTypeScript(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { initialProcessPlayback, reduceProcessPlayback, ProcessPlaybackClock, STEP_REVEAL_MS } =
  await importTypeScript("../src/components/process-playback-controller.ts");
const { landimotosProcesses: processes } = await importTypeScript("../src/data/landimotos-processes.ts");
const reduce = (state, event) => reduceProcessPlayback(state, event, processes);
const enter = { type: "viewport", outside: false, sufficientlyVisible: true };
const partial = { type: "viewport", outside: false, sufficientlyVisible: false };
const leave = { type: "viewport", outside: true, sufficientlyVisible: false };
const finalMessage = "Flujo de trabajo finalizado";

function ready(reduced = false) {
  let state = reduce(initialProcessPlayback, { type: "system-motion", reduced });
  return reduce(state, { type: "visibility", visible: true });
}

function phase(state, type) {
  return reduce(state, { type, runId: state.runId, stepIndex: state.stepIndex });
}

test("waits for sufficient visibility, latches through scroll jitter and completes only after all five steps", () => {
  let state = ready();
  assert.equal(state.status, "ready");
  assert.equal(state.stepIndex, -1);
  assert.deepEqual(state.log, []);
  assert.equal(reduce(state, partial), state);
  state = reduce(state, enter);
  const runId = state.runId;
  assert.equal(state.status, "running");
  assert.equal(state.revealedStep, -1);
  assert.equal(state.log.length, 2);
  for (let index = 0; index < 5; index += 1) {
    assert.equal(state.stepIndex, index);
    assert.equal(state.completedCount, index);
    assert.equal(state.status, "running");
    assert.ok(!state.log.some(({ message }) => message === finalMessage));
    assert.equal(reduce(state, partial), state);
    assert.equal(reduce(state, enter), state);
    assert.equal(phase(state, "finish"), state, "a step cannot finish before its reveal");
    state = phase(state, "reveal");
    assert.equal(state.revealedStep, index);
    assert.equal(state.completedCount, index);
    state = phase(state, "finish");
    assert.equal(state.completedCount, index + 1);
    assert.equal(state.runId, runId);
  }
  assert.equal(state.status, "completed");
  assert.equal(state.revealedStep, 4);
  assert.equal(state.log.at(-1).message, finalMessage);
  assert.equal(new Set(state.log.map(({ id }) => id)).size, state.log.length);
  assert.equal(reduce(state, enter), state, "completion stays visible without a loop");
  assert.equal(phase(state, "finish"), state);
});

test("rapid, revisited and same-process selections clear progress and reject old callbacks", () => {
  let state = reduce(ready(), enter);
  state = phase(phase(state, "reveal"), "finish");
  const obsolete = { type: "reveal", runId: state.runId, stepIndex: state.stepIndex };
  let previousRun = state.runId;
  for (const index of [1, 5, 2, 0, 0]) {
    state = reduce(state, { type: "select", index });
    assert.equal(state.scenarioIndex, index);
    assert.equal(state.stepIndex, 0);
    assert.equal(state.completedCount, 0);
    assert.equal(state.revealedStep, -1);
    assert.ok(state.runId > previousRun);
    previousRun = state.runId;
    assert.deepEqual(state.log.map(({ message }) => message), [processes[index].logStart, processes[index].steps[0].logStart]);
    assert.equal(reduce(state, obsolete), state);
  }
});

test("complete viewport exit resets and reentry requires the entry threshold again", () => {
  let state = reduce(ready(), { type: "select", index: 3 });
  state = phase(phase(state, "reveal"), "finish");
  const obsolete = { type: "reveal", runId: state.runId, stepIndex: state.stepIndex };
  state = reduce(state, leave);
  assert.equal(state.status, "ready");
  assert.equal(state.scenarioIndex, 3);
  assert.equal(state.stepIndex, -1);
  assert.equal(state.completedCount, 0);
  assert.deepEqual(state.log, []);
  assert.equal(reduce(state, obsolete), state);
  assert.equal(reduce(state, partial), state);
  state = reduce(state, enter);
  assert.equal(state.scenarioIndex, 3);
  assert.equal(state.stepIndex, 0);
  assert.equal(state.status, "running");
});

test("OS and manual reduced motion show the complete result without sequential playback", () => {
  let state = ready(true);
  assert.equal(state.status, "ready", "offscreen reduced motion remains neutral");
  state = reduce(state, enter);
  assert.equal(state.status, "completed");
  assert.equal(state.completedCount, 5);
  assert.equal(state.revealedStep, 4);
  const previousRun = state.runId;
  state = reduce(state, { type: "select", index: 4 });
  assert.ok(state.runId > previousRun);
  assert.equal(state.status, "completed");
  assert.equal(state.log.at(-1).message, finalMessage);
  state = reduce(ready(), enter);
  state = reduce(state, { type: "manual-motion", reduced: true });
  assert.equal(state.status, "completed");
  assert.equal(state.completedCount, 5);
  state = reduce(state, { type: "manual-motion", reduced: false });
  assert.equal(state.status, "completed", "unchecking does not unexpectedly restart the flow");
  state = reduce(state, { type: "select", index: 0 });
  assert.equal(state.status, "running");
  state = reduce(state, { type: "system-motion", reduced: true });
  assert.equal(state.status, "completed");
});

test("hidden tabs reject progress while keeping the current step and its log", () => {
  let state = phase(reduce(ready(), enter), "reveal");
  const visibleState = state;
  state = reduce(state, { type: "visibility", visible: false });
  assert.equal(phase(state, "finish"), state);
  assert.equal(phase(state, "reveal"), state);
  state = reduce(state, { type: "visibility", visible: true });
  assert.deepEqual(state, visibleState);
  assert.equal(phase(state, "finish").completedCount, 1);
});

function fakeHost() {
  let now = 0;
  let nextId = 0;
  const pending = new Map();
  const callbacks = new Map();
  return {
    now: () => now,
    pending,
    callbacks,
    setTimeout(callback, delay) {
      const id = ++nextId;
      pending.set(id, { callback, due: now + delay });
      callbacks.set(id, callback);
      return id;
    },
    clearTimeout(id) { pending.delete(id); },
    advance(duration) {
      const target = now + duration;
      while (pending.size) {
        const [id, next] = [...pending.entries()].sort((left, right) => left[1].due - right[1].due)[0];
        if (next.due > target) break;
        now = next.due;
        pending.delete(id);
        next.callback();
      }
      now = target;
    },
  };
}

test("one clock pauses for hidden tabs, resumes the remaining time and survives Strict Mode cleanup", () => {
  const host = fakeHost();
  const clock = new ProcessPlaybackClock(host);
  let completions = 0;
  const complete = () => { completions += 1; };
  clock.schedule("run:step:finish", 1_650, complete);
  const firstCallback = host.callbacks.get(1);
  clock.pause();
  clock.schedule("run:step:finish", 1_650, complete);
  assert.equal(host.pending.size, 1);
  firstCallback();
  assert.equal(completions, 0, "cleanup invalidates even already-queued old callbacks");
  host.advance(450);
  clock.pause();
  host.advance(8_000);
  assert.equal(completions, 0);
  assert.equal(host.pending.size, 0);
  clock.schedule("run:step:finish", 1_650, complete);
  host.advance(1_199);
  assert.equal(completions, 0);
  host.advance(1);
  assert.equal(completions, 1, "the 450ms already played are preserved");
  assert.equal(host.pending.size, 0);
});

test("restart cancels the old clock and begins a fresh full duration", () => {
  const host = fakeHost();
  const clock = new ProcessPlaybackClock(host);
  const events = [];
  clock.schedule("old", 350, () => events.push("old"));
  host.advance(300);
  const obsolete = host.callbacks.get(1);
  clock.reset();
  clock.schedule("new", 350, () => events.push("new"));
  obsolete();
  host.advance(349);
  assert.deepEqual(events, []);
  assert.equal(host.pending.size, 1);
  host.advance(1);
  assert.deepEqual(events, ["new"]);
});

test("all six flows run in their configured durations and leave no final timer", () => {
  for (let scenarioIndex = 0; scenarioIndex < processes.length; scenarioIndex += 1) {
    const host = fakeHost();
    const clock = new ProcessPlaybackClock(host);
    let state = reduce(ready(), { type: "select", index: scenarioIndex });
    const completedAt = [];
    const schedule = () => {
      if (state.status !== "running") return;
      const step = processes[state.scenarioIndex].steps[state.stepIndex];
      const type = state.revealedStep === state.stepIndex ? "finish" : "reveal";
      const duration = type === "reveal" ? STEP_REVEAL_MS : step.durationMs - STEP_REVEAL_MS;
      clock.schedule(`${state.runId}:${state.stepIndex}:${type}`, duration, () => {
        state = phase(state, type);
        if (type === "finish") completedAt.push(host.now());
        schedule();
      });
      assert.equal(host.pending.size, 1);
    };
    schedule();
    let elapsed = 0;
    for (const step of processes[scenarioIndex].steps) {
      assert.ok(step.durationMs >= 1_500 && step.durationMs <= 2_500);
      host.advance(step.durationMs);
      elapsed += step.durationMs;
      assert.equal(completedAt.at(-1), elapsed);
    }
    assert.equal(state.status, "completed");
    assert.equal(state.completedCount, 5);
    assert.equal(state.log.at(-1).message, finalMessage);
    assert.equal(host.pending.size, 0);
    host.advance(60_000);
    assert.equal(completedAt.length, 5);
  }
});
