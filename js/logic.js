// logic.js v0.8.2

// =========================
// 🔒 Passwortschutz
// =========================
function initPasswordProtection() {
  applyTranslations();
  applySavedSettings();
  const overlay = document.getElementById("password-overlay"); // dunkler Hintergrund
  const input = document.getElementById("password-input");     // Eingabefeld für Passwort
  const button = document.getElementById("password-submit");   // OK-Button

  if (localStorage.getItem("auth") === "true") {
    overlay.style.display = "none"; // sofort anzeigen, wenn bereits authentifiziert
    initLogic(); // Hauptlogik starten
  }

  button.addEventListener("click", () => {
    if (input.value === "1234") {
      overlay.style.display = "none";          // Overlay ausblenden
      localStorage.setItem("auth", "true");    // Flag setzen
      initLogic();
    } else {
      alert(t('wrong_password'));
    }
  });

}
document.addEventListener("DOMContentLoaded", initPasswordProtection);

// =========================
// 📂 Multi-Charakter Verwaltung
// =========================
let currentCharacter = null;
let characterList = [];

let gameDeckReactRoot = null;

function disposeGameDeck() {
  if (gameDeckReactRoot && typeof gameDeckReactRoot.unmount === "function") {
    gameDeckReactRoot.unmount();
  }
  gameDeckReactRoot = null;
}

function hasGameDeckSupport() {
  return (
    typeof window !== "undefined" &&
    window.React &&
    window.ReactDOM &&
    typeof window.ReactDOM.createRoot === "function" &&
    window.GameDeck
  );
}

function getNumericInputValue(input) {
  if (!input) return 0;
  const value = parseInt(input.value, 10);
  return Number.isNaN(value) ? 0 : value;
}

