// logic.js – zentrale Logik

// ---------------- Passwortschutz ----------------
const PASSWORD = "1234";

window.addEventListener("load", () => {
  const authenticated = localStorage.getItem("authenticated");
  if (authenticated === "true") {
    initApp();
  } else {
    const pw = prompt("Bitte Passwort eingeben:");
    if (pw === PASSWORD) {
      localStorage.setItem("authenticated", "true");
      initApp();
    } else {
      alert("Falsches Passwort. Zugriff verweigert.");
    }
  }
});

function initApp() {
  loadSections();
  loadCharacters();
  attachEventListeners();
}

// ---------------- Multi-Charakter Verwaltung ----------------
let characters = JSON.parse(localStorage.getItem("characters") || "{}");
let activeCharacter = null;

function loadCharacters() {
  const select = document.getElementById("characterSelect");
  select.innerHTML = "";
  for (let name in characters) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }
  if (activeCharacter && characters[activeCharacter]) {
    select.value = activeCharacter;
    loadData(characters[activeCharacter]);
  }
  select.onchange = () => {
    activeCharacter = select.value;
    loadData(characters[activeCharacter]);
  };
}

function newCharacter() {
  if (activeCharacter) saveData();
  activeCharacter = prompt("Name für neuen Charakter:");
  if (!activeCharacter) return;
  characters[activeCharacter] = {};
  localStorage.setItem("characters", JSON.stringify(characters));
  loadCharacters();
}

function showDeleteConfirm() {
  const modal = document.getElementById("deleteConfirm");
  modal.style.display = "block";
  document.getElementById("confirmYes").onclick = () => {
    deleteCharacter();
    modal.style.display = "none";
  };
  document.getElementById("confirmNo").onclick = () => {
    modal.style.display = "none";
  };
}

function deleteCharacter() {
  if (activeCharacter && characters[activeCharacter]) {
    delete characters[activeCharacter];
    localStorage.setItem("characters", JSON.stringify(characters));
    activeCharacter = null;
    loadCharacters();
    document.getElementById("main-content").innerHTML = "";
  }
}

// ---------------- Save & Load ----------------
function saveData() {
  if (!activeCharacter) return;
  const data = {};
  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.type === "checkbox" || el.type === "radio") {
      data[el.id] = el.checked;
    } else {
      data[el.id] = el.value;
    }
  });
  characters[activeCharacter] = data;
  localStorage.setItem("characters", JSON.stringify(characters));
}

function loadData(data) {
  if (!data) return;
  Object.keys(data).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = data[id];
      } else {
        el.value = data[id];
      }
    }
  });
  updateAll();
}

// ---------------- Import / Export ----------------
function exportData() {
  saveData();
  const blob = new Blob([JSON.stringify(characters)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "characters.json";
  a.click();
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      characters = JSON.parse(reader.result);
      localStorage.setItem("characters", JSON.stringify(characters));
      loadCharacters();
    };
    reader.readAsText(file);
  };
  input.click();
}

// ---------------- Event Listener ----------------
function attachEventListeners() {
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", () => {
      updateAll();
      saveData();
    });
  });
}
// ---------------- Update-Funktionen ----------------
function updateAll() {
  updateAttributes();
  updateWounds();
  updateCorruption();
  updateEncumbrance();
  updateMoney();
  updateExperience();
  updateFateResilience();
  updateSkills();
}

// Attribute: Aktuell = Basis + Steigerung
function updateAttributes() {
  const attrs = ["KG","BF","ST","WI","I","GW","GS","IN","WK","CH"];
  attrs.forEach(a => {
    const base = parseInt(document.getElementById(`attr_${a}_base`).value) || 0;
    const adv = parseInt(document.getElementById(`attr_${a}_adv`).value) || 0;
    document.getElementById(`attr_${a}`).value = base + adv;
  });
}

// Lebenspunkte
function updateWounds() {
  const ST = parseInt(document.getElementById("attr_ST").value) || 0;
  const WI = parseInt(document.getElementById("attr_WI").value) || 0;
  const WK = parseInt(document.getElementById("attr_WK").value) || 0;

  const stb = Math.floor(ST/10);
  const wib = Math.floor(WI/10);
  const wkb = Math.floor(WK/10);

  const robust = parseInt(document.getElementById("wound_robust").value) || 0;

  document.getElementById("wound_stb").value = stb;
  document.getElementById("wound_wib").value = wib;
  document.getElementById("wound_wkb2").value = 2*wkb;
  document.getElementById("wound_sum").value = stb + wib + (2*wkb) + robust;
}

