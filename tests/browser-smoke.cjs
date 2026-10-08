/* Optional real-browser check: npm install --no-save playwright, then run
   APP_URL=http://localhost:3000/ CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs.
   Uses an isolated browser context; does not touch anyone's existing characters. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [];
    await context.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|fonts\.cdnfonts\.com)\//, route => route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(String(error)));
    page.on('dialog', dialog => dialog.accept());
    await page.addInitScript(() => {
      localStorage.setItem('auth', 'true');
      if (!localStorage.getItem('wfrp-characters-v2')) {
        localStorage.setItem('characters', '["Smoke Test"]');
        localStorage.setItem('state-Smoke Test', JSON.stringify({ 'char-name': 'Smoke Test',
          'ST-start': '30', 'WI-start': '30', 'WK-start': '30',
          'talent-table': [['1', 'Hardy', '1', 'player hint']] }));
      }
    });
    await page.goto(process.env.APP_URL || 'http://localhost:3000/');
    await page.waitForFunction(() => document.getElementById('lp-gesamt')?.value === '15');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.locator('#story-background').fill('Browser smoke test');
    await page.locator('#delete-character').click();
    await page.locator('#del-kill').click();
    assert.equal(await page.locator('#char-name').isDisabled(), true);
    await page.locator('#delete-character').click();
    await page.locator('#del-kill').click();
    await page.locator('#edition-select').selectOption('5e');
    assert.equal(await page.locator('#attribute-table').count(), 0);
    await page.locator('#edition-select').selectOption('4e');
    assert.equal(await page.locator('#story-background').inputValue(), 'Browser smoke test');
    const downloaded = page.waitForEvent('download');
    await page.locator('#export-character').click();
    const download = await downloaded;
    const fs = require('node:fs');
    const backup = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
    assert.equal(backup.formatVersion, 2);
    await page.locator('#import-file').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
    assert.equal(await page.locator('input[name=import-mode][value=replace]').isChecked(), true);
    await page.locator('#import-cancel').click();
    await page.locator('#transfer-character').click();
    await page.locator('#transfer-confirm').click();
    assert.equal(await page.locator('#transfer-report').isVisible(), true);
    await context.setOffline(true);
    await page.reload();
    assert.equal(await page.locator('#char-name').inputValue(), 'Smoke Test');
    assert.equal(await page.locator('#story-background').inputValue(), 'Browser smoke test');
    assert.deepEqual(errors, []);
    console.log('Mobile browser and offline smoke checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
