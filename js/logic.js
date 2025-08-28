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
