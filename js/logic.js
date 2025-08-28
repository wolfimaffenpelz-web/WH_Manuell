// =========================
// Rendering-Funktion (vollständig für alle Typen)
// =========================
function renderSections() {
  const main = document.getElementById("main-content");
  main.innerHTML = "";

  sections.forEach((sec, idx) => {
    const sectionEl = document.createElement("section");
    sectionEl.id = sec.id;

    // Titel
    const title = document.createElement("h2");
    title.textContent = t(sec.id);
    sectionEl.appendChild(title);

    // Flexbox (z. B. Grunddaten)
    if (sec.type === "flex") {
      sec.groups.forEach(group => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "flex-group";

        group.fields.forEach(f => {
          const fieldDiv = document.createElement("div");
          fieldDiv.className = "flex-field";

          const label = document.createElement("label");
          label.textContent = f.label;
          label.setAttribute("for", f.id);

          const input = document.createElement("input");
          input.type = f.type || "text";
          input.id = f.id;

          fieldDiv.appendChild(label);
          fieldDiv.appendChild(input);
          groupDiv.appendChild(fieldDiv);
        });

        sectionEl.appendChild(groupDiv);
      });
    }

    // Normale Tabellen
    if (sec.type === "table") {
      const table = document.createElement("table");
      if (sec.width === "full") table.className = "fullwidth";
      if (sec.width === "ninety") table.className = "ninety";

      const thead = document.createElement("thead");
      const trHead = document.createElement("tr");
      sec.headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      sec.rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          if (typeof cell === "string") {
            td.textContent = cell;
          } else {
            let el;
            if (cell.textarea) {
              el = document.createElement("textarea");
            } else {
              el = document.createElement("input");
              el.type = cell.type || "text";
              if (cell.readonly) el.readOnly = true;
              if (cell.maxLength) el.maxLength = cell.maxLength;
            }
            if (cell.id) el.id = cell.id;
            td.appendChild(el);
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      sectionEl.appendChild(table);
    }

    // Dynamische Tabellen
    if (sec.type === "dynamic-table") {
      const table = document.createElement("table");
      table.setAttribute("data-dynamic", "true");
      table.setAttribute("data-id", sec.id);
      table.className = "fullwidth";

      const thead = document.createElement("thead");
      const trHead = document.createElement("tr");
      sec.headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      table.appendChild(tbody);
      sectionEl.appendChild(table);

      // Button zum Hinzufügen
      const btn = document.createElement("button");
      btn.textContent = "➕ Zeile hinzufügen";
      btn.onclick = () => {
        const tr = document.createElement("tr");
        sec.headers.forEach(h => {
          const td = document.createElement("td");

          if (h === "🗑") {
            const delBtn = document.createElement("button");
            delBtn.textContent = "❌";
            delBtn.onclick = () => tr.remove();
            td.appendChild(delBtn);
          } else if (sec.dropdowns && sec.dropdowns[h]) {
            const select = document.createElement("select");
            select.dataset.key = h;
            sec.dropdowns[h].forEach(opt => {
              const option = document.createElement("option");
              option.value = opt;
              option.textContent = opt;
              select.appendChild(option);
            });
            td.appendChild(select);
          } else if (h === "Notizen" || h === "Effekt" || h === "Qualitäten" || h === "Kommentar") {
            const textarea = document.createElement("textarea");
            textarea.dataset.key = h;
            td.appendChild(textarea);
          } else {
            const input = document.createElement("input");
            input.type = "text";
            input.dataset.key = h;
            td.appendChild(input);
          }

          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      };
      sectionEl.appendChild(btn);
    }

    // Komplexe Tabellen (z. B. Erfahrung Voll)
    if (sec.type === "complex") {
      sec.parts.forEach(part => {
        if (part.type === "table") {
          const table = document.createElement("table");
          table.className = "fullwidth";

          const thead = document.createElement("thead");
          const trHead = document.createElement("tr");
          part.headers.forEach(h => {
            const th = document.createElement("th");
            th.textContent = h;
            trHead.appendChild(th);
          });
          thead.appendChild(trHead);
          table.appendChild(thead);

          const tbody = document.createElement("tbody");
          part.rows.forEach(row => {
            const tr = document.createElement("tr");
            row.forEach(cell => {
              const td = document.createElement("td");
              let el = document.createElement("input");
              el.type = cell.type || "text";
              if (cell.id) el.id = cell.id;
              if (cell.readonly) el.readOnly = true;
              td.appendChild(el);
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
          sectionEl.appendChild(table);
        }

        if (part.type === "dynamic-table") {
          const table = document.createElement("table");
          table.setAttribute("data-dynamic", "true");
          table.setAttribute("data-id", sec.id + "_detail");
          table.className = "fullwidth";

          const thead = document.createElement("thead");
          const trHead = document.createElement("tr");
          part.headers.forEach(h => {
            const th = document.createElement("th");
            th.textContent = h;
            trHead.appendChild(th);
          });
          thead.appendChild(trHead);
          table.appendChild(thead);

          const tbody = document.createElement("tbody");
          table.appendChild(tbody);
          sectionEl.appendChild(table);

          const btn = document.createElement("button");
          btn.textContent = "➕ Eintrag hinzufügen";
          btn.onclick = () => {
            const tr = document.createElement("tr");
            part.headers.forEach(h => {
              const td = document.createElement("td");

              if (h === "🗑") {
                const delBtn = document.createElement("button");
                delBtn.textContent = "❌";
                delBtn.onclick = () => tr.remove();
                td.appendChild(delBtn);
              } else if (h === "Kommentar") {
                const textarea = document.createElement("textarea");
                textarea.dataset.key = h;
                td.appendChild(textarea);
              } else {
                const input = document.createElement("input");
                input.type = "text";
                input.dataset.key = h;
                td.appendChild(input);
              }

              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          };
          sectionEl.appendChild(btn);
        }
      });
    }

    main.appendChild(sectionEl);

    // Segment-Trennlinie außer nach der letzten Section
    if (idx < sections.length - 1) {
      const divider = document.createElement("div");
      divider.className = "segment-divider";
      main.appendChild(divider);
    }
  });
}
// =========================
// Speicher- und Ladelogik
// =========================

// Daten speichern
function saveData() {
  const data = {};

  // Alle Eingabefelder
  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.id) {
      if (el.type === "checkbox") {
        data[el.id] = el.checked;
      } else {
        data[el.id] = el.value;
      }
    }
  });

  // Dynamische Tabellen
  document.querySelectorAll("table[data-dynamic]").forEach(table => {
    const id = table.getAttribute("data-id");
    const rows = [];
    table.querySelectorAll("tbody tr").forEach(tr => {
      const rowData = {};
      tr.querySelectorAll("input, textarea, select").forEach(el => {
        if (el.dataset.key) {
          rowData[el.dataset.key] = el.value;
        }
      });
      rows.push(rowData);
    });
    data[id] = rows;
  });

  localStorage.setItem("charData", JSON.stringify(data));
}

// Daten laden
function loadData() {
  const raw = localStorage.getItem("charData");
  if (!raw) return;
  const data = JSON.parse(raw);

  // Eingabefelder
  Object.keys(data).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.type === "checkbox") {
        el.checked = data[key];
      } else {
        el.value = data[key];
      }
    }
  });

  // Dynamische Tabellen
  document.querySelectorAll("table[data-dynamic]").forEach(table => {
    const id = table.getAttribute("data-id");
    if (!data[id]) return;
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    data[id].forEach(row => {
      const tr = document.createElement("tr");
      Object.keys(row).forEach(key => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.value = row[key];
        input.dataset.key = key;
        td.appendChild(input);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  });
}

// Auto-Speichern bei Änderung
document.addEventListener("input", () => saveData());
document.addEventListener("change", () => saveData());

// =========================
// Hilfsfunktionen
// =========================

// Zahl auslesen mit Fallback
function getNum(id) {
  const el = document.getElementById(id);
  return el ? parseInt(el.value || "0") : 0;
}

// Wert setzen
function setNum(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}
// =========================
// Attribute-Berechnung
// =========================

function updateAttributes() {
  const attrs = ["ST", "GE", "GS", "IN", "WI", "WK", "CH", "FF", "LP", "KP"];

  attrs.forEach(attr => {
    const start = getNum(`attr_${attr}_start`);
    const steig = getNum(`attr_${attr}_steig`);
    const total = start + steig;
    setNum(`attr_${attr}_total`, total);
  });

  // Abhängigkeiten triggern
  updateSkills();
  updateGroupedSkills();
  updateCorruption();
  updateWounds();
}

// =========================
// Grundfähigkeiten berechnen
// =========================

function updateSkills() {
  const rows = document.querySelectorAll("#grundskills tbody tr");
  rows.forEach(tr => {
    const cells = tr.querySelectorAll("td");
    const attr = cells[1].textContent;
    const value = getNum(`attr_${attr}_total`);
    const steig = parseInt(cells[3].querySelector("input")?.value || "0");
    const gesamt = value + steig;
    cells[2].querySelector("input").value = value;
    cells[4].querySelector("input").value = gesamt;
  });
}

// =========================
// Gruppierte Fähigkeiten berechnen
// =========================

function updateGroupedSkills() {
  const rows = document.querySelectorAll("#groupskills tbody tr");
  rows.forEach(tr => {
    const inputs = tr.querySelectorAll("input, select");
    let attr = "", steig = 0;
    inputs.forEach(el => {
      if (el.dataset.key === "attr") attr = el.value;
      if (el.dataset.key === "steigerung") steig = parseInt(el.value || "0");
    });
    const attrValue = getNum(`attr_${attr}_total`);
    const total = attrValue + steig;
    inputs.forEach(el => {
      if (el.dataset.key === "attrValue") el.value = attrValue;
      if (el.dataset.key === "gesamt") el.value = total;
    });
  });
}
// =========================
// Lebenspunkte (mit Robustheit)
// =========================

function updateWounds() {
  const ST = getNum("attr_ST_total");
  const WI = getNum("attr_WI_total");
  const WK = getNum("attr_WK_total");

  const stb = Math.floor(ST / 10);
  const wib = Math.floor(WI / 10);
  const wkb = Math.floor(WK / 10) * 2;

  // Robustheit prüfen (Talent Hardy oder Robustheit vorhanden?)
  let robustheit = 0;
  const talents = (window.savedTalents || []).map(t => t.name?.toLowerCase());
  if (talents.includes("robustheit") || talents.includes("hardy")) {
    robustheit = wib;
  }

  const total = stb + wib + wkb + robustheit;

  setNum("lp_stb", stb);
  setNum("lp_wib", wib);
  setNum("lp_wkb", wkb);
  setNum("lp_robustheit", robustheit);
  setNum("lp_total", total);
}

// =========================
// Korruption
// =========================

function updateCorruption() {
  const WI = getNum("attr_WI_total");
  const WK = getNum("attr_WK_total");
  const max = Math.floor(WI / 10) + Math.floor(WK / 10);

  setNum("corruption_max", max);

  const current = getNum("corruption_current");
  const field = document.getElementById("corruption_current");

  if (current > max) {
    field.classList.add("over-max");
  } else {
    field.classList.remove("over-max");
  }

  // Block negative Werte
  if (current < 0) {
    field.value = 0;
  }
}

// =========================
// Traglast
// =========================

function updateEncumbrance() {
  const ST = getNum("attr_ST_total");
  const WI = getNum("attr_WI_total");
  const maxTP = Math.floor(ST / 10) + Math.floor(WI / 10);

  let totalTP = 0;

  // Waffen
  document.querySelectorAll("#weapons tbody tr").forEach(tr => {
    const tp = parseInt(tr.querySelector("[data-key='TP']")?.value || "0");
    totalTP += tp;
  });

  // Rüstung
  document.querySelectorAll("#armor tbody tr").forEach(tr => {
    const tp = parseInt(tr.querySelector("[data-key='TP']")?.value || "0");
    totalTP += tp;
  });

  // Ausrüstung
  document.querySelectorAll("#equipment tbody tr").forEach(tr => {
    const qty = parseInt(tr.querySelector("[data-key='Menge']")?.value || "0");
    const tp = parseInt(tr.querySelector("[data-key='TP']")?.value || "0");
    totalTP += qty * tp;
  });

  // Ausgabe
  const maxEl = document.getElementById("encumbrance_max");
  const totalEl = document.getElementById("encumbrance_total");

  if (maxEl && totalEl) {
    maxEl.value = maxTP;
    totalEl.value = totalTP;

    if (totalTP > maxTP) {
      totalEl.classList.add("over-max");
    } else {
      totalEl.classList.remove("over-max");
    }
  }
}
// =========================
// Erfahrung (Einfach)
// =========================
function updateExperienceSimple() {
  const current = getNum("exp_simple_current");
  const spent = getNum("exp_simple_spent");
  const total = current + spent;

  setNum("exp_simple_total", total);
}

// =========================
// Erfahrung (Voll)
// =========================
let wasNegativeExp = false;

function updateExperienceFull() {
  const rows = document.querySelectorAll("#experience_full tbody tr");
  let current = 0;
  let spent = 0;

  rows.forEach(tr => {
    const inputs = tr.querySelectorAll("input");
    if (inputs.length >= 2) {
      const value = parseInt(inputs[0].value || "0");
      if (value > 0) {
        current += value;
      } else if (value < 0) {
        spent += Math.abs(value);
      }
    }
  });

  const total = current + spent;

  setNum("exp_full_current", current);
  setNum("exp_full_spent", spent);
  setNum("exp_full_total", total);

  // Warnung bei negativem "Aktuell"
  const currentField = document.getElementById("exp_full_current");
  if (current < 0 && !wasNegativeExp) {
    showPopup("Achtung: Erfahrung unter 0 nicht erlaubt!");
    wasNegativeExp = true;
  }
  if (current >= 0) {
    wasNegativeExp = false;
  }

  if (current < 0) {
    currentField.classList.add("over-max");
  } else {
    currentField.classList.remove("over-max");
  }
}

// =========================
// Talente (Hardy/Robustheit)
// =========================
function updateTalents() {
  const talents = [];
  document.querySelectorAll("#talents tbody tr").forEach(tr => {
    const name = tr.querySelector("[data-key='Name']")?.value || "";
    talents.push({ name });
  });
  window.savedTalents = talents;

  // Trigger Robustheit in Lebenspunkten
  updateWounds();
}
// =========================
// Popup (z. B. Erfahrung < 0)
// =========================
function showPopup(message) {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const box = document.createElement("div");
  box.className = "popup-box";

  const text = document.createElement("p");
  text.textContent = message;

  const btn = document.createElement("button");
  btn.textContent = "OK";
  btn.onclick = () => document.body.removeChild(overlay);

  box.appendChild(text);
  box.appendChild(btn);
  overlay.appendChild(box);

  document.body.appendChild(overlay);
}

// =========================
// Init-Funktion
// =========================
function initLogic() {
  loadData();

  // Erste Berechnungen
  updateAttributes();
  updateWounds();
  updateCorruption();
  updateEncumbrance();
  updateExperienceSimple();
  updateExperienceFull();
  updateTalents();

  // Events
  document.querySelectorAll("input, select, textarea").forEach(el => {
    el.addEventListener("input", () => {
      updateAttributes();
      updateWounds();
      updateCorruption();
      updateEncumbrance();
      updateExperienceSimple();
      updateExperienceFull();
      updateTalents();
      saveData();
    });
  });
}

// =========================
// Start
// =========================
window.addEventListener("load", initLogic);
