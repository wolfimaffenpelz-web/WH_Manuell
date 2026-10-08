const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const vm = require('node:vm');
function app(initial = {}) {
  const html = fs.readFileSync('index.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const dom = new JSDOM(html, { url: 'https://example.test/WH_Manuell/', runScripts: 'dangerously', pretendToBeVisual: true });
  const w = dom.window, alerts = [], errors = [];
  w.alert = message => alerts.push(message);
  w.confirm = () => true;
  w.console.error = error => errors.push(String(error));
  Object.entries(initial).forEach(([key, value]) => w.localStorage.setItem(key, value));
  for (const script of ['translations', 'sections', 'character-store', 'rules', 'logic', 'edition-ui']) vm.runInContext(fs.readFileSync(`js/${script}.js`, 'utf8'), dom.getInternalVMContext());
  vm.runInContext('initLogic()', dom.getInternalVMContext());
  return { w, alerts, errors, close: () => w.close(), get: code => vm.runInContext(code, dom.getInternalVMContext()), doc: w.document };
}
const legacy = name => JSON.stringify({
  'char-name': name, 'ST-start': '30', 'WI-start': '30', 'WK-start': '30', 'lp-aktuell': '18',
  'state-bleeding-value': '2', 'KG-mark': '1', 'password-input': '1234',
  'talent-table': [['1', 'Hardy', '1', 'player hint'], ['0', 'Sturdy', '2', ''], ['0', 'Strong Back', '2', ''], ['0', 'Pure Soul', '2', '']],
  'grupp-table': [['1', 'Schwimmen', 'ST', '30', '2', '32']],
  'waffen-table': [], 'injuries-table': [['Arm', 'Pain', 'Healing']]
});

test('legacy mobile-style app restores all rows without storage writes during loading', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    assert.deepEqual(a.errors, []);
    assert.equal(a.doc.getElementById('lp-gesamt').value, '15');
    assert.equal(a.doc.getElementById('lp-aktuell').value, '18');
    assert.ok(a.doc.getElementById('lp-warning').textContent);
    assert.equal(a.doc.getElementById('trag-max').value, '12');
    assert.equal(a.doc.getElementById('korruption-max').value, '8');
    assert.equal(a.doc.querySelector('#talent-table tr:nth-child(2) textarea').value, 'Hardy');
    assert.equal(a.doc.querySelector('#talent-table tr:nth-child(2) input[type=hidden]').value, '1');
    assert.equal(a.doc.getElementById('KG-mark').value, '1');
    assert.equal(a.doc.getElementById('state-bleeding-value').value, '2');
    const before = a.w.localStorage.getItem('wfrp-characters-v2');
    a.get('loadState()');
    assert.equal(a.w.localStorage.getItem('wfrp-characters-v2'), before);
    a.get('saveState()');
    const data = JSON.parse(a.w.localStorage.getItem('wfrp-characters-v2'));
    assert.equal(data.characters[0].state['password-input'], undefined);
    assert.equal(data.characters[0].state['talent-table'][0][3], 'player hint');
    assert.equal(data.characters[0].state['injuries-table'][0][0], 'Arm');
  } finally { a.close(); }
});

test('character switching clears fields absent from older backups', () => {
  const a = app({ characters: '["Karl","Anna"]', 'state-Karl': legacy('Karl'), 'state-Anna': '{"char-name":"Anna"}' });
  try {
    const first = a.get('currentCharacter');
    a.doc.getElementById('story-background').value = 'Karl background';
    a.get('saveState()');
    a.get("currentCharacter = characterStore.list('4e')[1].id; loadState()");
    assert.equal(a.doc.getElementById('char-name').value, 'Anna');
    assert.equal(a.doc.getElementById('story-background').value, '');
    assert.equal(a.doc.getElementById('state-bleeding-value').value, '0');
    a.get(`currentCharacter = '${first}'; loadState()`);
    assert.equal(a.doc.getElementById('story-background').value, 'Karl background');
    assert.deepEqual(a.errors, []);
  } finally { a.close(); }
});

