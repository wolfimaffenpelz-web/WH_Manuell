// logic.js v0.8.2

// =========================
// 🔒 Passwortschutz
// =========================
function initPasswordProtection() {
  const overlay = document.getElementById("password-overlay"); // dunkler Hintergrund
  const input = document.getElementById("password-input");     // Eingabefeld für Passwort
  const button = document.getElementById("password-submit");   // OK-Button
  const logoutBtn = document.getElementById("logout");         // Logout-Button

  if (localStorage.getItem("auth") === "true") {
    overlay.style.display = "none"; // sofort anzeigen, wenn bereits authentifiziert
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    initLogic(); // Hauptlogik starten
  }

  button.addEventListener("click", () => {
    if (input.value === "1234") {
      overlay.style.display = "none";          // Overlay ausblenden
      localStorage.setItem("auth", "true");    // Flag setzen
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      initLogic();
    } else {
      alert("Falsches Passwort!");
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("auth"); // Auth-Flag löschen
      location.reload();               // Seite neu laden
    });
  }
}
document.addEventListener("DOMContentLoaded", initPasswordProtection);

// =========================
// 📂 Multi-Charakter Verwaltung
// =========================
let currentCharacter = null;

function loadCharacterList() {
  const select = document.getElementById("character-select"); // Dropdown-Element
  select.innerHTML = "";
  const chars = JSON.parse(localStorage.getItem("characters") || "[]"); // gespeicherte Namen
  chars.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
  if (chars.length > 0) {
    currentCharacter = chars[0]; // ersten Charakter vorauswählen
    select.value = currentCharacter;
  }
}

function saveCharacter(name) {
  let chars = JSON.parse(localStorage.getItem("characters") || "[]");
  if (!chars.includes(name)) {
    chars.push(name); // neuen Namen hinzufügen
    localStorage.setItem("characters", JSON.stringify(chars));
  }
  currentCharacter = name; // aktiven Charakter setzen
}

function deleteCharacter(name) {
  let chars = JSON.parse(localStorage.getItem("characters") || "[]");
  chars = chars.filter(c => c !== name); // entfernen
  localStorage.setItem("characters", JSON.stringify(chars));
  if (chars.length > 0) {
    currentCharacter = chars[0]; // anderen Charakter wählen
  } else {
    currentCharacter = null; // keiner übrig
  }
  loadCharacterList();
}

