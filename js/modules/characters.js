// Verwaltung mehrerer Charaktere inkl. Import/Export
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
  const newBtn = document.getElementById("new-character");
  const delBtn = document.getElementById("delete-character");
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

  newBtn.addEventListener("click", () => {
    if (currentCharacter) {
      promptNewCharacter();
    } else {
      promptNewCharacter(true);
    }
  });

  delBtn.addEventListener("click", () => {
    if (!currentCharacter) return;
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
          loadState();
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
