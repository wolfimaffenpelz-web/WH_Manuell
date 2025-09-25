// Allgemeine UI-Verhalten wie Auto-Resize und Highlighting
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

document.addEventListener('input', e => {
  if (e.target.tagName === 'TEXTAREA') {
    autoResize(e.target);
  }
});

document.addEventListener("focusin", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    const table = e.target.closest("table");
    const cell = e.target.closest("td, th");
    const row = e.target.closest("tr");
    if (table && table.id === "attribute-table" && cell) {
      const idx = cell.cellIndex;
      table.querySelectorAll("tr").forEach(r => {
        const c = r.cells[idx];
        if (c) c.classList.add("active");
      });
    } else if (row) {
      row.classList.add("active");
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
