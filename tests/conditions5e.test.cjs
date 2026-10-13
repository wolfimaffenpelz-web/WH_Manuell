const { test } = require('node:test');
const assert = require('node:assert/strict');
const { evaluate, count } = require('../js/conditions5e.js');
const effect = (result, id) => result.effects.find(item => item.id === id);

test('5e keeps the highest applicable SL penalty and preserves independent poison damage', () => {
  const result = evaluate({ fatigued: 3, poisoned: 2, entangled: 1 });
  assert.equal(effect(result, 'all-tests').params.count, 3);
  assert.equal(effect(result, 'movement-tests'), undefined);
  assert.equal(effect(result, 'poison-loss').params.count, 2);
  assert.equal(effect(result, 'movement').text, 'state5_no_movement');
  assert.deepEqual(result.suppressed.map(item => item.source).sort(), ['entangled', 'poisoned']);
  const changed = evaluate({ fatigued: 1, poisoned: 2, entangled: 4 });
  assert.equal(effect(changed, 'all-tests').params.count, 2);
  assert.equal(effect(changed, 'movement-tests').params.count, 4);
  assert.equal(effect(changed, 'movement-tests').label, 'state_summary_movement_tests');
});

test('partially overlapping running/hiding and movement penalties retain only applicable maxima', () => {
  // Check all four probe contexts, including a weaker Entangled penalty that
  // remains relevant to running/hiding because Broken explicitly excludes it.
  for (let general = 0; general <= 4; general++) for (let broken = 0; broken <= 4; broken++) for (let entangled = 0; entangled <= 4; entangled++) {
    const result = evaluate({ fatigued: general, broken, entangled });
    for (const movement of [false, true]) for (const running of [false, true]) {
      const applicable = result.effects.filter(item => {
        if (item.id === 'all-tests') return true;
        if (item.id === 'other-tests') return !running && (item.label !== 'state5_nonmovement_not_run_hide' || !movement);
        if (item.id === 'movement-tests') return movement && (item.label !== 'state5_movement_run_hide' || running);
        return false;
      });
      const actual = Math.max(0, ...applicable.map(item => item.params.count));
      assert.equal(actual, Math.max(general, running ? 0 : broken, movement ? entangled : 0), JSON.stringify({ general, broken, entangled, movement, running }));
    }
  }
});

test('advantages and disadvantages do not multiply with condition counts or repeated scopes', () => {
  const result = evaluate({ blinded: 8, prone: 1, besmirched: 1, surprised: 0 });
  assert.equal(effect(result, 'disadvantage').text.length, 3);
  assert.deepEqual(effect(result, 'enemy-attacks').text, ['state5_advantage']);
  assert.equal(effect(result, 'no-sight').text, 'state5_no_sight');
  assert.deepEqual(effect(evaluate({ blinded: 3 }), 'enemy-attacks').text, ['state5_enemy_advantage_blind']);
  assert.equal(effect(result, 'all-tests'), undefined);
});

test('strong restrictions suppress own actions but retain compulsory tests and incoming attack effects', () => {
  const result = evaluate({ unconscious: 1, surprised: 1, stunned: 4, prone: 1, entangled: 2, blinded: 1, deafened: 2, poisoned: 1 }, { wounds: 0, toughnessBonus: 3 });
  assert.equal(effect(result, 'actions').text, 'state5_unconscious_actions');
  assert.equal(effect(result, 'movement'), undefined);
  assert.equal(effect(result, 'disadvantage'), undefined);
  assert.equal(effect(result, 'hearing'), undefined);
  assert.equal(effect(result, 'all-tests').label, 'state5_required_tests');
  assert.equal(effect(result, 'all-tests').params.count, 1);
  assert.deepEqual(effect(result, 'all-tests').sources, ['poisoned']);
  assert.deepEqual(effect(result, 'enemy-attacks').text, ['state5_advantage', 'state5_enemy_plus2']);
  assert.ok(result.hints.some(item => item.id === 'clear-stunned'));
  assert.ok(result.hints.some(item => item.id === 'poison-death' && item.params.count === 3));
  assert.ok(result.hints.some(item => item.id === 'poison-no-heal'));
});

test('movement restrictions replace lower restrictions without dropping independent disadvantages', () => {
  const result = evaluate({ entangled: 1, prone: 1, stunned: 1, broken: 1 });
  assert.equal(result.effects.filter(item => item.id === 'movement').length, 1);
  assert.equal(effect(result, 'movement').text, 'state5_no_movement');
  assert.equal(effect(result, 'disadvantage').text[0], 'state5_disadvantage_movement');
  assert.equal(effect(result, 'flee').text, 'state5_flee_blocked');
  assert.equal(effect(evaluate({ prone: 1, stunned: 2 }), 'movement').text, 'state5_prone_movement');
});

test('zero wounds, unconscious bleeding and stunned thresholds use strict known-value boundaries', () => {
  assert.equal(evaluate({ stunned: 3 }, { toughnessBonus: 3 }).hints.length, 0);
  assert.ok(evaluate({ stunned: 4 }, { toughnessBonus: 3 }).hints.some(item => item.id === 'stunned-unconscious'));
  assert.equal(evaluate({ stunned: 4, bleeding: 2 }).hints.length, 0);
  const zero = evaluate({ bleeding: 2 }, { wounds: 0 });
  assert.equal(effect(zero, 'bleeding-loss'), undefined);
  assert.ok(zero.hints.some(item => item.id === 'bleeding-endurance'));
  const asleep = evaluate({ bleeding: 2, unconscious: 1 }, { wounds: 0 });
  assert.ok(asleep.hints.some(item => item.id === 'bleeding-death' && item.params.count === 2));
  assert.ok(asleep.hints.some(item => item.id === 'bleeding-wake'));
  assert.equal(asleep.hints.some(item => item.id === 'bleeding-endurance'), false);
});

test('round-end losses remain separate and fire uses one die plus the additional conditions', () => {
  const input = { burning: 3, bleeding: 2, poisoned: 4, fatigued: 1 };
  const before = JSON.stringify(input);
  const result = evaluate(input, { wounds: 5 });
  assert.equal(effect(result, 'fire').params.extra, ' + 2');
  assert.equal(effect(result, 'bleeding-loss').params.count, 2);
  assert.equal(effect(result, 'poison-loss').params.count, 4);
  assert.equal(effect(result, 'all-tests').params.count, 4);
  assert.equal(JSON.stringify(input), before);
});

test('5e counters accept more than nine, normalize invalid values and keep binary conditions binary', () => {
  assert.equal(count(25, 'bleeding'), 25);
  assert.equal(count(-2, 'bleeding'), 0);
  assert.equal(count(Infinity, 'bleeding'), 0);
  assert.equal(count(2.8, 'fatigued'), 2);
  for (const key of ['prone', 'surprised', 'unconscious', 'besmirched']) assert.equal(count(25, key), 1);
  assert.deepEqual(evaluate({}).effects, []);
});