test('edition switching, empty 5e creation and reload never invoke 4e calculations', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    const select = a.doc.getElementById('edition-select');
    select.value = '5e'; select.dispatchEvent(new a.w.Event('change'));
    assert.equal(a.doc.getElementById('attribute-table'), null);
    assert.equal(a.get('currentCharacter'), null);
    a.doc.getElementById('new-character').click();
    a.doc.getElementById('new-char-name').value = 'Karl 5';
    a.doc.getElementById('new-char-ok').click();
    assert.equal(a.doc.getElementById('char-name').value, 'Karl 5');
    a.doc.getElementById('story-background').value = 'New edition';
    a.doc.getElementById('story-background').dispatchEvent(new a.w.Event('input', { bubbles: true }));
    const snapshot = a.w.localStorage.getItem('wfrp-characters-v2');
    const b = app({ 'wfrp-characters-v2': snapshot });
    try {
      assert.equal(b.doc.getElementById('edition-select').value, '5e');
      assert.equal(b.doc.getElementById('story-background').value, 'New edition');
      assert.deepEqual(b.errors, []);
    } finally { b.close(); }
    select.value = '4e'; select.dispatchEvent(new a.w.Event('change'));
    assert.equal(a.doc.getElementById('char-name').value, 'Karl');
    assert.equal(a.doc.getElementById('lp-gesamt').value, '15');
    assert.deepEqual(a.errors, []);
  } finally { a.close(); }
});

test('deceased status persists, blocks edits and can be reversed without unlocking calculated fields', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    a.doc.getElementById('delete-character').click();
    assert.equal(a.doc.getElementById('del-kill').textContent, a.get("t('mark_deceased')"));
    a.w.confirm = () => false;
    a.doc.getElementById('del-kill').click();
    assert.equal(a.get('characterStore.get(currentCharacter).status'), 'alive');
    assert.ok(a.doc.getElementById('del-kill'));
    a.w.confirm = () => true;
    a.doc.getElementById('del-kill').click();
    assert.equal(a.doc.getElementById('status-character'), null);
    assert.equal(a.doc.getElementById('del-kill'), null);
    assert.equal(a.get('characterStore.get(currentCharacter).status'), 'deceased');
    assert.equal(a.doc.getElementById('char-name').disabled, true);
    a.get('loadState()');
    assert.equal(a.doc.getElementById('char-name').disabled, true);
    a.doc.getElementById('delete-character').click();
    assert.equal(a.doc.getElementById('del-kill').textContent, a.get("t('revive_character')"));
    a.doc.getElementById('del-kill').click();
    assert.equal(a.doc.getElementById('char-name').disabled, false);
    assert.equal(a.doc.getElementById('lp-gesamt').readOnly, true);
    assert.equal(a.doc.querySelector('#grupp-table select').disabled, false);
  } finally { a.close(); }
});

test('load failures cannot replace stored records; retry restores a usable sheet', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    const before = a.w.localStorage.getItem('wfrp-characters-v2');
    a.get("originalDeserialize = deserializeTable; deserializeTable = () => { throw new Error('load failure'); }; loadState()");
    assert.equal(a.get('saveState()'), false);
    assert.equal(a.w.localStorage.getItem('wfrp-characters-v2'), before);
    assert.equal(a.doc.getElementById('char-name').disabled, true);
    a.get('deserializeTable = originalDeserialize; loadState()');
    assert.equal(a.doc.getElementById('char-name').disabled, false);
    assert.equal(a.get('loadFailed'), false);
  } finally { a.close(); }
});

test('transfer requires confirmation, produces a 5e draft and keeps complete source report', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    const source = a.get('currentCharacter');
    a.doc.getElementById('transfer-character').click();
    assert.equal(a.get("characterStore.list('5e').length"), 0);
    a.doc.getElementById('transfer-confirm').click();
    assert.equal(a.doc.getElementById('edition-select').value, '5e');
    assert.equal(a.doc.getElementById('transfer-report').hidden, false);
    assert.equal(a.get('characterStore.get(currentCharacter).transfer.sourceId'), source);
    assert.equal(a.get('characterStore.get(currentCharacter).transfer.sourceState["talent-table"][0][1]'), 'Hardy');
    assert.deepEqual(a.errors, []);
  } finally { a.close(); }
});

