const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Store, normalizeBackup, filename } = require('../js/character-store.js');
const { talentEffects } = require('../js/rules.js');
function memory(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), values };
}

test('legacy migration assigns stable IDs, cleans UI fields and keeps fallback data', () => {
  const old = JSON.stringify({ 'char-name': 'Karl', 'WI-start': '30', 'password-input': '1234', 'new-char-name': 'Other', 'talent-table': [['1', 'Hardy', '1', 'note']] });
  const storage = memory({ characters: '["Karl"]', 'state-Karl': old });
  const store = new Store(storage);
  const record = store.list('4e')[0];
  assert.match(record.id, /^[a-f\d-]{36}$/);
  assert.equal(record.state['password-input'], undefined);
  assert.equal(storage.getItem('state-Karl'), old);
  assert.equal(new Store(storage).list('4e')[0].id, record.id);
});

test('migration fails without replacing old data when storage is unavailable or corrupt', () => {
  const storage = memory({ characters: '["Karl"]', 'state-Karl': '{bad json' });
  assert.throws(() => new Store(storage));
  assert.equal(storage.getItem('wfrp-characters-v2'), null);
  assert.equal(storage.getItem('state-Karl'), '{bad json');
  const unavailable = memory({ characters: '["Karl"]', 'state-Karl': '{}' });
  unavailable.setItem = () => { throw new Error('quota'); };
  assert.throws(() => new Store(unavailable), /quota/);
  assert.equal(unavailable.getItem('wfrp-characters-v2'), null);
});

test('same names are separate, with persistent per-edition selection', () => {
  const store = new Store(memory());
  const first = store.create('Karl', '4e'), second = store.create('Karl', '4e'), fifth = store.create('Karl', '5e');
  assert.notEqual(first, second);
  store.select('4e', first); store.select('5e', fifth);
  assert.equal(store.data.active['4e'], first);
  assert.equal(store.list('4e').length, 2);
  assert.equal(store.list('5e').length, 1);
  assert.throws(() => store.select('4e', fifth));
});

test('backup round-trip, replacement recovery, independent copy and deletion', () => {
  const storage = memory(), store = new Store(storage);
  const id = store.create('Karl', '4e', { 'char-name': 'Karl', 'story-background': 'before', 'injuries-table': [['arm', 'pain', 'healing']] });
  const backup = normalizeBackup(store.export(id));
  store.save(id, { 'char-name': 'Karl', 'story-background': 'after' });
  store.setStatus(id, 'deceased');
  store.import(backup, id);
  assert.equal(store.get(id).state['story-background'], 'before');
  assert.equal(store.get(id).recovery.state['story-background'], 'after');
  store.recover(id);
  assert.equal(store.get(id).status, 'deceased');
  assert.equal(store.get(id).state['story-background'], 'after');
  const copy = store.import(backup, null, true);
  assert.notEqual(copy, id);
  store.remove(copy);
  assert.ok(store.get(id));
  assert.equal(store.get(copy), undefined);
  const otherDevice = new Store(memory());
  assert.equal(otherDevice.import(backup), id);
});

test('failed writes do not mutate the current store', () => {
  const storage = memory(), store = new Store(storage);
  const id = store.create('Karl', '4e', { 'char-name': 'Karl' });
  const before = JSON.stringify(store.data);
  storage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => store.save(id, { 'char-name': 'Other' }), /quota/);
  assert.equal(JSON.stringify(store.data), before);
});

test('invalid backups are rejected; legacy UI inputs are excluded', () => {
  assert.throws(() => normalizeBackup({ id: 'Karl', state: { 'talent-table': [{}] } }));
  assert.throws(() => normalizeBackup({ formatVersion: 99, id: 'Karl', state: {} }));
  assert.throws(() => normalizeBackup({ id: 'Karl', state: [] }));
  const backup = normalizeBackup({ id: 'Karl', state: { 'char-name': 'Karl', 'password-input': 'secret' } });
  assert.deepEqual(backup.state, { 'char-name': 'Karl' });
  assert.equal(backup.edition, '4e');
});

test('filenames use Berlin time, a full stable ID and safe characters', () => {
  const record = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Karl / Test', edition: '4e' };
  assert.equal(filename(record, new Date('2026-10-08T19:34:07Z')), 'Karl_Test_4e_2026-10-08_21-34-07_550e8400-e29b-41d4-a716-446655440000.json');
  assert.ok(filename(record, new Date('2026-01-08T19:34:07Z')).includes('20-34-07'));
});

test('5e transfer preserves 4e source and copies shared character values', () => {
  const store = new Store(memory());
  const id = store.create('Karl', '4e', { 'char-name': 'Karl', 'WI-start': '30', 'story-background': 'Old World', 'talent-table': [['1', 'Hardy', '1', '']] });
  const source = structuredClone(store.get(id).state);
  const targetId = store.transfer(id), target = store.get(targetId);
  assert.notEqual(id, targetId);
  assert.equal(target.edition, '5e');
  assert.equal(target.state['WI-start'], '30');
  assert.equal(target.transfer.rulesVersion, '5e-group-v1');
  assert.equal(target.state['story-background'], 'Old World');
  assert.deepEqual(target.transfer.sourceState, source);
  assert.deepEqual(store.get(id).state, source);
  assert.equal(store.get(id).transfers[0].targetId, targetId);
  assert.equal(normalizeBackup(store.export(targetId)).transfer.sourceId, id);
});

