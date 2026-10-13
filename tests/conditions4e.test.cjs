const { test } = require('node:test');
const assert = require('node:assert/strict');
const { evaluate, testPenalty, count } = require('../js/conditions4e.js');
const find = (result, id) => result.effects.find(item => item.id === id);

test('4e percentages suppress weaker penalties but retain separate round-end damage', () => {
  const result = evaluate({ fatigued: 3, poisoned: 2, prone: 1, entangled: 1, burning: 3 });
  assert.equal(find(result, 'all-tests').params.count, 30);
  assert.equal(find(result, 'movement-tests'), undefined);
  assert.equal(find(result, 'poison-loss').params.count, 2);
  assert.equal(find(result, 'fire').text, 'state4_fire_damage');
  assert.equal(find(result, 'fire').params.extra, ' + 2');
  assert.equal(find(result, 'movement').text, 'state5_no_movement');
  assert.ok(result.suppressed.some(item => item.source === 'prone'));
});

test('4e overlapping scopes use the highest applicable modifier including running/hiding exceptions', () => {
  const input = { fatigued: 1, poisoned: 2, broken: 3, entangled: 2, prone: 1, blinded: 4, deafened: 1, bleeding: 5 };
  const values = evaluate(input).values;
  assert.equal(testPenalty(values, {}), 30);
  assert.equal(testPenalty(values, { runningHiding: true }), 20);
  assert.equal(testPenalty(values, { movement: true, sight: true }), 40);
  assert.equal(testPenalty(values, { infection: true }), 50);
  const exceptional = evaluate({ fatigued: 1, broken: 3, prone: 1, blinded: 2, deafened: 2 });
  assert.equal(find(exceptional, 'movement-tests').label, 'state5_movement_run_hide');
  assert.equal(find(exceptional, 'blinded-tests').label, 'state4_sight_run_hide');
  assert.equal(find(exceptional, 'deafened-tests').label, 'state4_hearing_run_hide');
});

test('4e attack modifiers do not stack, deafened stays +10 and stunned grants only one Advantage', () => {
  const result = evaluate({ blinded: 3, prone: 1, surprised: 1, deafened: 5, stunned: 4 });
  const attacks = find(result, 'enemy-attacks');
  assert.equal(attacks.params.count, 30);
  assert.deepEqual(attacks.text, ['state4_enemy_bonus', 'state4_enemy_advantage']);
  assert.equal(find(result, 'flank-attacks'), undefined);
  assert.ok(result.suppressed.some(item => item.source === 'deafened' && item.text === 'state4_flank_bonus'));
  assert.equal(find(evaluate({ deafened: 5 }), 'flank-attacks').text, 'state4_flank_bonus');
});

test('4e bleeding at zero gives immediate unconsciousness and percentage death risk, never a 5e endurance save', () => {
  const result = evaluate({ bleeding: 3 }, { wounds: 0 });
  assert.equal(find(result, 'bleeding-loss'), undefined);
  assert.ok(result.hints.some(item => item.id === 'bleeding-unconscious'));
  assert.ok(result.hints.some(item => item.id === 'bleeding-death' && item.params.chance === 30));
  assert.equal(result.hints.some(item => item.id === 'bleeding-endurance'), false);
  assert.equal(find(result, 'infection-tests').params.count, 30);
  assert.equal(evaluate({ bleeding: 3 }, { wounds: 1 }).hints.some(item => item.id === 'bleeding-death'), false);
});

test('4e stunned preserves defence, has no WI-bonus threshold and survives unconsciousness', () => {
  const awake = evaluate({ stunned: 4 }, { toughnessBonus: 3 });
  assert.equal(find(awake, 'actions').text, 'state4_stunned_actions');
  assert.equal(find(awake, 'movement').text, 'state5_half_movement');
  assert.equal(awake.hints.some(item => item.id === 'stunned-unconscious'), false);
  const asleep = evaluate({ stunned: 4, unconscious: 1 }, { toughnessBonus: 3 });
  assert.equal(find(asleep, 'all-tests').params.count, 40);
  assert.equal(asleep.values.stunned, 4);
  assert.equal(asleep.hints.some(item => item.id === 'clear-stunned'), false);
  assert.equal(find(asleep, 'unconscious-attacks').text, 'state4_unconscious_attacks');
});

test('4e poison uses a single after-WI-bonus reminder; zero wounds prevent standing and healing', () => {
  const result = evaluate({ poisoned: 2, unconscious: 1 }, { wounds: 0, toughnessBonus: 3 });
  assert.equal(result.hints.find(item => item.id === 'poison-death').text, 'state4_poison_death');
  assert.equal(result.hints.find(item => item.id === 'poison-death').params.count, 3);
  assert.ok(result.hints.some(item => item.id === 'poison-no-heal'));
  assert.equal(find(evaluate({ prone: 1 }, { wounds: 0 }), 'movement').text, 'state4_prone_zero');
  assert.equal(find(evaluate({ prone: 1 }, { wounds: 1 }), 'movement').text, 'state4_prone_movement');
});

test('4e counter bounds and binary states remain valid and evaluation never mutates the input', () => {
  assert.equal(count(12, 'bleeding'), 9);
  assert.equal(count(-1, 'bleeding'), 0);
  assert.equal(count(8, 'prone'), 1);
  const input = { bleeding: 2, unconscious: 1, stunned: 3 };
  const before = JSON.stringify(input);
  evaluate(input, { wounds: 0 });
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(evaluate({}).effects, []);
});