// Korruption
function updateCorruption() {
  const WI = parseInt(document.getElementById("attr_WI").value) || 0;
  const WK = parseInt(document.getElementById("attr_WK").value) || 0;
  const max = Math.floor(WI/10) + Math.floor(WK/10);
  document.getElementById("corruption_max").value = max;
}

// Traglast
function updateEncumbrance() {
  const ST = parseInt(document.getElementById("attr_ST").value) || 0;
  const WI = parseInt(document.getElementById("attr_WI").value) || 0;
  const stb = Math.floor(ST/10);
  const wib = Math.floor(WI/10);
  const max = stb + wib;
  document.getElementById("enc_max").value = max;

  const wpn = sumTable("weaponsTable","TP");
  const arm = sumTable("armorTable","RP");
  const eq = sumTableMulti("equipmentTable","Menge","TP");

  document.getElementById("enc_wpn").value = wpn;
  document.getElementById("enc_arm").value = arm;
  document.getElementById("enc_eq").value = eq;

  const total = wpn+arm+eq;
  const totalEl = document.getElementById("enc_total");
  totalEl.value = total;
  if (total > max) {
    totalEl.style.color = "red";
    totalEl.style.fontWeight = "bold";
  } else {
    totalEl.style.color = "black";
    totalEl.style.fontWeight = "normal";
  }
}

function sumTable(tableId,colName) {
  const table = document.getElementById(tableId);
  if (!table) return 0;
  let sum=0;
  Array.from(table.rows).forEach((row,i)=>{
    if(i===0)return;
    const cell = row.querySelector(`input[name='${colName}']`);
    if(cell) sum += parseInt(cell.value)||0;
  });
  return sum;
}
function sumTableMulti(tableId,col1,col2) {
  const table = document.getElementById(tableId);
  if (!table) return 0;
  let sum=0;
  Array.from(table.rows).forEach((row,i)=>{
    if(i===0)return;
    const c1 = row.querySelector(`input[name='${col1}']`);
    const c2 = row.querySelector(`input[name='${col2}']`);
    if(c1 && c2) sum += (parseInt(c1.value)||0)*(parseInt(c2.value)||0);
  });
  return sum;
}

// Geld
function updateMoney() {
  const gk = parseInt(document.getElementById("money_gk").value)||0;
  const s  = parseInt(document.getElementById("money_s").value)||0;
  const g  = parseInt(document.getElementById("money_g").value)||0;
  let totalG = g + (s*12) + (gk*240);
  const newGK = Math.floor(totalG/240);
  totalG %= 240;
  const newS = Math.floor(totalG/12);
  totalG %= 12;
  const newG = totalG;
  document.getElementById("money_total").textContent = `🟡 ${newGK} / ⚪ ${newS} / 🟤 ${newG}`;
}

// Erfahrung
function updateExperience() {
  const toggle = document.getElementById("exp_toggle");
  if (!toggle) return;
  if (toggle.checked) {
    document.getElementById("exp_simple").style.display="none";
    document.getElementById("exp_full").style.display="block";
    let gain=0,spent=0;
    document.querySelectorAll("#expTable tr").forEach((row,i)=>{
      if(i===0)return;
      const val = parseInt(row.querySelector("input[name='exp_val']").value)||0;
      if(val>=0) gain+=val; else spent+=Math.abs(val);
    });
    document.getElementById("exp_full_gain").value=gain;
    document.getElementById("exp_full_spent").value=spent;
    document.getElementById("exp_full_total").value=gain-spent;
  } else {
    document.getElementById("exp_simple").style.display="block";
    document.getElementById("exp_full").style.display="none";
    const gain=parseInt(document.getElementById("exp_simple_gain").value)||0;
    const spent=parseInt(document.getElementById("exp_simple_spent").value)||0;
    document.getElementById("exp_simple_total").value=gain-spent;
  }
}

