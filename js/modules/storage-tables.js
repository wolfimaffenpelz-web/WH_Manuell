// Speicherung und Tabellenverwaltung
function serializeTable(tableId) {
  const table = document.getElementById(tableId);
  const data = [];
  if (!table) return data;

  table.querySelectorAll("tr").forEach((row, idx) => {
    if (idx === 0) return;
    const rowData = [];
    row.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.type === "checkbox" || el.type === "radio") {
        rowData.push(el.checked);
      } else {
        rowData.push(el.value);
      }
    });
    data.push(rowData);
  });
  return data;
}

function deserializeTable(tableId, data) {
  const table = document.getElementById(tableId);
  if (!table) return;
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  if (!data || !Array.isArray(data)) return;
  data.forEach(rowData => {
    addRow(tableId);
    const row = table.rows[table.rows.length - 1];
    const inputs = row.querySelectorAll("input, select, textarea");
    rowData.forEach((val, idx) => {
      const el = inputs[idx];
      if (!el) return;
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = val;
      } else {
        el.value = val;
      }
    });
  });
}

function saveState() {
  if (!currentCharacter) return;
  const state = {};

  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (!el.id) return;
    if (el.type === "checkbox" || el.type === "radio") {
      state[el.id] = el.checked;
    } else {
      state[el.id] = el.value;
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
    state[id] = serializeTable(id);
  });

  localStorage.setItem("state-" + currentCharacter, JSON.stringify(state));
}

function loadState() {
  if (!currentCharacter) return;
  const state = JSON.parse(localStorage.getItem("state-" + currentCharacter) || "{}");

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
    deserializeTable(id, state[id]);
  });

  updateAttributes();
  restoreMarkers();
  ensureInitialRows();
  updateCharacterDisplay();
  updateExperienceView();
}

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
    if (table) {
      if (table.rows.length === 1) {
        addRow(id);
      }
      autoAddRow(id);
    }
  });
}

function resetCharacterSheet() {
  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else {
      el.value = "";
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
    const table = document.getElementById(id);
    if (table) {
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
    }
  });

  document.querySelectorAll(".marker-icon").forEach(icon => { icon.textContent = ""; });
  document.querySelectorAll("tr.line-marked").forEach(row => row.classList.remove("line-marked"));
  document.querySelectorAll('th[data-input]').forEach(th => {
    const hid = th.querySelector('input[type="hidden"]');
    if (hid) {
      hid.value = "0";
      updateAttrHeader(th, 0);
    }
  });

  ensureInitialRows();
  updateAttributes();
}

function autoAddRow(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = Array.from(table.rows).slice(1);
  if (rows.length === 0) {
    addRow(tableId);
    return;
  }
  const lastRow = rows[rows.length - 1];
  const lastInput = lastRow.cells[0]?.querySelector('input:not([type="hidden"]), textarea, select');
  if (lastInput && lastInput.value.trim() !== '') {
    addRow(tableId);
  }
  let emptyCount = 0;
  for (let i = rows.length - 1; i >= 0; i--) {
    const inp = rows[i].cells[0]?.querySelector('input:not([type="hidden"]), textarea, select');
    if (inp && inp.value.trim() === '') {
      emptyCount++;
      if (emptyCount > 1) {
        table.deleteRow(i + 1);
      }
    } else {
      break;
    }
  }
}

function addRow(tableId) {
  const table = document.getElementById(tableId);
  const row = table.insertRow(-1);

  if (tableId === "grupp-table") {
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><textarea rows="1"></textarea></td>
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
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('grupp-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
    const sel = row.cells[1].querySelector("select");
    const steig = row.cells[3].querySelector("input");
    sel.addEventListener("change", () => { updateGruppierteFaehigkeiten(); saveState(); });
    steig.addEventListener("input", () => { updateGruppierteFaehigkeiten(); saveState(); });
    updateGruppierteFaehigkeiten();
  }
  else if (tableId === "talent-table") {
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><textarea rows="1"></textarea></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="wsg"><input type="number"></td>
      <td class="wsg"><input type="number"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('talent-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "waffen-table") {
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><textarea rows="1"></textarea></td>
      <td class="text-left"><input type="text"></td>
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td class="text-left"><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('waffen-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten(); updateTraglast();">❌</button></td>
    `;
    row.querySelectorAll("input, textarea").forEach(el => {
      el.addEventListener('input', () => { updateTraglast(); saveState(); });
    });
  }
  else if (tableId === "schulden-table") {
    row.innerHTML = `
      <td><input type="number" max="0"></td>
      <td><input type="number" max="0"></td>
      <td><input type="number" max="0"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('schulden-table'); saveState(); updateVermoegen();">❌</button></td>
    `;
  }
  else if (tableId === "spar-table") {
    row.innerHTML = `
      <td><input type="number" min="0"></td>
      <td><input type="number" min="0"></td>
      <td><input type="number" min="0"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('spar-table'); saveState(); updateVermoegen();">❌</button></td>
    `;
  }
  else if (tableId === "ruestung-table") {
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><textarea rows="1"></textarea></td>
        <td>
          <select required>
            <option value="" selected disabled>-</option>
            <option value="Kopf">${t('head_short')}</option>
            <option value="Linker Arm">${t('left_arm_short')}</option>
            <option value="Rechter Arm">${t('right_arm_short')}</option>
            <option value="Linkes Bein">${t('left_leg_short')}</option>
            <option value="Rechtes Bein">${t('right_leg_short')}</option>
            <option value="Brust">${t('chest_short')}</option>
            <option value="Schild">${t('shield_short')}</option>
          </select>
        </td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('ruestung-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten(); updateRuestung(); updateTraglast();">❌</button></td>
    `;
    row.querySelectorAll("input, textarea, select").forEach(el => {
      el.addEventListener('input', () => { updateRuestung(); updateTraglast(); saveState(); });
    });
  }
  else if (tableId === "ausruestung-table") {
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><textarea rows="1"></textarea></td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td class="text-left"><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('ausruestung-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten(); updateTraglast();">❌</button></td>
    `;
    row.querySelectorAll("input, textarea").forEach(el => {
      el.addEventListener('input', () => { updateTraglast(); saveState(); });
    });
  }
  else if (tableId === "zauber-table") {
    row.innerHTML = `
      <td><textarea rows="1"></textarea></td>
      <td><input type="number"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td class="text-left"><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('zauber-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "mutationen-table") {
    row.innerHTML = `
      <td><textarea rows="1"></textarea></td>
      <td>
        <select required>
          <option value="" selected disabled>-</option>
          <option>${t('body')}</option>
          <option>${t('mind')}</option>
        </select>
      </td>
      <td class="text-left"><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('mutationen-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "psychologie-table") {
    row.innerHTML = `
      <td><textarea rows="1"></textarea></td>
      <td class="text-left"><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('psychologie-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "exp-table") {
    row.innerHTML = `
      <td><input type="number"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('exp-table'); saveState(); updateLebenspunkte(); updateErfahrung(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }

  row.querySelectorAll('textarea').forEach(autoResize);
}
