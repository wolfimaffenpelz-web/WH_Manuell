// Marker- und Symbolverwaltung
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
    const val = parseInt(hid.value, 10) || 0;
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
      const val = parseInt(btn.dataset.val, 10);
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
    const val = parseInt(hid.value, 10) || 0;
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
