// sections.js v0.8.2
// Enthält die Struktur aller Segmente für den Charakterbogen

// Array mit allen Abschnittsdefinitionen
const sections = [
  // 🧾 Grunddaten
  {
    id: "grunddaten",
    title: `<span id="grunddaten-arrow">▶</span> ${t('grunddaten')}`,
    content: `
      <div class="section-body">
        <div class="subsection">
          <h3>Identität</h3>
          <table class="full-width">
            <tr><td>Name</td><td><input type="text" id="char-name"></td></tr>
            <tr><td>Volk</td><td><input type="text" id="char-volk"></td></tr>
            <tr><td>Geschlecht</td><td><input type="text" id="char-geschlecht"></td></tr>
          </table>
        </div>
        <div class="subsection">
          <h3>Karriere</h3>
          <table class="full-width">
            <tr><td>Karriere</td><td><input type="text" id="char-karriere"></td></tr>
            <tr><td>Karrierestufe</td><td><input type="text" id="char-stufe"></td></tr>
            <tr><td>Karriereweg</td><td><input type="text" id="char-weg"></td></tr>
            <tr><td>Status</td><td><input type="text" id="char-status"></td></tr>
          </table>
        </div>
        <div class="subsection">
          <h3>Erscheinung</h3>
          <table class="full-width">
            <tr><td>Alter</td><td><input type="text" id="char-alter"></td></tr>
            <tr><td>Körpergröße</td><td><input type="text" id="char-groesse"></td></tr>
            <tr><td>Haare</td><td><input type="text" id="char-haare"></td></tr>
            <tr><td>Augen</td><td><input type="text" id="char-augen"></td></tr>
          </table>
        </div>
        <div class="section-divider"></div>
      </div>
    `
  },

  // 📊 Attribute (Spielwerte)
  {
    id: "attribute",
    title: t('attributes'),
    content: `
      <table class="full-width" id="attribute-table">
        <tr class="attr-header">
          <th></th>
          <th data-input="KG-mark">KG<input type="hidden" id="KG-mark" value="0"></th>
          <th data-input="BF-mark">BF<input type="hidden" id="BF-mark" value="0"></th>
          <th data-input="ST-mark">ST<input type="hidden" id="ST-mark" value="0"></th>
          <th data-input="WI-mark">WI<input type="hidden" id="WI-mark" value="0"></th>
          <th data-input="I-mark">I<input type="hidden" id="I-mark" value="0"></th>
          <th data-input="GW-mark">GW<input type="hidden" id="GW-mark" value="0"></th>
          <th data-input="GS-mark">GS<input type="hidden" id="GS-mark" value="0"></th>
          <th data-input="IN-mark">IN<input type="hidden" id="IN-mark" value="0"></th>
          <th data-input="WK-mark">WK<input type="hidden" id="WK-mark" value="0"></th>
          <th data-input="CH-mark">CH<input type="hidden" id="CH-mark" value="0"></th>
        </tr>
        <tr>
          <td>Anfang</td>
          <td><input type="number" id="KG-start"></td>
          <td><input type="number" id="BF-start"></td>
          <td><input type="number" id="ST-start"></td>
          <td><input type="number" id="WI-start"></td>
          <td><input type="number" id="I-start"></td>
          <td><input type="number" id="GW-start"></td>
          <td><input type="number" id="GS-start"></td>
          <td><input type="number" id="IN-start"></td>
          <td><input type="number" id="WK-start"></td>
          <td><input type="number" id="CH-start"></td>
        </tr>
        <tr>
          <td>Steig.</td>
          <td><input type="number" id="KG-steig"></td>
          <td><input type="number" id="BF-steig"></td>
          <td><input type="number" id="ST-steig"></td>
          <td><input type="number" id="WI-steig"></td>
          <td><input type="number" id="I-steig"></td>
          <td><input type="number" id="GW-steig"></td>
          <td><input type="number" id="GS-steig"></td>
          <td><input type="number" id="IN-steig"></td>
          <td><input type="number" id="WK-steig"></td>
          <td><input type="number" id="CH-steig"></td>
        </tr>
        <tr>
          <td>&Sigma;</td>
          <td><input type="number" id="KG-akt" readonly></td>
          <td><input type="number" id="BF-akt" readonly></td>
          <td><input type="number" id="ST-akt" readonly></td>
          <td><input type="number" id="WI-akt" readonly></td>
          <td><input type="number" id="I-akt" readonly></td>
          <td><input type="number" id="GW-akt" readonly></td>
          <td><input type="number" id="GS-akt" readonly></td>
          <td><input type="number" id="IN-akt" readonly></td>
          <td><input type="number" id="WK-akt" readonly></td>
          <td><input type="number" id="CH-akt" readonly></td>
        </tr>
      </table>
      <div class="section-divider"></div>
    `
  },

  // 📜 Grundfähigkeiten
  {
    id: "grundfaehigkeiten",
    title: t('grundskills'),
      content: `
        <table class="full-width" id="grund-table">
        <tr>
          <th>Fähigkeit</th>
          <th class="wsg" colspan="2">Spielwert</th>
          <th class="wsg">Steig.</th>
          <th class="wsg">&Sigma;</th>
        </tr>
        <!-- Reihenfolge fix nach Referenz -->
        ${[
          ["Anführen","CH"],["Athletik","GW"],["Ausdauer","WI"],["Ausweichen","GW"],
          ["Besonnenheit","WK"],["Bestechen","CH"],["Charme","CH"],["Einschüchtern","ST"],
          ["Fahren","GW"],["Feilschen","CH"],["Glücksspiel","IN"],["Intuition","I"],
          ["Klatsch","CH"],["Klettern","ST"],["Kunst","GS"],["Nahkampf","KG"],
          ["Nahkampf (Standard)","KG"],["Navigation","I"],["Reiten","GW"],["Rudern","ST"],
          ["Schleichen","GW"],["Tiere bezirzen","WK"],["Überleben","IN"],["Unterhalten","CH"],
          ["Wahrnehmung","I"],["Zechen","WI"]
          ].map(([name,att]) => `
          <tr>
            <td data-marker="grund-${name}"><span class="marker-icon"></span><span>${name}</span><input type="hidden" id="grund-${name}-mark" value="0"></td>
            <td class="wsg">${att}</td>
            <td class="wsg"><input type="number" id="grund-${name}-wert" readonly></td>
            <td class="wsg"><input type="number" id="grund-${name}-steig"></td>
            <td class="wsg"><input type="number" id="grund-${name}-gesamt" readonly></td>
          </tr>`).join("")}
        </table>
        <div class="section-divider"></div>
      `
    },

  // ⚔️ Gruppierte Fähigkeiten
  {
    id: "gruppfaehigkeiten",
    title: t('groupskills'),
    content: `
      <table class="full-width" id="grupp-table">
        <tr>
          <th>Fähigkeit</th>
          <th colspan="2">Spielwert</th>
          <th class="wsg">Steig.</th>
          <th class="wsg">&Sigma;</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <button class="add-row" onclick="addRow('grupp-table')">+ Neue Zeile</button>
      <div class="section-divider"></div>
    `
  },

  // ⭐ Talente
  {
    id: "talente",
    title: t('talents'),
    content: `
      <table class="full-width" id="talent-table">
        <tr>
          <th>Talent</th>
          <th class="wsg">Lvl.</th>
          <th class="text-left">${t('note')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <button class="add-row" onclick="addRow('talent-table')">+ Neues Talent</button>
      <div class="section-divider"></div>
    `
  },
];
// Fortsetzung sections.js v0.8.2

