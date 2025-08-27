// -------------------------
// Logic.js
// Enthält Berechnungen & Interaktivität
// -------------------------

document.addEventListener("DOMContentLoaded", () => {
  loadSections();
  initLogic();
});

function initLogic() {
  setupAttributeListeners();
  setupSkillButtons();
}

// -------------------------
// Attribute
// -------------------------
function setupAttributeListeners() {
  const attrIds = ["kg", "bf", "st", "wi", "ge", "in", "wk", "ch"];
  attrIds.forEach(id => {
    ["_start","_up"].forEach(suffix => {
      const el = document.getElementById(id + suffix);
      if (el) el.addEventListener("input", updateAttributes);
    });
  });
}

function updateAttributes() {
  const attrIds = ["kg", "bf", "st", "wi", "ge", "in", "wk", "ch"];
  attrIds.forEach(id => {
    const start = parseInt(document.getElementById(id + "_start").value) || 0;
    const up = parseInt(document.getElementById(id + "_up").value) || 0;
    const total = start + up;
    document.getElementById(id + "_w").value = total;
  });

  updateLebenspunkte();
  updateKorruption();
  updateTraglast();
  updateArmorFigure();
  updateSkills();
}

// -------------------------
// Skills
// -------------------------
function updateSkills() {
  // Grundfähigkeiten
  const rows = document.querySelectorAll("#basicSkillsTable tr");
  rows.forEach((row, idx) => {
    if (idx === 0) return; // Skip header
    const attrCell = row.cells[2];
    const attrShort = attrCell.textContent.trim();
    const attrId = attrShort.toLowerCase() + "_w";
    const attrVal = parseInt(document.getElementById(attrId)?.value) || 0;

    const attrField = row.querySelector("td:nth-child(4) input");
    const upField = row.querySelector("td:nth-child(5) input");
    const valField = row.querySelector("td:nth-child(6) input");

    if (attrField) attrField.value = attrVal;
    const up = parseInt(upField.value) || 0;
    if (valField) valField.value = attrVal + up;
  });

  // Gruppierte Fähigkeiten
  const groupedRows = document.querySelectorAll("#groupedSkillsTable tr");
  groupedRows.forEach((row, idx) => {
    if (idx === 0) return;
    const attrSelect = row.cells[2].querySelector("select");
    const attrShort = attrSelect ? attrSelect.value : "";
    const attrId = attrShort.toLowerCase() + "_w";
    const attrVal = parseInt(document.getElementById(attrId)?.value) || 0;

    const attrField = row.querySelector("td:nth-child(4) input");
    const upField = row.querySelector("td:nth-child(5) input");
    const valField = row.querySelector("td:nth-child(6) input");

    if (attrField) attrField.value = attrVal;
    const up = parseInt(upField.value) || 0;
    if (valField) valField.value = attrVal + up;
  });
}

// -------------------------
// Gruppierte Fähigkeiten: Zeilen hinzufügen
// -------------------------
function addGroupedSkillRow() {
  const table = document.getElementById("groupedSkillsTable");
  const row = table.insertRow(-1);

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);
  const cell4 = row.insertCell(3);
  const cell5 = row.insertCell(4);
  const cell6 = row.insertCell(5);
  const cell7 = row.insertCell(6);

  cell1.innerHTML = '<button class="skill-btn">◯</button>';
  cell2.innerHTML = '<input>';
  cell3.innerHTML = `
    <select onchange="updateSkills()">
      <option value="kg">KG</option>
      <option value="bf">BF</option>
      <option value="st">ST</option>
      <option value="wi">WI</option>
      <option value="ge">GE</option>
      <option value="in">IN</option>
      <option value="wk">WK</option>
      <option value="ch">CH</option>
    </select>`;
  cell4.innerHTML = '<input readonly class="num-3">';
  cell5.innerHTML = '<input class="num-3" oninput="updateSkills()">';
  cell6.innerHTML = '<input readonly class="num-3">';
  cell7.innerHTML = '<button onclick="deleteRow(this)">🗑</button>';
}

// -------------------------
// Zeile löschen
// -------------------------
function deleteRow(btn) {
  const row = btn.closest("tr");
  row.parentNode.removeChild(row);
  updateSkills();
  updateWeapons();
  updateArmor();
  updateEquipment();
  updateSpells();
  updateTalents();
  updateTraglast();
}

