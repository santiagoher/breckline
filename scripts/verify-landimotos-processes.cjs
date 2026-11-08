/*
 * Browser regression checks for the Landimotos process demonstration.
 * Start the app, then run: node scripts/verify-landimotos-processes.cjs
 * Optional: BASE_URL, PLAYWRIGHT_MODULE, CHROME_CHANNEL, QA_SCREENSHOTS.
 * Uses an existing Playwright installation; it adds no application dependency.
 * Visibility suspension is tested with a synthetic visibilitychange event.
 * This verifies the controller, not actual background-tab browser throttling.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_MODULE,
    'playwright',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'ms-playwright-go/1.57.0/package'),
  ].filter(Boolean);
  for (const candidate of candidates) {
    try { return require(candidate); } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
    }
  }
  throw new Error('Set PLAYWRIGHT_MODULE to an existing Playwright package.');
}

const { chromium } = loadPlaywright();
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const url = `${baseURL}/proyectos/portal-logistico-landimotos`;
const ids = ['dispatch', 'routes', 'service', 'whatsapp', 'admin', 'indicators'];
const screenshotDirectory = path.resolve(process.env.QA_SCREENSHOTS || '.codex-tmp');
const failures = [];
const report = [];
const browserErrors = [];
const hostSettle = () => new Promise((resolve) => setTimeout(resolve, 45));

async function test(name, callback) {
  try {
    const detail = await callback();
    report.push({ name, status: 'passed', ...(detail ? { detail } : {}) });
    console.log(`PASS ${name}${detail ? ` ${JSON.stringify(detail)}` : ''}`);
  } catch (error) {
    failures.push({ name, message: error.message });
    report.push({ name, status: 'failed', message: error.message });
    console.error(`FAIL ${name}: ${error.stack}`);
  }
}

function player(page) { return page.locator('[data-process-player]'); }
function scenarios(page) { return player(page).locator('fieldset button'); }

async function state(page) {
  return player(page).evaluate((element) => ({
    scenario: element.dataset.scenario,
    step: Number(element.dataset.step),
    run: element.dataset.run,
    status: element.dataset.status,
    playing: element.dataset.playing === 'true',
    completed: Number(element.dataset.completedCount),
    steps: Array.from(element.querySelectorAll('[aria-label="Pasos del proceso"] > li'), (item) => item.dataset.state),
    logs: Array.from(element.querySelectorAll('[data-process-log] li'), (item) => {
      const content = item.cloneNode(true);
      content.querySelectorAll('[aria-hidden="true"]').forEach((decoration) => decoration.remove());
      return content.textContent.trim();
    }),
    height: element.getBoundingClientRect().height,
  }));
}

function checkConsistency(snapshot) {
  assert.equal(snapshot.steps.length, 5, 'all five steps remain visible');
  assert.equal(snapshot.steps.filter((item) => item === 'completed').length, snapshot.completed, 'completed count matches timeline');
  assert(snapshot.logs.length <= 3, 'log displays at most three entries');
  assert(snapshot.steps.filter((item) => item === 'running').length <= 1, 'at most one step runs');
  if (snapshot.status === 'completed') {
    assert.equal(snapshot.completed, 5, 'global completion requires all five steps');
    assert(snapshot.steps.every((item) => item === 'completed'));
    assert.equal(snapshot.playing, false);
    assert.equal(snapshot.logs.at(-1), 'Flujo de trabajo finalizado');
  } else if (snapshot.status === 'running') {
    assert.equal(snapshot.completed, snapshot.step - 1);
    assert.equal(snapshot.steps[snapshot.step - 1], 'running');
  } else {
    assert.equal(snapshot.status, 'ready');
    assert.equal(snapshot.step, 0);
    assert.equal(snapshot.completed, 0);
    assert(snapshot.steps.every((item) => item === 'pending'));
  }
}

async function tick(page, milliseconds) {
  await page.clock.runFor(milliseconds);
  await hostSettle();
}

async function positionAtRatio(page, ratio) {
  await player(page).evaluate((element, fraction) => {
    const bounds = element.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + bounds.top - (window.innerHeight - bounds.height * fraction), behavior: 'instant' });
  }, ratio);
  await hostSettle();
}

async function showPlayer(page) {
  await player(page).scrollIntoViewIfNeeded();
  await hostSettle();
}

async function select(page, index) {
  await scenarios(page).nth(index).click();
  await hostSettle();
  const snapshot = await state(page);
  assert.equal(snapshot.scenario, ids[index]);
  assert.equal(await scenarios(page).nth(index).getAttribute('aria-pressed'), 'true');
  return snapshot;
}

async function setVisibility(page, visible) {
  await page.evaluate((isVisible) => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => isVisible ? 'visible' : 'hidden' });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => !isVisible });
    document.dispatchEvent(new Event('visibilitychange'));
  }, visible);
  await hostSettle();
}

async function runToCompletion(page, allowedLogs) {
  let elapsed = 0;
  let previous = await state(page);
  const heights = [previous.height];
  const stepBoundaries = [];
  const collectedLogs = new Set(previous.logs);
  checkConsistency(previous);
  for (; elapsed < 14000 && previous.status !== 'completed';) {
    await tick(page, 100);
    elapsed += 100;
    const current = await state(page);
    checkConsistency(current);
    assert.equal(current.run, previous.run, 'execution cannot restart while progressing');
    assert.equal(current.scenario, previous.scenario, 'execution cannot change scenario');
    assert(current.completed >= previous.completed && current.completed <= previous.completed + 1, 'steps complete once, in order');
    if (current.completed > previous.completed) stepBoundaries.push(elapsed);
    for (const entry of current.logs) {
      collectedLogs.add(entry);
      if (allowedLogs) assert(allowedLogs.has(entry), `mixed log entry: ${entry}`);
    }
    heights.push(current.height);
    previous = current;
  }
  assert.equal(previous.status, 'completed', 'flow finishes within the expected duration');
  assert(Math.max(...heights) - Math.min(...heights) <= 1, 'window height stays stable throughout playback');
  return { snapshot: previous, stepBoundaries, collectedLogs, elapsed };
}

async function colorOf(locator, property = 'color') {
  return locator.evaluate((element, styleProperty) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d');
    context.fillStyle = getComputedStyle(element)[styleProperty];
    context.fillRect(0, 0, 1, 1);
    return Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
  }, property);
}

(async () => {
  fs.mkdirSync(screenshotDirectory, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  page.on('pageerror', (error) => browserErrors.push(error.message));
  const logVocabulary = new Map();
  let firstStepDuration = 0;
  try {
    await page.clock.install({ time: new Date('2030-01-01T12:00:00Z') });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.clock.pauseAt(new Date('2030-01-01T12:01:00Z'));
    await hostSettle();

    await test('neutral state and entry threshold', async () => {
      let snapshot = await state(page);
      checkConsistency(snapshot);
      assert.equal(snapshot.status, 'ready');
      assert.equal(snapshot.playing, false);
      assert.equal(await player(page).getByRole('button', { name: /Reproducir|Reiniciar/ }).count(), 0);
      assert.equal(await player(page).evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(30, 30, 30)');
      await positionAtRatio(page, 0.2);
      assert.equal((await state(page)).status, 'ready', '20% entry must remain neutral');
      await positionAtRatio(page, 0.4);
      snapshot = await state(page);
      checkConsistency(snapshot);
      assert.equal(snapshot.status, 'running', '40% entry starts automatically');
      assert.equal(snapshot.step, 1);
      assert.equal(snapshot.playing, true);
      assert(snapshot.logs.length >= 1);
    });

    await test('threshold jitter preserves the active run', async () => {
      await showPlayer(page);
      const start = await select(page, 0);
      await tick(page, 700);
      for (const ratio of [0.34, 0.37, 0.28, 0.39]) {
        await positionAtRatio(page, ratio);
        const current = await state(page);
        assert.equal(current.run, start.run);
        assert.equal(current.playing, true);
        assert.equal(current.step, 1);
      }
      await showPlayer(page);
    });

    await test('pending results and gradual detail reveal', async () => {
      await select(page, 0);
      const frame = player(page).locator('[aria-label="Detalle del proceso"] > [data-visible="true"]');
      assert.equal(await frame.locator('dl [data-pending="true"]').count(), 4);
      assert.equal(await player(page).locator('[aria-label="Pasos del proceso"] > li[data-state="pending"] svg').count(), 0, 'pending steps have no check or result icon');
      assert.equal(await player(page).locator('[data-process-status]').innerText(), 'Ejecutando flujo de trabajo');
      const [red, green, blue] = await colorOf(player(page).locator('[data-process-status-dot]'), 'backgroundColor');
      assert(red > green && green > blue, `execution dot must be orange: ${red},${green},${blue}`);
      await tick(page, 200);
      assert.equal(await frame.locator('dl [data-pending="true"]').count(), 4, 'details do not appear immediately');
      await tick(page, 250);
      assert.equal(await frame.locator('dl [data-pending="false"]').count(), 1, 'only the running step reveals its result');
      const values = await frame.locator('dl [data-pending="false"] dd').innerText();
      assert.equal(values.trim(), 'Principal');
    });

    for (let index = 0; index < ids.length; index++) {
      await test(`ordered completion: ${ids[index]}`, async () => {
        const start = await select(page, index);
        assert.equal(start.completed, 0);
        assert.equal(start.step, 1);
        assert.equal(start.status, 'running');
        assert(start.logs.length <= 2, 'new process clears older logs');
        const result = await runToCompletion(page);
        assert.equal(result.stepBoundaries.length, 5);
        const durations = result.stepBoundaries.map((end, position) => end - (result.stepBoundaries[position - 1] || 0));
        assert(durations.every((duration) => duration >= 1500 && duration <= 2600), `step durations: ${durations}`);
        if (index === 0) firstStepDuration = durations[0];
        logVocabulary.set(ids[index], result.collectedLogs);
        // CSS transitions use the browser compositor clock, not the mocked JS clock.
        await new Promise((resolve) => setTimeout(resolve, 400));
        const checks = player(page).locator('[aria-label="Pasos del proceso"] > li[data-state="completed"] svg');
        assert.equal(await checks.count(), 5, 'each completed step displays an SVG check');
        for (let check = 0; check < 5; check++) {
          const [red, green, blue] = await colorOf(checks.nth(check));
          assert(green > red && green > blue, `check must be green: ${red},${green},${blue}`);
        }
        assert.equal(await player(page).locator('[data-process-status]').innerText(), 'Flujo de trabajo finalizado');
        const [red, green, blue] = await colorOf(player(page).locator('[data-process-status-dot]'), 'backgroundColor');
        assert(red > green && blue > green, `global completion must be purple: ${red},${green},${blue}`);
        assert.equal(await player(page).locator('[data-process-status-dot]').evaluate((element) => getComputedStyle(element).animationName), 'none', 'completion dot does not pulse');
        await tick(page, 15000);
        const stable = await state(page);
        assert.equal(stable.run, result.snapshot.run);
        assert.equal(stable.scenario, ids[index]);
        assert.deepEqual(stable.logs, result.snapshot.logs);
        assert.equal(stable.status, 'completed', 'completed flow does not loop');
        return { durations };
      });
    }

    await test('rapid selection, revisiting and same-process restart', async () => {
      let previousRun = (await state(page)).run;
      for (const index of [0, 3, 5, 1, 0, 0, 4, 2]) {
        const fresh = await select(page, index);
        assert.notEqual(fresh.run, previousRun, 'every click starts a new execution');
        assert.equal(fresh.step, 1);
        assert.equal(fresh.completed, 0);
        checkConsistency(fresh);
        for (const line of fresh.logs) assert(logVocabulary.get(ids[index])?.has(line), `foreign log after switch: ${line}`);
        previousRun = fresh.run;
        await tick(page, 270);
      }
      await runToCompletion(page, logVocabulary.get('service'));
    });

    await test('full viewport exit suspends and reentry restarts', async () => {
      await showPlayer(page);
      const initial = await select(page, 0);
      await tick(page, 850);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await hostSettle();
      const outside = await state(page);
      assert.equal(outside.playing, false);
      await tick(page, 8000);
      assert.deepEqual((await state(page)).logs, outside.logs);
      await positionAtRatio(page, 0.2);
      assert.equal((await state(page)).playing, false, 'small reentry does not restart');
      await positionAtRatio(page, 0.4);
      const restarted = await state(page);
      assert.notEqual(restarted.run, initial.run);
      assert.equal(restarted.step, 1);
      assert.equal(restarted.completed, 0);
      assert.equal(restarted.playing, true);
      await showPlayer(page);
    });

    await test('synthetic tab visibility preserves remaining step time', async () => {
      assert(firstStepDuration >= 1500, 'first-step duration established');
      const initial = await select(page, 0);
      await tick(page, 800);
      await setVisibility(page, false);
      try {
        const suspended = await state(page);
        assert.equal(suspended.playing, false);
        await tick(page, 8000);
        const hidden = await state(page);
        assert.equal(hidden.step, suspended.step);
        assert.equal(hidden.run, initial.run);
        assert.deepEqual(hidden.logs, suspended.logs);
      } finally { await setVisibility(page, true); }
      assert.equal((await state(page)).playing, true);
      await tick(page, firstStepDuration - 950);
      assert.equal((await state(page)).step, 1, 'remaining duration is not discarded');
      await tick(page, 250);
      const resumed = await state(page);
      assert.equal(resumed.step, 2, 'step resumes remaining time instead of starting its duration again');
      assert.equal(resumed.run, initial.run);
    });

    await test('keyboard selection and visible focus', async () => {
      await scenarios(page).first().focus();
      await page.keyboard.press('Tab');
      assert.equal(await scenarios(page).nth(1).evaluate((element) => element === document.activeElement), true);
      await page.keyboard.press('Enter');
      assert.equal((await state(page)).scenario, 'routes');
      const firstRun = (await state(page)).run;
      await page.keyboard.press('Space');
      assert.notEqual((await state(page)).run, firstRun);
      const focus = await scenarios(page).nth(1).evaluate((element) => ({
        visible: element.matches(':focus-visible'),
        outline: getComputedStyle(element).outlineStyle,
        outlineWidth: getComputedStyle(element).outlineWidth,
        shadow: getComputedStyle(element).boxShadow,
      }));
      assert(focus.visible);
      assert((focus.outline !== 'none' && focus.outlineWidth !== '0px') || focus.shadow !== 'none', 'keyboard focus has a visible treatment');
      await page.keyboard.press('ArrowRight');
      assert.equal((await state(page)).scenario, 'service');
      await page.keyboard.press('End');
      assert.equal((await state(page)).scenario, 'indicators');
      await page.keyboard.press('Home');
      assert.equal((await state(page)).scenario, 'dispatch');
    });

    await test('manual reduced motion completes immediately and keeps future selections static', async () => {
      await player(page).getByRole('checkbox', { name: 'Reducir movimiento' }).check();
      await hostSettle();
      checkConsistency(await state(page));
      assert.equal((await state(page)).status, 'completed');
      for (const index of [4, 5, 0]) {
        const complete = await select(page, index);
        checkConsistency(complete);
        assert.equal(complete.status, 'completed');
      }
      const logLiveRegions = await player(page).locator('[data-process-log]').evaluate((element) => ({ role: element.getAttribute('role'), live: element.getAttribute('aria-live') }));
      assert(logLiveRegions.live === null || logLiveRegions.live === 'off', 'individual log entries must not be announced');
      assert.notEqual(logLiveRegions.role, 'log');
    });

    for (const width of [1440, 1024, 768, 390, 320]) {
      await test(`responsive stable layout: ${width}px`, async () => {
        await page.setViewportSize({ width, height: 1000 });
        await showPlayer(page);
        const heights = [];
        for (let index = 0; index < ids.length; index++) {
          await select(page, index);
          const metrics = await player(page).evaluate((element) => ({
            height: element.getBoundingClientRect().height,
            right: element.getBoundingClientRect().right,
            left: element.getBoundingClientRect().left,
            scrollWidth: document.documentElement.scrollWidth,
            viewport: window.innerWidth,
          }));
          assert(metrics.scrollWidth <= metrics.viewport, `horizontal overflow at ${width}px: ${JSON.stringify(metrics)}`);
          assert(metrics.left >= 0 && metrics.right <= width + 1, 'window fits horizontally');
          heights.push(metrics.height);
        }
        assert(Math.max(...heights) - Math.min(...heights) <= 1, `scenario switching changes height: ${heights}`);
        await select(page, 0);
        await player(page).screenshot({ path: path.join(screenshotDirectory, `landimotos-terminal-${width}.png`), animations: 'disabled' });
        return { height: heights[0] };
      });
    }

    await test('operating-system reduced motion is immediate', async () => {
      const reducedPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      reducedPage.on('pageerror', (error) => browserErrors.push(error.message));
      try {
        await reducedPage.goto(url);
        await showPlayer(reducedPage);
        for (let index = 0; index < ids.length; index++) {
          const snapshot = await select(reducedPage, index);
          checkConsistency(snapshot);
          assert.equal(snapshot.status, 'completed');
        }
        const activeAnimations = await player(reducedPage).evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').map((animation) => animation.animationName || 'transition'));
        assert.deepEqual(activeAnimations, [], 'reduced motion disables pulses and movement');
      } finally { await reducedPage.close(); }
    });

    await test('no browser runtime errors', async () => assert.deepEqual(browserErrors, []));
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(screenshotDirectory, 'landimotos-process-qa.json'), `${JSON.stringify({ url, report, failures, browserErrors }, null, 2)}\n`);
  }
  if (failures.length) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exitCode = 1; });