function initCharacterManagement() {
  const select = document.getElementById("character-select");
  const newBtn = document.getElementById("new-character"); // neuer Charakter
  const delBtn = document.getElementById("delete-character"); // löschen

  // Beim ersten Aufruf einen Default-Charakter mit Dummywerten anlegen
  let chars = JSON.parse(localStorage.getItem("characters") || "[]");
  if (chars.length === 0) {
    const defaultName = "Default";
    saveCharacter(defaultName);
    ensureInitialRows();
    document.querySelectorAll("input, textarea, select").forEach(el => {
      if (!el.id) return;
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      } else if (el.type === "hidden") {
        el.value = "0";
      } else if (el.type === "number") {
        el.value = "1";
      } else {
        el.value = "Dummy";
      }
    });
    document.getElementById("char-name").value = "Günther";
    document.getElementById("char-volk").value = "Mensch";
    document.getElementById("char-geschlecht").value = "männlich";
    document.getElementById("char-karriere").value = "Krieger";
    document.getElementById("char-stufe").value = "1";
    document.getElementById("char-weg").value = "Soldat";
    document.getElementById("char-status").value = "Bronze - Stufe 1";
    document.getElementById("char-alter").value = "25";
    document.getElementById("char-groesse").value = "180";
    document.getElementById("char-haare").value = "Braun";
    document.getElementById("char-augen").value = "Blau";
    document.getElementById("korruption-akt").value = "0"
    saveState();   
  }

  loadCharacterList();

  select.addEventListener("change", () => {
    currentCharacter = select.value; // Dropdown-Wahl
    loadState();
  });

  newBtn.addEventListener("click", () => {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
      <p>Charaktername:</p>
      <input type="text" id="new-char-name">
      <br>
      <button id="new-char-ok">OK</button>
      <button id="new-char-cancel">Abbrechen</button>
    `;
    document.body.appendChild(popup);
    const input = document.getElementById("new-char-name");
    input.focus();
    document.getElementById("new-char-ok").addEventListener("click", () => {
      const newName = input.value.trim();
      if (!newName) { alert("Name erforderlich"); return; }
      saveCharacter(newName);
      saveState();
      loadCharacterList();
      select.value = newName;
      loadState();
      popup.remove();
    });
    document.getElementById("new-char-cancel").addEventListener("click", () => popup.remove());
  });

  delBtn.addEventListener("click", () => {
    if (!currentCharacter) return; // nichts zu löschen
    const popup = confirm(`Charakter "${currentCharacter}" wirklich löschen?`);
    if (popup) {
      deleteCharacter(currentCharacter);
      if (currentCharacter) loadState(); // anderen laden
      else location.reload();
    }
  });
}

// =========================
// 🧩 Sections Rendern
// =========================
function renderSections() {
  const main = document.getElementById("main-content");
  main.innerHTML = ""; // vorherige Inhalte entfernen
  sections.forEach(sec => {
    const sectionEl = document.createElement("section");
    sectionEl.id = sec.id; // ID für spätere Referenz
    sectionEl.innerHTML = `<h2>${sec.title}</h2>${sec.content}`;
    main.appendChild(sectionEl); // anhängen
  });
}

function initGrunddatenToggle() {
  const section = document.getElementById("grunddaten");
  if (!section) return;
  const body = section.querySelector(".section-body");
  const header = section.querySelector("h2");
  if (!body || !header) return;
  const collapsed = localStorage.getItem("grunddaten-collapsed") === "true";
  if (collapsed) body.style.display = "none";
  header.addEventListener("click", () => {
    if (body.style.display === "none") {
      body.style.display = "block"; // Abschnitt öffnen
      localStorage.setItem("grunddaten-collapsed", "false");
    } else {
      body.style.display = "none"; // Abschnitt schließen
      localStorage.setItem("grunddaten-collapsed", "true");
    }
  });
}

function initFinanzenToggle() {
  const header = document.getElementById("finanzen-toggle");
  const arrow = document.getElementById("finanzen-arrow");
  const extra = document.getElementById("finanzen-extra");
  if (!header || !arrow || !extra) return;
  header.addEventListener("click", () => {
    if (extra.style.display === "none") {
      extra.style.display = "block";
      arrow.textContent = "▼";
    } else {
      extra.style.display = "none";
      arrow.textContent = "▶";
    }
  });
}

// =========================
// 💾 Speicher- und Lade-Logik
// =========================
function serializeTable(tableId) {
  const table = document.getElementById(tableId);
  const data = [];
  if (!table) return data; // Tabelle existiert nicht

  table.querySelectorAll("tr").forEach((row, idx) => {
    if (idx === 0) return; // Kopfzeile überspringen
    const rowData = [];
    row.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.type === "checkbox" || el.type === "radio") {
        rowData.push(el.checked); // boolean speichern
      } else {
        rowData.push(el.value);
      }
    });
    data.push(rowData); // Zeile hinzufügen
  });
  return data;
}

function deserializeTable(tableId, data) {
  const table = document.getElementById(tableId);
  if (!table) return;
  // vorhandene Zeilen außer Kopf entfernen
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  if (!data || !Array.isArray(data)) return;
  data.forEach(rowData => {
    addRow(tableId); // neue Zeile erzeugen
    const row = table.rows[table.rows.length - 1];
    const inputs = row.querySelectorAll("input, select, textarea");
    rowData.forEach((val, idx) => {
      const el = inputs[idx];
      if (!el) return;
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = val; // boolean wiederherstellen
      } else {
        el.value = val;
      }
    });
  });
}

function saveState() {
  if (!currentCharacter) return; // nichts gespeichert
  const state = {};

  // alle Felder mit ID einsammeln
  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (!el.id) return;
    if (el.type === "checkbox" || el.type === "radio") {
      state[el.id] = el.checked;
    } else {
      state[el.id] = el.value;
    }
  });

  // Tabellen separat serialisieren
  [
    "grupp-table",
    "talent-table",
    "waffen-table",
    "schulden-table",
    "spar-table",
    "ruestung-table",
    "ausruestung-table",
    "zauber-table",
    "mutationen-table",
    "psychologie-table",
    "exp-table"
  ].forEach(id => {
    state[id] = serializeTable(id);
  });

  localStorage.setItem("state-" + currentCharacter, JSON.stringify(state));
}

function loadState() {
  if (!currentCharacter) return;
  const state = JSON.parse(localStorage.getItem("state-" + currentCharacter) || "{}");

  // Werte in Felder zurückschreiben
  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (!el.id) return;
    if (state.hasOwnProperty(el.id)) {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = state[el.id];
      } else {
        el.value = state[el.id];
      }
    }
  });

  [
    "grupp-table",
    "talent-table",
    "waffen-table",
    "schulden-table",
    "spar-table",
    "ruestung-table",
    "ausruestung-table",
    "zauber-table",
    "mutationen-table",
    "psychologie-table",
    "exp-table"
  ].forEach(id => {
    deserializeTable(id, state[id]); // Tabellen rekonstruieren
  });

  updateAttributes();
  restoreMarkers();
  ensureInitialRows();
}

// =========================
// ➕ Dynamische Tabellen – Initiale Zeilen
// =========================
function ensureInitialRows() {
  [
    "grupp-table",
    "talent-table",
    "waffen-table",
    "schulden-table",
    "spar-table",
    "ruestung-table",
    "ausruestung-table",
    "zauber-table",
    "mutationen-table",
    "psychologie-table",
    "exp-table"
  ].forEach(id => {
    const table = document.getElementById(id);
    if (table && table.rows.length === 1) {
      addRow(id);
    }
  });
}

// =========================
// 🔘 Markierungen
// =========================
const attrSymbols = ["","✠","⚔","☠","🛡"];
let markerPopup = null;
function updateAttrHeader(th, val) {
  th.classList.remove("attr-cross","attr-axes","attr-skull","attr-shield");
  th.dataset.icon = attrSymbols[val] || "";
  if (val === 1) th.classList.add("attr-cross");
  else if (val === 2) th.classList.add("attr-axes");
  else if (val === 3) th.classList.add("attr-skull");
  else if (val === 4) th.classList.add("attr-shield");
}

function resetAttrMarker(th) {
  const hid = th.querySelector('input[type="hidden"]');
  if (!hid) return;
  hid.value = "0";
  updateAttrHeader(th, 0);
}

function enforceAttributeExclusivity() {
  const groups = {1:[],2:[],3:[],4:[]};
  document.querySelectorAll('th[data-input]').forEach(th => {
    const hid = th.querySelector('input[type="hidden"]');
    const val = parseInt(hid.value) || 0;
    if (val > 0) groups[val].push(th);
  });
  let changed = false;
  [2,3,4].forEach(v => {
    const arr = groups[v];
    arr.slice(1).forEach(extra => { resetAttrMarker(extra); changed = true; });
  });
  const crosses = groups[1];
  if (crosses.length > 3) {
    crosses.slice(3).forEach(extra => { resetAttrMarker(extra); changed = true; });
  }
  if (changed) saveState();
}
function applyAttrMarker(th, val) {
  const hid = th.querySelector('input[type="hidden"]');
  if (!hid) return;

  if (val === 1) {
    const count = Array.from(document.querySelectorAll('th[data-input]'))
      .filter(m => m.querySelector('input[type="hidden"]').value === "1").length;
    if (count >= 3 && hid.value !== "1") {
      alert("Max 3 ✠ erlaubt.");
      return;
    }
  } else if (val >= 2) {
    document.querySelectorAll('th[data-input]').forEach(m => {
      if (m === th) return;
      const mh = m.querySelector('input[type="hidden"]');
      if (mh.value === String(val)) resetAttrMarker(m);
    });
  }

  hid.value = String(val);
  updateAttrHeader(th, val);
  saveState();
}

function selectAttrMarker(th) {
  const hid = th.querySelector('input[type="hidden"]');
  if (!hid) return;

  if (hid.value !== "0") {
    resetAttrMarker(th);
    saveState();
    return;
  }

  if (markerPopup) markerPopup.remove();
  markerPopup = document.createElement('div');
  markerPopup.className = 'popup marker-select';
  markerPopup.innerHTML = `
    <div class="marker-grid">
      <button class="icon-btn" data-val="1">${attrSymbols[1]}</button>
      <button class="icon-btn" data-val="2">${attrSymbols[2]}</button>
      <button class="icon-btn" data-val="3">${attrSymbols[3]}</button>
      <button class="icon-btn" data-val="4">${attrSymbols[4]}</button>
    </div>`;
  document.body.appendChild(markerPopup);

  markerPopup.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.val);
      applyAttrMarker(th, val);
      markerPopup.remove();
      markerPopup = null;
    });
  });
}
function toggleLineMarker(cell) {
  const hid = cell.querySelector('input[type="hidden"]');
  if (!hid) return;
  const icon = cell.querySelector('.marker-icon');
  if (hid.value === "1") {
    hid.value = "0";
    if (icon) icon.textContent = "";
    cell.closest('tr').classList.remove('line-marked');
  } else {
    hid.value = "1";
    if (icon) icon.textContent = attrSymbols[1];
    cell.closest('tr').classList.add('line-marked');
  }
  saveState();
}

function restoreMarkers() {
  document.querySelectorAll('th[data-input]').forEach(th => {
    const hid = th.querySelector('input[type="hidden"]');
    const val = parseInt(hid.value) || 0;
    updateAttrHeader(th, val);
  });
  enforceAttributeExclusivity();
  document.querySelectorAll('[data-marker]').forEach(cell => {
    const hid = cell.querySelector('input[type="hidden"]');
    const icon = cell.querySelector('.marker-icon');
    if (hid.value === "1") {
      if (icon) icon.textContent = attrSymbols[1];
      cell.closest('tr').classList.add('line-marked');
    } else {
      if (icon) icon.textContent = "";
      cell.closest('tr').classList.remove('line-marked');
    }
  });
}

document.addEventListener("click", e => {
  if (markerPopup && !markerPopup.contains(e.target)) {
    markerPopup.remove();
    markerPopup = null;
  }
  const cell = e.target.closest('[data-marker]');
  if (cell) {
    toggleLineMarker(cell);
    return;
  }
  const th = e.target.closest('th[data-input]');
  if (th) {
    selectAttrMarker(th);
  }
});
// =========================
// 📊 Attribute Berechnungen
// =========================
function updateAttributes() {
  const attrs = ["KG","BF","ST","WI","I","GW","GS","IN","WK","CH"];
  attrs.forEach(att => {
    const start = parseInt(document.getElementById(att+"-start").value) || 0; // Basiswert
    const steig = parseInt(document.getElementById(att+"-steig").value) || 0; // Steigerung
    const akt = start + steig;
    document.getElementById(att+"-akt").value = akt; // Gesamtwert anzeigen
  });

  updateGrundfaehigkeiten();
  updateGruppierteFaehigkeiten();
  updateLebenspunkte();
  updateKorruption();
  updateRuestung();
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
      const steig = parseInt(row.cells[3].querySelector("input").value) || 0; // individuelle Steigerung
      row.cells[2].querySelector("input").value = attVal; // Basiswert
      row.cells[4].querySelector("input").value = attVal + steig; // Gesamtwert
    });
  }

// =========================
// ⚔️ Gruppierte Fähigkeiten
// =========================
function updateGruppierteFaehigkeiten() {
  const rows = document.querySelectorAll("#grupp-table tr");
  rows.forEach((row, idx) => {
    if (idx === 0) return;
    const sel = row.cells[1]?.querySelector("select");
    const base = row.cells[2]?.querySelector("input");
    const steig = row.cells[3]?.querySelector("input");
    const ges = row.cells[4]?.querySelector("input");
    if (!sel || !base || !steig || !ges) return;
    const att = sel.value;
    const attVal = att ? (parseInt(document.getElementById(att + "-akt").value) || 0) : 0;
    base.value = att ? attVal : "";
    const steigVal = parseInt(steig.value) || 0;
    ges.value = att ? attVal + steigVal : steigVal;
  });
}

function addRow(tableId) {
  const table = document.getElementById(tableId); // Ziel-Tabelle
  const row = table.insertRow(-1); // neue Zeile am Ende

  if (tableId === "grupp-table") {
    // Vorlage für gruppierte Fähigkeiten
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><input type="text"></td>
      <td>
          <select required>
            <option value="" selected disabled>-</option>
            <option value="KG">KG</option><option value="BF">BF</option>
            <option value="ST">ST</option><option value="WI">WI</option>
            <option value="I">I</option><option value="GW">GW</option>
            <option value="GS">GS</option><option value="IN">IN</option>
            <option value="WK">WK</option><option value="CH">CH</option>
          </select>
        </td>
      <td class="wsg"><input type="number" readonly></td>
      <td class="wsg"><input type="number"></td>
      <td class="wsg"><input type="number" readonly></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
    const sel = row.cells[1].querySelector("select");
    const steig = row.cells[3].querySelector("input");
    sel.addEventListener("change", () => { updateGruppierteFaehigkeiten(); saveState(); });
    steig.addEventListener("input", () => { updateGruppierteFaehigkeiten(); saveState(); });
    updateGruppierteFaehigkeiten();
  }
  else if (tableId === "talent-table") {
    // Zeile für Talente
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><input type="text"></td>
      <td class="wsg"><input type="number"></td>
      <td><input type="text"></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "waffen-table") {
    // Waffenliste
    row.innerHTML = `
      <td><input type="text"></td>
      <td class="text-left"><input type="text"></td>
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "schulden-table") {
    // Dynamische Schuldenliste
    row.innerHTML = `
      <td><input type="number" max="0"></td>
      <td><input type="number" max="0"></td>
      <td><input type="number" max="0"></td>
      <td><input type="text"></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateVermoegen();">❌</button></td>
    `;
  }
  else if (tableId === "spar-table") {
    // Dynamische Sparvermögenliste
    row.innerHTML = `
      <td><input type="number" min="0"></td>
      <td><input type="number" min="0"></td>
      <td><input type="number" min="0"></td>
      <td><input type="text"></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateVermoegen();">❌</button></td>
    `;
  }
  else if (tableId === "ruestung-table") {
    // Rüstungsstücke
    row.innerHTML = `
      <td><input type="text"></td>
        <td>
          <select required>
            <option value="" selected disabled>-</option>
            <option>Kopf</option><option>Linker Arm</option>
            <option>Rechter Arm</option><option>Linkes Bein</option>
            <option>Rechtes Bein</option><option>Brust</option>
          </select>
        </td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "ausruestung-table") {
    // Allgemeine Ausrüstung
    row.innerHTML = `
      <td><input type="text"></td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "zauber-table") {
    // Zauber oder Gebete
    row.innerHTML = `
      <td><input type="text"></td>
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "mutationen-table") {
    // Mutationen mit Kategorie
    row.innerHTML = `
      <td><input type="text"></td>
      <td>
        <select required>
          <option value="" selected disabled>-</option>
          <option>Körper</option>
          <option>Geist</option>
        </select>
      </td>
      <td><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "psychologie-table") {
    // Einträge für psychologische Effekte
    row.innerHTML = `
      <td><input type="text"></td>
      <td><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "exp-table") {
    // Erfahrungspunkte-Modus "Voll"
    row.innerHTML = `
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); saveState(); updateLebenspunkte(); updateErfahrung(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }

  if (tableId === "exp-table") {
    updateErfahrung(); // nach Änderung Erfahrungswerte neu berechnen
  }
  saveState();
  updateLebenspunkte(); // Lebenspunkte können von Talenten abhängen
  updateVermoegen();
}