test('new injury and disease rows persist through reload', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    const row = a.doc.querySelector('#diseases-table tr:nth-child(2) textarea');
    row.value = 'Fever'; row.dispatchEvent(new a.w.Event('input', { bubbles: true }));
    a.get('loadState()');
    assert.equal(a.doc.querySelector('#diseases-table tr:nth-child(2) textarea').value, 'Fever');
    assert.equal(a.doc.querySelectorAll('#diseases-table tr').length, 3);
  } finally { a.close(); }
});

test('every character table, including savings, weapons and armor, survives export and import', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  let b;
  try {
    const tables = Array.from(a.get('CharacterStore.TABLES'));
    for (const id of tables) {
      const table = a.doc.getElementById(id);
      if (table.rows.length === 1) a.get(`addRow('${id}')`);
      const inputs = Array.from(table.rows[1].querySelectorAll('input, textarea, select'));
      for (const input of inputs) {
        if (input.type === 'hidden' || input.readOnly) continue;
        if (input.type === 'checkbox') input.checked = true;
        else if (input.tagName === 'SELECT') input.value = 'ST';
        else if (input.type === 'number') input.value = '2';
        else input.value = `Export check: ${id}`;
      }
    }
    a.doc.getElementById('verm-gk').value = '3';
    a.doc.getElementById('verm-s').value = '4';
    a.doc.getElementById('verm-g').value = '5';
    a.get('updateAttributes(); saveState()');
    const exported = JSON.parse(a.get('JSON.stringify(characterStore.export(currentCharacter))'));
    for (const id of tables) assert.ok(exported.state[id]?.length > 0, `${id} missing from export`);
    assert.equal(exported.state['verm-gk'], '3');
    assert.equal(exported.state['verm-s'], '4');
    assert.equal(exported.state['verm-g'], '5');
    assert.equal(exported.state['password-input'], undefined);
    b = app();
    b.w.testBackup = exported;
    b.get('currentCharacter = characterStore.import(CharacterStore.normalizeBackup(testBackup)); loadCharacterList(); loadState()');
    const reexported = JSON.parse(b.get('JSON.stringify(characterStore.export(currentCharacter))'));
    for (const id of tables) {
      assert.deepEqual(reexported.state[id], exported.state[id], `${id} changed in stored import`);
      const restored = JSON.parse(b.get(`JSON.stringify(serializeTable('${id}'))`));
      assert.deepEqual(restored[0], exported.state[id][0], `${id} not restored in sheet`);
    }
    assert.deepEqual(a.errors, []);
    assert.deepEqual(b.errors, []);
  } finally { a.close(); b?.close(); }
});

test('attribute and skill totals update from player inputs', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    a.doc.getElementById('ST-steig').value = '5';
    a.doc.getElementById('ST-steig').dispatchEvent(new a.w.Event('input', { bubbles: true }));
    assert.equal(a.doc.getElementById('ST-akt').value, '35');
    assert.equal(a.doc.getElementById('grund-Klettern-wert').value, '35');
    const grouped = a.doc.querySelector('#grupp-table tr:nth-child(2)');
    assert.equal(grouped.cells[4].querySelector('input').value, '37');
  } finally { a.close(); }
});

test('currency conversion, savings and automatically negative debts remain correct', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    ['verm-gk', 'verm-s', 'verm-g'].forEach((id, i) => { a.doc.getElementById(id).value = ['1','5','3'][i]; });
    const savings = a.doc.querySelector('#spar-table tr:nth-child(2)').querySelectorAll('input');
    savings[1].value = '1';
    const debt = a.doc.querySelector('#schulden-table tr:nth-child(2)').querySelectorAll('input');
    debt[1].value = '2'; debt[2].value = '1';
    a.get('updateVermoegen(); saveState(); loadState()');
    assert.equal(a.doc.getElementById('netto-gk').value, '1');
    assert.equal(a.doc.getElementById('netto-s').value, '4');
    assert.equal(a.doc.getElementById('netto-g').value, '2');
    const restored = a.doc.querySelector('#schulden-table tr:nth-child(2)').querySelectorAll('input');
    assert.equal(restored[1].value, '-2'); assert.equal(restored[2].value, '-1');
  } finally { a.close(); }
});

