import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LOCALAPPDATA + '/ms-playwright-go/1.57.0/package');
const directory = '.codex-tmp/video-review/scroll';
fs.mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const reports = [];
const sizes = [[1440, 900], [1366, 768], [1920, 1080], [1024, 600], [768, 1024], [390, 844], [320, 700]];

async function open(width, height, reducedMotion = 'no-preference', blocked = false) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('breckline-cookie-consent-v1', 'rejected'));
  if (blocked) await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    window.__playAttempts = 0;
    window.__allowPlayback = false;
    HTMLMediaElement.prototype.play = function () {
      window.__playAttempts++;
      return window.__allowPlayback ? play.call(this) : Promise.reject(new DOMException('Blocked autoplay for QA', 'NotAllowedError'));
    };
  });
  await page.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
  await page.evaluate(() => document.fonts.ready);
  // Disable only CSS smooth anchor/focus navigation for exact scroll-position comparisons.
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; } html { scroll-behavior: auto !important; }' });
  await page.waitForFunction(() => document.querySelector('[data-landimotos-hero]'));
  return page;
}

async function playing(page, expected) {
  await page.waitForFunction(expected => {
    const v = document.querySelector('main video');
    const button = v.parentElement.querySelector('button');
    return !v.paused === expected && button.getAttribute('aria-label') === (expected ? 'Pausar video' : 'Reanudar video');
  }, expected);
}

async function at(page, y) {
  return page.evaluate(async y => {
    window.scrollTo({ top: y, behavior: 'instant' });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const root = document.querySelector('[data-landimotos-hero]');
    const copy = root.firstElementChild;
    const visual = root.lastElementChild;
    const frame = visual.firstElementChild;
    const video = root.querySelector('video');
    const rect = el => {
      const { x, y, width, height, top, bottom } = el.getBoundingClientRect();
      return { x, y, width, height, top, bottom };
    };
    return {
      y: scrollY, root: rect(root), copy: rect(copy), frame: rect(frame), video: rect(video),
      copyOpacity: Number(getComputedStyle(copy).opacity), copyTransform: getComputedStyle(copy).transform,
      visualTransform: getComputedStyle(visual).transform,
      padding: getComputedStyle(frame).paddingTop, border: getComputedStyle(frame).borderTopWidth,
      videoFilter: getComputedStyle(video).filter, fit: getComputedStyle(video).objectFit,
      facts: rect(root.nextElementSibling), context: rect(document.querySelector('#enfoque')),
      protected: rect(document.querySelector('#procesos')),
      pageHeight: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      time: video.currentTime, paused: video.paused,
    };
  }, y);
}