// -------------------------
// Skill Buttons (✠)
// -------------------------
function setupSkillButtons() {
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("skill-btn")) {
      const btn = e.target;
      btn.textContent = (btn.textContent === "◯") ? "✠" : "◯";
      const row = btn.closest("tr");
      if (btn.textContent === "✠") {
        row.classList.add("skill-marked");
      } else {
        row.classList.remove("skill-marked");
      }
    }
  });
}
// -------------------------
// Lebenspunkte
// -------------------------
function updateLebenspunkte() {
  const st = parseInt(document.getElementById("st_w").value) || 0;
  const wi = parseInt(document.getElementById("wi_w").value) || 0;
  const wk = parseInt(document.getElementById("wk_w").value) || 0;

  const stb = Math.floor(st / 10);
  const wib = Math.floor(wi / 10);
  const wkb2 = Math.floor(wk / 10) * 2;

  document.getElementById("lp_stb").value = stb;
  document.getElementById("lp_wib").value = wib;
  document.getElementById("lp_wkb2").value = wkb2;

  // Robustheit Bonus (Talent Robustheit/Hardy)
  let robustheitBonus = "";
  const talents = Array.from(document.querySelectorAll("#talentsTable input"))
                       .map(el => el.value.toLowerCase().trim());
  if (talents.includes("robustheit") || talents.includes("hardy")) {
    robustheitBonus = Math.floor(wi / 10);
  }

  document.getElementById("lp_robustheit_bonus").value = robustheitBonus;

  const robustheit = stb + wib + wkb2 + (robustheitBonus === "" ? 0 : robustheitBonus);
  document.getElementById("lp_robustheit").value = robustheit;
}

// -------------------------
// Korruption
// -------------------------
function updateKorruption() {
  const wi = parseInt(document.getElementById("wi_w").value) || 0;
  const wk = parseInt(document.getElementById("wk_w").value) || 0;

  const maxKorruption = Math.floor(wi / 10) + Math.floor(wk / 10);
  document.getElementById("korruption_max").value = maxKorruption;

  checkKorruptionWarning();
}

function checkKorruptionWarning() {
  const max = parseInt(document.getElementById("korruption_max").value) || 0;
  const currentField = document.getElementById("korruption_current");
  const current = parseInt(currentField.value) || 0;

  if (current > max) {
    currentField.classList.add("over");
  } else {
    currentField.classList.remove("over");
  }
}

// -------------------------
// Mutationen
// -------------------------
function addMutationRow() {
  const table = document.getElementById("mutationTable");
  const row = table.insertRow(-1);

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);

  cell1.innerHTML = '<input>';
  cell2.innerHTML = '<button onclick="deleteRow(this)">🗑</button>';
}

// -------------------------
// Psychologie
// -------------------------
function addPsychologyRow() {
  const table = document.getElementById("psychologyTable");
  const row = table.insertRow(-1);

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);

  cell1.innerHTML = '<input>';
  cell2.innerHTML = '<button onclick="deleteRow(this)">🗑</button>';
}
// -------------------------
// Waffen
// -------------------------
function addWeaponRow() {
  const table = document.getElementById("weaponsTable");
  const row = table.insertRow(-1);

  row.insertCell(0).innerHTML = '<input>';
  row.insertCell(1).innerHTML = '<input>';
  row.insertCell(2).innerHTML = '<input class="num-2" oninput="updateWeapons()">';
  row.insertCell(3).innerHTML = '<input class="text-short">';
  row.insertCell(4).innerHTML = '<input>';
  row.insertCell(5).innerHTML = '<button onclick="deleteRow(this)">🗑</button>';

  updateWeapons();
}

function updateWeapons() {
  const rows = document.querySelectorAll("#weaponsTable tr");
  let sum = 0;
  rows.forEach((row, idx) => {
    if (idx === 0) return;
    const tpField = row.cells[2].querySelector("input");
    const tp = parseInt(tpField?.value) || 0;
    sum += tp;
  });
  document.getElementById("enc_weapons").value = sum;
  updateTraglast();
}