sections.push(
  // 🗡️ Waffen
  {
    id: "waffen",
    title: t('weapons'),
    content: `
      <table class="full-width" id="waffen-table">
        <tr>
          <th>Name</th>
          <th class="text-left">${t('weapon_group')}</th>
          <th>TP</th>
          <th>RW</th>
          <th class="text-left">${t('qualities')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <button class="add-row" onclick="addRow('waffen-table')">+ Neue Waffe</button>
      <div class="section-divider"></div>
    `
  },

  // 🛡️ Rüstung
  {
    id: "ruestung",
    title: t('armor'),
    content: `
      <!-- Übersicht RP pro Zone -->
      <table class="ruestung-uebersicht">
        <tr><th>Trefferzone</th><th>Trefferbereich</th><th>Summe RP</th></tr>
        <tr><td>Kopf</td><td>01–09</td><td><input type="number" id="rp-kopf" readonly></td></tr>
        <tr><td>Linker Arm</td><td>10–24</td><td><input type="number" id="rp-larm" readonly></td></tr>
        <tr><td>Rechter Arm</td><td>25–44</td><td><input type="number" id="rp-rarm" readonly></td></tr>
        <tr><td>Brust</td><td>45–79</td><td><input type="number" id="rp-brust" readonly></td></tr>
        <tr><td>Linkes Bein</td><td>80–89</td><td><input type="number" id="rp-lbein" readonly></td></tr>
        <tr><td>Rechtes Bein</td><td>90–100</td><td><input type="number" id="rp-rbein" readonly></td></tr>
      </table>
      <div class="table-gap"></div>

      <!-- Dynamische Rüstungsteile -->
      <table class="full-width" id="ruestung-table">
        <tr>
          <th>Name</th>
          <th>${t('zone_short')}</th>
          <th>RP</th>
          <th>TP</th>
          <th class="text-left">${t('qualities')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <button class="add-row" onclick="addRow('ruestung-table')">+ Neue Rüstung</button>
      <div class="section-divider"></div>
    `
  },

  // 🎒 Ausrüstung
  {
    id: "ausruestung",
    title: t('equipment'),
    content: `
      <table class="full-width" id="ausruestung-table">
        <tr>
          <th>Name</th>
          <th>Menge</th>
          <th>TP</th>
          <th class="text-left">${t('notes')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <button class="add-row" onclick="addRow('ausruestung-table')">+ Neue Ausrüstung</button>
      <div class="section-divider"></div>
    `
  },

  // ✨ Zauber & Gebete
  {
    id: "zauber",
    title: t('spells'),
    content: `
      <table class="full-width" id="zauber-table">
        <tr>
          <th>Name</th>
          <th>ZW</th>
          <th>RW</th>
          <th>Ziel</th>
          <th>⏳</th>
          <th class="text-left">${t('effect')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <button class="add-row" onclick="addRow('zauber-table')">+ Neuer Zauber</button>
      <div class="section-divider"></div>
    `
  },

  // ☠️ Korruption + Mutationen
  {
    id: "korruption",
    title: t('corruption') + ' & ' + t('mutations'),
    content: `
      <table id="korruption-table">
        <tr><th>${t('max')}</th><th>${t('current')}</th></tr>
        <tr>
          <td><input type="number" id="korruption-max" readonly></td>
          <td><input type="number" id="korruption-akt"></td>
        </tr>
      </table>

      <table class="full-width" id="mutationen-table">
        <tr>
          <th>Mutation</th>
          <th>${t('affects')}</th>
          <th class="text-left">${t('notes')}</th>
          <th class="delete-col"></th>
        </tr>
      </table>
      <button class="add-row" onclick="addRow('mutationen-table')">+ ${t('mutation')}</button>
      <div class="section-divider"></div>
    `
  }
);
// Fortsetzung sections.js v0.8.2

