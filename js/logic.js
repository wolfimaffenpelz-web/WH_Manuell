// logic.js v0.8.2

// =========================
// 🔒 Passwortschutz
// =========================
function initPasswordProtection() {
  const overlay = document.getElementById("password-overlay");
  const input = document.getElementById("password-input");
  const button = document.getElementById("password-submit");

  button.addEventListener("click", () => {
    if (input.value === "1234") {
      overlay.style.display = "none";
      initLogic();
    } else {
      alert("Falsches Passwort!");
    }
  });
}
document.addEventListener("DOMContentLoaded", initPasswordProtection);

// =========================
// 📂 Multi-Charakter Verwaltung
// =========================
let currentCharacter = null;

function loadCharacterList() {
  const select = document.getElementById("character-select");
  select.innerHTML = "";
  const chars = JSON.parse(localStorage.getItem("characters") || "[]");
  chars.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
  if (chars.length > 0) {
    currentCharacter = chars[0];
    select.value = currentCharacter;
  }
}

function saveCharacter(name) {
  let chars = JSON.parse(localStorage.getItem("characters") || "[]");
  if (!chars.includes(name)) {
    chars.push(name);
    localStorage.setItem("characters", JSON.stringify(chars));
  }
  currentCharacter = name;
}

function deleteCharacter(name) {
  let chars = JSON.parse(localStorage.getItem("characters") || "[]");
  chars = chars.filter(c => c !== name);
  localStorage.setItem("characters", JSON.stringify(chars));
  if (chars.length > 0) {
    currentCharacter = chars[0];
  } else {
    currentCharacter = null;
  }
  loadCharacterList();
}

function initCharacterManagement() {
  const select = document.getElementById("character-select");
  const newBtn = document.getElementById("new-character");
  const delBtn = document.getElementById("delete-character");

  loadCharacterList();

  select.addEventListener("change", () => {
    currentCharacter = select.value;
    loadState();
  });

  newBtn.addEventListener("click", () => {
    const nameField = document.getElementById("char-name");
    const newName = nameField && nameField.value ? nameField.value : "Unbenannt";
    saveCharacter(newName);
    saveState();
    loadCharacterList();
    select.value = newName;
  });

  delBtn.addEventListener("click", () => {
    if (!currentCharacter) return;
    const popup = confirm(`Charakter "${currentCharacter}" wirklich löschen?`);
    if (popup) {
      deleteCharacter(currentCharacter);
      if (currentCharacter) loadState();
      else location.reload();
    }
  });
}

// =========================
// 🧩 Sections Rendern
// =========================
function renderSections() {
  const main = document.getElementById("main-content");
  main.innerHTML = "";
  sections.forEach(sec => {
    const sectionEl = document.createElement("section");
    sectionEl.id = sec.id;
    sectionEl.innerHTML = `<h2>${sec.title}</h2>${sec.content}`;
    main.appendChild(sectionEl);
  });
}

// =========================
// 💾 Speicher- und Lade-Logik
// =========================
function saveState() {
  if (!currentCharacter) return;
  const state = {};

  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.type === "checkbox" || el.type === "radio") {
      state[el.id] = el.checked;
    } else {
      state[el.id] = el.value;
    }
  });

  localStorage.setItem("state-" + currentCharacter, JSON.stringify(state));
}

function loadState() {
  if (!currentCharacter) return;
  const state = JSON.parse(localStorage.getItem("state-" + currentCharacter) || "{}");

  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (state.hasOwnProperty(el.id)) {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = state[el.id];
      } else {
        el.value = state[el.id];
      }
    }
  });

  updateAttributes();
  restoreMarkers();
}

// =========================
// 🔘 Markierungen
// =========================
function toggleMarker(el) {
  const hid = document.getElementById(el.dataset.input);
  if (!hid) return;
  if (hid.value === "1") {
    hid.value = "0";
    el.textContent = "◯";
  } else {
    hid.value = "1";
    el.textContent = "✚";
  }
  saveState();
}

function restoreMarkers() {
  document.querySelectorAll(".marker").forEach(el => {
    const hid = document.getElementById(el.dataset.input);
    if (!hid) return;
    el.textContent = hid.value === "1" ? "✚" : "◯";
  });
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("marker")) {
    toggleMarker(e.target);
  }
});
// =========================
// 📊 Attribute Berechnungen
// =========================
function updateAttributes() {
  const attrs = ["KG","BF","ST","WI","I","GW","GS","IN","WK","CH"];
  attrs.forEach(att => {
    const start = parseInt(document.getElementById(att+"-start").value) || 0;
    const steig = parseInt(document.getElementById(att+"-steig").value) || 0;
    const akt = start + steig;
    document.getElementById(att+"-akt").value = akt;
  });

  updateGrundfaehigkeiten();
  updateLebenspunkte();
  updateKorruption();
  updateTraglast();
  updateVermoegen();
  updateErfahrung();
  saveState();
}

