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

test('5e transfer preserves 4e source and reports all unconverted values', () => {
  const store = new Store(memory());
  const id = store.create('Karl', '4e', { 'char-name': 'Karl', 'WI-start': '30', 'story-background': 'Old World', 'talent-table': [['1', 'Hardy', '1', '']] });
  const source = structuredClone(store.get(id).state);
  const targetId = store.transfer(id), target = store.get(targetId);
  assert.notEqual(id, targetId);
  assert.equal(target.edition, '5e');
  assert.equal(target.state['WI-start'], undefined);
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