function getTableCell(row, index) {
  if (!row || !row.cells || row.cells.length <= index) {
    return null;
  }
  return row.cells[index];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function collectAttributeOptions() {
  const table = document.getElementById("attribute-table");
  if (!table) return [];

  const rows = Array.from(table.rows);
  if (rows.length === 0) return [];

  const headerRow = rows[0];
  if (!headerRow) return [];

  const startRow = rows[1] || null;
  const increaseRow = rows[2] || null;
  const totalRow = rows[rows.length - 1] || null;

  const baseLabel = t("game_deck_attribute_base_label");
  const increaseLabel = t("game_deck_attribute_increase_label");

  const options = [];
  for (let col = 1; col < headerRow.cells.length; col += 1) {
    const headerCell = headerRow.cells[col];
    if (!headerCell) continue;
    const label = (headerCell.textContent || "").trim();
    if (!label) continue;

    const startCell = getTableCell(startRow, col);
    const increaseCell = getTableCell(increaseRow, col);
    const totalCell = getTableCell(totalRow, col);

    const startInput = startCell ? startCell.querySelector("input") : null;
    const increaseInput = increaseCell ? increaseCell.querySelector("input") : null;
    const totalInput = totalCell ? totalCell.querySelector("input") : null;

    const base = getNumericInputValue(startInput);
    const increase = getNumericInputValue(increaseInput);
    const total = totalInput ? getNumericInputValue(totalInput) : base + increase;

    options.push({
      id: `attribute-${col}`,
      label,
      value: total,
      breakdown: {
        base,
        increase,
        baseLabel,
        increaseLabel,
      },
    });
  }

  return options;
}

function collectGrundskillOptions() {
  const table = document.getElementById("grund-table");
  if (!table) return [];
  const rows = Array.from(table.rows).slice(1);
  if (rows.length === 0) return [];

  const baseLabel = t("game_deck_skill_base_label");
  const increaseLabel = t("game_deck_skill_increase_label");

  return rows
    .map((row, index) => {
      const nameCell = getTableCell(row, 0);
      const nameSpan = nameCell ? nameCell.querySelector("span:last-of-type") : null;
      const label = nameSpan ? nameSpan.textContent.trim() : "";
      if (!label) return null;

      const totalCellIndex = row.cells.length - 1;
      const increaseCellIndex = row.cells.length - 2;
      const baseCellIndex = row.cells.length - 3;

      const baseCell = getTableCell(row, baseCellIndex);
      const increaseCell = getTableCell(row, increaseCellIndex);
      const totalCell = getTableCell(row, totalCellIndex);

      const baseInput = baseCell ? baseCell.querySelector("input") : null;
      const increaseInput = increaseCell ? increaseCell.querySelector("input") : null;
      const totalInput = totalCell ? totalCell.querySelector("input") : null;

      const base = getNumericInputValue(baseInput);
      const increase = getNumericInputValue(increaseInput);
      const total = totalInput ? getNumericInputValue(totalInput) : base + increase;

      return {
        id: `grund-${index}`,
        label,
        value: total,
        breakdown: {
          base,
          increase,
          baseLabel,
          increaseLabel,
        },
      };
    })
    .filter(Boolean);
}

function collectGroupskillOptions() {
  const table = document.getElementById("grupp-table");
  if (!table) return [];
  const rows = Array.from(table.rows).slice(1);
  if (rows.length === 0) return [];

  const baseLabel = t("game_deck_group_base_label");
  const increaseLabel = t("game_deck_group_increase_label");

  return rows
    .map((row, index) => {
      const nameCell = getTableCell(row, 0);
      const nameField = nameCell ? nameCell.querySelector("textarea") : null;
      const label = nameField ? nameField.value.trim() : "";
      if (!label) return null;

      const totalCellIndex = row.cells.length - 2;
      const increaseCellIndex = row.cells.length - 3;
      const baseCellIndex = row.cells.length - 4;

      const baseCell = getTableCell(row, baseCellIndex);
      const increaseCell = getTableCell(row, increaseCellIndex);
      const totalCell = getTableCell(row, totalCellIndex);

      const baseInput = baseCell ? baseCell.querySelector("input") : null;
      const increaseInput = increaseCell ? increaseCell.querySelector("input") : null;
      const totalInput = totalCell ? totalCell.querySelector("input") : null;

      const base = getNumericInputValue(baseInput);
      const increase = getNumericInputValue(increaseInput);
      const total = totalInput ? getNumericInputValue(totalInput) : base + increase;

      return {
        id: `groupskill-${index}`,
        label,
        value: total,
        breakdown: {
          base,
          increase,
          baseLabel,
          increaseLabel,
        },
      };
    })
    .filter(Boolean);
}

function buildGameDeckOptionGroups() {
  const groups = [];
  const attributes = collectAttributeOptions();
  if (attributes.length > 0) {
    groups.push({
      id: "attributes",
      label: t("game_deck_category_attributes"),
      options: attributes,
    });
  }

  const grundskills = collectGrundskillOptions();
  if (grundskills.length > 0) {
    groups.push({
      id: "grundskills",
      label: t("game_deck_category_grundskills"),
      options: grundskills,
    });
  }

  const groupskills = collectGroupskillOptions();
  if (groupskills.length > 0) {
    groups.push({
      id: "groupskills",
      label: t("game_deck_category_groupskills"),
      options: groupskills,
    });
  }

  return groups;
}

function renderGameDeckComponent() {
  if (!hasGameDeckSupport()) {
    return;
  }
  const container = document.getElementById("game-deck-root");
  if (!container) {
    disposeGameDeck();
    return;
  }
  if (!gameDeckReactRoot) {
    gameDeckReactRoot = window.ReactDOM.createRoot(container);
  }
  const optionGroups = buildGameDeckOptionGroups();
  const element = window.React.createElement(window.GameDeck, {
    optionGroups,
  });
  gameDeckReactRoot.render(element);
}

function applySavedSettings() {
  const colors = JSON.parse(localStorage.getItem("color-settings") || "{}");
  Object.entries(colors).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
  const fonts = JSON.parse(localStorage.getItem("font-settings") || "{}");
  Object.entries(fonts).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
}


function rgbToHex(rgb) {
  const str = rgb.trim();
  if (str.startsWith("#")) return str;
  const res = str.match(/\d+/g);
  if (!res) return "#000000";
  return "#" + res.map(x => parseInt(x).toString(16).padStart(2, "0")).join("");
}

function updateCharacterDisplay() {
  const display = document.getElementById("current-character");
  if (display) display.textContent = `${t('active_character')} ${currentCharacter || ''}`;
}

function loadCharacterList() {
  characterList = JSON.parse(localStorage.getItem("characters") || "[]");
  if (characterList.length > 0) {
    if (!currentCharacter || !characterList.includes(currentCharacter)) {
      currentCharacter = characterList[0];
    }
  } else {
    currentCharacter = null;
  }
  updateCharacterDisplay();
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

function killCharacter() {
  document
    .querySelectorAll('#main-content input, #main-content textarea, #main-content select, #main-content button')
    .forEach(el => {
      if (el.tagName === 'BUTTON' || el.tagName === 'SELECT') {
        el.disabled = true;
      } else if (el.type === 'checkbox' || el.type === 'radio') {
        el.disabled = true;
      } else {
        el.setAttribute('readonly', true);
      }
      el.classList.add('readonly');
    });
}

// Öffnet Eingabe zur Erstellung eines neuen Charakters
function promptNewCharacter(preserveValues = false) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="overlay-content">
      <p>${t('character_name_prompt')}</p>
      <input type="text" id="new-char-name">
      <br>
      <button id="new-char-ok">${t('ok')}</button>
      <button id="new-char-cancel">${t('cancel')}</button>
    </div>
  `;
  document.body.appendChild(overlay);
  const input = overlay.querySelector("#new-char-name");
  input.focus();

  function close() { overlay.remove(); }

  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  overlay.querySelector("#new-char-cancel").addEventListener("click", close);

  overlay.querySelector("#new-char-ok").addEventListener("click", () => {
    const newName = input.value.trim();
    if (!newName) { alert(t('name_required')); return; }
    if (preserveValues) {
      saveCharacter(newName);
      saveState();
    } else {
      saveState();
      saveCharacter(newName);
      resetCharacterSheet();
    }
    loadCharacterList();
    close();
  });
}

function initCharacterManagement() {
  const cycleBtn = document.getElementById("cycle-character");
  const newBtn = document.getElementById("new-character"); // neuer Charakter
  const delBtn = document.getElementById("delete-character"); // löschen
  const importBtn = document.getElementById("import-character");
  const exportBtn = document.getElementById("export-character");
  const importFile = document.getElementById("import-file");
  const settingsBtn = document.getElementById("settings");

  loadCharacterList();
  if (!currentCharacter) {
    ensureInitialRows();
    updateAttributes();
  }

  if (cycleBtn) {
    cycleBtn.addEventListener("click", () => {
      if (characterList.length === 0) return;
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = `
        <div class="overlay-content">
          <p>${t('choose_character')}</p>
          <div id="char-list"></div>
          <button id="char-cancel">${t('cancel')}</button>
        </div>
      `;
      document.body.appendChild(overlay);
      const list = overlay.querySelector('#char-list');
      characterList.forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.addEventListener('click', () => {
          saveState();
          currentCharacter = name;
          updateCharacterDisplay();
          loadState();
          overlay.remove();
        });
        list.appendChild(btn);
      });
      function close() { overlay.remove(); }
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      overlay.querySelector('#char-cancel').addEventListener('click', close);
    });
  }

  if (settingsBtn) settingsBtn.title = t('settings');

  // Neuer Charakter anlegen
  newBtn.addEventListener("click", () => {
    if (currentCharacter) {
      promptNewCharacter();
    } else {
      promptNewCharacter(true);
    }
  });

  // Charakter löschen
  delBtn.addEventListener("click", () => {
    if (!currentCharacter) return; // nichts zu löschen
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = `
      <div class="overlay-content">
        <p>${t('delete_confirm_prefix')}${currentCharacter}${t('delete_confirm_suffix')}</p>
        <button id="del-kill">${t('kill_char')}</button>
        <button id="del-yes">${t('delete_char')}</button>
        <button id="del-no">${t('cancel')}</button>
      </div>
    `;
    document.body.appendChild(overlay);

    function close() { overlay.remove(); }

    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    overlay.querySelector("#del-no").addEventListener("click", close);
    overlay.querySelector("#del-kill").addEventListener("click", () => {
      const confirmOverlay = document.createElement("div");
      confirmOverlay.className = "overlay";
      confirmOverlay.innerHTML = `
        <div class="overlay-content">
          <p>${t('kill_confirm')}</p>
          <button id="kill-yes">${t('yes')}</button>
          <button id="kill-no">${t('no')}</button>
        </div>
      `;
      document.body.appendChild(confirmOverlay);

      function closeConfirm() { confirmOverlay.remove(); }

      confirmOverlay.addEventListener("click", e => { if (e.target === confirmOverlay) closeConfirm(); });
      confirmOverlay.querySelector("#kill-no").addEventListener("click", closeConfirm);
      confirmOverlay.querySelector("#kill-yes").addEventListener("click", () => {
        killCharacter();
        closeConfirm();
        close();
      });
    });

    overlay.querySelector("#del-yes").addEventListener("click", () => {
      const confirmOverlay = document.createElement("div");
      confirmOverlay.className = "overlay";
      confirmOverlay.innerHTML = `
        <div class="overlay-content">
          <p>${t('delete_confirm')}</p>
          <button id="confirm-del-yes">${t('yes')}</button>
          <button id="confirm-del-no">${t('no')}</button>
        </div>
      `;
      document.body.appendChild(confirmOverlay);

      function closeConfirm() { confirmOverlay.remove(); }

      confirmOverlay.addEventListener("click", e => { if (e.target === confirmOverlay) closeConfirm(); });
      confirmOverlay.querySelector("#confirm-del-no").addEventListener("click", closeConfirm);
      confirmOverlay.querySelector("#confirm-del-yes").addEventListener("click", () => {
        deleteCharacter(currentCharacter);
        if (currentCharacter) {
          loadState(); // anderen laden
        } else {
          resetCharacterSheet();
        }
        closeConfirm();
        close();
      });
    });
  });

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = `
        <div class="overlay-content">
          <button id="open-colors">🎨 ${t('colors')}</button>
          <button id="open-fonts">🅵 ${t('fonts')}</button>
          <button id="settings-close">${t('cancel')}</button>
        </div>
      `;
      document.body.appendChild(overlay);
      function close() { overlay.remove(); }
      overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
      overlay.querySelector("#settings-close").addEventListener("click", close);
      overlay.querySelector("#open-colors").addEventListener("click", () => { close(); openColorSettings(); });
      overlay.querySelector("#open-fonts").addEventListener("click", () => { close(); openFontSettings(); });
    });
  }

  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", (e) => { importCharacters(e.target.files); e.target.value = ""; });
  exportBtn.addEventListener("click", openExportPopup);
}

function openColorSettings() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="overlay-content">
      <button id="open-colors-bg">${t('colors_group_bg_text')}</button>
      <button id="open-colors-mark">${t('colors_group_markings')}</button>
      <button id="open-colors-lines">${t('colors_group_lines')}</button>
      <div class="popup-buttons">
        <button id="color-cancel">${t('cancel')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  overlay.querySelector('#color-cancel').addEventListener('click', close);
  overlay.querySelector('#open-colors-bg').addEventListener('click', () => { close(); openColorGroup('bg'); });
  overlay.querySelector('#open-colors-mark').addEventListener('click', () => { close(); openColorGroup('mark'); });
  overlay.querySelector('#open-colors-lines').addEventListener('click', () => { close(); openColorGroup('lines'); });
}

function openColorGroup(group) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  let groupVars, titleKey;
  if (group === 'bg') {
    groupVars = {
      "--color-bg": "color_bg",
      "--color-text": "color_text",
      "--color-field": "color_field",
      "--color-readonly": "color_readonly",
      "--color-positive": "color_positive",
      "--color-negative": "color_negative",
      "--color-active-char-bg": "color_active_char_bg",
      "--color-active-char-text": "color_active_char_text"
    };
    titleKey = 'colors_group_bg_text';
  } else if (group === 'mark') {
    groupVars = {
      "--color-highlight": "color_highlight",
      "--color-attr-cross": "color_attr_cross",
      "--color-attr-axes": "color_attr_axes",
      "--color-attr-skull": "color_attr_skull",
      "--color-attr-shield": "color_attr_shield",
      "--color-active-cell": "color_active_cell"
    };
    titleKey = 'colors_group_markings';
  } else {
    groupVars = {
      "--color-table-line": "color_table_lines",
      "--color-divider": "color_section_divider"
    };
    titleKey = 'colors_group_lines';
  }
  const styles = getComputedStyle(document.documentElement);
  let fields = "";
  Object.entries(groupVars).forEach(([varName, key]) => {
    const val = rgbToHex(styles.getPropertyValue(varName).trim());
    fields += `<div class="setting-row"><label>${t(key)}</label> <input type="color" data-var="${varName}" value="${val}"></div>`;
  });
  overlay.innerHTML = `
    <div class="overlay-content scrollable">
      <h2>${t(titleKey)}</h2>
      ${fields}
      <div class="popup-buttons">
        <button id="group-accept">${t('accept')}</button>
        <button id="group-cancel">${t('cancel')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('#group-cancel').addEventListener('click', close);
  overlay.querySelector('#group-accept').addEventListener('click', () => {
    const inputs = overlay.querySelectorAll("input[type='color']");
    const saved = JSON.parse(localStorage.getItem('color-settings') || '{}');
    inputs.forEach(inp => {
      document.documentElement.style.setProperty(inp.dataset.var, inp.value);
      saved[inp.dataset.var] = inp.value;
    });
    localStorage.setItem('color-settings', JSON.stringify(saved));
    close();
  });
}

function openFontSettings() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const fontVars = {
    "--font-heading": "font_heading",
    "--font-main": "font_main",
    "--font-active-char": "font_active_char"
  };
  const fontOptions = [
    { name: "UnifrakturMaguntia", stack: "'UnifrakturMaguntia', cursive" },
    { name: "Podkova", stack: "'Podkova', serif" },
    { name: "Black Chancery", stack: "'Black Chancery', cursive" },
    { name: "Deutsch Gothic", stack: "'Deutsch Gothic', cursive" },
    { name: "Cloister Black", stack: "'Cloister Black', cursive" },
    { name: "Old English Text MT", stack: "'Old English Text MT', serif" },
    { name: "Kingthings Petrock", stack: "'Kingthings Petrock', cursive" },
    { name: "Arial", stack: "Arial, sans-serif" },
    { name: "Times New Roman", stack: "'Times New Roman', serif" },
    { name: "Courier New", stack: "'Courier New', monospace" }
  ];
  const styles = getComputedStyle(document.documentElement);
  let fields = "";
  Object.entries(fontVars).forEach(([varName, key]) => {
    const current = styles.getPropertyValue(varName).trim();
    const options = fontOptions.map(f => `<option value="${f.stack}" ${current === f.stack ? 'selected' : ''} style="font-family:${f.stack};">${f.name}</option>`).join('');
    fields += `<div class="setting-row"><label>${t(key)}</label> <select data-var="${varName}">${options}</select><span class="font-preview" style="font-family:${current}; margin-left:0.5em">${t('sample')}</span></div>`;
  });
  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>${t('fonts')}</h2>
      ${fields}
      <div class="popup-buttons">
        <button id="font-accept">${t('accept')}</button>
        <button id="font-cancel">${t('cancel')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  overlay.querySelector("#font-cancel").addEventListener("click", close);
  overlay.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", () => {
      sel.nextElementSibling.style.fontFamily = sel.value;
    });
  });
  overlay.querySelector("#font-accept").addEventListener("click", () => {
    const selects = overlay.querySelectorAll("select");
    const saved = {};
    selects.forEach(sel => {
      document.documentElement.style.setProperty(sel.dataset.var, sel.value);
      saved[sel.dataset.var] = sel.value;
    });
    localStorage.setItem("font-settings", JSON.stringify(saved));
    close();
  });
}

