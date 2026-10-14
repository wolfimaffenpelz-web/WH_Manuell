/* 5e condition effects are advisory: this module never changes character data. */
(function (root) {
  'use strict';
  const binary = new Set(['besmirched', 'prone', 'surprised', 'unconscious']);
  const keys = ['stunned', 'unconscious', 'bleeding', 'burning', 'broken', 'fatigued',
    'deafened', 'blinded', 'entangled', 'prone', 'surprised', 'poisoned', 'besmirched'];
  function count(value, key) {
    const number = Number(value);
    const safe = Number.isFinite(number) ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(number))) : 0;
    return binary.has(key) ? Math.min(1, safe) : safe;
  }
  const restrictions = { surprised: 'state5_surprised_actions', entangled: 'state5_no_movement', prone: 'state5_prone_movement', stunned: 'state5_half_movement', broken: 'state_summary_must_flee_hide', blinded: 'state5_no_sight', deafened: 'state5_no_hearing' };
  function evaluate(input, context = {}) {
    const values = Object.fromEntries(keys.map(key => [key, count(input[key], key)]));
    const effects = [], hints = [], suppressed = [];
    const add = (id, label, text, params = {}, sources = []) => effects.push({ id, label, text, params, sources });
    const hint = (id, text, params = {}) => hints.push({ id, text, params });
    const hide = (source, text, params, reason) => suppressed.push({ source, text, params, reason });
    const general = Math.max(values.fatigued, values.poisoned, values.unconscious ? 0 : values.stunned);
    const canAct = !values.unconscious && !values.surprised;
    const generalSources = ['fatigued', 'poisoned', 'stunned'].filter(key => values[key] === general && general > 0 && !(key === 'stunned' && values.unconscious));
    for (const key of ['fatigued', 'poisoned', 'stunned']) {
      if (key === 'stunned' && values.unconscious && values[key]) { hide(key, 'state5_sl', { count: values[key] }, 'state5_reason_stunned_cleared'); continue; }
      if (values[key] && values[key] < general) hide(key, 'state5_sl', { count: values[key] }, 'state5_reason_stronger');
    }
    if (general) add('all-tests', canAct ? 'state_summary_all_tests' : 'state5_required_tests', 'state5_sl', { count: general }, generalSources);
    if (canAct) {
      // Movement and running/hiding overlap only partly. Preserve the exception
      // when Broken suppresses Entangled outside running/hiding, but not within it.
      if (values.broken > general) add('other-tests', values.entangled > values.broken ? 'state5_nonmovement_not_run_hide' : 'state_summary_not_run_hide', 'state5_sl', { count: values.broken }, ['broken']);
      else if (values.broken) hide('broken', 'state5_sl', { count: values.broken }, 'state5_reason_stronger');
      if (values.entangled > general) add('movement-tests', values.broken >= values.entangled ? 'state5_movement_run_hide' : 'state_summary_movement_tests', 'state5_sl', { count: values.entangled }, ['entangled']);
      else if (values.entangled) hide('entangled', 'state5_sl', { count: values.entangled }, 'state5_reason_stronger');
      const disadvantage = [], sources = [];
      if (values.blinded) { disadvantage.push('state5_disadvantage_sight'); sources.push('blinded'); add('no-sight', 'state5_restrictions', 'state5_no_sight', {}, ['blinded']); }
      if (values.prone) { disadvantage.push('state5_disadvantage_movement'); sources.push('prone'); }
      if (values.besmirched) { disadvantage.push('state5_disadvantage_fellowship'); sources.push('besmirched'); }
      if (disadvantage.length) add('disadvantage', 'state5_disadvantage', disadvantage, {}, sources);
    } else {
      for (const key of ['broken', 'entangled']) if (values[key]) hide(key, 'state5_sl', { count: values[key] }, 'state5_reason_no_actions');
      for (const key of ['blinded', 'prone', 'besmirched']) if (values[key]) hide(key, 'state5_disadvantage', {}, 'state5_reason_no_actions');
    }
    if (values.unconscious) {
      add('actions', 'state5_restrictions', 'state5_unconscious_actions', {}, ['unconscious']);
      for (const key of ['surprised', 'entangled', 'prone', 'stunned', 'broken', 'blinded', 'deafened']) if (values[key]) hide(key, restrictions[key], {}, 'state5_reason_unconscious');
    } else {
      if (values.deafened) add('hearing', 'state5_restrictions', 'state5_no_hearing', {}, ['deafened']);
      if (values.surprised) {
        add('actions', 'state5_restrictions', 'state5_surprised_actions', {}, ['surprised']);
        for (const key of ['entangled', 'prone', 'stunned', 'broken']) if (values[key]) hide(key, restrictions[key], {}, 'state5_reason_no_actions');
      } else {
        if (values.entangled) add('movement', 'movement', 'state5_no_movement', {}, ['entangled']);
        else if (values.prone) add('movement', 'movement', 'state5_prone_movement', {}, ['prone']);
        else if (values.stunned) add('movement', 'movement', 'state5_half_movement', {}, ['stunned']);
        if (values.entangled && values.prone) hide('prone', 'state5_prone_movement', {}, 'state5_reason_no_movement');
        if ((values.entangled || values.prone) && values.stunned) hide('stunned', 'state5_half_movement', {}, 'state5_reason_movement');
        if (values.broken) add('flee', 'state5_actions', values.entangled ? 'state5_flee_blocked' : 'state_summary_must_flee_hide', {}, ['broken']);
      }
    }
    // Incoming attacks and round-end damage remain independent of own actions.
    const enemyEffects = [], enemySources = [];
    if (values.blinded || values.prone) {
      enemyEffects.push(values.blinded && !values.prone ? 'state5_enemy_advantage_blind' : 'state5_advantage');
      enemySources.push(...['blinded', 'prone'].filter(key => values[key]));
    }
    if (values.surprised) { enemyEffects.push('state5_enemy_plus2'); enemySources.push('surprised'); }
    if (enemyEffects.length) add('enemy-attacks', 'state_summary_melee_against_you', enemyEffects, {}, enemySources);
    const knownWounds = context.wounds !== null && context.wounds !== undefined && Number.isFinite(context.wounds);
    if (values.bleeding) {
      if (!knownWounds || context.wounds > 0) add('bleeding-loss', 'state_summary_wounds_end_round', 'state5_bleeding_loss', { count: values.bleeding }, ['bleeding']);
      else if (!values.unconscious) hint('bleeding-endurance', 'state5_bleeding_endurance');
      else hint('bleeding-death', 'state5_bleeding_death', { count: values.bleeding });
      if (values.unconscious) hint('bleeding-wake', 'state5_bleeding_wake');
    }
    if (values.poisoned) {
      add('poison-loss', 'state_summary_poison_end_round', 'state5_poison_loss', { count: values.poisoned }, ['poisoned']);
      if (knownWounds && context.wounds <= 0) hint('poison-no-heal', 'state5_poison_no_heal');
      if (values.unconscious && Number.isFinite(context.toughnessBonus) && context.toughnessBonus > 0) hint('poison-death', 'state5_poison_death', { count: context.toughnessBonus });
    }
    if (values.burning) add('fire', 'state_summary_fire_end_round', 'state5_fire_damage', { extra: values.burning > 1 ? ` + ${values.burning - 1}` : '' }, ['burning']);
    if (values.stunned && !values.unconscious && Number.isFinite(context.toughnessBonus) && values.stunned > context.toughnessBonus) hint('stunned-unconscious', 'state5_stunned_threshold', { count: values.stunned, bonus: context.toughnessBonus });
    if (values.unconscious && values.stunned) hint('clear-stunned', 'state5_clear_stunned');
    return { values, effects, hints, suppressed };
  }
  root.WFRP5Conditions = { count, evaluate, keys };
  if (typeof module !== 'undefined') module.exports = root.WFRP5Conditions;
})(typeof window !== 'undefined' ? window : globalThis);