// -------------------------
// Rüstung
// -------------------------
function addArmorRow() {
  const table = document.getElementById("armorTable");
  const row = table.insertRow(-1);

  row.insertCell(0).innerHTML = '<input>';
  row.insertCell(1).innerHTML = `
    <select onchange="updateArmor()">
      <option value="head">Kopf</option>
      <option value="body">Körper</option>
      <option value="larm">L. Arm</option>
      <option value="rarm">R. Arm</option>
      <option value="lleg">L. Bein</option>
      <option value="rleg">R. Bein</option>
      <option value="shield">Schild</option>
    </select>`;
  row.insertCell(2).innerHTML = '<input class="num-2" oninput="updateArmor()">';
  row.insertCell(3).innerHTML = '<input class="num-2" oninput="updateArmor()">';
  row.insertCell(4).innerHTML = '<input>';
  row.insertCell(5).innerHTML = '<button onclick="deleteRow(this)">🗑</button>';

  updateArmor();
}

function updateArmor() {
  const rows = document.querySelectorAll("#armorTable tr");
  let sum = 0;
  let zoneSums = { head:0, body:0, larm:0, rarm:0, lleg:0, rleg:0, shield:0 };

  rows.forEach((row, idx) => {
    if (idx === 0) return;
    const zone = row.cells[1].querySelector("select").value;
    const tp = parseInt(row.cells[2].querySelector("input").value) || 0;
    const rp = parseInt(row.cells[3].querySelector("input").value) || 0;
    sum += tp;
    zoneSums[zone] += rp;
  });

  document.getElementById("enc_armor").value = sum;

  // Update Figur
  document.getElementById("zone_head").value   = zoneSums.head;
  document.getElementById("zone_body").value   = zoneSums.body;
  document.getElementById("zone_larm").value   = zoneSums.larm;
  document.getElementById("zone_rarm").value   = zoneSums.rarm;
  document.getElementById("zone_lleg").value   = zoneSums.lleg;
  document.getElementById("zone_rleg").value   = zoneSums.rleg;
  document.getElementById("zone_shield").value = zoneSums.shield;

  updateTraglast();
}

function updateArmorFigure() {
  // nur zum Refresh bei Attributänderungen aufrufen
  updateArmor();
}

// -------------------------
// Ausrüstung
// -------------------------
function addEquipmentRow() {
  const table = document.getElementById("equipmentTable");
  const row = table.insertRow(-1);

  row.insertCell(0).innerHTML = '<input>';
  row.insertCell(1).innerHTML = '<input class="num-2" oninput="updateEquipment()">';
  row.insertCell(2).innerHTML = '<input class="num-2" oninput="updateEquipment()">';
  row.insertCell(3).innerHTML = '<button onclick="deleteRow(this)">🗑</button>';

  updateEquipment();
}

function updateEquipment() {
  const rows = document.querySelectorAll("#equipmentTable tr");
  let sum = 0;
  rows.forEach((row, idx) => {
    if (idx === 0) return;
    const qty = parseInt(row.cells[1].querySelector("input").value) || 0;
    const tp = parseInt(row.cells[2].querySelector("input").value) || 0;
    sum += qty * tp;
  });
  document.getElementById("enc_equipment").value = sum;
  updateTraglast();
}

// -------------------------
// Traglast
// -------------------------
function updateTraglast() {
  const st = parseInt(document.getElementById("st_w").value) || 0;
  const wi = parseInt(document.getElementById("wi_w").value) || 0;

  const stb = Math.floor(st / 10);
  const wib = Math.floor(wi / 10);

  const maxTP = stb + wib;
  document.getElementById("traglast_max").value = maxTP;

  const weap = parseInt(document.getElementById("enc_weapons").value) || 0;
  const armor = parseInt(document.getElementById("enc_armor").value) || 0;
  const equip = parseInt(document.getElementById("enc_equipment").value) || 0;
  const total = weap + armor + equip;

  const totalField = document.getElementById("traglast_total");
  totalField.value = total;

  if (total > maxTP) {
    totalField.classList.add("over");
  } else {
    totalField.classList.remove("over");
  }
}

// -------------------------
// Vermögen
// -------------------------
function updateMoney() {
  const gk = parseInt(document.getElementById("money_gk").value) || 0;
  const s  = parseInt(document.getElementById("money_s").value)  || 0;
  const g  = parseInt(document.getElementById("money_g").value)  || 0;

  let total = g + s*12 + gk*240;

  const totalGK = Math.floor(total / 240);
  const restAfterGK = total % 240;
  const totalS = Math.floor(restAfterGK / 12);
  const totalG = restAfterGK % 12;

  document.getElementById("money_total_gk").value = totalGK;
  document.getElementById("money_total_s").value = totalS;
  document.getElementById("money_total_g").value = totalG;
}

// Trigger für Geldfelder
["money_gk","money_s","money_g"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", updateMoney);
});