// =========================
// 🧩 Sections Rendern
// =========================
function renderSections() {
  const main = document.getElementById("main-content");
  disposeGameDeck();
  main.innerHTML = ""; // vorherige Inhalte entfernen
  sections.forEach(sec => {
    const sectionEl = document.createElement("section");
    sectionEl.id = sec.id; // ID für spätere Referenz
    const header = document.createElement("h2");
    header.innerHTML = `<span id="${sec.id}-arrow" class="section-arrow">▼</span> ${sec.title}`;
    sectionEl.appendChild(header);
    const body = document.createElement("div");
    body.className = "section-body";
    body.innerHTML = sec.content;
    sectionEl.appendChild(body);
    main.appendChild(sectionEl); // anhängen
  });
}

function initSectionToggle(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const body = section.querySelector(".section-body");
  const header = section.querySelector("h2");
  const arrow = header?.querySelector(`#${sectionId}-arrow`);
  if (!body || !header || !arrow) return;
  const storageKey = `${sectionId}-collapsed`;
  const collapsed = localStorage.getItem(storageKey) === "true";
  body.style.removeProperty("display");
  const getChildren = () => Array.from(body.children);
  const applyCollapsedState = (isCollapsed, persist) => {
    getChildren().forEach(child => {
      if (child.classList && child.classList.contains("section-divider")) {
        child.style.removeProperty("display");
        return;
      }
      if (isCollapsed) {
        child.style.display = "none";
      } else {
        child.style.removeProperty("display");
      }
    });
    section.classList.toggle("collapsed", isCollapsed);
    arrow.textContent = isCollapsed ? "▶" : "▼";
    if (isCollapsed) {
      body.setAttribute("aria-hidden", "true");
      section.setAttribute("data-collapsed", "true");
    } else {
      body.removeAttribute("aria-hidden");
      section.removeAttribute("data-collapsed");
    }
    if (persist) {
      localStorage.setItem(storageKey, isCollapsed ? "true" : "false");
    }
  };

  applyCollapsedState(collapsed, false);

  header.addEventListener("click", () => {
    const nextState = !section.classList.contains("collapsed");
    applyCollapsedState(nextState, true);
  });
}

