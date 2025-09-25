// Farb- und Schrift-Einstellungen
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