test('attribute markers enforce three crosses and unique special markers after reload', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    a.get("document.querySelectorAll('th[data-input]').forEach(th => applyAttrMarker(th, 0))");
    for (const attr of ['KG', 'BF', 'ST', 'WI']) a.get(`applyAttrMarker(document.querySelector('[data-input="${attr}-mark"]'), 1)`);
    assert.equal(a.doc.getElementById('WI-mark').value, '0');
    for (const value of [2, 3, 4]) {
      a.get(`applyAttrMarker(document.querySelector('[data-input="GW-mark"]'), ${value}); applyAttrMarker(document.querySelector('[data-input="GS-mark"]'), ${value})`);
      assert.equal(a.doc.getElementById('GW-mark').value, '0');
      assert.equal(a.doc.getElementById('GS-mark').value, String(value));
    }
    a.get('saveState(); loadState()');
    assert.equal(a.doc.querySelectorAll('th input[value="1"]').length, 3);
    assert.equal(a.doc.getElementById('GS-mark').value, '4');
  } finally { a.close(); }
});

test('equipment quantity, equipped reduction and baggage notes survive marker changes and reload', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    const row = a.doc.querySelector('#ausruestung-table tr:nth-child(2)');
    row.querySelector('textarea').value = 'Rucksack';
    row.cells[1].querySelector('input').value = '2'; row.cells[2].querySelector('input').value = '3';
    a.get('updateTraglast()'); assert.equal(a.doc.getElementById('trag-ausruestung').value, '6');
    a.get("setLineMarker(document.querySelector('#ausruestung-table tr:nth-child(2) [data-marker]'), MARKER_EQUIPPED)");
    assert.equal(a.doc.getElementById('trag-ausruestung').value, '5');
    a.get("setLineMarker(document.querySelector('#ausruestung-table tr:nth-child(2) [data-marker]'), MARKER_BAGGAGE)");
    assert.equal(a.doc.getElementById('trag-ausruestung').value, '0');
    assert.equal(a.doc.getElementById('trag-gepaeck').value, '6');
    const note = a.doc.querySelector('#gepaeck-list textarea');
    note.value = 'Auf dem Wagen'; note.dispatchEvent(new a.w.Event('input', { bubbles: true }));
    a.get('saveState(); loadState()');
    assert.equal(a.doc.querySelector('#gepaeck-list textarea').value, 'Auf dem Wagen');
    assert.equal(a.doc.getElementById('trag-gepaeck').value, '6');
  } finally { a.close(); }
});

test('condition counters enforce bounds and binary conditions remain binary', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    a.get("changeStateValue('bleeding', 20)"); assert.equal(a.doc.getElementById('state-bleeding-value').value, '9');
    a.get("changeStateValue('bleeding', -20)"); assert.equal(a.doc.getElementById('state-bleeding-value').value, '0');
    assert.equal(a.doc.getElementById('state-bleeding-toggle').getAttribute('aria-pressed'), 'false');
    a.doc.getElementById('state-prone-toggle').click();
    assert.equal(a.doc.getElementById('state-prone-value').value, '1');
    a.get("changeStateValue('prone', 5); loadState()");
    assert.equal(a.doc.getElementById('state-prone-value').value, '1');
    a.doc.getElementById('state-prone-toggle').click();
    assert.equal(a.doc.getElementById('state-prone-value').value, '0');
  } finally { a.close(); }
});

