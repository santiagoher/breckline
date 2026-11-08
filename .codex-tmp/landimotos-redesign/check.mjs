import { createRequire } from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LOCALAPPDATA + '/ms-playwright-go/1.57.0/package');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
const errors = [];
const directory = '.codex-tmp/landimotos-redesign/after';
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => localStorage.setItem('breckline-cookie-consent-v1', 'rejected'));
    const response = await page.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
    const audit = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      return {
        duplicates: ids.filter((id, i) => ids.indexOf(id) !== i),
        brokenAnchors: [...document.querySelectorAll('main a[href^="#"]')].map(a => a.getAttribute('href')).filter(href => !document.getElementById(href.slice(1))),
        order: [...document.querySelectorAll('main section[id]')].map(el => el.id),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.deepEqual(audit.duplicates, []);
    assert.deepEqual(audit.brokenAnchors, []);
    assert.equal(audit.overflow, false);
    assert(audit.order.indexOf('enfoque') < audit.order.indexOf('procesos'));
    assert(audit.order.indexOf('procesos') < audit.order.indexOf('galeria'));
    assert.equal(await page.locator('#procesos').count(), 1);
    assert.equal(await page.locator('#galeria figure').count(), 2);
    assert.equal(await page.locator('h1').count(), 1);
    await page.screenshot({ path: `${directory}/hero-${width}.png`, animations: 'disabled' });
    await page.locator('#galeria').scrollIntoViewIfNeeded();
    await page.locator('#galeria').screenshot({ path: `${directory}/gallery-${width}.png`, animations: 'disabled' });
    if (width <= 390) {
      for (const region of await page.locator('#galeria [role="region"]').all()) {
        await region.focus();
        await page.keyboard.press('ArrowRight');
        await page.waitForFunction(() => document.activeElement.scrollLeft > 0);
        assert(await region.evaluate(el => el.matches(':focus-visible')));
      }
    }
    await page.getByRole('link', { name: 'Explorar la plataforma', exact: true }).click();
    await page.waitForURL('**#procesos');
    assert(await page.locator('[data-process-player]').isVisible());
    await page.getByRole('link', { name: 'Conversemos', exact: true }).click();
    await page.waitForURL('**/#contacto');
    assert.equal(await page.locator('#contacto').count(), 1);
    assert.equal(await page.locator('#proyectos').count(), 1);
    report.push({ width, status: 'passed', audit });
    await page.close();
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
  await noJS.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
  assert(await noJS.locator('#project-title').isVisible());
  assert(await noJS.locator('#gallery-operacion').isVisible());
  assert(await noJS.getByRole('link', { name: 'Conversemos', exact: true }).isVisible());
  report.push({ noJavaScript: 'Editorial content and navigation remain visible' });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ report, errors }, null, 2));
  fs.writeFileSync(`${directory}/editorial-qa.json`, JSON.stringify({ report, errors }, null, 2));
} finally { await browser.close(); }