// =========================
// ⭐ Talente Logik (inkl. Robustheit)
// =========================
function checkTalentEffects() {
  let hardy = false;
  document.querySelectorAll("#talent-table tr").forEach((row, idx) => {
    if (idx === 0) return; // Kopfzeile überspringen
    const name = row.cells[0].querySelector("input").value.toLowerCase();
    if (name.includes("robustheit") || name.includes("hardy")) {
      hardy = true; // Talent gefunden
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

  // Basiswerte berechnen
  const stb = Math.floor(ST/10);
  const wib = Math.floor(WI/10);
  const wkb = Math.floor(WK/10) * 2;

  const hardy = checkTalentEffects();
  const robust = hardy ? wib : 0; // Robustheit addiert WI-Anteil

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
  const max = Math.floor(WI/10) + Math.floor(WK/10); // zulässige Korruption
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
// 🛡️ Rüstung
// =========================
function updateRuestung() {
  const zones = {
    "Kopf": 0,
    "Linker Arm": 0,
    "Rechter Arm": 0,
    "Brust": 0,
    "Linkes Bein": 0,
    "Rechtes Bein": 0
  }; // Sammeln der besten Rüstungswerte pro Zone

  document.querySelectorAll("#ruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const zoneSel = row.cells[1].querySelector("select");
    const zone = zoneSel ? zoneSel.value : "";
    const rp = parseInt(row.cells[2].querySelector("input").value) || 0;
    if (zones.hasOwnProperty(zone)) zones[zone] += rp; // Werte je Zone addieren
  });

  document.getElementById("rp-kopf").value = zones["Kopf"] || 0;
  document.getElementById("rp-larm").value = zones["Linker Arm"] || 0;
  document.getElementById("rp-rarm").value = zones["Rechter Arm"] || 0;
  document.getElementById("rp-brust").value = zones["Brust"] || 0;
  document.getElementById("rp-lbein").value = zones["Linkes Bein"] || 0;
  document.getElementById("rp-rbein").value = zones["Rechtes Bein"] || 0;
}

// =========================
// ⚖️ Traglast
// =========================
function updateTraglast() {
  const ST = parseInt(document.getElementById("ST-akt").value) || 0;
  const WI = parseInt(document.getElementById("WI-akt").value) || 0;
  const max = Math.floor(ST/10) + Math.floor(WI/10); // maximale Traglast

  let waffenTP = 0, ruestungTP = 0, ausrTP = 0;

  // Gewicht der Waffen aufsummieren
  document.querySelectorAll("#waffen-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    waffenTP += parseInt(row.cells[2].querySelector("input").value) || 0;
  });

  // Gewicht der Rüstungsteile
  document.querySelectorAll("#ruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    ruestungTP += parseInt(row.cells[3].querySelector("input").value) || 0;
  });

  // Ausrüstung: Menge * Tragpunkte
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

  // Warnung, wenn überladen
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

  // Grundbetrag in Kupfer umrechnen
  let totalG = g + s*12 + gk*240;

  // Sparvermögen (nur positive Werte)
  let sparG = 0;
  document.querySelectorAll("#spar-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const inputs = row.querySelectorAll("input");
    let sgk = parseInt(inputs[0].value) || 0;
    let ss  = parseInt(inputs[1].value) || 0;
    let sg  = parseInt(inputs[2].value) || 0;
    if (sgk < 0) { sgk = Math.abs(sgk); inputs[0].value = sgk; }
    if (ss < 0) { ss = Math.abs(ss); inputs[1].value = ss; }
    if (sg < 0) { sg = Math.abs(sg); inputs[2].value = sg; }
    sparG += sg + ss*12 + sgk*240;
  });

  // Schulden (nur negative Werte)
  let debtG = 0;
  document.querySelectorAll("#schulden-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const inputs = row.querySelectorAll("input");
    let dgk = parseInt(inputs[0].value) || 0;
    let ds  = parseInt(inputs[1].value) || 0;
    let dg  = parseInt(inputs[2].value) || 0;
    if (dgk > 0) { dgk = -dgk; inputs[0].value = dgk; }
    if (ds > 0) { ds = -ds; inputs[1].value = ds; }
    if (dg > 0) { dg = -dg; inputs[2].value = dg; }
    debtG += dg + ds*12 + dgk*240; // negative Summe
  });

  const netto = totalG + sparG + debtG;
  const gkFinal = Math.trunc(netto/240);
  const sFinal  = Math.trunc((netto%240)/12);
  const gFinal  = netto % 12;
  document.getElementById("netto-gk").value = gkFinal;
  document.getElementById("netto-s").value = sFinal;
  document.getElementById("netto-g").value = gFinal;
}