sections.push(
  // 🧠 Psychologie
  {
    id: "psychologie",
    title: t('psychology'),
    content: `
      <table class="full-width" id="psychologie-table">
        <tr><th>Eintrag</th><th class="text-left">${t('notes')}</th><th class="delete-col"></th></tr>
      </table>
      <button class="add-row" onclick="addRow('psychologie-table')">+ Neuer Eintrag</button>
      <div class="section-divider"></div>
    `
  },

  // ❤️ Lebenspunkte
  {
    id: "lebenspunkte",
    title: t('lebenspunkte'),
    content: `
      <table class="full-width" id="lp-table">
        <tr><th>Komponente</th><th>Wert</th></tr>
        <tr><td>ST-Bonus</td><td><input type="number" id="lp-stb" readonly></td></tr>
        <tr><td>WI-Bonus</td><td><input type="number" id="lp-wib" readonly></td></tr>
        <tr><td>2× WK-Bonus</td><td><input type="number" id="lp-wkb" readonly></td></tr>
        <tr><td>Robustheit*</td><td><input type="number" id="lp-robustheit" readonly></td></tr>
        <tr><td>Gesamt-LP</td><td><input type="number" id="lp-gesamt" readonly></td></tr>
        <tr><td>${t('current_lp')}</td><td><input type="number" id="lp-aktuell" min="0" max="99"></td></tr>
      </table>
      <p>* Automatisch durch Talent "Robustheit" / "Hardy"</p>
      <div class="section-divider"></div>
    `
  },

  // ⚖️ Traglast
  {
    id: "traglast",
    title: t('traglast'),
    content: `
      <table class="full-width" id="traglast-table">
        <tr><th>Quelle</th><th>TP</th></tr>
        <tr><td>Waffen</td><td><input type="number" id="trag-waffen" readonly></td></tr>
        <tr><td>Rüstung</td><td><input type="number" id="trag-ruestung" readonly></td></tr>
        <tr><td>Ausrüstung</td><td><input type="number" id="trag-ausruestung" readonly></td></tr>
        <tr><td>Maximale TP</td><td><input type="number" id="trag-max" readonly></td></tr>
        <tr><td>Gesamt</td><td><input type="number" id="trag-gesamt" readonly></td></tr>
      </table>
      <div class="section-divider"></div>
    `
  },

  // 💰 Vermögen & Schulden
  {
    id: "vermoegen",
    title: t('wealth') + ' & ' + t('debts'),
    content: `
      <h3>${t('coin_possession')}</h3>
      <table id="vermoegen-table">
        <tr><th><span class="coin gold"></span> GK</th><th><span class="coin silver"></span> S</th><th><span class="coin copper"></span> G</th></tr>
        <tr>
          <td><input type="number" id="verm-gk"></td>
          <td><input type="number" id="verm-s"></td>
          <td><input type="number" id="verm-g"></td>
        </tr>
      </table>

      <div id="nettovermoegen-block" style="margin-top:10px;">
        <h3>${t('net_worth')}</h3>
        <table>
          <tr><th><span class="coin gold"></span> GK</th><th><span class="coin silver"></span> S</th><th><span class="coin copper"></span> G</th></tr>
          <tr>
            <td><input type="number" id="netto-gk" readonly></td>
            <td><input type="number" id="netto-s" readonly></td>
            <td><input type="number" id="netto-g" readonly></td>
          </tr>
        </table>
      </div>

      <h3 id="finanzen-toggle"><span id="finanzen-arrow">▶</span> ${t('finances_expand')}</h3>
      <div id="finanzen-extra" style="display:none;">
        <h3>${t('debts')}</h3>
        <table class="full-width" id="schulden-table">
          <tr>
            <th><span class="coin gold"></span> GK</th>
            <th><span class="coin silver"></span> S</th>
            <th><span class="coin copper"></span> G</th>
            <th>Notizen</th>
            <th class="delete-col"></th>
          </tr>
        </table>
        <button class="add-row" onclick="addRow('schulden-table')">+ ${t('new_row')}</button>

        <h3>${t('savings')}</h3>
        <table class="full-width" id="spar-table">
          <tr>
            <th><span class="coin gold"></span> GK</th>
            <th><span class="coin silver"></span> S</th>
            <th><span class="coin copper"></span> G</th>
            <th>Notizen</th>
            <th class="delete-col"></th>
          </tr>
        </table>
        <button class="add-row" onclick="addRow('spar-table')">+ ${t('new_row')}</button>
      </div>

      <div class="section-divider"></div>
    `
  },

  // ⭐ Erfahrung
  {
    id: "erfahrung",
    title: t('experience'),
    content: `
      <div style="text-align:center; margin-bottom:10px;">
        <label>${t('simple')}</label>
        <label class="switch">
          <input type="checkbox" id="exp-toggle">
          <span class="slider"></span>
        </label>
        <label>${t('full')}</label>
      </div>

      <!-- Simpler Modus -->
      <div id="exp-simple">
        <table class="full-width">
          <tr><th>${t('current')}</th><th>${t('spent')}</th><th>${t('total_col')}</th></tr>
          <tr>
            <td><input type="number" id="exp-simple-akt"></td>
            <td><input type="number" id="exp-simple-ausg"></td>
            <td><input type="number" id="exp-simple-gesamt" readonly></td>
          </tr>
        </table>
      </div>

      <!-- Voller Modus -->
      <div id="exp-full" style="display:none;">
        <table class="full-width">
          <tr><th>${t('current')}</th><th>${t('spent')}</th><th>${t('total_col')}</th></tr>
          <tr>
            <td><input type="number" id="exp-full-akt" readonly></td>
            <td><input type="number" id="exp-full-ausg" readonly></td>
            <td><input type="number" id="exp-full-gesamt" readonly></td>
          </tr>
        </table>

        <table class="full-width" id="exp-table">
          <tr><th>${t('value_col')}</th><th>${t('comment_col')}</th><th class="delete-col"></th></tr>
        </table>
        <button class="add-row" onclick="addRow('exp-table')">+ ${t('entry')}</button>
      </div>
      <div class="section-divider"></div>
    `
  }
);
