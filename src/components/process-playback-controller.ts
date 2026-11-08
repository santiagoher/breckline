import type { ProcessScenario } from "../data/landimotos-processes";

export const STEP_REVEAL_MS = 350;

export interface ProcessLogEntry {
  readonly id: string;
  readonly message: string;
}

export interface ProcessPlaybackState {
  readonly scenarioIndex: number;
  readonly stepIndex: number;
  readonly completedCount: number;
  readonly revealedStep: number;
  readonly status: "ready" | "running" | "completed";
  readonly log: readonly ProcessLogEntry[];
  readonly runId: number;
  readonly entered: boolean;
  readonly visible: boolean;
  readonly systemReducedMotion: boolean | null;
  readonly manualReducedMotion: boolean;
}

export type ProcessPlaybackEvent =
  | { type: "viewport"; outside: boolean; sufficientlyVisible: boolean }
  | { type: "visibility"; visible: boolean }
  | { type: "system-motion"; reduced: boolean }
  | { type: "manual-motion"; reduced: boolean }
  | { type: "select"; index: number }
  | { type: "reveal" | "finish"; runId: number; stepIndex: number };

export const initialProcessPlayback: ProcessPlaybackState = {
  scenarioIndex: 0,
  stepIndex: -1,
  completedCount: 0,
  revealedStep: -1,
  status: "ready",
  log: [],
  runId: 0,
  entered: false,
  visible: false,
  systemReducedMotion: null,
  manualReducedMotion: false,
};

function entry(runId: number, event: string, message: string): ProcessLogEntry {
  return { id: `${runId}:${event}`, message };
}

function hasReducedMotion(state: ProcessPlaybackState) {
  return state.manualReducedMotion || state.systemReducedMotion === true;
}

function complete(state: ProcessPlaybackState, process: ProcessScenario): ProcessPlaybackState {
  const log = [entry(state.runId, "start", process.logStart)];
  process.steps.forEach((step, index) => {
    log.push(entry(state.runId, `${index}:start`, step.logStart));
    log.push(entry(state.runId, `${index}:complete`, step.logComplete));
  });
  log.push(entry(state.runId, "complete", "Flujo de trabajo finalizado"));
  return {
    ...state,
    stepIndex: process.steps.length - 1,
    completedCount: process.steps.length,
    revealedStep: process.steps.length - 1,
    status: "completed",
    log,
  };
}

function start(state: ProcessPlaybackState, processes: readonly ProcessScenario[]): ProcessPlaybackState {
  const process = processes[state.scenarioIndex];
  if (!process || state.systemReducedMotion === null) return state;
  const next: ProcessPlaybackState = {
    ...state,
    runId: state.runId + 1,
    stepIndex: 0,
    completedCount: 0,
    revealedStep: -1,
    status: "running",
    log: [],
  };
  if (hasReducedMotion(next)) return complete(next, process);
  return {
    ...next,
    log: [
      entry(next.runId, "start", process.logStart),
      entry(next.runId, "0:start", process.steps[0].logStart),
    ],
  };
}

export function reduceProcessPlayback(
  state: ProcessPlaybackState,
  event: ProcessPlaybackEvent,
  processes: readonly ProcessScenario[],
): ProcessPlaybackState {
  switch (event.type) {
    case "viewport": {
      if (event.outside) {
        if (!state.entered && state.status === "ready") return state;
        return {
          ...state,
          entered: false,
          stepIndex: -1,
          completedCount: 0,
          revealedStep: -1,
          status: "ready",
          log: [],
          runId: state.runId + 1,
        };
      }
      if (state.entered || !event.sufficientlyVisible) return state;
      return start({ ...state, entered: true }, processes);
    }
    case "visibility":
      return state.visible === event.visible ? state : { ...state, visible: event.visible };
    case "select": {
      if (!Number.isFinite(event.index) || processes.length === 0) return state;
      const scenarioIndex = Math.max(0, Math.min(Math.trunc(event.index), processes.length - 1));
      return start({ ...state, scenarioIndex, entered: true }, processes);
    }
    case "system-motion":
    case "manual-motion": {
      const key = event.type === "system-motion" ? "systemReducedMotion" : "manualReducedMotion";
      if (state[key] === event.reduced) return state;
      const next = { ...state, [key]: event.reduced };
      const process = processes[next.scenarioIndex];
      if (process && hasReducedMotion(next) && next.status === "running") return complete(next, process);
      if (next.status === "ready" && next.entered) return start(next, processes);
      return next;
    }
    case "reveal":
    case "finish": {
      // A queued callback from an old selection, viewport visit or phase is harmless.
      if (state.status !== "running" || !state.visible || !state.entered
        || state.runId !== event.runId || state.stepIndex !== event.stepIndex) return state;
      if (event.type === "reveal") {
        return state.revealedStep === state.stepIndex ? state : { ...state, revealedStep: state.stepIndex };
      }
      if (state.revealedStep !== state.stepIndex) return state;
      const process = processes[state.scenarioIndex];
      const step = process.steps[state.stepIndex];
      const completedCount = state.stepIndex + 1;
      const log = [...state.log, entry(state.runId, `${state.stepIndex}:complete`, step.logComplete)];
      if (completedCount === process.steps.length) {
        return {
          ...state,
          completedCount,
          status: "completed",
          log: [...log, entry(state.runId, "complete", "Flujo de trabajo finalizado")],
        };
      }
      return {
        ...state,
        completedCount,
        stepIndex: completedCount,
        log: [...log, entry(state.runId, `${completedCount}:start`, process.steps[completedCount].logStart)],
      };
    }
  }
}

interface TimerHost {
  now(): number;
  setTimeout(callback: () => void, delay: number): number;
  clearTimeout(id: number): void;
}

interface TimerPhase {
  key: string;
  remaining: number;
  startedAt: number | null;
  timerId: number | null;
}

/** One cancellable clock. Pausing keeps the current phase's remaining duration. */
export class ProcessPlaybackClock {
  private phase: TimerPhase | null = null;
  private generation = 0;

  constructor(private readonly host: TimerHost) {}

  pause() {
    this.generation += 1;
    if (!this.phase) return;
    if (this.phase.timerId !== null) this.host.clearTimeout(this.phase.timerId);
    if (this.phase.startedAt !== null) {
      this.phase.remaining = Math.max(0, this.phase.remaining - (this.host.now() - this.phase.startedAt));
    }
    this.phase.startedAt = null;
    this.phase.timerId = null;
  }

  reset() {
    this.pause();
    this.phase = null;
  }

  schedule(key: string, duration: number, callback: () => void) {
    this.pause();
    if (this.phase?.key !== key) {
      this.phase = { key, remaining: duration, startedAt: null, timerId: null };
    }
    const phase = this.phase;
    const generation = this.generation;
    phase.startedAt = this.host.now();
    phase.timerId = this.host.setTimeout(() => {
      if (this.phase !== phase || this.generation !== generation) return;
      phase.remaining = 0;
      phase.startedAt = null;
      phase.timerId = null;
      callback();
    }, phase.remaining);
  }
}
