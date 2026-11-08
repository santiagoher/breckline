const { chromium } = require(process.env.LOCALAPPDATA + '/ms-playwright-go/1.57.0/package');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const reports = [];
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
      await page.addInitScript(() => localStorage.setItem('breckline-cookie-consent-v1', 'rejected'));
      await page.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator('#procesos');
      const player = section.locator('[data-process-player]');
      await player.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('[data-process-player]').dataset.status === 'running');
      const options = player.locator('fieldset button');
      const ids = ['dispatch', 'routes', 'service', 'whatsapp', 'admin', 'indicators'];
      for (let i = 0; i < ids.length; i++) {
        await options.nth(i).click();
        await page.waitForFunction(id => document.querySelector('[data-process-player]').dataset.scenario === id, ids[i]);
        assert.equal(await options.nth(i).getAttribute('aria-pressed'), 'true');
      }
      await options.last().focus();
      await page.keyboard.press('Home');
      await page.waitForFunction(() => document.querySelector('[data-process-player]').dataset.scenario === 'dispatch');
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('[data-process-player]').dataset.scenario === 'routes');
      await player.getByRole('checkbox', { name: 'Reducir movimiento' }).check();
      await page.waitForFunction(() => document.querySelector('[data-process-player]').dataset.completedCount === '5');
      await player.getByRole('checkbox', { name: 'Reducir movimiento' }).uncheck();
      await options.first().click();
      await page.waitForFunction(() => Number(document.querySelector('[data-process-player]').dataset.step) >= 2);
      assert(await section.getByText('Del desorden operativo a procesos con responsables, registros y seguimiento.', { exact: true }).isVisible());
      if (width >= 768) {
        await section.getByRole('link', { name: 'Presentación del proyecto' }).click();
      } else {
        // The protected demo deliberately hides its rail on mobile.
        assert.equal(await section.getByRole('link', { name: 'Presentación del proyecto' }).count(), 0);
        await page.evaluate(() => { location.hash = 'project-title'; });
      }
      await page.waitForFunction(() => scrollY < 1);
      const initialOpacity = await page.locator('[data-landimotos-hero]').evaluate(el => getComputedStyle(el.firstElementChild).opacity);
      assert.equal(initialOpacity, '1');
      await page.waitForTimeout(150);
      await page.mouse.move(width / 2, 300);
      await page.mouse.wheel(0, 160);
      await page.waitForFunction(() => scrollY >= 60);
      const settled = await page.locator('[data-landimotos-hero]').evaluate(async el => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const sample = () => [scrollY, getComputedStyle(el.firstElementChild).opacity, getComputedStyle(el.lastElementChild).transform];
        const before = sample();
        await new Promise(resolve => setTimeout(resolve, 500));
        return { before, after: sample() };
      });
      assert.deepEqual(settled.after, settled.before, 'presentation does not animate while scroll is stationary');
      reports.push({ width, processes: 'six selectors, keyboard navigation, reduced motion control, real step progression and lower text preserved', heroAnchor: width >= 768 ? 'desktop rail link returns to initial composition' : 'rail remains hidden; native fragment navigation returns to initial composition', wheel: 'scroll drives movement; no timed continuation at rest' });
      console.log(`Passed integration: ${width}`);
      await page.close();
    }
    fs.writeFileSync('.codex-tmp/landimotos-redesign/scroll-after/integration.json', JSON.stringify(reports, null, 2));
    console.log(JSON.stringify(reports, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
