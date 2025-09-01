// translations.js - zentrale Sprachdatei
// Deutsch wird als Platzhalter für alle Sprachen genutzt
const baseTranslations = {
  // Interface
  title: "Charakterbogen – Warhammer Fantasy",
  access: "Zugang",
  password_prompt: "Bitte Passwort eingeben:",
  ok: "OK",
  character_sheet: "Charakterbogen",
  character_selection: "Charakterauswahl",
  new: "Neu",
  delete: "Löschen",
  import: "Import",
  export: "Export",
  wrong_password: "Falsches Passwort!",
  import_failed: "Import fehlgeschlagen",
  character_name_prompt: "Charaktername:",
  cancel: "Abbrechen",
  name_required: "Name erforderlich",
  delete_confirm: "Charakter wirklich löschen?",
  // Sections
  grunddaten: "Grunddaten",
  attributes: "Spielwerte",
  grundskills: "Grundfähigkeiten",
  groupskills: "Gruppierte Fähigkeiten",
  talents: "Talente",
  lebenspunkte: "Lebenspunkte",
  traglast: "Traglast",
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
  experience: "Erfahrung",
  experience_simple: "Erfahrung (Einfach)",
  experience_full: "Erfahrung (Voll)",
  simple: "Simpel",
  full: "Voll",
  // Labels & table headers
  identity: "Identität",
  race: "Volk",
  gender: "Geschlecht",
  career: "Karriere",
  career_level: "Karrierestufe",
  career_path: "Karriereweg",
  status: "Status",
  appearance: "Erscheinung",
  age: "Alter",
  body_height: "Körpergröße",
  hair: "Haare",
  eyes: "Augen",
  start: "Anfang",
  increase: "Steig.",
  total: "Σ",
  ability: "Fähigkeit",
  value: "Spielwert",
  talent: "Talent",
  note: "Notiz",
  group: "Gruppe",
  tp: "TP",
  rw: "RW",
  qualities: "Qualitäten",
  quantity: "Menge",
  target: "Ziel",
  time: "⏳",
  effect: "Effekt",
  zone: "Trefferzone",
  range: "Trefferbereich",
  sum_rp: "Summe RP",
  max: "Max.",
  current: "Aktuell",
  spent: "Ausgegeben",
  affected: "Betroffen",
  entry: "Eintrag",
  component: "Komponente",
  value_col: "Wert",
  comment_col: "Kommentar",
  st_bonus: "ST-Bonus",
  wi_bonus: "WI-Bonus",
  wk_bonus: "2× WK-Bonus",
  robustness: "Robustheit*",
  total_lp: "Gesamt-LP",
  source: "Quelle",
  weapons_col: "Waffen",
  armor_col: "Rüstung",
  equipment_col: "Ausrüstung",
  max_tp: "Maximale TP",
  total_col: "Gesamt",
  coin_possession: "Münzbesitz",
  net_worth: "Nettovermögen",
  finances_expand: "Finanzen - erweitern",
  new_row: "Neue Zeile",
  mutation: "Mutation",
  savings: "Sparvermögen",
  max_cross_warning: "Max 3 ✠ erlaubt.",
  current_negative_warning: "Warnung: Aktuell ist negativ!",
  // Ability names
  "Anführen": "Anführen",
  "Athletik": "Athletik",
  "Ausdauer": "Ausdauer",
  "Ausweichen": "Ausweichen",
  "Besonnenheit": "Besonnenheit",
  "Bestechen": "Bestechen",
  "Charme": "Charme",
  "Einschüchtern": "Einschüchtern",
  "Fahren": "Fahren",
  "Feilschen": "Feilschen",
  "Glücksspiel": "Glücksspiel",
  "Intuition": "Intuition",
  "Klatsch": "Klatsch",
  "Klettern": "Klettern",
  "Kunst": "Kunst",
  "Nahkampf": "Nahkampf",
  "Nahkampf (Standard)": "Nahkampf (Standard)",
  "Navigation": "Navigation",
  "Reiten": "Reiten",
  "Rudern": "Rudern",
  "Schleichen": "Schleichen",
  "Tiere bezirzen": "Tiere bezirzen",
  "Überleben": "Überleben",
  "Unterhalten": "Unterhalten",
  "Wahrnehmung": "Wahrnehmung",
  "Zechen": "Zechen"
};

const translations = {
  // Deutsch
  de: baseTranslations,
  // Englisch
  en: { ...baseTranslations },
  // Französisch
  fr: { ...baseTranslations },
  // Russisch
  ru: { ...baseTranslations }
};

let currentLang = "de"; // aktuell aktive Sprache

// Helper-Funktion
function t(key) {
  return translations[currentLang][key] || key;
}

// Füllt Elemente mit data-i18n Attribut
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}
