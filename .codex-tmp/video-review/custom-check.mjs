import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LOCALAPPDATA + '/ms-playwright-go/1.57.0/package');
const directory = '.codex-tmp/video-review/custom';
fs.mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const report = [];

async function open(width, motion, blocked = false) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: motion });
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem('breckline-cookie-consent-v1', 'rejected'));
  if (blocked) await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    window.__allowPlayback = false;
    window.__playAttempts = 0;
    HTMLMediaElement.prototype.play = function () {
      window.__playAttempts += 1;
      if (!window.__allowPlayback) return Promise.reject(new DOMException('Autoplay blocked for QA', 'NotAllowedError'));
      return original.call(this);
    };
  });
  await page.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('main section').first();
  const video = hero.locator('video');
  const button = hero.getByRole('button');
  return { page, hero, video, button };
}

async function playing(page, expected) {
  await page.waitForFunction(expectPlaying => {
    const v = document.querySelector('main video');
    const b = document.querySelector('main section button');
    return !v.paused === expectPlaying && b.getAttribute('aria-label') === (expectPlaying ? 'Pausar video' : 'Reanudar video');
  }, expected);
}

try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const reduced = width <= 390;
    const { page, hero, video, button } = await open(width, reduced ? 'reduce' : 'no-preference');
    await playing(page, !reduced);
    assert.equal(await hero.getByText('Software interno · Landimotos', { exact: true }).count(), 0);
    assert.equal(await button.count(), 1);
    const attrs = await video.evaluate(v => ({ nativeControls: v.controls, loop: v.loop, muted: v.muted, playsInline: v.playsInline, ratio: v.getBoundingClientRect().width / v.getBoundingClientRect().height }));
    assert(!attrs.nativeControls && attrs.loop && attrs.muted && attrs.playsInline);
    assert(Math.abs(attrs.ratio - 16 / 9) < 0.001);
    const layout = await hero.evaluate(el => {
      const copy = el.firstElementChild.getBoundingClientRect();
      const frame = el.children[1].getBoundingClientRect();
      const frameStyle = getComputedStyle(el.children[1]);
      const button = el.querySelector('button').getBoundingClientRect();
      return { gap: frame.top - copy.bottom, copyWidth: copy.width, frameWidth: frame.width, border: frameStyle.borderWidth, radius: frameStyle.borderRadius, buttonSize: [button.width, button.height], overflow: document.documentElement.scrollWidth > innerWidth };
    });
    assert.equal(layout.gap, width < 768 ? 36 : 72);
    assert.equal(layout.border, '1px');
    assert(layout.buttonSize.every(size => size >= 44));
    assert(!layout.overflow);
    if (width >= 1024) assert(layout.frameWidth > layout.copyWidth);
    if (reduced) {
      assert.equal(await video.evaluate(v => v.currentTime), 0);
      await button.click();
      await playing(page, true);
    }
    await page.waitForFunction(() => document.querySelector('main video').currentTime > .2);
    await button.focus();
    await page.keyboard.press('Space');
    await playing(page, false);
    const pausedAt = await video.evaluate(v => v.currentTime);
    assert(pausedAt > 0);
    await page.locator('#alcance').scrollIntoViewIfNeeded();
    await video.scrollIntoViewIfNeeded();
    await page.setViewportSize({ width, height: 920 });
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await playing(page, false);
    assert(Math.abs((await video.evaluate(v => v.currentTime)) - pausedAt) < .05, 'manual pause survives viewport and preference changes');
    await button.focus();
    await page.keyboard.press('Enter');
    await playing(page, true);
    await page.waitForFunction(time => document.querySelector('main video').currentTime > time + .1, pausedAt);
    // External media events must update the same control.
    await video.evaluate(v => v.pause());
    await playing(page, false);
    await video.evaluate(v => v.play());
    await playing(page, true);
    // Real looping without resetting currentTime from React.
    if (width === 1440) {
      await video.evaluate(v => { v.currentTime = v.duration - .15; });
      await page.waitForFunction(() => { const v = document.querySelector('main video'); return v.currentTime < 2 && !v.paused; });
      await playing(page, true);
    }
    await button.click();
    await playing(page, false);
    await video.evaluate(v => new Promise(resolve => { v.addEventListener('seeked', resolve, { once: true }); v.currentTime = 8; }));
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${directory}/hero-${width}.png`, animations: 'disabled' });
    assert(await button.evaluate(b => b.querySelector('svg') !== null));
    report.push({ width, reducedInitially: reduced, ...attrs, ...layout, playback: 'autoplay/reduced motion, pause, resume, keyboard, viewport persistence, external events passed' });
    await page.close();
  }
  const { page, video, button } = await open(1440, 'no-preference', true);
  await page.waitForFunction(() => window.__playAttempts >= 1);
  await playing(page, false);
  assert.equal(await page.evaluate(() => window.__playAttempts), 1, 'only one automatic attempt, including React Strict Mode');
  await button.click();
  await playing(page, false);
  await page.evaluate(() => { window.__allowPlayback = true; });
  await button.click();
  await playing(page, true);
  await button.click();
  await playing(page, false);
  const attempts = await page.evaluate(() => window.__playAttempts);
  await page.locator('#alcance').scrollIntoViewIfNeeded();
  await video.scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(() => window.__playAttempts), attempts);
  report.push({ autoplayBlocked: 'play icon remains accurate; retry and manual pause work without automatic retries' });
  await page.close();
  assert.deepEqual(errors, []);
  fs.writeFileSync(`${directory}/qa.json`, JSON.stringify({ report, errors }, null, 2));
  console.log(JSON.stringify({ status: 'passed', checks: report, errors }, null, 2));
} finally { await browser.close(); }