// Schicksal & Zähigkeit
function updateFateResilience() {
  const fate = parseInt(document.getElementById("fate_val").value)||0;
  const res  = parseInt(document.getElementById("res_val").value)||0;
  document.getElementById("fate_luck_max").textContent=fate;
  document.getElementById("res_mut_max").textContent=res;
}
// ---------------- Skills ----------------
function updateSkills() {
  // Grundfähigkeiten
  grundfertigkeitenListe().forEach(skill => {
    const attrVal = parseInt(document.getElementById(`attr_${skill.attr}`).value) || 0;
    const steig = parseInt(document.getElementById(`skill_${skill.id}_steig`).value) || 0;
    const total = attrVal + steig;

    // Schreibe Werte in die Tabelle
    const valEl = document.getElementById(`skill_${skill.id}_attrval`);
    if (valEl) valEl.textContent = attrVal;

    const totalEl = document.getElementById(`skill_${skill.id}_total`);
    if (totalEl) totalEl.value = total;
  });

  // Gruppierte Fähigkeiten
  const table = document.getElementById("groupedSkillsTable");
  if (table) {
    Array.from(table.rows).forEach((row, i) => {
      if (i === 0) return; // Header überspringen
      const sel = row.querySelector("select[name='attr']");
      const steig = row.querySelector("input[name='steigerung']");
      const attrValEl = row.querySelector("span[name='attrval']");
      const totalEl = row.querySelector("input[name='wert']");

      if (sel && steig && attrValEl && totalEl) {
        const attr = sel.value;
        const attrVal = parseInt(document.getElementById(`attr_${attr}`).value) || 0;
        attrValEl.textContent = attrVal;

        const steigVal = parseInt(steiger.value) || 0;
        totalEl.value = attrVal + steigVal;
      }
    });
  }
}


// ---------------- Dynamische Tabellen Add/Delete ----------------
// ---------------- Gruppierte hinzufügen ----------------
function addGroupedSkill() {
  const table = document.getElementById("groupedSkillsTable");
  const row = table.insertRow();
  row.innerHTML = `
    <td><input name="name"></td>
    <td>
      <select name="attr" onchange="updateSkills()">
        <option value="KG">KG</option><option value="BF">BF</option><option value="ST">ST</option>
        <option value="WI">WI</option><option value="I">I</option><option value="GW">GW</option>
        <option value="GS">GS</option><option value="IN">IN</option><option value="WK">WK</option><option value="CH">CH</option>
      </select>
    </td>
    <td><span name="attrval" class="num-2"></span></td>
    <td><input name="steigerung" class="num-2" oninput="updateSkills()"></td>
    <td><input name="wert" readonly class="num-2"></td>
    <td><button onclick="this.parentNode.parentNode.remove(); updateSkills();">🗑</button></td>
  `;
}

function addWeapon() {
  const table=document.getElementById("weaponsTable");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="Name"></td>
    <td><input name="Gruppe"></td>
    <td><input name="TP" class="num-2"></td>
    <td><input name="RW" class="num-2"></td>
    <td><input name="Schaden" class="num-2"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}

function addArmor() {
  const table=document.getElementById("armorTable");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="Name"></td>
    <td>
      <select name="Trefferzone">
        <option>Kopf</option><option>Linker Arm</option><option>Rechter Arm</option>
        <option>Körper</option><option>Linkes Bein</option><option>Rechtes Bein</option>
        <option>Schild</option>
      </select>
    </td>
    <td><input name="RP" class="num-2"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}

function addEquipment() {
  const table=document.getElementById("equipmentTable");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="Name"></td>
    <td><input name="Menge" class="num-2"></td>
    <td><input name="TP" class="num-2"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}

function addSpell() {
  const table=document.getElementById("spellsTable");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="Name"></td>
    <td><input name="Stufe" class="num-2"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}

function addMutation() {
  const table=document.getElementById("mutationsTable");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="mutation"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}

function addPsychology() {
  const table=document.getElementById("psychologyTable");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="psychology"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}

function addCorruptionMutation() {
  const table=document.getElementById("corruptionMutations");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="c_mut"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}

function addExpRow() {
  const table=document.getElementById("expTable");
  const row=table.insertRow();
  row.innerHTML=`
    <td><input name="exp_val" class="num-5"></td>
    <td><input name="exp_comment"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">🗑</button></td>`;
}
function toggleExpComments() {
  const rows=document.querySelectorAll("#expTable tr");
  rows.forEach((row,i)=>{
    if(i===0)return;
    const comment=row.querySelector("input[name='exp_comment']");
    if(comment.style.display==="none") comment.style.display="block"; else comment.style.display="none";
  });
}
