/* WFRP 4 core rules; player-selected hints and markers are never modified. */
(function (root) {
  'use strict';
  const names = {
    hardy: ['hardy', 'robustheit'], pureSoul: ['pure soul', 'reine seele'],
    strongBack: ['strong back', 'starker rücken'], sturdy: ['sturdy', 'stämmig']
  };
  function talentEffects(entries, attributes) {
    const levels = { hardy: 0, pureSoul: 0, strongBack: 0, sturdy: 0 };
    for (const entry of entries) {
      const name = entry.name.trim().normalize('NFC').toLowerCase().replace(/\s+/g, ' ');
      const key = Object.keys(names).find(key => names[key].includes(name));
      if (!key) continue;
      const level = entry.level === '' ? 1 : Math.max(0, parseInt(entry.level, 10) || 0);
      levels[key] += level;
    }
    const bonus = value => Math.max(0, Math.floor(value / 10));
    const limits = { hardy: bonus(attributes.toughness), pureSoul: bonus(attributes.willpower),
      strongBack: bonus(attributes.strength), sturdy: bonus(attributes.strength) };
    return { levels, limits, wounds: limits.hardy * levels.hardy, corruption: levels.pureSoul,
      encumbrance: levels.strongBack + 2 * levels.sturdy,
      exceeded: Object.keys(levels).filter(key => levels[key] > limits[key]) };
  }
  root.WFRP4Rules = { talentEffects };
  if (typeof module !== 'undefined') module.exports = root.WFRP4Rules;
})(typeof window !== 'undefined' ? window : globalThis);

/* 5e rules supplied by the group: individual prices also define +5 bundles. */
(function (root) {
  'use strict';
  const aliases = { hardy: ['hardy', 'robustheit'], pureSoul: ['pure soul', 'reine seele'],
    strongBack: ['strong back', 'starker rücken'], sturdy: ['sturdy', 'stämmig'] };
  const identify = name => Object.keys(aliases).find(key => aliases[key].includes(String(name).trim().normalize('NFC').toLowerCase().replace(/\s+/g, ' ')));
  const prices = [[25,10],[35,15],[50,20],[70,30],[100,50],[140,80],[190,120],[260,170],
    [360,240],[510,340],[720,500],[1005,700],[1390,950],[1800,1300],[2250,1700]];
  const brackets = prices.map(([attrCost, skillCost], index) => ({ min: index * 5 + 1,
    max: index === 14 ? Infinity : index * 5 + 5, attrCost, skillCost }));
  const talentLimits = { hardy: 1, pureSoul: 1, strongBack: 2, sturdy: 1 };
  function talentEffects(entries, attributes) {
    const levels = { hardy: 0, pureSoul: 0, strongBack: 0, sturdy: 0 };
    for (const entry of entries) {
      const key = identify(entry.name);
      if (key) levels[key] += entry.level === '' ? 1 : Math.max(0, parseInt(entry.level, 10) || 0);
    }
    const sb = Math.max(0, Math.floor(attributes.strength / 10));
    const tb = Math.max(0, Math.floor(attributes.toughness / 10));
    const wb = Math.max(0, Math.floor(attributes.willpower / 10));
    const back = levels.strongBack >= 2 ? 3 : levels.strongBack > 0 ? 1 : 0;
    return { levels, limits: talentLimits, wounds: levels.hardy > 0 ? tb : 0,
      corruption: levels.pureSoul > 0 ? tb + wb : 0,
      strongBack: back, sturdy: levels.sturdy > 0 ? sb : 0,
      encumbrance: back + (levels.sturdy > 0 ? sb : 0),
      exceeded: Object.keys(levels).filter(key => levels[key] > talentLimits[key]) };
  }
  function advanceCost(current, delta, type) {
    if (!Number.isInteger(current) || current < 0 || !Number.isInteger(delta) || delta < 0) throw new Error('invalid_advances');
    if (type === 'talent') return delta * 100;
    let total = 0;
    for (let advance = current + 1; advance <= current + delta; advance++) {
      const bracket = brackets.find(row => advance >= row.min && advance <= row.max);
      total += type === 'attribute' ? bracket.attrCost : bracket.skillCost;
    }
    return total;
  }
  function convertState(source) {
    const state = JSON.parse(JSON.stringify(source)), remaining = { ...talentLimits }, adjustments = [];
    for (const row of state['talent-table'] || []) {
      const key = identify(row[1]);
      if (!key) continue;
      const before = row[2] === '' ? 1 : Math.max(0, parseInt(row[2], 10) || 0);
      const after = Math.min(before, remaining[key]);
      remaining[key] -= after;
      if (before !== after) adjustments.push({ name: row[1], before, after });
      row[2] = String(after);
    }
    // Old purchased advances and XP history stay intact, even between +5 boundaries.
    state['exp-advance-step'] = '1';
    return { state, adjustments };
  }
  root.WFRP5Rules = { talentEffects, advanceCost, brackets, identify, talentLimits, convertState };
  if (typeof module !== 'undefined') module.exports.WFRP5Rules = root.WFRP5Rules;
})(typeof window !== 'undefined' ? window : globalThis);
