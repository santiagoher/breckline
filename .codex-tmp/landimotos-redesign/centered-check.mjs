import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LOCALAPPDATA + '/ms-playwright-go/1.57.0/package');
const dir = '.codex-tmp/landimotos-redesign/centered-after';
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
const errors = [];
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => localStorage.setItem('breckline-cookie-consent-v1', 'rejected'));
    await page.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator('main section').first();
    const media = hero.locator('img');
    await media.evaluate(img => img.decode());
    const audit = await hero.evaluate(section => {
      const image = section.querySelector('img');
      const heading = section.querySelector('h1');
      const copy = heading.parentElement;
      const text = section.innerText;
      const imageRect = image.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const css = getComputedStyle(image);
      return {
        source: image.getAttribute('src'),
        natural: [image.naturalWidth, image.naturalHeight],
        image: [imageRect.width, imageRect.height],
        imageFillsSection: Math.abs(imageRect.width - sectionRect.width) < 1,
        centered: Math.abs((copyRect.left + copyRect.right) / 2 - (imageRect.left + imageRect.right) / 2) < 1,
        textAlign: getComputedStyle(copy).textAlign,
        gap: imageRect.top - copyRect.bottom,
        textWidth: copyRect.width,
        fullWidthMedia: image.parentElement === section,
        removedText: text.includes('Panel operativo · Registro de facturas') || text.includes('01 / 03'),
        hasVideo: section.querySelector('video') !== null,
        hasControls: section.querySelector('button, a, figcaption') !== null,
        overflow: document.documentElement.scrollWidth > innerWidth,
        css: { border: css.borderWidth, padding: css.padding, radius: css.borderRadius, shadow: css.boxShadow, background: css.backgroundColor },
      };
    });
    assert.equal(audit.source, '/assets/images/Intranet landimotos panel operativo.png');
    assert.deepEqual(audit.natural, [2559, 1352]);
    assert(Math.abs(audit.image[0] / audit.image[1] - 2559 / 1352) < 0.001);
    assert(audit.centered && audit.imageFillsSection && audit.fullWidthMedia);
    assert.equal(audit.textAlign, 'center');
    assert(audit.gap >= 23 && audit.gap <= 37);
    if (width >= 1024) assert(audit.image[0] > audit.textWidth);
    assert(!audit.removedText && !audit.hasVideo && !audit.hasControls && !audit.overflow);
    assert.deepEqual(audit.css, { border: '0px', padding: '0px', radius: '0px', shadow: 'none', background: 'rgba(0, 0, 0, 0)' });
    assert.equal(await page.getByText('Panel operativo · Registro de facturas', { exact: true }).count(), 0);
    assert.equal(await page.getByText('01 / 03', { exact: true }).count(), 0);
    assert.equal(await page.locator('#procesos').count(), 1);
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
    await page.screenshot({ path: `${dir}/hero-${width}.png`, animations: 'disabled' });
    report.push({ width, ...audit });
    await page.close();
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(`${dir}/hero-qa.json`, JSON.stringify({ report, errors }, null, 2));
  console.log(JSON.stringify({ widths: report.map(item => item.width), status: 'All hero checks passed', errors }));
} finally { await browser.close(); }
