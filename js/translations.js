// -------------------------
// Translations.js
// Enthält Sprachstrings (aktuell nur Deutsch)
// -------------------------

const translations = {
  de: {
    basics: "Grunddaten",
    attributes: "Attribute",
    wounds: "Lebenspunkte",
    skills_basic: "Grundfähigkeiten",
    skills_grouped: "Gruppierte & Ausbaufähigkeiten",
    weapons: "Waffen",
    armor: "Rüstung",
    armor_points: "Rüstungspunkte",
    equipment: "Ausrüstung",
    money: "Vermögen",
    spells: "Zauber & Gebete",
    talents: "Talente",
    corruption: "Korruption & Mutationen",
    psychology: "Psychologie",
    sin: "Sünde",
    encumbrance: "Traglast"
  }
};

// Aktuelle Sprache (Standard = Deutsch)
let currentLang = "de";

function t(key) {
  return translations[currentLang][key] || key;
}
