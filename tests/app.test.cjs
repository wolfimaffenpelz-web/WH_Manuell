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
    a.doc.getElementById('status-character').click();
    assert.equal(a.get('characterStore.get(currentCharacter).status'), 'deceased');
    assert.equal(a.doc.getElementById('char-name').disabled, true);
    a.get('loadState()');
    assert.equal(a.doc.getElementById('char-name').disabled, true);
    a.doc.getElementById('status-character').click();
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