function initSectionToggles() {
  sections.forEach(sec => initSectionToggle(sec.id));
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
// 🛡 Schicksal & Zähigkeit Symbole
// =========================
const TOKEN_ACTIVE_SYMBOL = "●";
const TOKEN_SPENT_SYMBOL = "✖";
const TOKEN_LONG_PRESS_MS = 2000;
const TOKEN_PARENT_REMOVE_DELAY_MS = 3000;

const tokenConfig = {
  fate: { storageId: "fate-tokens", child: "luck" },
  luck: { storageId: "luck-tokens", parent: "fate" },
  resilience: { storageId: "resilience-tokens", child: "resolve" },
  resolve: { storageId: "resolve-tokens", parent: "resilience" }
};

function getTokenInput(type) {
  const config = tokenConfig[type];
  if (!config) return null;
  return document.getElementById(config.storageId);
}

function normalizeTokenEntry(type, entry) {
  const isParent = type === "fate" || type === "resilience";
  if (entry === "spent" && isParent) {
    return "active";
  }
  return entry === "spent" ? "spent" : "active";
}

function readTokenData(type) {
  const input = getTokenInput(type);
  if (!input) return [];
  const raw = (input.value || "").trim();
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : [];
  } catch (err) {
    parsed = [];
  }
  const normalized = Array.isArray(parsed)
    ? parsed.map(entry => normalizeTokenEntry(type, entry))
    : [];
  if (!raw || JSON.stringify(parsed) !== JSON.stringify(normalized)) {
    input.value = JSON.stringify(normalized);
  }
  return normalized;
}

function writeTokenData(type, data) {
  const input = getTokenInput(type);
  if (!input) return [];
  const normalized = Array.isArray(data)
    ? data.map(entry => normalizeTokenEntry(type, entry))
    : [];
  input.value = JSON.stringify(normalized);
  saveState();
  return normalized;
}

function updateTokenAddButton(type) {
  const btn = document.querySelector(`[data-token-add="${type}"]`);
  if (!btn) return;
  const config = tokenConfig[type];
  let disabled = false;
  let labelKey = "token_add";
  if (config && config.parent) {
    const parentCount = readTokenData(config.parent).length;
    const ownCount = readTokenData(type).length;
    if (ownCount >= parentCount) {
      disabled = true;
      labelKey = "token_parent_limit";
    }
  }
  btn.disabled = disabled;
  btn.setAttribute("aria-disabled", disabled ? "true" : "false");
  btn.setAttribute("aria-label", t(labelKey));
  btn.title = t(labelKey);
}

function enforceTokenChildLimit(parentType) {
  const config = tokenConfig[parentType];
  if (!config || !config.child) return;
  const childType = config.child;
  const parentCount = readTokenData(parentType).length;
  let childData = readTokenData(childType);
  const original = JSON.stringify(childData);
  if (childData.length > parentCount) {
    let removeCount = childData.length - parentCount;
    const updated = childData.slice();
    while (removeCount > 0) {
      const spentIndex = updated.lastIndexOf("spent");
      const indexToRemove = spentIndex >= 0 ? spentIndex : updated.length - 1;
      if (indexToRemove >= 0) {
        updated.splice(indexToRemove, 1);
      }
      removeCount -= 1;
    }
    childData = updated;
  }
  if (childData.length < parentCount) {
    childData = childData.concat(Array(parentCount - childData.length).fill("active"));
  }
  if (JSON.stringify(childData) !== original) {
    writeTokenData(childType, childData);
    renderTokenButtons(childType);
  } else {
    renderTokenButtons(childType);
  }
}

