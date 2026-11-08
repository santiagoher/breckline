const { chromium } = require('C:/Users/usuario/AppData/Local/ms-playwright-go/1.57.0/package');
const assert = require('node:assert/strict');
(async () => {
  const b = await chromium.launch({channel:'chrome', headless:true});
  try {
    const p = await b.newPage({ reducedMotion:'reduce' });
    const errors = [];
    p.on('pageerror', error => errors.push(error.message));
    await p.goto('http://127.0.0.1:3000/proyectos/portal-logistico-landimotos');
    await p.evaluate(() => document.fonts.ready);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await p.setViewportSize({width, height:1000});
      await p.locator('#procesos').scrollIntoViewIfNeeded();
      const section = p.locator('#procesos');
      const results = [];
      const scenarios = section.locator('fieldset button');
      for (let i=0;i<6;i++) {
        await scenarios.nth(i).click();
        for (let step=0;step<5;step++) {
          await section.getByRole('list', {name:'Pasos del proceso'}).getByRole('button').nth(step).click();
          assert.equal(await section.locator('[data-process-player]').getAttribute('data-step'), String(step+1));
          assert.equal(await section.locator('[data-process-player]').getAttribute('data-playing'), 'false');
        }
        results.push(await section.locator('[data-process-player]').evaluate(e => ({height:e.getBoundingClientRect().height,title:e.querySelector('[data-visible="true"] h3').getBoundingClientRect().height,scroll:document.documentElement.scrollWidth,viewport:innerWidth})));
      }
      assert(results.every(item => item.scroll <= item.viewport), `Page overflow at ${width}`);
      assert(Math.max(...results.map(i=>i.height)) - Math.min(...results.map(i=>i.height)) <= 1, `Height jumped at ${width}`);
      await scenarios.first().click();
      await section.getByRole('list', {name:'Pasos del proceso'}).getByRole('button').nth(2).click();
      await section.screenshot({path:`.codex-tmp/process-${width}.png`});
      console.log(JSON.stringify({width,results}));
    }
    assert.deepEqual(errors, []);
  } finally {await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
