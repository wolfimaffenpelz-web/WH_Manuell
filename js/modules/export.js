// Export von Charakterdaten und PDF-Erstellung
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