function attachTokenInteractions(btn, type) {
  let timerId = null;
  const clearTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
  btn.addEventListener("pointerdown", event => {
    event.preventDefault();
    clearTimer();
    timerId = window.setTimeout(() => {
      timerId = null;
      handleTokenLongPress(type, btn);
    }, TOKEN_LONG_PRESS_MS);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(evt => {
    btn.addEventListener(evt, () => {
      clearTimer();
    });
  });
  btn.addEventListener("contextmenu", event => event.preventDefault());
}

function handleTokenLongPress(type, button) {
  const index = parseInt(button.dataset.tokenIndex, 10);
  if (Number.isNaN(index)) return;
  const tokens = readTokenData(type);
  if (type === "fate" || type === "resilience") {
    if (button.disabled) return;
    button.disabled = true;
    button.dataset.tokenState = "spent";
    button.classList.add("token-icon--cooldown");
    button.setAttribute("aria-label", t("token_spent"));
    button.innerHTML = `<span aria-hidden="true">${TOKEN_SPENT_SYMBOL}</span>`;
    window.setTimeout(() => {
      const currentTokens = readTokenData(type);
      if (index < currentTokens.length) {
        currentTokens.splice(index, 1);
      } else if (currentTokens.length > 0) {
        currentTokens.pop();
      }
      writeTokenData(type, currentTokens);
      renderTokenButtons(type);
      enforceTokenChildLimit(type);
    }, TOKEN_PARENT_REMOVE_DELAY_MS);
    return;
  }
  if (!tokens[index]) return;
  tokens[index] = tokens[index] === "spent" ? "active" : "spent";
  writeTokenData(type, tokens);
  renderTokenButtons(type);
}

function renderTokenButtons(type) {
  const container = document.querySelector(`[data-token-list="${type}"]`);
  if (!container) return;
  const tokens = readTokenData(type);
  container.innerHTML = "";
  container.setAttribute("data-empty", tokens.length === 0 ? "true" : "false");
  tokens.forEach((state, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "token-icon";
    btn.dataset.tokenType = type;
    btn.dataset.tokenIndex = String(index);
    btn.dataset.tokenState = state;
    btn.setAttribute("aria-label", state === "spent" ? t("token_spent") : t("token_active"));
    btn.setAttribute("role", "listitem");
    btn.innerHTML = `<span aria-hidden="true">${state === "spent" ? TOKEN_SPENT_SYMBOL : TOKEN_ACTIVE_SYMBOL}</span>`;
    attachTokenInteractions(btn, type);
    container.appendChild(btn);
  });
  updateTokenAddButton(type);
}

function addToken(type) {
  const tokens = readTokenData(type);
  const config = tokenConfig[type];
  if (config && config.parent) {
    // Child-Token werden automatisch verwaltet
    return;
  }
  tokens.push("active");
  writeTokenData(type, tokens);
  renderTokenButtons(type);
  if (config && config.child) {
    enforceTokenChildLimit(type);
  }
}

function restoreTokenFields() {
  Object.keys(tokenConfig).forEach(type => {
    const input = getTokenInput(type);
    if (input && (!input.value || input.value.trim() === "")) {
      input.value = "[]";
    }
  });
  Object.keys(tokenConfig).forEach(type => {
    renderTokenButtons(type);
  });
  enforceTokenChildLimit("fate");
  enforceTokenChildLimit("resilience");
}

function resetTokenFields() {
  Object.keys(tokenConfig).forEach(type => {
    const input = getTokenInput(type);
    if (input) {
      input.value = "[]";
    }
  });
  restoreTokenFields();
}

function refreshChildTokens() {
  ["luck", "resolve"].forEach(type => {
    const tokens = readTokenData(type);
    if (!tokens.length) return;
    const refreshed = tokens.map(() => "active");
    if (JSON.stringify(tokens) !== JSON.stringify(refreshed)) {
      writeTokenData(type, refreshed);
      renderTokenButtons(type);
    } else {
      renderTokenButtons(type);
    }
  });
}

function initTokenFields() {
  document.querySelectorAll("[data-token-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.tokenAdd;
      addToken(type);
    });
  });
  document.querySelectorAll("[data-token-refresh]").forEach(btn => {
    btn.addEventListener("click", () => {
      refreshChildTokens();
    });
  });
  restoreTokenFields();
}

function prepareTokenFieldForPdf(field) {
  const iconsContainer = field.querySelector(".token-field__icons");
  if (!iconsContainer) return;
  const tokens = Array.from(iconsContainer.querySelectorAll(".token-icon"));
  const summary = document.createElement("div");
  summary.className = "token-field__summary";
  if (tokens.length === 0) {
    summary.textContent = "–";
  } else {
    tokens.forEach(token => {
      const span = document.createElement("span");
      span.textContent = token.dataset.tokenState === "spent" ? TOKEN_SPENT_SYMBOL : TOKEN_ACTIVE_SYMBOL;
      summary.appendChild(span);
    });
  }
  iconsContainer.replaceWith(summary);
  const addBtn = field.querySelector(".token-field__add");
  if (addBtn) addBtn.remove();
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
    "lp-status-table",
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
    "lp-status-table",
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

  restoreTokenFields();
  updateAttributes();
  restoreMarkers();
  ensureInitialRows();
  updateCharacterDisplay();
  updateExperienceView();
}

