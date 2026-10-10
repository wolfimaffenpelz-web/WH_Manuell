/* Edition views share manual notes, but never share rule calculations. */
function renderEdition() {
  renderSections(activeEdition === '4e' ? sections : edition5Sections);
  initSectionToggles();
  document.getElementById('advance-step-control').hidden = activeEdition !== '5e';
  document.getElementById('exp-advance-step').value = activeEdition === '5e' ? '5' : '1';
  document.getElementById('exp-advance-step').addEventListener('change', saveState);
  initFinanzenToggle();
  initStatesSection();
  document.getElementById('exp-toggle').addEventListener('change', () => {
    syncExperienceMode(); updateErfahrung(); saveState();
  });
  document.getElementById('add-armor-button').addEventListener('click', openArmorDialog);
  document.getElementById('levelup-open').addEventListener('click', openLevelUpOverlay);
}

function initEditionManagement() {
  document.getElementById('edition-select').addEventListener('change', event => {
    const next = event.target.value;
    if (!saveState()) { event.target.value = activeEdition; return; }
    try {
      const id = characterStore.data.active[next] || characterStore.list(next)[0]?.id || null;
      characterStore.select(next, id);
      activeEdition = next; currentCharacter = id;
      renderEdition(); loadCharacterList(); loadState();
    } catch (error) { event.target.value = activeEdition; storageError(error); }
  });
  document.getElementById('retry-load').addEventListener('click', loadState);
  document.getElementById('recover-character').addEventListener('click', () => {
    if (!currentCharacter || !confirm(t('recover_confirm'))) return;
    try { characterStore.recover(currentCharacter); loadState(); }
    catch (error) { storageError(error); }
  });
  document.getElementById('transfer-character').addEventListener('click', () => {
    if (!currentCharacter || activeEdition !== '4e' || !saveState()) return;
    const sourceId = currentCharacter;
    const conversion = WFRP5Rules.convertState(characterStore.get(sourceId).state);
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div class="overlay-content">
      <h2>${t('transfer_preview')}</h2><p>${escapeHtml(characterName())}</p>
      <p>${t('transfer_ready')}</p><p>${t('transfer_all_values')}</p>
      <p>${t('transfer_recalculate')}</p><p>${t('transfer_review')}</p>
      <ul>${conversion.adjustments.map(item => `<li>${escapeHtml(item.name)}: ${item.before} → ${item.after}</li>`).join('')}</ul>
      <p>${t('transfer_preserve')}</p>
      <button id="transfer-confirm">${t('transfer_confirm')}</button><button id="transfer-cancel">${t('cancel')}</button>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#transfer-cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
    overlay.querySelector('#transfer-confirm').onclick = () => {
      try {
        currentCharacter = characterStore.transfer(sourceId);
        activeEdition = '5e'; renderEdition(); loadCharacterList(); loadState(); if (!loadFailed) saveState(); overlay.remove();
      } catch (error) { storageError(error); }
    };
  });
}

function renderTransferReport(record) {
  const report = document.getElementById('transfer-report');
  report.hidden = !record?.transfer;
  const body = document.getElementById('transfer-report-body');
  // Avoid rebuilding the report (and closing its details) on every keystroke.
  const reportKey = record?.transfer ? `${record.id}:${record.transfer.transferredAt}:${record.transfer.rulesVersion}` : '';
  if (body.dataset.reportKey === reportKey) return;
  body.dataset.reportKey = reportKey;
  body.replaceChildren();
  if (!record?.transfer) return;
  const transfer = record.transfer;
  for (const text of [t(transfer.rulesVersion === 'pending' ? 'transfer_pending' : 'transfer_ready'), `${t('transfer_source')}: ${transfer.sourceId}`,
    `${t('transfer_date')}: ${formatDate(transfer.transferredAt)}`, t(transfer.rulesVersion === 'pending' ? 'transfer_identity' : 'transfer_all_values'), t('transfer_review'),
    ...(transfer.adjustments || []).map(item => `${item.name}: ${item.before} → ${item.after}`)]) {
    const paragraph = document.createElement('p'); paragraph.textContent = text; body.appendChild(paragraph);
  }
  const details = document.createElement('details');
  const summary = document.createElement('summary'); summary.textContent = t('transfer_source_data');
  const pre = document.createElement('pre'); pre.textContent = JSON.stringify(transfer.sourceState, null, 2);
  details.append(summary, pre); body.appendChild(details);
  const button = document.createElement('button'); button.textContent = t('transfer_download');
  button.onclick = () => {
    const date = new Date();
    const original = { id: transfer.sourceId, name: transfer.sourceName || transfer.sourceState['char-name'] || record.name, edition: '4e', status: transfer.sourceStatus || 'alive' };
    downloadJSON({ formatVersion: 2, ...original, exportedAt: date.toISOString(), state: transfer.sourceState,
      transfer: null }, CharacterStore.filename(original, date));
  };
  body.appendChild(button);
}
