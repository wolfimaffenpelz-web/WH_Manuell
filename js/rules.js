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
