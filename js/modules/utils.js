// Allgemeine Hilfsfunktionen
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

function rgbToHex(rgb) {
  const str = rgb.trim();
  if (str.startsWith("#")) return str;
  const res = str.match(/\d+/g);
  if (!res) return "#000000";
  return "#" + res.map(x => parseInt(x, 10).toString(16).padStart(2, "0")).join("");
}