// =========================
// ➕ Dynamische Tabellen – Initiale Zeilen
// =========================
function ensureInitialRows() {
  [
    "lp-status-table",
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
    "lp-status-table",
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

  resetTokenFields();

  ensureInitialRows();
  updateAttributes();
}

// Aktuellen Charakter exportieren
function exportCharacterData() {
  if (!currentCharacter) return;
  saveState();
  const state = JSON.parse(localStorage.getItem('state-' + currentCharacter) || '{}');
  const data = { id: currentCharacter, state };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${currentCharacter}.json`;
  a.click();
}

function replaceFormElementForPdf(el) {
  if (el.type === "hidden") {
    el.remove();
    return;
  }

  let value = "";
  if (el.tagName === "SELECT") {
    const selected = el.options[el.selectedIndex] || null;
    value = selected ? selected.text : el.value;
  } else if (el.type === "checkbox" || el.type === "radio") {
    value = el.checked ? t('yes') : t('no');
  } else {
    value = el.value;
  }

  const normalized = typeof value === "string" ? value : String(value ?? "");
  if (el.tagName === "TEXTAREA") {
    const div = document.createElement("div");
    div.className = "export-multiline";
    if (normalized.trim() === "") {
      div.textContent = "–";
    } else {
      div.innerHTML = escapeHtml(normalized).replace(/\n/g, "<br>");
    }
    el.replaceWith(div);
    return;
  }

  const span = document.createElement("span");
  span.className = "export-value";
  span.textContent = normalized.trim() === "" ? "–" : normalized;
  el.replaceWith(span);
}

function removeDeleteColumns(table) {
  const indexes = new Set();
  Array.from(table.rows).forEach(row => {
    Array.from(row.cells).forEach((cell, idx) => {
      if (cell.classList && cell.classList.contains('delete-col')) {
        indexes.add(idx);
      }
    });
  });
  const sorted = Array.from(indexes).sort((a, b) => b - a);
  sorted.forEach(index => {
    Array.from(table.rows).forEach(row => {
      if (row.cells[index]) {
        row.deleteCell(index);
      }
    });
  });
}

function prepareSectionForPdf(section, exportFullExperience) {
  const clone = section.cloneNode(true);
  clone.classList.remove('collapsed');
  clone.removeAttribute('data-collapsed');
  clone.classList.add('pdf-section');

  const header = clone.querySelector('h2');
  if (header) {
    const arrow = header.querySelector('.section-arrow');
    if (arrow) arrow.remove();
    header.textContent = header.textContent.replace(/^[▼▶]\s*/, '').trim();
  }

  const finanzenToggle = clone.querySelector('#finanzen-toggle');
  if (finanzenToggle) {
    const arrow = finanzenToggle.querySelector('#finanzen-arrow');
    if (arrow) arrow.remove();
    finanzenToggle.textContent = t('finances_expand');
  }

  const finanzenExtra = clone.querySelector('#finanzen-extra');
  if (finanzenExtra) {
    finanzenExtra.style.removeProperty('display');
  }

  const experienceToggle = clone.querySelector('#exp-toggle');
  if (experienceToggle) {
    const container = experienceToggle.closest('div');
    if (container) {
      container.innerHTML = `<strong>${t('experience_mode_label')}:</strong> ${exportFullExperience ? t('full') : t('simple')}`;
      container.style.textAlign = 'left';
    }
  }

  const simpleBlock = clone.querySelector('#exp-simple');
  const fullBlock = clone.querySelector('#exp-full');
  if (simpleBlock || fullBlock) {
    if (exportFullExperience) {
      if (simpleBlock) simpleBlock.remove();
      if (fullBlock) fullBlock.style.removeProperty('display');
    } else {
      if (fullBlock) fullBlock.remove();
      if (simpleBlock) simpleBlock.style.removeProperty('display');
    }
  }

  clone.querySelectorAll('.armor-visual, .table-gap').forEach(el => el.remove());

  clone.querySelectorAll('.section-divider').forEach(div => div.remove());
  clone.querySelectorAll('[style]').forEach(el => {
    if (el.style.display === 'none') {
      el.style.removeProperty('display');
    }
  });
  clone.querySelectorAll('.subsection').forEach(div => div.classList.add('pdf-subsection'));

  clone.querySelectorAll('table').forEach(table => removeDeleteColumns(table));

  clone.querySelectorAll('.token-field').forEach(field => prepareTokenFieldForPdf(field));

  clone.querySelectorAll('input, textarea, select').forEach(el => replaceFormElementForPdf(el));
  clone.querySelectorAll('button, .switch, .slider, .icon-btn').forEach(el => el.remove());

  clone.querySelectorAll('[id]').forEach(el => {
    if (el.id !== clone.id) {
      el.removeAttribute('id');
    }
  });

  return clone;
}

function exportCharacterPdf() {
  if (!currentCharacter) return;
  saveState();

  const exportFullExperience = !!document.getElementById('exp-toggle')?.checked;
  const sectionsToExport = Array.from(document.querySelectorAll('#main-content > section'))
    .filter(sec => sec.id !== 'gamedeck');

  const preparedSections = sectionsToExport.map(sec => prepareSectionForPdf(sec, exportFullExperience));

  const charName = (document.getElementById('char-name')?.value || '').trim();
  const generatedAt = new Date().toLocaleString();

  const metaParts = [];
  if (charName) {
    metaParts.push(`<div><strong>${t('export_character_name')}:</strong> ${escapeHtml(charName)}</div>`);
  }
  metaParts.push(`<div><strong>${t('export_character_id')}:</strong> ${escapeHtml(currentCharacter)}</div>`);
  metaParts.push(`<div><strong>${t('export_generated_at')}:</strong> ${escapeHtml(generatedAt)}</div>`);

  const styles = `
    body { font-family: 'Times New Roman', Georgia, serif; color: #111; margin: 0; padding: 32px; background: #fff; }
    .pdf-header { text-align: center; margin-bottom: 24px; }
    .pdf-header h1 { font-family: 'Times New Roman', Georgia, serif; font-size: 32px; margin: 0 0 8px; }
    .pdf-meta { font-size: 12px; display: flex; flex-direction: column; gap: 4px; align-items: center; }
    section.pdf-section { margin-bottom: 28px; page-break-inside: avoid; }
    section.pdf-section h2 { font-size: 20px; margin: 0 0 12px; border-bottom: 2px solid #333; padding-bottom: 6px; }
    section.pdf-section h3 { font-size: 16px; margin: 16px 0 8px; }
    section.pdf-section table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    section.pdf-section th, section.pdf-section td { border: 1px solid #999; padding: 6px 8px; font-size: 12px; vertical-align: top; }
    section.pdf-section th { background: #f0f0f0; font-weight: 600; }
    .dual-table-wrapper { display: flex; gap: 12px; }
    .dual-table-wrapper > div { flex: 1; }
    .export-value { display: inline-block; min-width: 0.5em; }
    .export-multiline { white-space: pre-wrap; }
    .pdf-subsection { margin-bottom: 12px; }
    .pdf-subsection table { margin-bottom: 0; }
    .pdf-section .marker-icon { margin-right: 4px; }
    .coin { display: inline-block; width: 0.8em; height: 0.8em; border-radius: 50%; margin-right: 4px; }
    .coin.gold { background: #d4af37; }
    .coin.silver { background: #c0c0c0; }
    .coin.copper { background: #b87333; }
  `;

  const sectionsHtml = preparedSections.map(sec => sec.outerHTML).join('');
  const docTitle = `${t('export_pdf_title')} - ${charName || currentCharacter}`;

  const html = `<!DOCTYPE html>
  <html lang="${document.documentElement.lang || 'de'}">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(docTitle)}</title>
      <style>${styles}</style>
    </head>
    <body>
      <header class="pdf-header">
        <h1>${escapeHtml(t('character_sheet'))}</h1>
        <div class="pdf-meta">${metaParts.join('')}</div>
      </header>
      ${sectionsHtml}
    </body>
  </html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert(t('export_popup_blocked'));
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  const triggerPrint = () => {
    printWindow.focus();
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (err) {
        console.error('Failed to trigger print dialog', err);
      }
    }, 50);
  };

  if (printWindow.document.readyState === 'complete' || printWindow.document.readyState === 'interactive') {
    triggerPrint();
  } else {
    printWindow.document.addEventListener('DOMContentLoaded', triggerPrint, { once: true });
  }

  printWindow.addEventListener('afterprint', () => {
    printWindow.close();
  });
}

function openExportPopup() {
  if (!currentCharacter) {
    alert(t('choose_character'));
    return;
  }

  const existing = document.getElementById('export-popup');
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'export-popup';
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>${t('export')}</h2>
      <p>${t('export_choose_action')}</p>
      <div class="popup-buttons">
        <button id="export-json-btn">${t('export_json_button')}</button>
      </div>
      <div class="popup-buttons">
        <button id="export-pdf-btn">${t('export_pdf_button')}</button>
      </div>
      <div class="popup-buttons">
        <button id="export-cancel">${t('cancel')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      close();
    }
  }

  document.addEventListener('keydown', onKeyDown);

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('#export-cancel').addEventListener('click', close);
  overlay.querySelector('#export-json-btn').addEventListener('click', () => {
    close();
    exportCharacterData();
  });
  overlay.querySelector('#export-pdf-btn').addEventListener('click', () => {
    close();
    exportCharacterPdf();
  });

  const jsonBtn = overlay.querySelector('#export-json-btn');
  if (jsonBtn) {
    jsonBtn.focus();
  }
}

// Charakter importieren und laden
function importCharacters(files) {
  const file = files[0];
  if (!file) return;
  saveState();
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.id && data.state) {
        saveCharacter(data.id);
        localStorage.setItem('state-' + data.id, JSON.stringify(data.state));
        loadCharacterList();
        currentCharacter = data.id;
        updateCharacterDisplay();
        loadState();
      } else {
        throw new Error('Invalid');
      }
    } catch (err) {
      alert(t('import_failed'));
    }
  };
  reader.readAsText(file);
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

document.addEventListener('input', e => {
  if (e.target.tagName === 'TEXTAREA') {
    autoResize(e.target);
  }
});

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
      alert(t('max_cross_warning'));
      return;
    }
  } else if ([2,3,4].includes(val)) {
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
  markerPopup.className = 'marker-select';
  markerPopup.innerHTML = `
    <div class="marker-row">
      <button class="icon-btn" data-val="1">${attrSymbols[1]}</button>
      <button class="icon-btn" data-val="2">${attrSymbols[2]}</button>
      <button class="icon-btn" data-val="3">${attrSymbols[3]}</button>
      <button class="icon-btn" data-val="4">${attrSymbols[4]}</button>
    </div>`;
  const rect = th.getBoundingClientRect();
  markerPopup.style.left = '50%';
  markerPopup.style.top = `${window.scrollY + rect.bottom}px`;
  markerPopup.style.transform = 'translateX(-50%)';
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
  const row = cell.closest('tr');
  const table = row ? row.closest('table') : null;
  if (table && ['grupp-table','talent-table','waffen-table','ruestung-table','ausruestung-table'].includes(table.id)) {
    const nameField = cell.querySelector('input[type="text"], textarea');
    if (!nameField || nameField.value.trim() === '') return;
  }
  const icon = cell.querySelector('.marker-icon');
  if (hid.value === "1") {
    hid.value = "0";
    if (icon) icon.textContent = "";
    row.classList.remove('line-marked');
  } else {
    hid.value = "1";
    if (icon) icon.textContent = attrSymbols[1];
    row.classList.add('line-marked');
  }
  row.querySelectorAll('textarea').forEach(autoResize);
  saveState();
  if (table && (table.id === 'waffen-table' || table.id === 'ruestung-table' || table.id === 'ausruestung-table')) {
    if (table.id === 'ruestung-table') updateRuestung();
    updateTraglast();
  }
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
    const row = cell.closest('tr');
    const table = row ? row.closest('table') : null;
    if (hid.value === "1") {
      if (table && (table.id === 'grupp-table' || table.id === 'talent-table')) {
        const nameField = cell.querySelector('input[type="text"], textarea');
        if (!nameField || nameField.value.trim() === '') {
          hid.value = "0";
        }
      }
    }
    if (hid.value === "1") {
      if (icon) icon.textContent = attrSymbols[1];
      row.classList.add('line-marked');
    } else {
      if (icon) icon.textContent = "";
      row.classList.remove('line-marked');
    }
    row.querySelectorAll('textarea').forEach(autoResize);
  });
  updateRuestung();
  updateTraglast();
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