// =========================
// ⭐ Erfahrung
// =========================
let aktWarNegativ = false;
function updateErfahrung() {
  const toggle = document.getElementById("exp-toggle");
  if (!toggle) return;

  if (!toggle.checked) {
    // Simpler Modus
    const akt = parseInt(document.getElementById("exp-simple-akt").value) || 0;
    const ausg = parseInt(document.getElementById("exp-simple-ausg").value) || 0;
    document.getElementById("exp-simple-gesamt").value = akt + ausg;
  } else {
    // Voller Modus mit Tabellenzeilen
    let akt = 0, ausg = 0, gesamt = 0;
    document.querySelectorAll("#exp-table tr").forEach((row, idx) => {
      if (idx === 0) return;
      const val = parseInt(row.cells[0].querySelector("input").value) || 0;
      akt += val;
      if (val < 0) {
        ausg += val;
      } else {
        gesamt += val;
      }
    });
    document.getElementById("exp-full-akt").value = akt;
    document.getElementById("exp-full-ausg").value = ausg;
    document.getElementById("exp-full-gesamt").value = gesamt;

    if (akt < 0 && !aktWarNegativ) {
      alert("Warnung: Aktuell ist negativ!");
      aktWarNegativ = true;
    } else if (akt >= 0 && aktWarNegativ) {
      aktWarNegativ = false;
    }
  }
}

