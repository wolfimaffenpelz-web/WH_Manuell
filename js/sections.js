const sections = [

// =========================
  // Grunddaten
  // =========================
  {
    id: "basicdata",
    type: "flex",
    groups: [
      {
        title: "Identität",
        fields: [
          { id: "basic_name", label: "Name", type: "text" },
          { id: "basic_race", label: "Volk", type: "text" },
          { id: "basic_gender", label: "Geschlecht", type: "text" }
        ]
      },
      {
        title: "Karriere",
        fields: [
          { id: "basic_career", label: "Karriere", type: "text" },
          { id: "basic_level", label: "Karrierestufe", type: "text" },
          { id: "basic_path", label: "Karriereweg", type: "text" },
          { id: "basic_status", label: "Status", type: "text" }
        ]
      },
      {
        title: "Erscheinung",
        fields: [
          { id: "basic_age", label: "Alter", type: "text" },
          { id: "basic_height", label: "Körpergröße", type: "text" },
          { id: "basic_hair", label: "Haare", type: "text" },
          { id: "basic_eyes", label: "Augen", type: "text" }
        ]
      }
    ],
    collapsible: true // einklappbar, Standard offen
  },
  // =========================
  // Spielwerte (Attribute)
  // =========================
  {
    id: "attributes",
    type: "table",
    width: "full",
    headers: ["", "KG", "BF", "ST", "WI", "I", "GW", "GS", "IN", "WK", "CH"],
    rows: [
      ["Anfangswert", 
        { id: "attr_KG_start", type: "number", maxLength: 2 },
        { id: "attr_BF_start", type: "number", maxLength: 2 },
        { id: "attr_ST_start", type: "number", maxLength: 2 },
        { id: "attr_WI_start", type: "number", maxLength: 2 },
        { id: "attr_I_start", type: "number", maxLength: 2 },
        { id: "attr_GW_start", type: "number", maxLength: 2 },
        { id: "attr_GS_start", type: "number", maxLength: 2 },
        { id: "attr_IN_start", type: "number", maxLength: 2 },
        { id: "attr_WK_start", type: "number", maxLength: 2 },
        { id: "attr_CH_start", type: "number", maxLength: 2 }
      ],
      ["Steig.", 
        { id: "attr_KG_steig", type: "number", maxLength: 2 },
        { id: "attr_BF_steig", type: "number", maxLength: 2 },
        { id: "attr_ST_steig", type: "number", maxLength: 2 },
        { id: "attr_WI_steig", type: "number", maxLength: 2 },
        { id: "attr_I_steig", type: "number", maxLength: 2 },
        { id: "attr_GW_steig", type: "number", maxLength: 2 },
        { id: "attr_GS_steig", type: "number", maxLength: 2 },
        { id: "attr_IN_steig", type: "number", maxLength: 2 },
        { id: "attr_WK_steig", type: "number", maxLength: 2 },
        { id: "attr_CH_steig", type: "number", maxLength: 2 }
      ],
      ["Aktuell", 
        { id: "attr_KG_total", type: "number", readonly: true },
        { id: "attr_BF_total", type: "number", readonly: true },
        { id: "attr_ST_total", type: "number", readonly: true },
        { id: "attr_WI_total", type: "number", readonly: true },
        { id: "attr_I_total", type: "number", readonly: true },
        { id: "attr_GW_total", type: "number", readonly: true },
        { id: "attr_GS_total", type: "number", readonly: true },
        { id: "attr_IN_total", type: "number", readonly: true },
        { id: "attr_WK_total", type: "number", readonly: true },
        { id: "attr_CH_total", type: "number", readonly: true }
      ]
    ],
    markable: true // << Flag für Markierungssymbole über Spalten
  },

  // =========================
  // Grundfähigkeiten
  // =========================
  {
    id: "grundskills",
    type: "table",
    width: "full",
    headers: ["◯", "Fähigkeit", "Attribut", "Wert", "Steig.", "Gesamt"],
    rows: [
      ["", "Anführen", "CH", { id: "skill_Anf_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Athletik", "GW", { id: "skill_Ath_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Ausdauer", "WI", { id: "skill_Ausd_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Ausweichen", "GW", { id: "skill_Ausw_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Besonnenheit", "WK", { id: "skill_Beso_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Bestechen", "CH", { id: "skill_Best_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Charme", "CH", { id: "skill_Char_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Einschüchtern", "ST", { id: "skill_Eins_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Fahren", "GW", { id: "skill_Fahr_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Feilschen", "CH", { id: "skill_Feil_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Glücksspiel", "IN", { id: "skill_Glue_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Intuition", "I", { id: "skill_Intu_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Klatsch", "CH", { id: "skill_Klat_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Klettern", "ST", { id: "skill_Klet_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Kunst", "GS", { id: "skill_Kuns_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Nahkampf", "KG", { id: "skill_Nah1_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Nahkampf (Standard)", "KG", { id: "skill_Nah2_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Navigation", "I", { id: "skill_Navi_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Reiten", "GW", { id: "skill_Reit_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Rudern", "ST", { id: "skill_Rude_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Schleichen", "GW", { id: "skill_Schl_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Tiere bezirzen", "WK", { id: "skill_Tier_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Überleben", "IN", { id: "skill_Uebe_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Unterhalten", "CH", { id: "skill_Unte_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Wahrnehmung", "I", { id: "skill_Wahr_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }],
      ["", "Zechen", "WI", { id: "skill_Zech_value", type: "number", readonly: true }, { type: "number" }, { type: "number", readonly: true }]
    ],
    markable: true // << Flag für Markierungsspalte
  },
  // =========================
  // Gruppierte Fähigkeiten
  // =========================
  {
    id: "groupskills",
    type: "dynamic-table",
    width: "full",
    headers: ["◯", "Fähigkeit", "Attribut", "Wert", "Steig.", "Gesamt", "🗑"],
    dropdowns: {
      "Attribut": ["KG", "BF", "ST", "WI", "I", "GW", "GS", "IN", "WK", "CH"]
    },
    markable: true
  },

  // =========================
  // Talente
  // =========================
  {
    id: "talents",
    type: "dynamic-table",
    width: "full",
    headers: ["◯", "Name", "Notizen", "🗑"],
    markable: true
  },

  // =========================
  // Lebenspunkte
  // =========================
  {
    id: "wounds",
    type: "table",
    width: "full",
    headers: ["", "Wert"],
    rows: [
      ["STB", { id: "lp_stb", type: "number", readonly: true }],
      ["WIB×2", { id: "lp_wib", type: "number", readonly: true }],
      ["WKB", { id: "lp_wkb", type: "number", readonly: true }],
      ["Robustheit", { id: "lp_robustheit", type: "number", readonly: true }],
      ["LP", { id: "lp_total", type: "number", readonly: true }]
    ]
  },
  // =========================
  // Korruption
  // =========================
  {
    id: "corruption",
    type: "table",
    width: "full",
    headers: ["Max.", "Aktuell"],
    rows: [
      [{ id: "corruption_max", type: "number", readonly: true },
       { id: "corruption_current", type: "number" }]
    ]
  },

  // =========================
  // Mutationen
  // =========================
  {
    id: "mutations",
    type: "dynamic-table",
    width: "full",
    headers: ["◯", "Betroffen", "Beschreibung", "🗑"],
    dropdowns: {
      "Betroffen": ["Körper", "Geist"]
    },
    markable: true
  },

  // =========================
  // Psychologie
  // =========================
  {
    id: "psychology",
    type: "dynamic-table",
    width: "ninety",
    headers: ["◯", "Name", "Notizen", "🗑"],
    markable: true
  },

  // =========================
  // Vermögen
  // =========================
  {
    id: "wealth",
    type: "table",
    width: "full",
    headers: ["GK 🪙", "S 🪙", "G 🪙"],
    rows: [
      [{ id: "wealth_GK", type: "number", maxLength: 3 },
       { id: "wealth_S", type: "number", maxLength: 3 },
       { id: "wealth_G", type: "number", maxLength: 3 }]
    ],
    sum: true
  },

  // =========================
  // Schulden
  // =========================
  {
    id: "debt",
    type: "table",
    width: "full",
    headers: ["GK 🪙", "S 🪙", "G 🪙"],
    rows: [
      [{ id: "debt_GK", type: "number", maxLength: 3 },
       { id: "debt_S", type: "number", maxLength: 3 },
       { id: "debt_G", type: "number", maxLength: 3 }]
    ],
    sum: true,
    negative: true
  },

  // =========================
  // Nettosumme
  // =========================
  {
    id: "netwealth",
    type: "table",
    width: "full",
    headers: ["Gesamt"],
    rows: [
      [{ id: "netwealth_total", type: "text", readonly: true }]
    ]
  },
  // =========================
  // Rüstung
  // =========================
  {
    id: "armor",
    type: "dynamic-table",
    width: "full",
    headers: ["Name", "Trefferzone", "RP", "TP", "Notizen", "🗑"],
    dropdowns: {
      "Trefferzone": ["Kopf", "Linker Arm", "Rechter Arm", "Rumpf", "Linkes Bein", "Rechtes Bein"]
    }
  },

  // =========================
  // Waffen
  // =========================
  {
    id: "weapons",
    type: "dynamic-table",
    width: "full",
    headers: ["Name", "Gruppe", "RW", "TP", "Notizen", "🗑"]
  },

  // =========================
  // Ausrüstung
  // =========================
  {
    id: "equipment",
    type: "dynamic-table",
    width: "full",
    headers: ["Name", "Menge", "TP", "Notizen", "🗑"]
  },

  // =========================
  // Zauber & Gebete
  // =========================
  {
    id: "spells",
    type: "dynamic-table",
    width: "full",
    headers: ["Name", "ZW", "RW", "Ziel", "⏳ Dauer", "Effekt", "🗑"]
  },

  // =========================
  // Rüstungspunkte-Box
  // =========================
  {
    id: "armor_summary",
    type: "table",
    width: "ninety",
    headers: ["Trefferzone", "Würfelbereich", "RP Gesamt"],
    rows: [
      ["Kopf", "01–09", { id: "armor_rp_head", type: "number", readonly: true }],
      ["Linker Arm", "10–24", { id: "armor_rp_leftarm", type: "number", readonly: true }],
      ["Rechter Arm", "25–44", { id: "armor_rp_rightarm", type: "number", readonly: true }],
      ["Rumpf", "45–79", { id: "armor_rp_body", type: "number", readonly: true }],
      ["Linkes Bein", "80–89", { id: "armor_rp_leftleg", type: "number", readonly: true }],
      ["Rechtes Bein", "90–100", { id: "armor_rp_rightleg", type: "number", readonly: true }]
    ]
  },

  // =========================
  // Erfahrung (Einfach & Voll)
  // =========================
  {
    id: "experience_simple",
    type: "table",
    width: "full",
    headers: ["Aktuell", "Ausgegeben", "Gesamt"],
    rows: [
      [
        { id: "exp_simple_current", type: "number", maxLength: 5 },
        { id: "exp_simple_spent", type: "number", maxLength: 5 },
        { id: "exp_simple_total", type: "number", readonly: true }
      ]
    ]
  },
  {
    id: "experience_full",
    type: "complex",
    width: "full",
    tables: [
      {
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
        headers: ["Wert", "Kommentar", "🗑"],
        dynamic: true
      }
    ]
  }
];