document.addEventListener("input", e => {
  const cell = e.target.closest('td[data-marker]');
  if (!cell || !e.target.matches('input[type="text"], textarea')) return;
  if (e.target.value.trim() !== "") return;
  const hid = cell.querySelector('input[type="hidden"]');
  const icon = cell.querySelector('.marker-icon');
  const row = cell.closest('tr');
  if (hid && hid.value !== "0") {
    hid.value = "0";
    if (icon) icon.textContent = "";
    if (row) row.classList.remove('line-marked');
    saveState();
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
  renderGameDeckComponent();
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
  renderGameDeckComponent();
}

function autoAddRow(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = Array.from(table.rows).slice(1); // ohne Kopfzeile
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
        table.deleteRow(i + 1); // +1 für Kopfzeile
      }
    } else {
      break;
    }
  }
}

function addRow(tableId) {
  const table = document.getElementById(tableId); // Ziel-Tabelle
  const row = table.insertRow(-1); // neue Zeile am Ende

  if (tableId === "grupp-table") {
    // Vorlage für gruppierte Fähigkeiten
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
    // Zeile für Talente
    row.innerHTML = `
      <td data-marker><span class="marker-icon"></span><input type="hidden" value="0"><textarea rows="1"></textarea></td>
      <td class="wsg"><input type="number"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('talent-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "waffen-table") {
    // Waffenliste
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
    // Dynamische Schuldenliste
    row.innerHTML = `
      <td><input type="number" max="0"></td>
      <td><input type="number" max="0"></td>
      <td><input type="number" max="0"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('schulden-table'); saveState(); updateVermoegen();">❌</button></td>
    `;
  }
  else if (tableId === "spar-table") {
    // Dynamische Sparvermögenliste
    row.innerHTML = `
      <td><input type="number" min="0"></td>
      <td><input type="number" min="0"></td>
      <td><input type="number" min="0"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('spar-table'); saveState(); updateVermoegen();">❌</button></td>
    `;
  }
  else if (tableId === "lp-status-table") {
    // Lebenspunkt-Statusübersicht
    row.innerHTML = `
      <td><textarea rows="1"></textarea></td>
      <td><input type="number" min="0"></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('lp-status-table'); saveState(); updateLebenspunkte();">❌</button></td>
    `;
  }
  else if (tableId === "ruestung-table") {
    // Rüstungsstücke
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
    // Allgemeine Ausrüstung
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
    // Zauber oder Gebete
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
    // Mutationen mit Kategorie
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
    // Einträge für psychologische Effekte
    row.innerHTML = `
      <td><textarea rows="1"></textarea></td>
      <td class="text-left"><textarea></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('psychologie-table'); saveState(); updateLebenspunkte(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }
  else if (tableId === "exp-table") {
    // Erfahrungspunkte-Modus "Voll"
    row.innerHTML = `
      <td><input type="number"></td>
      <td class="text-left"><textarea rows="1"></textarea></td>
      <td class="delete-col"><button class="delete-row" onclick="this.parentElement.parentElement.remove(); autoAddRow('exp-table'); saveState(); updateLebenspunkte(); updateErfahrung(); updateGruppierteFaehigkeiten();">❌</button></td>
    `;
  }

  const first = row.cells[0]?.querySelector('input:not([type="hidden"]), textarea, select');
  if (first) {
    first.addEventListener('input', () => { autoAddRow(tableId); saveState(); updateRuestung(); updateTraglast(); });
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
// Ähnlichkeitsberechnung per Levenshtein-Distanz
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  matrix[0] = Array.from({ length: a.length + 1 }, (_, j) => j);
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const distance = levenshtein(a, b);
  return 1 - distance / maxLen;
}

// Ermittelt die Stufe des Talents "Robustheit"/"Hardy" (Ähnlichkeit > 90%).
// Wenn das Talent existiert, zählt mindestens eine Stufe.
function checkTalentEffects() {
  let hardyLevel = 0;
  document.querySelectorAll("#talent-table tr").forEach((row, idx) => {
    if (idx === 0) return; // Kopfzeile überspringen
    const nameField = row.cells[0].querySelector('input[type="text"], textarea');
    if (!nameField) return;
    const name = nameField.value.toLowerCase().trim();
    const simRob = similarity(name, "robustheit");
    const simHardy = similarity(name, "hardy");
    if (simRob >= 0.9 || simHardy >= 0.9) {
      const lvlInput = row.cells[1].querySelector("input");
      let lvl = parseInt(lvlInput.value);
      if (isNaN(lvl) || lvl < 1) lvl = 1; // mindestens Stufe 1
      hardyLevel += lvl; // Stufen addieren (Talent kann mehrfach vorkommen)
    }
  });
  return hardyLevel;
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

  const hardyLevel = checkTalentEffects();
  const robust = wib * hardyLevel; // Robustheit: WI-Bonus mal Talentstufe

  document.getElementById("lp-stb").value = stb;
  document.getElementById("lp-wib").value = wib;
  document.getElementById("lp-wkb").value = wkb;
  document.getElementById("lp-robustheit").value = hardyLevel > 0 ? robust : "";

  const gesamt = stb + wib + wkb + (hardyLevel > 0 ? robust : 0);
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
    "Rechtes Bein": 0,
    "Schild": 0
  }; // Sammeln der besten Rüstungswerte pro Zone

  document.querySelectorAll("#ruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const zoneSel = row.cells[1].querySelector("select");
    const zone = zoneSel ? zoneSel.value : "";
    const rp = parseInt(row.cells[2].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    if (eq && zones.hasOwnProperty(zone)) zones[zone] += rp; // Werte je Zone addieren
  });

  document.getElementById("rp-kopf").value = zones["Kopf"] || 0;
  document.getElementById("rp-larm").value = zones["Linker Arm"] || 0;
  document.getElementById("rp-rarm").value = zones["Rechter Arm"] || 0;
  document.getElementById("rp-brust").value = zones["Brust"] || 0;
  document.getElementById("rp-lbein").value = zones["Linkes Bein"] || 0;
  document.getElementById("rp-rbein").value = zones["Rechtes Bein"] || 0;

  document.getElementById("rp-box-kopf").textContent = zones["Kopf"] || 0;
  document.getElementById("rp-box-larm").textContent = zones["Linker Arm"] || 0;
  document.getElementById("rp-box-rarm").textContent = zones["Rechter Arm"] || 0;
  document.getElementById("rp-box-brust").textContent = zones["Brust"] || 0;
  document.getElementById("rp-box-lbein").textContent = zones["Linkes Bein"] || 0;
  document.getElementById("rp-box-rbein").textContent = zones["Rechtes Bein"] || 0;
  document.getElementById("rp-box-schild").textContent = zones["Schild"] || 0;
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
    const tp = parseInt(row.cells[2].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    waffenTP += Math.max(0, tp - (eq ? 1 : 0));
  });

  // Gewicht der Rüstungsteile
  document.querySelectorAll("#ruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const tp = parseInt(row.cells[3].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    ruestungTP += Math.max(0, tp - (eq ? 1 : 0));
  });

  // Ausrüstung: Menge * Tragpunkte
  document.querySelectorAll("#ausruestung-table tr").forEach((row, idx) => {
    if (idx === 0) return;
    const menge = parseInt(row.cells[1].querySelector("input").value) || 0;
    const tp = parseInt(row.cells[2].querySelector("input").value) || 0;
    const eq = row.cells[0].querySelector("input[type='hidden']")?.value === "1";
    const weight = menge * tp;
    ausrTP += Math.max(0, weight - (eq ? 1 : 0));
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
function updateExperienceView() {
  const toggle = document.getElementById("exp-toggle");
  const simpleBlock = document.getElementById("exp-simple");
  const fullBlock = document.getElementById("exp-full");
  if (!toggle || !simpleBlock || !fullBlock) return;

  if (toggle.checked) {
    simpleBlock.style.display = "none";
    fullBlock.style.display = "block";
  } else {
    simpleBlock.style.display = "block";
    fullBlock.style.display = "none";
  }

  updateErfahrung();
}

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
      row.classList.toggle("negative", val < 0);
      row.classList.toggle("positive", val > 0);
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
      alert(t('current_negative_warning'));
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
  initTokenFields();
  renderGameDeckComponent();
  initSectionToggles();
  initFinanzenToggle();
  initCharacterManagement();

  document.addEventListener("input", e => {
    if (!e.target.matches("input, textarea, select")) {
      return;
    }
    const gameDeckRoot = document.getElementById("game-deck-root");
    if (gameDeckRoot && gameDeckRoot.contains(e.target)) {
      return;
    }
    updateAttributes();
  });

  const toggle = document.getElementById("exp-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      updateExperienceView();
      saveState();
    });
  }

  loadState();
  updateExperienceView();
  if (!currentCharacter) {
    ensureInitialRows();
    updateAttributes();
  }
}
