/* Optional real-browser regression: APP_URL=http://localhost:3000/
   CHROMIUM_PATH=/usr/bin/chromium node tests/conditions-scroll.cjs */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await page.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|fonts\.cdnfonts\.com)\//, route => route.abort());
      await page.addInitScript(() => {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('characters', '["Scroll Test"]');
        localStorage.setItem('state-Scroll Test', JSON.stringify({ 'char-name': 'Scroll Test' }));
      });
      await page.goto(process.env.APP_URL || 'http://localhost:3000/');
      await page.waitForFunction(() => typeof changeStateValue === 'function');
      for (const edition of ['4e', '5e']) {
        await page.locator('#edition-select').selectOption(edition);
        // Cover browsers with native scroll anchoring and without it.
        for (const anchoring of ['auto', 'none']) {
          await page.evaluate(value => { document.documentElement.style.overflowAnchor = value; }, anchoring);
          const stable = async (selector, action) => {
            const target = page.locator(selector);
            await target.scrollIntoViewIfNeeded();
            const before = await target.boundingBox();
            await action(target);
            await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            const after = await target.boundingBox();
            assert.ok(Math.abs(after.y - before.y) < 2,
              `${edition}, ${width}px, anchoring ${anchoring}, ${selector}: ${before.y} -> ${after.y}`);
          };
          await stable('#state-blinded-toggle', target => target.click());
          assert.ok(await page.locator('#states-summary li:not(.state-effect-placeholder)').count() > 0);
          await stable('#state-blinded-toggle', target => target.click());
          const up = '[data-state-step][data-state-key="bleeding"][data-direction="up"]';
          const down = '[data-state-step][data-state-key="bleeding"][data-direction="down"]';
          await stable(up, target => target.click());
          await stable(down, target => target.click());
        }
      }
      await page.close();
    }
    console.log('Condition scroll regression passed (mobile/desktop, 4e/5e, native anchoring on/off).');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