// =========================
// 📜 Grundfähigkeiten Logik
// =========================
function updateGrundfaehigkeiten() {
  const rows = document.querySelectorAll("#grund-table tr");
  rows.forEach((row, idx) => {
    if (idx === 0) return; // header
    const attCell = row.cells[1];
    if (!attCell) return;
    const att = attCell.textContent.trim();
    const attVal = parseInt(document.getElementById(att+"-akt").value) || 0;
    const steig = parseInt(row.cells[3].querySelector("input").value) || 0;
    row.cells[2].querySelector("input").value = attVal;
    row.cells[4].querySelector("input").value = attVal + steig;
  });
}

// =========================
// ⚔️ Gruppierte Fähigkeiten
// =========================
function addRow(tableId) {
  const table = document.getElementById(tableId);
  const row = table.insertRow(-1);

  if (tableId === "grupp-table") {
    row.innerHTML = `
      <td>◯</td>
      <td><input type="text"></td>
      <td>
        <select>
          <option value="">-</option>
          <option value="KG">KG</option><option value="BF">BF</option>
          <option value="ST">ST</option><option value="WI">WI</option>
          <option value="I">I</option><option value="GW">GW</option>
          <option value="GS">GS</option><option value="IN">IN</option>
          <option value="WK">WK</option><option value="CH">CH</option>
        </select>
      </td>
      <td><input type="number" readonly></td>
      <td><input type="number"></td>
      <td><input type="number" readonly></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "talent-table") {
    row.innerHTML = `
      <td>◯</td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "waffen-table") {
    row.innerHTML = `
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td><textarea></textarea></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "ruestung-table") {
    row.innerHTML = `
      <td><input type="text"></td>
      <td>
        <select>
          <option>Kopf</option><option>Linker Arm</option>
          <option>Rechter Arm</option><option>Linkes Bein</option>
          <option>Rechtes Bein</option><option>Brust</option>
        </select>
      </td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td><textarea></textarea></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "ausruestung-table") {
    row.innerHTML = `
      <td><input type="text"></td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td><textarea></textarea></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "zauber-table") {
    row.innerHTML = `
      <td><input type="text"></td>
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><textarea></textarea></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "mutationen-table") {
    row.innerHTML = `
      <td><input type="text"></td>
      <td>
        <select><option>Körper</option><option>Geist</option></select>
      </td>
      <td><textarea></textarea></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "psychologie-table") {
    row.innerHTML = `
      <td><input type="text"></td>
      <td><textarea></textarea></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState();">❌</button></td>
    `;
  }
  else if (tableId === "exp-table") {
    row.innerHTML = `
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateErfahrung();">❌</button></td>
    `;
  }
}

// =========================
// ⭐ Talente Logik (inkl. Robustheit)
// =========================
function checkTalentEffects() {
  let hardy = false;
  document.querySelectorAll("#talent-table tr").forEach((row, idx) => {
    if (idx === 0) return; // skip header
    const name = row.cells[1].querySelector("input").value.toLowerCase();
    if (name.includes("robustheit") || name.includes("hardy")) {
      hardy = true;
    }
  });
  return hardy;
}
// =========================
// ❤️ Lebenspunkte Berechnung
// =========================
function updateLebenspunkte() {
  const ST = parseInt(document.getElementById("ST-akt").value) || 0;
  const WI = parseInt(document.getElementById("WI-akt").value) || 0;
  const WK = parseInt(document.getElementById("WK-akt").value) || 0;

  const stb = Math.floor(ST/10);
  const wib = Math.floor(WI/10);
  const wkb = Math.floor(WK/10) * 2;

  const hardy = checkTalentEffects();
  const robust = hardy ? wib : 0;

  document.getElementById("lp-stb").value = stb;
  document.getElementById("lp-wib").value = wib;
  document.getElementById("lp-wkb").value = wkb;
  document.getElementById("lp-robustheit").value = robust;

  const gesamt = stb + wib + wkb + robust;
  document.getElementById("lp-gesamt").value = gesamt;
}

// =========================
// ☠️ Korruption
// =========================
function updateKorruption() {
  const WI = parseInt(document.getElementById("WI-akt").value) || 0;
  const WK = parseInt(document.getElementById("WK-akt").value) || 0;
  const max = Math.floor(WI/10) + Math.floor(WK/10);
  const akt = parseInt(document.getElementById("korruption-akt").value) || 0;

  const maxEl = document.getElementById("korruption-max");
  maxEl.value = max;

  if (akt > max) {
    document.getElementById("korruption-akt").classList.add("readonly-red");
    alert("⚠️ Korruption über Maximum – Wurf auf Mutation/Wahnsinn nötig!");
  } else {
    document.getElementById("korruption-akt").classList.remove("readonly-red");
  }
}

// =========================
// ⚖️ Traglast
// =========================
function updateTraglast() {
  const ST = parseInt(document.getElementById("ST-akt").value) || 0;
  const WI = parseInt(document.getElementById("WI-akt").value) || 0;
  const max = Math.floor(ST/10) + Math.floor(WI/10);

  let waffenTP = 0, ruestungTP = 0, ausrTP = 0;

  document.querySelectorAll("#waffen-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    waffenTP += parseInt(row.cells[2].querySelector("input").value) || 0;
  });

  document.querySelectorAll("#ruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    ruestungTP += parseInt(row.cells[3].querySelector("input").value) || 0;
  });

  document.querySelectorAll("#ausruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const menge = parseInt(row.cells[1].querySelector("input").value) || 0;
    const tp = parseInt(row.cells[2].querySelector("input").value) || 0;
    ausrTP += menge * tp;
  });

  const gesamt = waffenTP + ruestungTP + ausrTP;

  document.getElementById("trag-waffen").value = waffenTP;
  document.getElementById("trag-ruestung").value = ruestungTP;
  document.getElementById("trag-ausruestung").value = ausrTP;
  document.getElementById("trag-max").value = max;
  const gesamtEl = document.getElementById("trag-gesamt");
  gesamtEl.value = gesamt;

  if (gesamt > max) {
    gesamtEl.classList.add("readonly-red");
  } else {
    gesamtEl.classList.remove("readonly-red");
  }
}

// =========================
// 💰 Vermögen & Schulden
// =========================
function updateVermoegen() {
  const gk = parseInt(document.getElementById("verm-gk").value) || 0;
  const s  = parseInt(document.getElementById("verm-s").value) || 0;
  const g  = parseInt(document.getElementById("verm-g").value) || 0;

  const sgk = parseInt(document.getElementById("schul-gk").value) || 0;
  const ss  = parseInt(document.getElementById("schul-s").value) || 0;
  const sg  = parseInt(document.getElementById("schul-g").value) || 0;

  // Normalisierung: 1 GK = 20 S, 1 S = 12 G
  let totalG = g + s*12 + gk*240;
  let debtG = sg + ss*12 + sgk*240;
  let netto = totalG - debtG;

  const block = document.getElementById("nettovermoegen-block");
  if (debtG !== 0) {
    block.style.display = "block";
    const gkFinal = Math.floor(netto/240);
    const sFinal = Math.floor((netto%240)/12);
    const gFinal = netto % 12;
    document.getElementById("nettovermoegen").innerText = 
      `${gkFinal} 💰 / ${sFinal} 🥈 / ${gFinal} 🥉`;
  } else {
    block.style.display = "none";
  }
}

// =========================
// ⭐ Erfahrung
// =========================
function updateErfahrung() {
  const toggle = document.getElementById("exp-toggle");
  if (!toggle) return;

  if (!toggle.checked) {
    // Simpler Modus
    const akt = parseInt(document.getElementById("exp-simple-akt").value) || 0;
    const ausg = parseInt(document.getElementById("exp-simple-ausg").value) || 0;
    document.getElementById("exp-simple-gesamt").value = akt + ausg;
  } else {
    // Voller Modus
    let akt = 0, ausg = 0;
    document.querySelectorAll("#exp-table tr").forEach((row, idx) => {
      if (idx === 0) return;
      const val = parseInt(row.cells[0].querySelector("input").value) || 0;
      if (val >= 0) akt += val;
      else ausg += Math.abs(val);
    });
    document.getElementById("exp-full-akt").value = akt;
    document.getElementById("exp-full-ausg").value = ausg;
    document.getElementById("exp-full-gesamt").value = akt + ausg;
  }
}

// =========================
// 🎨 Highlighting
// =========================
document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    const cell = e.target.closest("td");
    const row = e.target.closest("tr");
    if (cell) cell.classList.add("active");
    if (row) row.classList.add("active");
  }
});

document.addEventListener("focusout", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    const cell = e.target.closest("td");
    const row = e.target.closest("tr");
    if (cell) cell.classList.remove("active");
    if (row) row.classList.remove("active");
  }
});

// =========================
// 🚀 Init
// =========================
function initLogic() {
  renderSections();
  initCharacterManagement();

  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", () => {
      updateAttributes();
      saveState();
    });
  });

  const toggle = document.getElementById("exp-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      if (!toggle.checked) {
        document.getElementById("exp-simple").style.display = "block";
        document.getElementById("exp-full").style.display = "none";
      } else {
        document.getElementById("exp-simple").style.display = "none";
        document.getElementById("exp-full").style.display = "block";
      }
      updateErfahrung();
      saveState();
    });
  }

  loadState();
}
