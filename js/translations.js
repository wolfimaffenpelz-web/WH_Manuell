// Übersetzungsobjekt: nach Sprache unterteilt
const translations = {
  de: {
    grunddaten: "Grunddaten",
    attributes: "Spielwerte",
    grundskills: "Grundfähigkeiten",
    groupskills: "Gruppierte Fähigkeiten",
    talents: "Talente",
    lebenspunkte: "Lebenspunkte",
    armor: "Rüstung",
    weapons: "Waffen",
    equipment: "Ausrüstung",
    corruption: "Korruption",
    mutations: "Mutationen",
    psychology: "Psychologie",
    wealth: "Vermögen",
    debts: "Schulden",
    networth: "Nettosumme",
    spells: "Zauber & Gebete",
    experience_simple: "Erfahrung (Einfach)",
    experience_full: "Erfahrung (Voll)"
  },
  en: {
    // reserviert für Zukunft
  },
  fr: {
    // reserviert für Zukunft
  },
  ru: {
    // reserviert für Zukunft
  }
};

let currentLang = "de"; // aktuell aktive Sprache

// Helper-Funktion: gibt Übersetzung zurück oder key, falls nicht vorhanden
function t(key) {
  return translations[currentLang][key] || key;
}