try {
  for (const [width, height] of sizes) {
    const page = await open(width, height);
    const video = page.locator('main video');
    const hero = page.locator('[data-landimotos-hero]');
    const button = hero.getByRole('button');
    await playing(page, true);
    await page.waitForFunction(() => document.querySelector('main video').currentTime > .1);
    const attributes = await video.evaluate(v => ({ controls: v.controls, muted: v.muted, loop: v.loop, playsInline: v.playsInline, intrinsic: [v.videoWidth, v.videoHeight] }));
    assert.deepEqual(attributes, { controls: false, muted: true, loop: true, playsInline: true, intrinsic: [2560, 1440] });
    assert.equal(await button.count(), 1);
    assert.equal(await hero.getByText('Software interno · Landimotos', { exact: true }).count(), 0);
    await button.focus();
    await page.keyboard.press('Space');
    await playing(page, false);
    await video.evaluate(v => new Promise(resolve => { v.addEventListener('seeked', resolve, { once: true }); v.currentTime = 8; }));
    const initial = await at(page, 0);
    const time = initial.time;
    assert.equal(initial.padding, width < 768 ? '10px' : '22px');
    assert.equal(initial.border, '1px');
    assert(Math.abs(initial.frame.top - initial.copy.bottom - (width < 768 ? 44 : 88)) < .1);
    assert.equal(initial.copyOpacity, 1);
    assert.equal(initial.videoFilter, 'none');
    assert.equal(initial.fit, 'contain');
    assert(Math.abs(initial.video.width / initial.video.height - 16 / 9) < .001);
    assert(!initial.overflow);
    assert(initial.video.top < height - Math.min(initial.video.height * .35, 240), 'significant video visible initially');
    await page.screenshot({ path: `${directory}/initial-${width}x${height}.png` });
    const copyInner = await page.locator('#project-title').boundingBox();
    assert(Math.abs(copyInner.x + copyInner.width / 2 - initial.frame.x - initial.frame.width / 2) < 1);

    const samples = [];
    const end = Math.ceil((initial.root.bottom + 80) / 20) * 20;
    for (let y = 0; y <= end; y += 20) {
      const sample = await at(page, y);
      samples.push(sample);
      assert(!sample.overflow && sample.paused);
      assert.equal(sample.time, time, 'scroll must not seek or restart playback');
      assert.equal(sample.pageHeight, initial.pageHeight, 'no scroll-induced layout shifts');
      assert(Math.abs(sample.protected.top + sample.y - initial.protected.top) < .1, 'protected section stays in normal flow');
      assert(sample.frame.top - sample.copy.bottom >= (width < 768 ? 44 : 88) - .1, 'text cannot overlap the product');
      assert(sample.facts.top >= sample.frame.bottom, 'frame cannot overlap facts');
      assert(sample.context.top >= sample.facts.bottom, 'natural section exit');
      assert(Math.abs(sample.video.width - initial.video.width) < .1, 'no scaling');
      if (samples.length > 1) {
        const previous = samples[samples.length - 2];
        assert(sample.frame.top < previous.frame.top, 'product moves upwards continuously');
        assert(sample.copyOpacity <= previous.copyOpacity, 'copy progressively fades');
        assert(previous.frame.top - sample.frame.top < 38, 'no transition jump');
      }
      if ([100, 220, 500].includes(y) && [1440, 390].includes(width)) await page.screenshot({ path: `${directory}/scroll-${width}-${y}.png` });
    }
    assert(samples.some(s => s.frame.top + s.y < initial.frame.top - (width < 768 ? 16 : 50)), 'product lifts beyond the natural scroll');
    assert.equal(samples.at(-1).copyOpacity, 0);
    assert(Math.abs(samples.at(-1).frame.top + end - initial.frame.top) < .1, 'motion ends before following content');
    for (const expected of samples.toReversed()) {
      const reversed = await at(page, expected.y);
      assert(Math.abs(reversed.frame.top - expected.frame.top) < .1, 'reversible visual movement');
      assert(Math.abs(reversed.copyOpacity - expected.copyOpacity) < .001, 'reversible opacity');
      assert.equal(reversed.time, time);
    }
    await button.focus();
    await page.keyboard.press('Enter');
    await playing(page, true);
    await page.waitForFunction(time => document.querySelector('main video').currentTime > time + .1, time);
    // Real wheel input while playing: presentation must not reset the media timeline.
    const timeBeforeWheel = await video.evaluate(v => v.currentTime);
    await page.mouse.wheel(0, 160);
    await page.mouse.wheel(0, -160);
    await playing(page, true);
    assert((await video.evaluate(v => v.currentTime)) >= timeBeforeWheel);
    await button.click();
    await playing(page, false);
    const pauseAgain = await video.evaluate(v => v.currentTime);
    await page.locator('#procesos').scrollIntoViewIfNeeded();
    await at(page, 0);
    await page.setViewportSize({ width, height: height + 24 });
    await page.setViewportSize({ width, height });
    await playing(page, false);
    assert.equal(await video.evaluate(v => v.currentTime), pauseAgain);
    const midway = await at(page, 100);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const staticMidway = await at(page, 100);
    assert.equal(staticMidway.copyOpacity, 1);
    assert.equal(staticMidway.copyTransform, 'none');
    assert.equal(staticMidway.visualTransform, 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const restored = await at(page, 100);
    assert(Math.abs(restored.frame.top - midway.frame.top) < .1);
    await playing(page, false);
    assert.equal(await video.evaluate(v => v.currentTime), pauseAgain);
    fs.writeFileSync(`${directory}/trajectory-${width}.json`, JSON.stringify(samples, null, 2));
    reports.push({ width, height, padding: initial.padding, gap: initial.frame.top - initial.copy.bottom, initialVideoTop: initial.video.top, visibleVideo: Math.min(initial.video.height, height - initial.video.top), samples: samples.length, motion: 'down/up, no overlaps, no jumps, no scaling, unchanged video time', playback: 'autoplay, keyboard pause/resume, wheel while playing, persistent pause, runtime motion preference' });
    console.log(`Passed scroll and playback: ${width}x${height}`);
    await page.close();
  }

  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await open(width, height, 'reduce');
    await playing(page, false);
    const initial = await at(page, 0);
    assert.equal(initial.time, 0);
    for (const y of [0, 100, 220, 400, 900, 220, 100, 0]) {
      const value = await at(page, y);
      assert.equal(value.copyOpacity, 1);
      assert.equal(value.copyTransform, 'none');
      assert.equal(value.visualTransform, 'none');
      assert.equal(value.time, 0);
      assert(Math.abs(value.frame.top + value.y - initial.frame.top) < .1);
    }
    await page.locator('[data-landimotos-hero]').getByRole('button').click();
    await playing(page, true);
    reports.push({ width, reducedMotion: 'static at all scroll positions, initially paused, manual playback works' });
    await page.close();
  }

  const blocked = await open(1440, 900, 'no-preference', true);
  await blocked.waitForFunction(() => window.__playAttempts === 1);
  await playing(blocked, false);
  await at(blocked, 200);
  await at(blocked, 0);
  assert.equal(await blocked.evaluate(() => window.__playAttempts), 1);
  await blocked.evaluate(() => { window.__allowPlayback = true; });
  await blocked.locator('[data-landimotos-hero]').getByRole('button').click();
  await playing(blocked, true);
  reports.push({ blockedAutoplay: 'accurate play icon, no retry on scroll, manual resume works' });
  await blocked.close();
  assert.deepEqual(errors, []);
  fs.writeFileSync(`${directory}/qa.json`, JSON.stringify({ reports, errors }, null, 2));
  console.log(JSON.stringify({ reports, errors }, null, 2));
} finally { await browser.close(); }
