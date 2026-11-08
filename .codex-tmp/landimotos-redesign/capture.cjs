/* eslint-disable @typescript-eslint/no-require-imports -- Local QA with the existing browser tooling. */
const { chromium } = require(process.env.LOCALAPPDATA + '/ms-playwright-go/1.57.0/package');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const stage = process.argv[2] || 'before';
const dir = path.join(__dirname, stage);
fs.mkdirSync(dir, { recursive: true });
const protectedFiles = ['src/components/landimotos-process-showcase.tsx', 'src/components/landimotos-process-player.tsx', 'src/components/landimotos-process.module.css', 'src/components/use-process-playback.ts', 'src/components/process-playback-controller.ts', 'src/data/landimotos-processes.ts', 'src/data/landimotos-process-demos.ts', 'src/components/icons.tsx', 'src/components/project-motion.tsx', 'src/components/project-study.module.css', 'src/app/globals.css', 'src/app/layout.tsx', 'src/components/site-header.tsx', 'src/components/site-footer.tsx'];
fs.writeFileSync(path.join(dir, 'hashes.json'), JSON.stringify(Object.fromEntries(protectedFiles.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')])), null, 2));
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  try {
    for (const width of (process.argv[3] ? [Number(process.argv[3])] : [1440, 1024, 768, 390, 320])) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => localStorage.setItem('breckline-cookie-consent-v1', 'rejected'));
      await page.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
      await page.evaluate(() => document.fonts.ready);
      await page.locator('#procesos').scrollIntoViewIfNeeded();
      await page.locator('[data-process-player][data-status="completed"]').waitFor();
      await page.screenshot({ path: path.join(dir, `page-${width}.png`), fullPage: true, animations: 'disabled' });
      await page.locator('#procesos').screenshot({ path: path.join(dir, `protected-${width}.png`), animations: 'disabled' });
      const snapshot = await page.locator('#procesos').evaluate(section => {
        const root = section.getBoundingClientRect();
        return [section, ...section.querySelectorAll('*')].map(el => {
          const rect = el.getBoundingClientRect();
          const computed = getComputedStyle(el);
          return { tag: el.tagName, text: el.children.length ? null : el.textContent, bounds: [rect.x - root.x, rect.y - root.y, rect.width, rect.height].map(n => Math.round(n * 100) / 100), css: Object.fromEntries(['font-family', 'font-size', 'font-weight', 'line-height', 'color', 'background-color', 'padding', 'margin', 'gap', 'border-radius', 'display'].map(key => [key, computed.getPropertyValue(key)])) };
        });
      });
      fs.writeFileSync(path.join(dir, `protected-${width}.json`), JSON.stringify(snapshot));
      console.log(stage, width, await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })));
      await page.close();
    }
    fs.writeFileSync(path.join(dir, 'errors.json'), JSON.stringify(errors));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