// =========================
// 🎨 Highlighting
// =========================
document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    const table = e.target.closest("table");
    const cell = e.target.closest("td, th");
    const row = e.target.closest("tr");
    if (table && table.id === "attribute-table" && cell) {
      const idx = cell.cellIndex;
      table.querySelectorAll("tr").forEach(r => {
        const c = r.cells[idx];
        if (c) c.classList.add("active"); // Spalte hervorheben
      });
    } else if (row) {
      row.classList.add("active"); // Zeile hervorheben
    }
  }
});

document.addEventListener("focusout", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    const table = e.target.closest("table");
    const cell = e.target.closest("td, th");
    const row = e.target.closest("tr");
    if (table && table.id === "attribute-table" && cell) {
      const idx = cell.cellIndex;
      table.querySelectorAll("tr").forEach(r => {
        const c = r.cells[idx];
        if (c) c.classList.remove("active");
      });
    } else if (row) {
      row.classList.remove("active");
    }
  }
});

// =========================
// 🚀 Init
// =========================
function initLogic() {
  renderSections();
  initGrunddatenToggle();
  initFinanzenToggle();
  initCharacterManagement();

  document.addEventListener("input", e => {
    if (e.target.matches("input, textarea, select")) {
      if (e.target.closest("#talent-table")) {
        updateLebenspunkte();
        saveState();
      } else {
        updateAttributes();
      }
    }
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
