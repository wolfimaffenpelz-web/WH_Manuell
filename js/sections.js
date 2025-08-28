// sections.js – Alle Segmente & Tabellen

function loadSections() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    ${sectionGrunddaten()}
    ${sectionAttribute()}
    ${sectionLebenspunkte()}
    ${sectionGrundfertigkeiten()}
    ${sectionGruppierteFertigkeiten()}
    ${sectionWaffen()}
    ${sectionRuestung()}
    ${sectionAusrüstung()}
    ${sectionZauber()}
    ${sectionMutationen()}
    ${sectionPsychologie()}
    ${sectionKorruption()}
    ${sectionTraglast()}
    ${sectionVermoegen()}
    ${sectionSchicksalUndZaehaigkeit()}
    ${sectionErfahrung()}
  `;
}

// ---------------- Grunddaten ----------------
function sectionGrunddaten() {
  return `
  <section id="section_grunddaten">
    <h2>Grunddaten</h2>
    <table class="narrow">
      <tr>
        <th>Name</th>
        <td><input id="char_name" type="text"></td>
        <th>Klasse</th>
        <td><input id="char_class" type="text"></td>
      </tr>
      <tr>
        <th>Rasse</th>
        <td><input id="char_race" type="text"></td>
        <th>Karrierestufe</th>
        <td><input id="char_career" type="text" class="num-2"></td>
      </tr>
      <tr>
        <th>Status</th>
        <td><input id="char_status" type="text"></td>
        <th>Geschlecht</th>
        <td><input id="char_gender" type="text"></td>
      </tr>
    </table>
  </section>
  `;
}

// ---------------- Attribute ----------------
function sectionAttribute() {
  return `
  <section id="section_attributes">
    <h2>Spielwerte</h2>
    <table class="wide">
      <tr>
        <th></th>
        <th>KG</th><th>BF</th><th>ST</th><th>WI</th><th>I</th>
        <th>GW</th><th>GS</th><th>IN</th><th>WK</th><th>CH</th>
      </tr>
      <tr>
        <td>Anfang</td>
        <td><input id="attr_KG_base" class="num-2"></td>
        <td><input id="attr_BF_base" class="num-2"></td>
        <td><input id="attr_ST_base" class="num-2"></td>
        <td><input id="attr_WI_base" class="num-2"></td>
        <td><input id="attr_I_base" class="num-2"></td>
        <td><input id="attr_GW_base" class="num-2"></td>
        <td><input id="attr_GS_base" class="num-2"></td>
        <td><input id="attr_IN_base" class="num-2"></td>
        <td><input id="attr_WK_base" class="num-2"></td>
        <td><input id="attr_CH_base" class="num-2"></td>
      </tr>
      <tr>
        <td>Steig.</td>
        <td><input id="attr_KG_adv" class="num-2"></td>
        <td><input id="attr_BF_adv" class="num-2"></td>
        <td><input id="attr_ST_adv" class="num-2"></td>
        <td><input id="attr_WI_adv" class="num-2"></td>
        <td><input id="attr_I_adv" class="num-2"></td>
        <td><input id="attr_GW_adv" class="num-2"></td>
        <td><input id="attr_GS_adv" class="num-2"></td>
        <td><input id="attr_IN_adv" class="num-2"></td>
        <td><input id="attr_WK_adv" class="num-2"></td>
        <td><input id="attr_CH_adv" class="num-2"></td>
      </tr>
      <tr>
        <td>Aktuell</td>
        <td><input id="attr_KG" readonly class="num-2"></td>
        <td><input id="attr_BF" readonly class="num-2"></td>
        <td><input id="attr_ST" readonly class="num-2"></td>
        <td><input id="attr_WI" readonly class="num-2"></td>
        <td><input id="attr_I" readonly class="num-2"></td>
        <td><input id="attr_GW" readonly class="num-2"></td>
        <td><input id="attr_GS" readonly class="num-2"></td>
        <td><input id="attr_IN" readonly class="num-2"></td>
        <td><input id="attr_WK" readonly class="num-2"></td>
        <td><input id="attr_CH" readonly class="num-2"></td>
      </tr>
    </table>
  </section>
  `;
}
// ---------------- Lebenspunkte ----------------
function sectionLebenspunkte() {
  return `
  <section id="section_wounds">
    <h2>Lebenspunkte</h2>
    <table class="narrow">
      <tr>
        <th>STB</th><th>WIB</th><th>2×WKB</th><th>Robustheit*</th><th>Summe</th><th>LP</th>
      </tr>
      <tr>
        <td><input id="wound_stb" readonly class="num-2"></td>
        <td><input id="wound_wib" readonly class="num-2"></td>
        <td><input id="wound_wkb2" readonly class="num-2"></td>
        <td><input id="wound_robust" readonly class="num-2"></td>
        <td><input id="wound_sum" readonly class="num-2"></td>
        <td><input id="wound_lp" class="num-2"></td>
      </tr>
    </table>
    <small>* Robustheit wird automatisch berechnet, falls das Talent „Robustheit“/„Hardy“ vorhanden ist</small>
  </section>
  `;
}

// ---------------- Grundfertigkeiten ----------------
function sectionGrundfertigkeiten() {
  return `
  <section id="section_basic_skills">
    <h2>Grundfähigkeiten</h2>
    <table class="wide">
      <tr>
        <th></th><th>Fähigkeit</th><th>Attribut</th><th>Wert</th>
      </tr>
      ${grundfertigkeitenListe().map(skill => `
      <tr>
        <td><button class="mark-btn" data-skill="${skill.id}">◯</button></td>
        <td>${skill.name}</td>
        <td><span id="skill_${skill.id}_attr">${skill.attr}</span> 
            (<span id="skill_${skill.id}_attrval"></span>)</td>
        <td><input id="skill_${skill.id}_val" class="num-2"></td>
      </tr>
      `).join("")}
    </table>
  </section>
  `;
}

function grundfertigkeitenListe() {
  return [
    { id: "animalcare", name: "Tierkunde", attr: "IN" },
    { id: "charm", name: "Charme", attr: "CH" },
    { id: "charmanimal", name: "Tiere besänftigen", attr: "WI" },
    { id: "climb", name: "Klettern", attr: "ST" },
    { id: "cool", name: "Kaltblütigkeit", attr: "WK" },
    { id: "consumealcohol", name: "Trinken", attr: "WI" },
    { id: "dodge", name: "Ausweichen", attr: "GW" },
    { id: "endurance", name: "Ausdauer", attr: "WI" },
    { id: "entertain", name: "Unterhalten", attr: "CH" },
    { id: "gamble", name: "Spielen", attr: "IN" },
    { id: "gossip", name: "Klatsch", attr: "CH" },
    { id: "haggle", name: "Feilschen", attr: "CH" },
    { id: "intimidate", name: "Einschüchtern", attr: "ST" },
    { id: "intuition", name: "Intuition", attr: "I" },
    { id: "leadership", name: "Führen", attr: "CH" },
    { id: "melee_basic", name: "Nahkampf (Standard)", attr: "KG" },
    { id: "outdoor", name: "Wildnisleben", attr: "IN" },
    { id: "perception", name: "Wahrnehmung", attr: "I" },
    { id: "ride", name: "Reiten", attr: "GS" },
    { id: "row", name: "Rudern", attr: "ST" },
    { id: "stealth", name: "Schleichen", attr: "GE" }, 
    { id: "swim", name: "Schwimmen", attr: "ST" }
  ];
}
// ---------------- Gruppierte Fähigkeiten ----------------
function sectionGruppierteFertigkeiten() {
  return `
  <section id="section_grouped_skills">
    <h2>Gruppierte & Ausbaufähigkeiten</h2>
    <table class="wide" id="groupedSkillsTable">
      <tr>
        <th></th><th>Fähigkeit</th><th>Attribut</th><th>Wert</th><th>🗑</th>
      </tr>
    </table>
    <button onclick="addGroupedSkill()">➕</button>
  </section>
  `;
}

// ---------------- Waffen ----------------
function sectionWaffen() {
  return `
  <section id="section_weapons">
    <h2>Waffen</h2>
    <table class="wide" id="weaponsTable">
      <tr>
        <th>Name</th><th>Gruppe</th><th>TP</th><th>RW</th><th>Schaden</th><th>🗑</th>
      </tr>
    </table>
    <button onclick="addWeapon()">➕</button>
  </section>
  `;
}

// ---------------- Rüstung ----------------
function sectionRuestung() {
  return `
  <section id="section_armor">
    <h2>Rüstungspunkte</h2>
    <div class="armor-container">
      <svg id="armorFigure" viewBox="0 0 200 420">
        <!-- Graue Silhouette (vereinfacht) -->
        <rect x="60" y="40" width="80" height="300" fill="#ccc" rx="20"/>
        <circle cx="100" cy="20" r="20" fill="#ccc"/>
        <!-- Stiefel -->
        <rect x="70" y="340" width="20" height="50" fill="#bbb"/>
        <rect x="110" y="340" width="20" height="50" fill="#bbb"/>
        <polygon points="70,340 90,330 90,340" fill="#999"/>
        <polygon points="110,340 130,330 130,340" fill="#999"/>
        <!-- Schwert links -->
        <rect x="45" y="200" width="8" height="80" fill="#888"/>
        <rect x="40" y="190" width="18" height="15" fill="#666"/>
      </svg>
      <table class="wide" id="armorTable">
        <tr>
          <th>Name</th><th>Trefferzone</th><th>RP</th><th>🗑</th>
        </tr>
      </table>
      <button onclick="addArmor()">➕</button>
    </div>
  </section>
  `;
}

// ---------------- Ausrüstung ----------------
function sectionAusrüstung() {
  return `
  <section id="section_equipment">
    <h2>Ausrüstung</h2>
    <table class="wide" id="equipmentTable">
      <tr>
        <th>Name</th><th>Menge</th><th>TP</th><th>🗑</th>
      </tr>
    </table>
    <button onclick="addEquipment()">➕</button>
  </section>
  `;
}

// ---------------- Zauber & Gebete ----------------
function sectionZauber() {
  return `
  <section id="section_spells">
    <h2>Zauber & Gebete</h2>
    <table class="wide" id="spellsTable">
      <tr>
        <th>Name</th><th>Stufe</th><th>🗑</th>
      </tr>
    </table>
    <button onclick="addSpell()">➕</button>
  </section>
  `;
}

// ---------------- Mutationen ----------------
function sectionMutationen() {
  return `
  <section id="section_mutations">
    <h2>Mutationen</h2>
    <table class="wide" id="mutationsTable">
      <tr><th>Mutation</th><th>🗑</th></tr>
    </table>
    <button onclick="addMutation()">➕</button>
  </section>
  `;
}

// ---------------- Psychologie ----------------
function sectionPsychologie() {
  return `
  <section id="section_psychology">
    <h2>Psychologie</h2>
    <table class="wide" id="psychologyTable">
      <tr><th>Eintrag</th><th>🗑</th></tr>
    </table>
    <button onclick="addPsychology()">➕</button>
  </section>
  `;
}
// ---------------- Korruption ----------------
function sectionKorruption() {
  return `
  <section id="section_corruption">
    <h2>Korruption</h2>
    <table class="narrow">
      <tr><th>Max.</th><th>Aktuell</th></tr>
      <tr>
        <td><input id="corruption_max" readonly class="num-2"></td>
        <td><input id="corruption_current" class="num-2"></td>
      </tr>
    </table>
    <h3>Mutationen</h3>
    <table class="wide" id="corruptionMutations">
      <tr><th>Mutation</th><th>🗑</th></tr>
    </table>
    <button onclick="addCorruptionMutation()">➕</button>
  </section>
  `;
}

// ---------------- Traglast ----------------
function sectionTraglast() {
  return `
  <section id="section_encumbrance">
    <h2>Traglast</h2>
    <table class="narrow">
      <tr><td>Waffen</td><td><input id="enc_wpn" readonly class="num-2"></td></tr>
      <tr><td>Rüstung</td><td><input id="enc_arm" readonly class="num-2"></td></tr>
      <tr><td>Ausrüstung</td><td><input id="enc_eq" readonly class="num-2"></td></tr>
      <tr><td>Maximale TP</td><td><input id="enc_max" readonly class="num-2"></td></tr>
      <tr><td>Gesamt</td><td><input id="enc_total" readonly class="num-2"></td></tr>
    </table>
  </section>
  `;
}

// ---------------- Vermögen ----------------
function sectionVermoegen() {
  return `
  <section id="section_money">
    <h2>Vermögen</h2>
    <table class="narrow">
      <tr>
        <th>🟡 GK</th><th>⚪ S</th><th>🟤 G</th>
      </tr>
      <tr>
        <td><input id="money_gk" class="num-3"></td>
        <td><input id="money_s" class="num-3"></td>
        <td><input id="money_g" class="num-3"></td>
      </tr>
    </table>
    <div id="money_total" class="money-total"></div>
  </section>
  `;
}

// ---------------- Schicksal & Zähigkeit ----------------
function sectionSchicksalUndZaehaigkeit() {
  return `
  <section id="section_fate_resilience">
    <h2>Schicksal & Zähigkeit</h2>
    <div class="dual-table">
      <table class="narrow">
        <tr><th>Schicksal</th><td><input id="fate_val" class="num-2"></td></tr>
        <tr><th>Glück</th><td><input id="fate_luck" class="num-2"> / <span id="fate_luck_max"></span></td></tr>
      </table>
      <div class="table-divider"></div>
      <table class="narrow">
        <tr><th>Zähigkeit</th><td><input id="res_val" class="num-2"></td></tr>
        <tr><th>Mut</th><td><input id="res_mut" class="num-2"> / <span id="res_mut_max"></span></td></tr>
      </table>
    </div>
    <div class="motivation">
      <h3>Motivation</h3>
      <textarea id="motivation_text"></textarea>
    </div>
  </section>
  `;
}

// ---------------- Erfahrung ----------------
function sectionErfahrung() {
  return `
  <section id="section_experience">
    <h2>Erfahrung</h2>
    <label class="switch">
      <input type="checkbox" id="exp_toggle">
      <span class="slider"></span>
      <span class="switch-label">Vereinfacht / Voll</span>
    </label>
    <div id="exp_simple">
      <table class="narrow">
        <tr><th>Erhalten</th><th>Ausgegeben</th><th>Gesamt</th></tr>
        <tr>
          <td><input id="exp_simple_gain" class="num-5"></td>
          <td><input id="exp_simple_spent" class="num-5"></td>
          <td><input id="exp_simple_total" readonly class="num-5"></td>
        </tr>
      </table>
    </div>
    <div id="exp_full" style="display:none;">
      <table class="narrow">
        <tr><th>Erhalten</th><th>Ausgegeben</th><th>Gesamt</th></tr>
        <tr>
          <td><input id="exp_full_gain" readonly class="num-5"></td>
          <td><input id="exp_full_spent" readonly class="num-5"></td>
          <td><input id="exp_full_total" readonly class="num-5"></td>
        </tr>
      </table>
      <table class="wide" id="expTable">
        <tr><th>Wert</th><th>Kommentar</th><th>🗑</th></tr>
      </table>
      <button onclick="addExpRow()">➕</button>
      <button onclick="toggleExpComments()">Alle einklappen / ausklappen</button>
    </div>
  </section>
  `;
}