test('all four German and English talent aliases use current attribute bonuses', () => {
  const entries = [
    { name: 'Hardy', level: 1 }, { name: 'Robustheit', level: 1 },
    { name: 'Pure Soul', level: 1 }, { name: 'Reine Seele', level: 1 },
    { name: 'Strong Back', level: 1 }, { name: 'Starker Rücken', level: 1 },
    { name: 'Sturdy', level: 1 }, { name: 'Stämmig', level: 1 }
  ];
  const effects = talentEffects(entries, { strength: 30, toughness: 30, willpower: 30 });
  assert.equal(effects.wounds, 6);
  assert.equal(effects.corruption, 2);
  assert.equal(effects.encumbrance, 6);
  assert.deepEqual(effects.exceeded, []);
  assert.equal(talentEffects(entries, { strength: 30, toughness: 40, willpower: 30 }).wounds, 8);
  assert.equal(talentEffects([{ name: 'Hardly', level: 1 }], { strength: 30, toughness: 30, willpower: 30 }).wounds, 0);
});

test('talent limits warn without capping player input; zero level gives no bonus', () => {
  const effects = talentEffects([{ name: 'Hardy', level: 4 }, { name: 'Pure Soul', level: 0 }], { strength: 30, toughness: 30, willpower: 30 });
  assert.deepEqual(effects.exceeded, ['hardy']);
  assert.equal(effects.wounds, 12);
  assert.equal(effects.corruption, 0);
});

const { WFRP5Rules } = require('../js/rules.js');
test('5e talents use presence for Hardy/Pure Soul/Sturdy and 1 or 3 for Strong Back', () => {
  const attributes = { strength: 40, toughness: 30, willpower: 50 };
  const effects = WFRP5Rules.talentEffects([{ name: 'Robustheit', level: 1 }, { name: 'Reine Seele', level: 1 },
    { name: 'Stämmig', level: 1 }, { name: 'Starker Rücken', level: 2 }], attributes);
  assert.equal(effects.wounds, 3); assert.equal(effects.corruption, 8);
  assert.equal(effects.sturdy, 4); assert.equal(effects.strongBack, 3); assert.equal(effects.encumbrance, 7);
  assert.equal(WFRP5Rules.talentEffects([{ name: 'Strong Back', level: 1 }], attributes).encumbrance, 1);
  assert.equal(WFRP5Rules.talentEffects([{ name: 'Hardy', level: 2 }, { name: 'Pure Soul', level: 2 }, { name: 'Sturdy', level: 2 }], attributes).wounds, 3);
  assert.deepEqual(WFRP5Rules.talentEffects([{ name: 'Hardy', level: 2 }], attributes).exceeded, ['hardy']);
});

test('5e costs reproduce every supplied +5 and cumulative table entry', () => {
  const expected = [[125,50],[175,75],[250,100],[350,150],[500,250],[700,400],[950,600],[1300,850],
    [1800,1200],[2550,1700],[3600,2500],[5025,3500],[6950,4750],[9000,6500],[11250,8500]];
  const cumulative = [[125,50],[300,125],[550,225],[900,375],[1400,625],[2100,1025],[3050,1625],
    [4350,2475],[6150,3675],[8700,5375],[12300,7875],[17325,11375],[24275,16125],[33275,22625],[44525,31125]];
  expected.forEach(([attribute, skill], index) => {
    assert.equal(WFRP5Rules.advanceCost(index * 5, 5, 'attribute'), attribute);
    assert.equal(WFRP5Rules.advanceCost(index * 5, 5, 'skill'), skill);
    assert.equal(WFRP5Rules.advanceCost(0, (index + 1) * 5, 'attribute'), cumulative[index][0]);
    assert.equal(WFRP5Rules.advanceCost(0, (index + 1) * 5, 'skill'), cumulative[index][1]);
  });
  assert.equal(WFRP5Rules.advanceCost(4, 2, 'attribute'), 25 + 35);
  assert.equal(WFRP5Rules.advanceCost(74, 2, 'skill'), 3400);
  assert.equal(WFRP5Rules.advanceCost(0, 2, 'talent'), 200);
});

test('5e conversion caps repeated aliases together while preserving full source and history', () => {
  const store = new Store(memory());
  const state = { 'char-name': 'Karl', 'ST-steig': '7', 'exp-table': [['-250', 'Historical 4e purchase']],
    'waffen-table': [['1', 'Sword', 'Standard', '1', '0', '+4', 'Sharp']],
    'talent-table': [['1', 'Hardy', '2', 'selected hint'], ['0', 'Robustheit', '1', 'note'],
      ['1', 'Pure Soul', '3', ''], ['1', 'Sturdy', '3', ''], ['1', 'Strong Back', '4', '']] };
  const id = store.create('Karl', '4e', state), target = store.get(store.transfer(id));
  assert.deepEqual(target.state['talent-table'].map(row => row[2]), ['1','0','1','1','2']);
  assert.equal(target.state['talent-table'][0][3], 'selected hint');
  assert.deepEqual(target.state['exp-table'], state['exp-table']);
  assert.deepEqual(target.state['waffen-table'], state['waffen-table']);
  assert.deepEqual(store.get(id).state, state);
  assert.equal(target.state['exp-advance-step'], '1');
  const backup = normalizeBackup(store.export(target.id));
  assert.equal(backup.transfer.rulesVersion, '5e-group-v1');
  assert.equal(backup.transfer.adjustments.length, 5);
});