test('level-up cancellation and purchases preserve XP accounting in simple and full modes', () => {
  for (const mode of ['simple', 'full']) {
    const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
    try {
      if (mode === 'simple') a.doc.getElementById('exp-simple-akt').value = '100';
      else {
        a.doc.getElementById('exp-toggle').checked = true;
        a.doc.querySelector('#exp-table tr:nth-child(2) input').value = '100';
      }
      a.doc.getElementById('ST-mark').value = '1';
      a.get('syncExperienceMode(); updateErfahrung(); openLevelUpOverlay()');
      a.doc.querySelector('tr[data-entry="attr-ST"] [data-act="plus"]').click();
      a.doc.getElementById('levelup-cancel').click();
      assert.equal(a.doc.getElementById('ST-steig').value, '');
      assert.equal(a.get('getAvailableXP()'), 100);
      a.get('openLevelUpOverlay()');
      a.doc.querySelector('tr[data-entry="attr-ST"] [data-act="plus"]').click();
      a.doc.getElementById('levelup-confirm').click();
      assert.equal(a.doc.getElementById('ST-steig').value, '1');
      assert.equal(a.get('getAvailableXP()'), 75);
      a.get('loadState()');
      assert.equal(a.doc.getElementById('ST-akt').value, '31');
      assert.equal(a.get('getAvailableXP()'), 75);
      assert.deepEqual(a.errors, []);
    } finally { a.close(); }
  }
});

test('armor dialog, equipping and damage controls retain protection after reload', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    a.doc.getElementById('add-armor-button').click();
    a.doc.getElementById('armor-name-input').value = 'Helm';
    a.doc.querySelector('.armor-zone-grid input[value="Kopf"]').checked = true;
    a.doc.getElementById('armor-rp-input').value = '2';
    a.doc.getElementById('armor-tp-input').value = '1';
    a.doc.getElementById('armor-add-confirm').click();
    a.get("setLineMarker(document.querySelector('#ruestung-table tr:nth-child(2) [data-marker]'), MARKER_EQUIPPED)");
    assert.equal(a.doc.getElementById('rp-kopf').value, '2');
    a.doc.querySelector('#ruestung-table .armor-damage-btn[data-zone="Kopf"][data-step="-1"]').click();
    assert.equal(a.doc.getElementById('rp-kopf').value, '1');
    a.get('loadState()');
    assert.equal(a.doc.getElementById('rp-kopf').value, '1');
    assert.equal(a.doc.getElementById('rp-box-kopf').textContent, '1');
  } finally { a.close(); }
});

test('font and color settings remain separate from character backups', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    a.w.localStorage.setItem('color-settings', JSON.stringify({ '--color-bg': '#112233' }));
    a.get('applySavedSettings(); openFontSettings()');
    const font = a.doc.querySelector('#font-accept').closest('.overlay').querySelector('select');
    font.value = 'Arial, sans-serif';
    a.doc.getElementById('font-accept').click();
    assert.equal(JSON.parse(a.w.localStorage.getItem('font-settings'))['--font-heading'], 'Arial, sans-serif');
    assert.equal(a.doc.documentElement.style.getPropertyValue('--color-bg'), '#112233');
    a.get('saveState()');
    const state = JSON.parse(a.get('JSON.stringify(characterStore.export(currentCharacter).state)'));
    assert.equal(state['font-settings'], undefined); assert.equal(state['color-settings'], undefined);
    assert.equal(state['font-accept'], undefined);
  } finally { a.close(); }
});

test('deletion can be cancelled and deleting the last character resets the sheet', () => {
  const a = app({ characters: '["Karl"]', 'state-Karl': legacy('Karl') });
  try {
    a.doc.getElementById('delete-character').click();
    a.doc.getElementById('del-no').click();
    assert.equal(a.get("characterStore.list('4e').length"), 1);
    a.doc.getElementById('delete-character').click();
    a.doc.getElementById('del-yes').click();
    a.doc.getElementById('confirm-del-no').click();
    assert.equal(a.get("characterStore.list('4e').length"), 1);
    a.doc.getElementById('del-yes').click();
    a.doc.getElementById('confirm-del-yes').click();
    assert.equal(a.get('currentCharacter'), null);
    assert.equal(a.doc.getElementById('char-name').value, '');
    assert.equal(a.doc.getElementById('export-character').disabled, true);
    assert.equal(a.doc.getElementById('state-bleeding-value').value, '0');
    assert.deepEqual(a.errors, []);
  } finally { a.close(); }
});
