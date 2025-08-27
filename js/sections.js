// -------------------------
// Sections.js
// Enthält die Struktur aller Tabellen & Abschnitte
// -------------------------

function loadSections() {
  const main = document.getElementById("main-content");

  // -------------------------
  // Grunddaten (3 Tabellen)
  // -------------------------
  main.innerHTML += `
  <section id="section_basics">
    <h2>Grunddaten</h2>

    <!-- Tabelle 1 -->
    <table>
      <tr>
        <th>Name</th>
        <th>Rasse</th>
        <th>Klasse</th>
        <th>Karriere</th>
      </tr>
      <tr>
        <td><input class="text-long" id="char_name"></td>
        <td><input class="text-medium" id="char_race"></td>
        <td><input class="text-medium" id="char_class"></td>
        <td><input class="text-long" id="char_career"></td>
      </tr>
    </table>

    <!-- Tabelle 2 -->
    <table>
      <tr>
        <th>Karrierestufe</th>
        <th>Status</th>
        <th>Alter</th>
        <th>Geschlecht</th>
      </tr>
      <tr>
        <td><input class="text-long" id="career_level"></td>
        <td><input class="text-medium" id="char_status"></td>
        <td><input class="num-3" id="char_age"></td>
        <td><input class="text-short" id="char_gender"></td>
      </tr>
    </table>

    <!-- Tabelle 3 -->
    <table class="segment-separator">
      <tr>
        <th>Größe</th>
        <th>Gewicht</th>
        <th>Augenfarbe</th>
        <th>Haarfarbe</th>
      </tr>
      <tr>
        <td><input class="num-3" id="char_height"></td>
        <td><input class="num-3" id="char_weight"></td>
        <td><input class="text-medium" id="char_eyes"></td>
        <td><input class="text-medium" id="char_hair"></td>
      </tr>
    </table>
  </section>
  `;

  // -------------------------
  // Attribute
  // -------------------------
  main.innerHTML += `
  <section id="section_attributes">
    <h2>Attribute</h2>
    <table class="segment-separator">
      <tr>
        <th></th>
        <th>KG</th><th>BF</th><th>ST</th><th>WI</th>
        <th>GE</th><th>IN</th><th>WK</th><th>CH</th>
      </tr>
      <tr>
        <td>Anfang</td>
        <td><input id="kg_start" class="num-3"></td>
        <td><input id="bf_start" class="num-3"></td>
        <td><input id="st_start" class="num-3"></td>
        <td><input id="wi_start" class="num-3"></td>
        <td><input id="ge_start" class="num-3"></td>
        <td><input id="in_start" class="num-3"></td>
        <td><input id="wk_start" class="num-3"></td>
        <td><input id="ch_start" class="num-3"></td>
      </tr>
      <tr>
        <td>Steigerungen</td>
        <td><input id="kg_up" class="num-3"></td>
        <td><input id="bf_up" class="num-3"></td>
        <td><input id="st_up" class="num-3"></td>
        <td><input id="wi_up" class="num-3"></td>
        <td><input id="ge_up" class="num-3"></td>
        <td><input id="in_up" class="num-3"></td>
        <td><input id="wk_up" class="num-3"></td>
        <td><input id="ch_up" class="num-3"></td>
      </tr>
      <tr>
        <td><b>Aktuell</b></td>
        <td><input id="kg_w" class="num-3" readonly></td>
        <td><input id="bf_w" class="num-3" readonly></td>
        <td><input id="st_w" class="num-3" readonly></td>
        <td><input id="wi_w" class="num-3" readonly></td>
        <td><input id="ge_w" class="num-3" readonly></td>
        <td><input id="in_w" class="num-3" readonly></td>
        <td><input id="wk_w" class="num-3" readonly></td>
        <td><input id="ch_w" class="num-3" readonly></td>
      </tr>
    </table>
  </section>
  `;

  // -------------------------
  // Lebenspunkte
  // -------------------------
  main.innerHTML += `
  <section id="section_wounds">
    <h2>Lebenspunkte</h2>
    <table class="segment-separator">
      <tr>
        <th>STB</th>
        <th>WIB</th>
        <th>WKB × 2</th>
        <th>Robustheit*</th>
        <th>Summe</th>
        <th>LP</th>
      </tr>
      <tr>
        <td><input id="lp_stb" class="num-3" readonly></td>
        <td><input id="lp_wib" class="num-3" readonly></td>
        <td><input id="lp_wkb2" class="num-3" readonly></td>
        <td><input id="lp_robustheit_bonus" class="num-3" readonly></td>
        <td><input id="lp_robustheit" class="num-3" readonly></td>
        <td><input id="lp_current" class="num-3"></td>
      </tr>
    </table>
    <div class="footnote">
      * Bonus aus Talent „Robustheit“ (engl. Hardy), falls vorhanden, sonst leer.
    </div>
  </section>
  `;

  // -------------------------
  // Grundfähigkeiten
  // -------------------------
  main.innerHTML += `
  <section id="section_skills">
    <h2>Grundfähigkeiten</h2>
    <table class="segment-separator" id="basicSkillsTable">
      <tr>
        <th>✠</th>
        <th>Name</th>
        <th>Attribut</th>
        <th>Attr.-Wert</th>
        <th>Steigerung</th>
        <th>Wert</th>
      </tr>
      <tr>
        <td><button class="skill-btn">◯</button></td>
        <td>Ausweichen</td>
        <td>I</td>
        <td><input id="skill_ausweichen_attr" class="num-3" readonly></td>
        <td><input id="skill_ausweichen_up" class="num-3"></td>
        <td><input id="skill_ausweichen_val" class="num-3" readonly></td>
      </tr>
      <!-- Weitere Grundfähigkeiten analog -->
    </table>
  </section>
  `;

  // -------------------------
  // Gruppierte Fähigkeiten
  // -------------------------
  main.innerHTML += `
  <section id="section_grouped_skills">
    <h2>Gruppierte & Ausbaufähigkeiten</h2>
    <table class="segment-separator" id="groupedSkillsTable">
      <tr>
        <th>✠</th>
        <th>Name</th>
        <th>Attribut</th>
        <th>Attr.-Wert</th>
        <th>Steigerung</th>
        <th>Wert</th>
        <th>🗑</th>
      </tr>
    </table>
    <button type="button" onclick="addGroupedSkillRow()">+ Zeile hinzufügen</button>
  </section>
  `;
  // -------------------------
  // Waffen
  // -------------------------
  main.innerHTML += `
  <section id="section_weapons">
    <h2>Waffen</h2>
    <table class="segment-separator" id="weaponsTable">
      <tr>
        <th>Name</th>
        <th>Gruppe</th>
        <th>TP</th>
        <th>RW</th>
        <th>Qualitäten</th>
        <th>🗑</th>
      </tr>
    </table>
    <button type="button" onclick="addWeaponRow()">+ Zeile hinzufügen</button>
  </section>
  `;

  // -------------------------
  // Rüstung + Figur
  // -------------------------
  main.innerHTML += `
  <section id="section_armor">
    <h2>Rüstungspunkte</h2>
    <svg id="armorFigure" viewBox="0 0 200 420">
      <!-- Kopf -->
      <text x="100" y="15" text-anchor="middle" font-size="10">01–09</text>
      <foreignObject x="85" y="40" width="30" height="20">
        <input id="zone_head" readonly class="num-3" />
      </foreignObject>
      <text x="100" y="75" text-anchor="middle" font-size="10">Kopf</text>

      <!-- Körper -->
      <text x="100" y="110" text-anchor="middle" font-size="10">45–79</text>
      <foreignObject x="85" y="150" width="30" height="20">
        <input id="zone_body" readonly class="num-3" />
      </foreignObject>
      <text x="100" y="180" text-anchor="middle" font-size="10">Körper</text>

      <!-- Linker Arm -->
      <text x="40" y="110" text-anchor="middle" font-size="10">10–24</text>
      <foreignObject x="30" y="150" width="30" height="20">
        <input id="zone_larm" readonly class="num-3" />
      </foreignObject>
      <text x="40" y="180" text-anchor="middle" font-size="10">L. Arm</text>

      <!-- Rechter Arm -->
      <text x="160" y="110" text-anchor="middle" font-size="10">25–44</text>
      <foreignObject x="140" y="150" width="30" height="20">
        <input id="zone_rarm" readonly class="num-3" />
      </foreignObject>
      <text x="160" y="180" text-anchor="middle" font-size="10">R. Arm</text>

      <!-- Linkes Bein -->
      <text x="70" y="250" text-anchor="middle" font-size="10">80–89</text>
      <foreignObject x="60" y="300" width="30" height="20">
        <input id="zone_lleg" readonly class="num-3" />
      </foreignObject>
      <text x="70" y="330" text-anchor="middle" font-size="10">L. Bein</text>

      <!-- Rechtes Bein -->
      <text x="130" y="250" text-anchor="middle" font-size="10">90–100</text>
      <foreignObject x="120" y="300" width="30" height="20">
        <input id="zone_rleg" readonly class="num-3" />
      </foreignObject>
      <text x="130" y="330" text-anchor="middle" font-size="10">R. Bein</text>

      <!-- Schild -->
      <rect x="85" y="360" width="30" height="20" fill="#999"/>
      <foreignObject x="85" y="360" width="30" height="20">
        <input id="zone_shield" readonly class="num-3" />
      </foreignObject>
      <text x="100" y="395" text-anchor="middle" font-size="10">Schild</text>
    </svg>

    <h2>Rüstung</h2>
    <table class="segment-separator" id="armorTable">
      <tr>
        <th>Name</th>
        <th>Trefferzone</th>
        <th>TP</th>
        <th>RP</th>
        <th>Qualitäten</th>
        <th>🗑</th>
      </tr>
    </table>
    <button type="button" onclick="addArmorRow()">+ Zeile hinzufügen</button>
  </section>
  `;

  // -------------------------
  // Ausrüstung
  // -------------------------
  main.innerHTML += `
  <section id="section_equipment">
    <h2>Ausrüstung</h2>
    <table class="segment-separator" id="equipmentTable">
      <tr>
        <th>Name</th>
        <th>Menge</th>
        <th>TP</th>
        <th>🗑</th>
      </tr>
    </table>
    <button type="button" onclick="addEquipmentRow()">+ Zeile hinzufügen</button>
  </section>
  `;

  // -------------------------
  // Vermögen
  // -------------------------
  main.innerHTML += `
  <section id="section_money">
    <h2>Vermögen</h2>
    <table id="moneyTable">
      <tr>
        <th>🟡 GK</th>
        <th>⚪ S</th>
        <th>🟤 G</th>
      </tr>
      <tr>
        <td><input id="money_gk" class="num-3"></td>
        <td><input id="money_s" class="num-3"></td>
        <td><input id="money_g" class="num-3"></td>
      </tr>
    </table>

    <table class="segment-separator">
      <tr>
        <th>Gesamt GK</th>
        <th>Gesamt S</th>
        <th>Gesamt G</th>
      </tr>
      <tr>
        <td><input id="money_total_gk" class="num-3" readonly></td>
        <td><input id="money_total_s" class="num-3" readonly></td>
        <td><input id="money_total_g" class="num-3" readonly></td>
      </tr>
    </table>
  </section>
  `;
  // -------------------------
  // Zauber & Gebete
  // -------------------------
  main.innerHTML += `
  <section id="section_spells">
    <h2>Zauber & Gebete</h2>
    <table class="segment-separator" id="spellsTable">
      <tr>
        <th>Name</th>
        <th>ZW</th>
        <th>Reichweite</th>
        <th>Ziel</th>
        <th>Dauer</th>
        <th>Effekt</th>
        <th>🗑</th>
      </tr>
    </table>
    <button type="button" onclick="addSpellRow()">+ Zeile hinzufügen</button>
  </section>
  `;

  // -------------------------
  // Talente
  // -------------------------
  main.innerHTML += `
  <section id="section_talents">
    <h2>Talente</h2>
    <table class="segment-separator" id="talentsTable">
      <tr>
        <th>✠</th>
        <th>Name</th>
        <th>Stufe</th>
        <th>🗑</th>
      </tr>
    </table>
    <button type="button" onclick="addTalentRow()">+ Zeile hinzufügen</button>
  </section>
  `;

  // -------------------------
  // Korruption & Mutationen
  // -------------------------
  main.innerHTML += `
  <section id="section_corruption">
    <h2>Korruption & Mutationen</h2>
    <div id="corruptionBlock" class="flex-tables">
      <div class="table-container">
        <h3>Korruptionspunkte</h3>
        <table>
          <tr>
            <th>Max.</th>
            <th>Aktuell</th>
          </tr>
          <tr>
            <td><input id="korruption_max" readonly class="num-3"></td>
            <td><input id="korruption_current" class="num-3"></td>
          </tr>
        </table>
      </div>
      <div class="table-container">
        <h3>Mutationen</h3>
        <table id="mutationTable">
          <tr>
            <th>Name</th>
            <th>🗑</th>
          </tr>
          <tr>
            <td><input></td>
            <td><button onclick="deleteMutationRow(this)">🗑</button></td>
          </tr>
        </table>
        <button type="button" onclick="addMutationRow()">+ Zeile hinzufügen</button>
      </div>
    </div>
  </section>
  `;

  // -------------------------
  // Psychologie
  // -------------------------
  main.innerHTML += `
  <section id="section_psychology">
    <h2>Psychologie</h2>
    <table id="psychologyTable">
      <tr>
        <th>Name</th>
        <th>🗑</th>
      </tr>
      <tr>
        <td><input></td>
        <td><button onclick="deletePsychologyRow(this)">🗑</button></td>
      </tr>
    </table>
    <button type="button" onclick="addPsychologyRow()">+ Zeile hinzufügen</button>
  </section>
  `;

  // -------------------------
  // Sünde
  // -------------------------
  main.innerHTML += `
  <section id="section_sin">
    <table class="segment-separator">
      <tr>
        <td><b>Sünde</b></td>
        <td><input id="sin_value" class="num-2" maxlength="2"></td>
      </tr>
    </table>
  </section>
  `;

  // -------------------------
  // Traglast
  // -------------------------
  main.innerHTML += `
  <section id="section_encumbrance">
    <table class="segment-separator">
      <tr>
        <td>Waffen</td>
        <td><input id="enc_weapons" class="num-3" readonly></td>
      </tr>
      <tr>
        <td>Rüstung</td>
        <td><input id="enc_armor" class="num-3" readonly></td>
      </tr>
      <tr>
        <td>Ausrüstung</td>
        <td><input id="enc_equipment" class="num-3" readonly></td>
      </tr>
      <tr>
        <td>Maximale TP</td>
        <td><input id="traglast_max" class="num-3" readonly></td>
      </tr>
      <tr>
        <td>Gesamt</td>
        <td><input id="traglast_total" class="num-3" readonly></td>
      </tr>
    </table>
  </section>
  `;
}
