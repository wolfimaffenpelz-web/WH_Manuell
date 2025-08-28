const sections = [
  // =========================
  // Grunddaten (einklappbar)
  // =========================
  {
    id: "grunddaten",
    title: "Grunddaten",
    type: "flex",
    collapsible: true,
    defaultOpen: true,
    groups: [
      {
        label: "Identität",
        fields: [
          { id: "char_name", label: "Name", type: "text" },
          { id: "char_volk", label: "Volk", type: "text" },
          { id: "char_gender", label: "Geschlecht", type: "text" }
        ]
      },
      {
        label: "Karriere",
        fields: [
          { id: "char_career", label: "Karriere", type: "text" },
          { id: "char_career_level", label: "Karrierestufe", type: "text" },
          { id: "char_career_path", label: "Karriereweg", type: "text" },
          { id: "char_status", label: "Status", type: "text" }
        ]
      },
      {
        label: "Erscheinung",
        fields: [
          { id: "char_age", label: "Alter", type: "text" },
          { id: "char_height", label: "Körpergröße", type: "text" },
          { id: "char_hair", label: "Haare", type: "text" },
          { id: "char_eyes", label: "Augen", type: "text" }
        ]
      }
    ]
  },

  // =========================
  // Spielwerte / Attribute
  // =========================
  {
    id: "attributes",
    title: "Spielwerte",
    type: "table",
    headers: ["", "ST", "GE", "GS", "IN", "WI", "WK", "CH", "FF", "LP", "KP"],
    rows: [
      ["Anfang", 
        { id: "attr_ST_start", type: "number", maxLength: 2 },
        { id: "attr_GE_start", type: "number", maxLength: 2 },
        { id: "attr_GS_start", type: "number", maxLength: 2 },
        { id: "attr_IN_start", type: "number", maxLength: 2 },
        { id: "attr_WI_start", type: "number", maxLength: 2 },
        { id: "attr_WK_start", type: "number", maxLength: 2 },
        { id: "attr_CH_start", type: "number", maxLength: 2 },
        { id: "attr_FF_start", type: "number", maxLength: 2 },
        { id: "attr_LP_start", type: "number", maxLength: 2 },
        { id: "attr_KP_start", type: "number", maxLength: 2 }
      ],
      ["Steig.", 
        { id: "attr_ST_steig", type: "number", maxLength: 2 },
        { id: "attr_GE_steig", type: "number", maxLength: 2 },
        { id: "attr_GS_steig", type: "number", maxLength: 2 },
        { id: "attr_IN_steig", type: "number", maxLength: 2 },
        { id: "attr_WI_steig", type: "number", maxLength: 2 },
        { id: "attr_WK_steig", type: "number", maxLength: 2 },
        { id: "attr_CH_steig", type: "number", maxLength: 2 },
        { id: "attr_FF_steig", type: "number", maxLength: 2 },
        { id: "attr_LP_steig", type: "number", maxLength: 2 },
        { id: "attr_KP_steig", type: "number", maxLength: 2 }
      ],
      ["Aktuell", 
        { id: "attr_ST_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_GE_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_GS_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_IN_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_WI_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_WK_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_CH_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_FF_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_LP_total", type: "number", maxLength: 2, readonly: true },
        { id: "attr_KP_total", type: "number", maxLength: 2, readonly: true }
      ]
    ]
  },

  // =========================
  // Grundfähigkeiten
  // =========================
  {
    id: "grundskills",
    title: "Grundfähigkeiten",
    type: "table",
    headers: ["Fähigkeit", "Attribut", "Wert", "Steig.", "Gesamt"],
    rows: [
      ["Athletik", "ST", "", "", ""],
      ["Wahrnehmung", "IN", "", "", ""],
      ["Heimlichkeit", "GE", "", "", ""],
      ["Charme", "CH", "", "", ""],
      ["Willenskraft", "WK", "", "", ""],
      ["Fingerfertigkeit", "FF", "", "", ""]
    ]
  },

  // =========================
  // Gruppierte Fähigkeiten
  // =========================
  {
    id: "groupskills",
    title: "Gruppierte Fähigkeiten",
    type: "dynamic-table",
    headers: ["Fähigkeit", "Attribut", "Wert", "Steig.", "Gesamt", "🗑"],
    rows: []
  },

  // =========================
  // Talente
  // =========================
  {
    id: "talents",
    title: "Talente",
    type: "dynamic-table",
    headers: ["Name", "Notizen", "🗑"],
    rows: []
  },
  // =========================
  // Lebenspunkte
  // =========================
  {
    id: "lebenspunkte",
    title: "Lebenspunkte",
    type: "table",
    headers: ["STB", "WIB", "2×WKB", "Robustheit*", "Summe LP"],
    rows: [
      [
        { id: "lp_stb", type: "number", readonly: true },
        { id: "lp_wib", type: "number", readonly: true },
        { id: "lp_wkb", type: "number", readonly: true },
        { id: "lp_robustheit", type: "number", readonly: true },
        { id: "lp_total", type: "number", readonly: true }
      ]
    ]
  },

  // =========================
  // Rüstung
  // =========================
  {
    id: "armor",
    title: "Rüstung",
    type: "dynamic-table",
    headers: ["Name", "Trefferzone", "RP", "TP", "Qualitäten", "🗑"],
    rows: [],
    dropdowns: {
      "Trefferzone": ["Kopf", "Linker Arm", "Rechter Arm", "Körper", "Linkes Bein", "Rechtes Bein", "Schild"]
    }
  },

  // =========================
  // Waffen
  // =========================
  {
    id: "weapons",
    title: "Waffen",
    type: "dynamic-table",
    headers: ["Gruppe", "Name", "TP", "Notizen", "🗑"],
    rows: []
  },

  // =========================
  // Ausrüstung
  // =========================
  {
    id: "equipment",
    title: "Ausrüstung",
    type: "dynamic-table",
    headers: ["Name", "Menge", "TP", "Notizen", "🗑"],
    rows: []
  },
  // =========================
  // Korruption
  // =========================
  {
    id: "corruption",
    title: "Korruption",
    type: "table",
    headers: ["Max.", "Aktuell"],
    rows: [
      [
        { id: "corruption_max", type: "number", readonly: true },
        { id: "corruption_current", type: "number" }
      ]
    ]
  },

  // =========================
  // Mutationen
  // =========================
  {
    id: "mutations",
    title: "Mutationen",
    type: "dynamic-table",
    headers: ["Name", "Betroffen", "🗑"],
    rows: [],
    dropdowns: {
      "Betroffen": ["Körper", "Geist"]
    }
  },

  // =========================
  // Psychologie
  // =========================
  {
    id: "psychology",
    title: "Psychologie",
    type: "dynamic-table",
    headers: ["Name", "🗑"],
    rows: []
  },

  // =========================
  // Vermögen
  // =========================
  {
    id: "wealth",
    title: "Vermögen",
    type: "table",
    headers: ["💰 GK", "🥈 S", "🪙 G"],
    rows: [
      [
        { id: "wealth_gk", type: "number", maxLength: 3 },
        { id: "wealth_s", type: "number", maxLength: 3 },
        { id: "wealth_g", type: "number", maxLength: 3 }
      ]
    ]
  },

  // =========================
  // Schulden
  // =========================
  {
    id: "debts",
    title: "Schulden",
    type: "table",
    headers: ["💰 GK", "🥈 S", "🪙 G"],
    rows: [
      [
        { id: "debt_gk", type: "number", maxLength: 3 },
        { id: "debt_s", type: "number", maxLength: 3 },
        { id: "debt_g", type: "number", maxLength: 3 }
      ]
    ]
  },

  // =========================
  // Nettosumme (dynamisch)
  // =========================
  {
    id: "networth",
    title: "Nettosumme",
    type: "table",
    headers: ["💰 GK", "🥈 S", "🪙 G"],
    rows: [
      [
        { id: "net_gk", type: "number", readonly: true },
        { id: "net_s", type: "number", readonly: true },
        { id: "net_g", type: "number", readonly: true }
      ]
    ]
  },
  // =========================
  // Zauber & Gebete
  // =========================
  {
    id: "spells",
    title: "Zauber & Gebete",
    type: "dynamic-table",
    headers: ["Name", "ZW", "RW", "Ziel", "⏳ Dauer", "Effekt", "🗑"],
    rows: []
  },

  // =========================
  // Erfahrung (einfach)
  // =========================
  {
    id: "experience_simple",
    title: "Erfahrung (Einfach)",
    type: "table",
    headers: ["Aktuell", "Ausgegeben", "Gesamt"],
    rows: [
      [
        { id: "exp_simple_current", type: "number", maxLength: 5 },
        { id: "exp_simple_spent", type: "number", maxLength: 5 },
        { id: "exp_simple_total", type: "number", readonly: true }
      ]
    ]
  },

  // =========================
  // Erfahrung (voll)
  // =========================
  {
    id: "experience_full",
    title: "Erfahrung (Voll)",
    type: "complex",
    parts: [
      {
        type: "table",
        headers: ["Aktuell", "Ausgegeben", "Gesamt"],
        rows: [
          [
            { id: "exp_full_current", type: "number", readonly: true },
            { id: "exp_full_spent", type: "number", readonly: true },
            { id: "exp_full_total", type: "number", readonly: true }
          ]
        ]
      },
      {
        type: "dynamic-table",
        headers: ["Wert", "Kommentar", "🗑"],
        rows: []
      }
    ]
  }
];
