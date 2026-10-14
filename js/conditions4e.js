/* Supplied 4e rules. Effects and reminders never mutate character data. */
(function (root) {
  'use strict';
  const keys = ['stunned', 'unconscious', 'bleeding', 'burning', 'broken', 'fatigued',
    'deafened', 'blinded', 'entangled', 'prone', 'surprised', 'poisoned'];
  const binary = new Set(['prone', 'surprised', 'unconscious']);
  function count(value, key) {
    const number = Number(value);
    const safe = Number.isFinite(number) ? Math.max(0, Math.min(9, Math.trunc(number))) : 0;
    return binary.has(key) ? Math.min(1, safe) : safe;
  }
  function testPenalty(values, scope = {}) {
    return Math.max(values.fatigued * 10, values.poisoned * 10, values.stunned * 10,
      scope.runningHiding ? 0 : values.broken * 10,
      scope.movement ? Math.max(values.entangled * 10, values.prone ? 20 : 0) : 0,
      scope.sight ? values.blinded * 10 : 0, scope.hearing ? values.deafened * 10 : 0,
      scope.infection ? values.bleeding * 10 : 0);
  }
  function evaluate(input, context = {}) {
    const values = Object.fromEntries(keys.map(key => [key, count(input[key], key)]));
    const effects = [], hints = [], suppressed = [];
    const add = (id, label, text, params = {}, sources = []) => effects.push({ id, label, text, params, sources });
    const hint = (id, text, params = {}) => hints.push({ id, text, params });
    const hide = (source, text, params, reason = 'state4_reason_stronger') => suppressed.push({ source, text, params, reason });
    const general = Math.max(values.fatigued, values.poisoned, values.stunned) * 10;
    const canTakeTests = !values.unconscious && !values.surprised;
    const candidates = ['fatigued', 'poisoned', 'stunned'];
    if (general) add('all-tests', canTakeTests ? 'state_summary_all_tests' : 'state5_required_tests', 'state4_penalty', { count: general }, candidates.filter(key => values[key] * 10 === general));
    candidates.forEach(key => { if (values[key] && values[key] * 10 < general) hide(key, 'state4_penalty', { count: values[key] * 10 }); });
    const broken = values.broken * 10;
    if (canTakeTests) {
      if (broken > general) add('other-tests', 'state_summary_not_run_hide', 'state4_penalty', { count: broken }, ['broken']);
      else if (broken) hide('broken', 'state4_penalty', { count: broken });
      const movement = Math.max(values.entangled * 10, values.prone ? 20 : 0);
      if (movement > general) add('movement-tests', movement <= broken ? 'state5_movement_run_hide' : 'state_summary_movement_tests', 'state4_penalty', { count: movement }, ['entangled', 'prone'].filter(key => (key === 'prone' ? values[key] * 20 : values[key] * 10) === movement));
      for (const key of ['entangled', 'prone']) {
        const penalty = values[key] * (key === 'prone' ? 20 : 10);
        if (penalty && (penalty <= general || penalty < movement)) hide(key, 'state4_penalty', { count: penalty });
      }
      for (const [key, label, restricted] of [['blinded', 'state_summary_sight_tests', 'state4_sight_run_hide'], ['deafened', 'state_summary_hearing_tests', 'state4_hearing_run_hide']]) {
        const penalty = values[key] * 10;
        if (penalty > general) add(`${key}-tests`, penalty <= broken ? restricted : label, 'state4_penalty', { count: penalty }, [key]);
        else if (penalty) hide(key, 'state4_penalty', { count: penalty });
      }
    } else {
      for (const key of ['broken', 'entangled', 'prone', 'blinded', 'deafened']) if (values[key]) hide(key, 'state4_penalty', { count: values[key] * (key === 'prone' ? 20 : 10) }, 'state5_reason_no_actions');
    }
    if (values.bleeding) {
      if (values.bleeding * 10 > Math.max(general, broken)) add('infection-tests', 'state_summary_infection_penalty', 'state4_penalty', { count: values.bleeding * 10 }, ['bleeding']);
      else hide('bleeding', 'state4_infection_penalty', { count: values.bleeding * 10 });
    }
    const restrictions = { surprised: 'state5_surprised_actions', stunned: 'state4_stunned_actions', entangled: 'state5_no_movement', prone: 'state4_prone_movement', broken: 'state_summary_must_flee_hide' };
    if (values.unconscious) {
      add('actions', 'state5_restrictions', 'state5_unconscious_actions', {}, ['unconscious']);
      for (const key of Object.keys(restrictions)) if (values[key]) hide(key, restrictions[key], {}, 'state5_reason_unconscious');
    } else if (values.surprised) {
      add('actions', 'state5_restrictions', 'state5_surprised_actions', {}, ['surprised']);
      for (const key of ['stunned', 'entangled', 'prone', 'broken']) if (values[key]) hide(key, restrictions[key], {}, 'state5_reason_no_actions');
    } else {
      if (values.stunned) add('actions', 'state5_restrictions', 'state4_stunned_actions', {}, ['stunned']);
      if (values.entangled) add('movement', 'movement', 'state5_no_movement', {}, ['entangled']);
      else if (values.prone) add('movement', 'movement', Number.isFinite(context.wounds) && context.wounds <= 0 ? 'state4_prone_zero' : 'state4_prone_movement', {}, ['prone']);
      else if (values.stunned) add('movement', 'movement', 'state5_half_movement', {}, ['stunned']);
      if (values.entangled && values.prone) hide('prone', 'state4_prone_movement', {}, 'state5_reason_no_movement');
      if ((values.entangled || values.prone) && values.stunned) hide('stunned', 'state5_half_movement', {}, 'state5_reason_movement');
      if (values.broken) add('flee', 'state5_actions', values.stunned ? 'state4_broken_stunned' : values.entangled ? 'state5_flee_blocked' : 'state_summary_must_flee_hide', {}, ['broken']);
    }
    const enemy = Math.max(values.blinded * 10, values.prone ? 20 : 0, values.surprised ? 20 : 0);
    const enemySources = ['blinded', 'prone', 'surprised'].filter(key => (key === 'blinded' ? values[key] * 10 : values[key] * 20) === enemy && enemy > 0);
    const enemyText = [], enemyParams = {}, sources = [...enemySources];
    if (enemy) { enemyText.push('state4_enemy_bonus'); enemyParams.count = enemy; }
    if (values.stunned) { enemyText.push('state4_enemy_advantage'); sources.push('stunned'); }
    if (enemyText.length) add('enemy-attacks', 'state_summary_melee_against_you', enemyText, enemyParams, sources);
    for (const key of ['blinded', 'prone', 'surprised']) {
      const bonus = values[key] * (key === 'blinded' ? 10 : 20);
      if (bonus && bonus < enemy) hide(key, 'state4_enemy_bonus', { count: bonus });
    }
    if (values.deafened) {
      if (enemy < 10) add('flank-attacks', 'state_summary_melee_against_you', 'state4_flank_bonus', {}, ['deafened']);
      else hide('deafened', 'state4_flank_bonus', {});
    }
    if (values.unconscious) add('unconscious-attacks', 'state5_restrictions', 'state4_unconscious_attacks', {}, ['unconscious']);
    const zero = Number.isFinite(context.wounds) && context.wounds <= 0;
    if (values.bleeding) {
      if (!zero) add('bleeding-loss', 'state_summary_wounds_end_round', 'state4_bleeding_loss', { count: values.bleeding }, ['bleeding']);
      else {
        if (!values.unconscious) hint('bleeding-unconscious', 'state4_bleeding_unconscious');
        hint('bleeding-death', 'state4_bleeding_death', { chance: values.bleeding * 10 });
      }
      if (values.unconscious || zero) hint('bleeding-wake', 'state5_bleeding_wake');
    }
    if (values.poisoned) {
      add('poison-loss', 'state_summary_poison_end_round', 'state5_poison_loss', { count: values.poisoned }, ['poisoned']);
      if (zero) hint('poison-no-heal', 'state5_poison_no_heal');
      if (values.unconscious && Number.isFinite(context.toughnessBonus) && context.toughnessBonus > 0) hint('poison-death', 'state4_poison_death', { count: context.toughnessBonus });
    }
    if (values.burning) add('fire', 'state_summary_fire_end_round', 'state4_fire_damage', { extra: values.burning > 1 ? ` + ${values.burning - 1}` : '' }, ['burning']);
    return { values, effects, hints, suppressed };
  }
  root.WFRP4Conditions = { keys, count, evaluate, testPenalty };
  if (typeof module !== 'undefined') module.exports = root.WFRP4Conditions;
})(typeof window !== 'undefined' ? window : globalThis);
