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
    assert.equal(await page.locator('#attribute-table').count(), 1);
    assert.equal(await page.locator('#exp-advance-step').inputValue(), '5');
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
    assert.equal(await page.locator('#lp-gesamt').inputValue(), '15');
    await page.locator('#exp-simple-akt').fill('1000');
    await page.evaluate(() => applyAttrMarker(document.querySelector('[data-input="ST-mark"]'), 1));
    await page.locator('#levelup-open').click();
    assert.equal(await page.locator('#levelup-step').isChecked(), false);
    assert.equal(await page.locator('#levelup-step-title').textContent(), 'Modus: Einzelsteigerung');
    assert.equal(await page.locator('.levelup-cost-table').count(), 0);
    assert.equal(await page.locator('[data-entry^="talent-"]').count(), 0);
    await page.locator('label.switch').filter({ has: page.locator('#levelup-step') }).click();
    assert.equal(await page.locator('#levelup-step').isChecked(), true);
    assert.equal(await page.locator('#levelup-step-title').textContent(), 'Modus: Steigerung 5');
    await page.locator('tr[data-entry="attr-ST"] [data-act="plus"]').click();
    assert.equal(await page.locator('#levelup-total').textContent(), '125');
    await page.locator('#levelup-cost-info').click();
    assert.equal(await page.locator('#levelup-cost-overlay').isVisible(), true);
    assert.equal(await page.locator('#levelup-cost-overlay td:nth-child(2)').first().textContent(), '125');
    await page.locator('#levelup-cost-close').click();
    assert.equal(await page.locator('#levelup-total').textContent(), '125');
    await page.locator('#levelup-confirm').click();
    assert.equal(await page.locator('#ST-steig').inputValue(), '5');
    assert.equal(await page.locator('#exp-simple-akt').inputValue(), '875');
    assert.equal(await page.locator('#resilience-value').count(), 0);
    assert.equal(await page.locator('#resolve-current').count(), 0);
    await page.locator('#fate-value').fill('1');
    await page.locator('#luck-max').fill('8');
    await page.locator('#luck-current').fill('5');
    await page.locator('#state-fatigued-value').fill('3');
    await page.locator('#state-poisoned-value').fill('2');
    await page.locator('#state-entangled-value').fill('1');
    assert.equal(await page.locator('[data-state5-effect]').count(), 3);
    assert.ok((await page.locator('[data-state5-effect="all-tests"]').textContent()).includes('−3 SL'));
    await page.locator('#state-besmirched-toggle').click();
    await page.locator('#state-bleeding-value').fill('12');
    await page.locator('#lp-aktuell').fill('0');
    assert.equal(await page.locator('[data-state5-hint="bleeding-endurance"]').isVisible(), true);
    assert.equal(await page.locator('#states-summary .state5-effect-list').count(), 1);
    assert.equal(await page.locator('#states-summary .state-effect-chip').count(), 0);
    await page.locator('#states-summary-info').click();
    assert.ok((await page.locator('.state5-info-popup').textContent()).includes('Vergiftet: −2 SL'));
    await page.screenshot({ path: 'work/states5-mobile.png' });
    await page.keyboard.press('Escape');
    await page.locator('[data-state-info][data-state-key="entangled"]').click();
    assert.equal(await page.locator('.state5-material-table tr:last-child td:last-child').textContent(), '105');
    await page.locator('#state-info-close').click();
    await context.setOffline(true);
    await page.reload();
    assert.equal(await page.locator('#char-name').inputValue(), 'Smoke Test');
    assert.equal(await page.locator('#story-background').inputValue(), 'Browser smoke test');
    assert.equal(await page.locator('#ST-steig').inputValue(), '5');
    assert.equal(await page.locator('#exp-advance-step').inputValue(), '5');
    assert.equal(await page.locator('#fate-value').inputValue(), '1');
    assert.equal(await page.locator('#luck-max').inputValue(), '8');
    assert.equal(await page.locator('#luck-current').inputValue(), '5');
    assert.equal(await page.locator('#state-besmirched-value').inputValue(), '1');
    assert.equal(await page.locator('#state-bleeding-value').inputValue(), '12');
    assert.ok((await page.locator('[data-state5-effect="all-tests"]').textContent()).includes('−3 SL'));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#states-summary-info').click();
    await page.screenshot({ path: 'work/states5-desktop.png' });
    await page.locator('#state-info-close').click();
    await page.locator('#levelup-open').click();
    await page.locator('#levelup-cost-info').click();
    assert.equal(await page.locator('#levelup-cost-overlay').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#levelup-cost-overlay').count(), 0);
    await page.locator('#levelup-cancel').click();
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator('#state-fatigued-value').fill('99');
      const layout = await page.evaluate(() => {
        const grid = document.querySelector('.state-grid-5e');
        const rect = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width }; };
        const table = document.querySelector('.points5e-table');
        const widths = () => Array.from(table.querySelectorAll('input'), el => rect(el).width);
        const centeredWidths = widths();
        table.style.marginInline = '0';
        const originalWidths = widths();
        table.style.marginInline = '';
        return {
          first: grid.firstElementChild.dataset.stateKey,
          names: Array.from(grid.querySelectorAll('.state-name'), el => ({ scroll: el.scrollWidth, client: el.clientWidth })),
          grid: rect(grid), last: rect(grid.lastElementChild),
          background: getComputedStyle(grid).backgroundColor,
          cardBackground: getComputedStyle(grid.firstElementChild).backgroundColor,
          table: rect(table), parent: rect(table.parentElement), centeredWidths, originalWidths,
          controls: Array.from(grid.querySelectorAll('.state-counter'), controls => ({
            card: rect(controls.closest('.state-card')),
            icon: rect(controls.closest('.state-card').querySelector('.state-icon-button')),
            borders: getComputedStyle(controls.closest('.state-card')).borderTopStyle,
            parts: Array.from(controls.querySelectorAll('button, input'), rect)
          })),
          corruptionRows: Array.from(document.querySelectorAll('#korruption-table tr'), row => ({
            label: row.cells[0].textContent,
            italic: getComputedStyle(row.cells[0]).fontStyle,
            input: row.querySelector('input').id
          }))
        };
      });
      assert.equal(layout.first, 'besmirched');
      for (const name of layout.names) assert.ok(name.scroll <= name.client + 1, `Clipped state name at ${width}px`);
      assert.equal(layout.background, layout.cardBackground);
      assert.ok(Math.abs((layout.last.left + layout.last.right) / 2 - (layout.grid.left + layout.grid.right) / 2) < 2);
      assert.ok(Math.abs((layout.table.left + layout.table.right) / 2 - (layout.parent.left + layout.parent.right) / 2) < 2);
      assert.deepEqual(layout.centeredWidths, layout.originalWidths);
      for (const controls of layout.controls) {
        assert.equal(controls.borders, 'none');
        assert.ok(controls.parts[0].left >= controls.icon.right, `Controls not beside icon at ${width}px`);
        assert.ok(controls.parts[0].top < controls.icon.bottom, `Controls below icon at ${width}px`);
        for (let index = 0; index < controls.parts.length; index++) {
          const part = controls.parts[index];
          assert.ok(part.left >= controls.card.left && part.right <= controls.card.right, `Control outside card at ${width}px`);
          if (index) assert.ok(part.left >= controls.parts[index - 1].right, `Overlapping controls at ${width}px`);
        }
      }
      assert.deepEqual(layout.corruptionRows.map(row => row.input), ['korruption-akt', 'korruption-wib', 'korruption-wkb', 'corruption-talent-bonus', 'korruption-max']);
      for (const row of layout.corruptionRows.slice(1, 4)) assert.equal(row.italic, 'italic');
      await page.locator('#zustaende').screenshot({ path: `work/states-layout-${width}.png` });
    }
    for (const edition of ['4e', '5e']) {
      await page.locator('#edition-select').selectOption(edition);
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const table = await page.evaluate(() => {
          const grid = document.querySelector('.state-grid');
          const cards = Array.from(grid.children);
          const style = (el, pseudo) => {
            const css = getComputedStyle(el, pseudo);
            return { content: css.content, width: css.width, height: css.height,
              borders: [css.borderTopWidth, css.borderRightWidth, css.borderBottomWidth, css.borderLeftWidth] };
          };
          return {
            grid: style(grid),
            cards: cards.map(card => ({
              box: style(card), top: style(card, '::before'), side: style(card, '::after'),
              weights: Array.from(card.querySelectorAll('.state-name, .state-counter input, .state-info-button'), el => getComputedStyle(el).fontWeight)
            }))
          };
        });
        const columns = width < 1200 ? 2 : 4;
        assert.ok(table.grid.borders.every(value => value === '0px'));
        table.cards.forEach((card, index) => {
          assert.ok(card.box.borders.every(value => value === '0px'), `Status box border in ${edition} at ${width}px`);
          assert.ok(card.weights.every(value => value === '400'), `Bold condition text in ${edition} at ${width}px`);
          assert.equal(card.top.content === 'none', index < columns);
          assert.equal(card.side.content === 'none', index % columns === 0);
          if (index >= columns) assert.equal(card.top.height, '1px');
          if (index % columns) assert.equal(card.side.width, '1px');
        });
        await page.locator('#zustaende').screenshot({ path: `work/state-table-${edition}-${width}.png` });
      }
    }
    assert.deepEqual(errors, []);
    console.log('Mobile browser and offline smoke checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
