/* Combat view: the sheet remains the only source of character values. */
(function () {
  'use strict';
  let overlay, owner, manual = { attack: 0, defense: 0 };
  const field = id => document.getElementById(id);
  const value = id => field(id)?.value || '';
  const number = id => Number(value(id)) || 0;
  const escape = text => escapeHtml(String(text));
  const uiFields = ['combat-weapon', 'combat-defense'];

  function mountFields() {
    for (const id of uiFields) {
      if (field(id)) continue;
      const input = document.createElement('input');
      input.type = 'hidden'; input.id = id;
      field('main-content').appendChild(input);
    }
  }

  function weapons() {
    const duplicates = new Map();
    return Array.from(document.querySelectorAll('#waffen-table tr')).slice(1).flatMap(row => {
      const name = row.cells[0].querySelector('textarea').value.trim();
      if (!name) return [];
      const read = index => row.cells[index].querySelector('input, textarea').value.trim();
      const entry = { name, group: read(1), range: read(3), damage: read(4), notes: read(5) };
      const signature = JSON.stringify(entry);
      const ordinal = duplicates.get(signature) || 0;
      duplicates.set(signature, ordinal + 1);
      return [{ ...entry, key: JSON.stringify([signature, ordinal]) }];
    });
  }

  function skills() {
    const basic = Array.from(document.querySelectorAll('#grund-table tr')).slice(1).map(row => {
      const total = row.cells[4].querySelector('input');
      const name = total.id.slice(6, -7);
      return { key: total.id, name, label: t(name), total: Number(total.value) || 0 };
    });
    const duplicates = new Map();
    const grouped = Array.from(document.querySelectorAll('#grupp-table tr')).slice(1).flatMap(row => {
      const name = row.cells[0].querySelector('textarea').value.trim();
      if (!name) return [];
      const signature = JSON.stringify([name, row.cells[1].querySelector('select').value]);
      const ordinal = duplicates.get(signature) || 0;
      duplicates.set(signature, ordinal + 1);
      return [{ key: JSON.stringify([signature, ordinal]), name, label: name,
        total: Number(row.cells[4].querySelector('input').value) || 0 }];
    });
    return [...basic, ...grouped];
  }

  const normalize = name => name.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');
  const melee = skill => /^(nahkampf|melee)(\s*\(|$)/i.test(skill.name);
  const dodge = skill => ['ausweichen', 'dodge'].includes(normalize(skill.name));
  function normalizeSelections() {
    let changed = false;
    const reset = id => { if (value(id)) { field(id).value = ''; changed = true; } };
    if (!weapons().some(item => item.key === value('combat-weapon'))) reset('combat-weapon');
    if (!skills().some(skill => (melee(skill) || dodge(skill)) && skill.key === value('combat-defense'))) reset('combat-defense');
    return changed;
  }
  function weaponSkill(weapon, available) {
    if (!weapon?.group) return null;
    const group = normalize(weapon.group);
    const exact = available.filter(skill => [skill.name, skill.label].some(name => normalize(name) === group));
    if (exact.length === 1) return exact[0];
    // Match a group only when a single actual character skill names it.
    const matches = available.filter(skill => [skill.name, skill.label].some(name => {
      const match = /^(?:nahkampf|melee|fernkampf|ranged)\s*\((.+)\)$/i.exec(name);
      return match && normalize(match[1]) === group;
    }));
    return matches.length === 1 ? matches[0] : null;
  }

  function damage(formula) {
    const match = /^STB\s*([+-])\s*(\d+)$/i.exec(formula);
    if (match) {
      const bonus = Math.floor(number('ST-akt') / 10);
      return `${formula} = ${bonus + (match[1] === '+' ? 1 : -1) * Number(match[2])}`;
    }
    if (/^STB$/i.test(formula)) return `${formula} = ${Math.floor(number('ST-akt') / 10)}`;
    return formula || '—';
  }

  function resource(id, key, maxId) {
    const source = field(id);
    if (!source) return '';
    return `<label>${escape(t(key))}<span><input type="number" data-resource="${id}" aria-label="${escape(t(key))}"
      min="${escape(source.min)}" max="${escape(source.max)}" step="1" value="${escape(source.value)}" ${source.disabled ? 'disabled' : ''}>
      ${maxId ? `<span class="combat-max"> / ${escape(value(maxId) || '0')}</span>` : ''}</span></label>`;
  }

  function testView(kind, skill, states) {
    let penalty = 0;
    const isDodge = skill && dodge(skill);
    if (activeEdition === '4e') penalty = WFRP4Conditions.testPenalty(states, { movement: !!isDodge });
    const blocked = states.unconscious || states.surprised || (activeEdition === '4e' && kind === 'attack' && states.stunned);
    const candidates = ['fatigued', 'poisoned', 'stunned', 'broken', ...(isDodge ? ['entangled', 'prone'] : [])];
    const detail = activeEdition === '4e' ? candidates.filter(key => states[key]).map(key =>
      `${t(`state_${key}`)}: −${states[key] * (key === 'prone' ? 20 : 10)}`).join(' · ') : '';
    return `<div class="combat-test" data-test="${kind}" data-blocked="${blocked ? 'true' : 'false'}">
      <div>${escape(t('combat_skill'))}: <strong>${escape(skill?.label || t('combat_no_skill'))}</strong></div>
      <div class="combat-calculation"><span>${escape(t('combat_base'))}: <b data-base>${skill ? skill.total : '—'}</b></span>
      <span>${escape(t('combat_auto'))}: <b data-auto>${penalty ? '−' + penalty : '0'}</b></span></div>
      ${detail ? `<details><summary>${escape(t('combat_details'))}</summary>${escape(detail)}</details>` : ''}
      <label class="combat-manual">${escape(t('combat_manual'))}<input type="number" step="1" value="${manual[kind]}" data-manual="${kind}"></label>
      <div class="combat-effective">${escape(t('combat_effective'))}: <strong data-effective>${skill && !blocked ? skill.total - penalty + manual[kind] : '—'}</strong></div>
      ${blocked ? `<p class="rule-warning">${escape(t('combat_blocked'))}</p>` : ''}
    </div>`;
  }

  function armorView() {
    const zones = ARMOR_ZONES.filter(zone => zone.rpInputId);
    const pieces = Array.from(document.querySelectorAll('#ruestung-table tr')).slice(1)
      .filter(row => getItemMarkerValue(row) === '1');
    return `<div class="combat-armor-map" role="group" aria-label="${escape(t('combat_armor'))}">
      ${zones.map((zone, index) => `<div class="combat-zone combat-zone-${index}"><span>${escape(t(zone.key === 'Brust' ? 'combat_body' : zone.shortKey))}</span><b>${escape(value(zone.rpInputId) || '0')}</b></div>`).join('')}
      </div><div class="combat-armor-notes">${pieces.map(row => {
        const name = row.querySelector('.armor-card-name textarea').value;
        const notes = row.querySelector('.armor-card-qualities textarea').value;
        const covered = Array.from(row.querySelectorAll('.armor-zone-toggle:checked')).map(input => {
          const zone = ARMOR_ZONES.find(zone => zone.key === input.dataset.zone);
          return t(zone.shortKey);
        });
        return `<details><summary>${escape(name)} · ${escape(covered.join(', '))}</summary><p class="combat-notes">${escape(notes || '—')}</p></details>`;
      }).join('') || `<p>${escape(t('combat_no_armor'))}</p>`}</div>`;
  }

  function body() {
    const inventory = weapons(), available = skills();
    const weapon = inventory.find(item => item.key === value('combat-weapon'));
    const offense = weaponSkill(weapon, available);
    const defenses = available.filter(skill => melee(skill) || dodge(skill));
    const defense = defenses.find(skill => skill.key === value('combat-defense')) || defenses.find(dodge) || defenses[0];
    const result = evaluateConditionEffects();
    const definitions = activeEdition === '4e' ? conditionDefinitions : conditionDefinitions5e;
    return `<section><h3>${escape(t('combat_resources'))}</h3><div class="combat-resources">
      ${resource('lp-aktuell', 'current_lp', 'lp-gesamt')}${resource('luck-current', 'luck', 'luck-max')}${resource('fate-value', 'fate')}
      ${activeEdition === '4e' ? resource('resilience-value', 'resilience') + resource('resolve-current', 'resolve', 'resolve-max') : ''}
      <label>${escape(t('combat_toughness'))}<b>${Math.floor(number('WI-akt') / 10)}</b></label>
      </div><p class="rule-warning">${escape(field('lp-warning')?.textContent || '')}</p></section>
      <section><h3>${escape(t('combat_attack'))}</h3>
      <label>${escape(t('combat_weapon'))}<select data-selection="combat-weapon"><option value="">${escape(t('combat_no_weapon'))}</option>${inventory.map(item => `<option value="${escape(item.key)}" ${weapon?.key === item.key ? 'selected' : ''}>${escape(item.name)}</option>`).join('')}</select></label>
      ${weapon ? `<div>${escape(t('weapon_group'))}: ${escape(weapon.group || '—')}</div><div class="combat-weapon-stats"><span>${escape(t('damage'))}: <b>${escape(damage(weapon.damage))}</b></span><span>${escape(t('combat_range'))}: ${escape(weapon.range || '—')}</span></div>
      <details><summary>${escape(t('qualities'))}</summary><p class="combat-notes">${escape(weapon.notes || '—')}</p></details>` : ''}
      ${testView('attack', offense, result.values)}</section>
      <section><h3>${escape(t('combat_defense'))}</h3><label>${escape(t('combat_skill'))}<select data-selection="combat-defense">${defenses.map(skill => `<option value="${escape(skill.key)}" ${defense?.key === skill.key ? 'selected' : ''}>${escape(skill.label)}</option>`).join('') || `<option>${escape(t('combat_no_defense'))}</option>`}</select></label>
      ${testView('defense', defense, result.values)}
      ${defense && melee(defense) && offense?.key !== defense.key ? `<p>${escape(t('combat_defense_weapon'))}</p>` : ''}
      ${defense && melee(defense) && weapon && offense?.key === defense.key ? `<details><summary>${escape(weapon.name)} · ${escape(t('qualities'))}</summary><p class="combat-notes">${escape(weapon.notes || '—')}</p></details>` : ''}</section>
      <section><h3>${escape(t('combat_armor'))}</h3>${armorView()}</section>
      <section><h3>${escape(t('combat_conditions'))}</h3><div class="combat-states">${definitions.filter(item => result.values[item.key]).map(item =>
        `<button type="button" data-condition="${item.key}"><img src="${item.icon}" alt=""><span>${escape(t(item.translationKey))}${item.binary ? '' : ' ×' + result.values[item.key]}</span></button>`).join('') || escape(t('combat_no_conditions'))}</div>
      <p>${escape(t(activeEdition === '4e' ? 'combat_scope' : 'combat_5e_hint'))}</p>
      <details><summary>${escape(t('combat_rules'))}</summary><p>${escape(t(activeEdition === '4e' ? 'state4_stack' : 'state5_stack'))}</p>
      ${definitions.filter(item => result.values[item.key]).map(item => `<p><strong>${escape(t(item.translationKey))}:</strong> ${escape(t(`state${activeEdition === '4e' ? '4' : '5'}_${item.key}_effect`))}</p>`).join('')}</details></section>`;
  }

  function refresh() {
    const record = characterStore?.get(currentCharacter);
    field('combat-open').disabled = !record || loadFailed;
    field('combat-open').setAttribute('aria-label', t('combat_title'));
    if (!overlay) return;
    if (!record || loadFailed) { close(); return; }
    if (owner !== currentCharacter) { owner = currentCharacter; manual = { attack: 0, defense: 0 }; }
    // Invalid saved selections never silently choose another weapon.
    const focused = overlay.contains(document.activeElement) ? document.activeElement : null;
    const focusKey = focused?.dataset.resource || focused?.dataset.manual || focused?.dataset.selection;
    const openDetails = Array.from(overlay.querySelectorAll('details')).map(item => item.open);
    overlay.querySelector('#combat-heading').textContent = `${t('combat_title')} · ${characterName()} · ${activeEdition}`;
    overlay.querySelector('#combat-body').innerHTML = body();
    overlay.querySelectorAll('details').forEach((item, index) => { item.open = !!openDetails[index]; });
    if (focusKey) overlay.querySelector(`[data-resource="${focusKey}"], [data-manual="${focusKey}"], [data-selection="${focusKey}"]`)?.focus();
  }

  function close() {
    overlay?.remove(); overlay = null;
    document.removeEventListener('keydown', keyboard);
    field('combat-open').focus();
  }

  function keyboard(event) {
    if (event.key === 'Escape' && document.querySelector('.overlay:last-of-type') === overlay) { event.preventDefault(); close(); }
    if (event.key !== 'Tab' || document.querySelector('.overlay:last-of-type') !== overlay) return;
    const focusable = Array.from(overlay.querySelectorAll('button, input, select, summary')).filter(el => !el.disabled && !el.closest('details:not([open])') || el.tagName === 'SUMMARY');
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  function open() {
    if (!currentCharacter || loadFailed || overlay) return;
    if (normalizeSelections()) saveState();
    owner = currentCharacter; manual = { attack: 0, defense: 0 };
    overlay = document.createElement('div'); overlay.className = 'overlay combat-overlay';
    overlay.innerHTML = `<div class="overlay-content scrollable combat-popup" role="dialog" aria-modal="true" aria-labelledby="combat-heading"><div class="combat-header"><h2 id="combat-heading"></h2><button type="button" data-close>${escape(t('combat_close'))}</button></div><div id="combat-body"></div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target.closest('[data-close]')) { close(); return; }
      const button = event.target.closest('[data-condition]');
      if (button) openStateInfo(button.dataset.condition, button);
    });
    overlay.addEventListener('change', event => {
      const target = event.target;
      if (!target.dataset.selection || field(target.dataset.selection).disabled) return;
      field(target.dataset.selection).value = target.value;
      saveState(); refresh();
    });
    overlay.addEventListener('input', event => {
      const target = event.target;
      if (target.dataset.resource) {
        const source = field(target.dataset.resource);
        if (source.disabled || !Number.isFinite(target.valueAsNumber)) return;
        source.value = String(Math.max(Number(source.min), Math.min(Number(source.max), Math.trunc(target.valueAsNumber))));
        source.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (target.dataset.manual) {
        manual[target.dataset.manual] = Number.isFinite(target.valueAsNumber) ? Math.trunc(target.valueAsNumber) : 0;
        const view = target.closest('[data-test]');
        const base = view.querySelector('[data-base]').textContent;
        const penalty = Number(view.querySelector('[data-auto]').textContent.replace('−', '-'));
        view.querySelector('[data-effective]').textContent = base === '—' || view.dataset.blocked === 'true'
          ? '—' : Number(base) + penalty + manual[target.dataset.manual];
      }
    });
    document.addEventListener('keydown', keyboard);
    refresh(); overlay.querySelector('[data-close]').focus();
  }

  window.CombatPopup = { mountFields, refresh, open, close, normalizeSelections };
  field('combat-open').addEventListener('click', open);
})();
