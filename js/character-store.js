/* Versioned character storage; one write commits an entire operation. */
(function (root) {
  'use strict';
  const KEY = 'wfrp-characters-v2';
  const TABLES = ['grupp-table', 'talent-table', 'waffen-table', 'schulden-table', 'spar-table',
    'ruestung-table', 'ausruestung-table', 'zauber-table', 'mutationen-table',
    'psychologie-table', 'exp-table', 'injuries-table', 'diseases-table'];
  const FIELD = /^(char-|story-|KG-|BF-|ST-|WI-|I-|GW-|GS-|IN-|WK-|CH-|grund-|state-|fate-|luck-|resilience-|resolve-|rp-|lp-|korruption-|trag-|verm-|netto-|exp-|sin-)/;
  function cleanState(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) throw new Error('invalid_state');
    const result = {};
    for (const [key, value] of Object.entries(state)) {
      if (TABLES.includes(key)) {
        if (!Array.isArray(value) || value.length > 1000 || value.some(row => !Array.isArray(row) || row.length > 60 || row.some(cell => !['string', 'number', 'boolean'].includes(typeof cell)))) {
          throw new Error('invalid_table');
        }
        result[key] = value.map(row => row.map(cell => typeof cell === 'boolean' ? cell : String(cell)));
      } else if (FIELD.test(key) && ['string', 'number', 'boolean'].includes(typeof value)) {
        result[key] = typeof value === 'boolean' ? value : String(value);
      }
    }
    return result;
  }
  function uuid() {
    if (root.crypto.randomUUID) return root.crypto.randomUUID();
    const bytes = root.crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  const clone = value => JSON.parse(JSON.stringify(value));
  const validId = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  function normalizeBackup(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('invalid_backup');
    const legacy = data.formatVersion === undefined;
    if (!legacy && (data.formatVersion !== 2 || !validId(data.id) || !['4e', '5e'].includes(data.edition))) throw new Error('invalid_version');
    const name = legacy ? data.id : data.name;
    if (typeof name !== 'string' || !name.trim() || name.length > 200) throw new Error('invalid_name');
    const state = cleanState(data.state);
    if (legacy && !Object.keys(state).length) throw new Error('empty_legacy');
    if (!legacy && (!['alive', 'deceased'].includes(data.status) || typeof data.exportedAt !== 'string' || !Number.isFinite(Date.parse(data.exportedAt)))) throw new Error('invalid_metadata');
    return { id: legacy ? null : data.id, name: name.trim(), edition: legacy ? '4e' : data.edition,
      status: legacy ? 'alive' : data.status, state, exportedAt: legacy ? null : data.exportedAt,
      transfer: !legacy && data.transfer ? cleanTransfer(data.transfer) : null,
      transfers: !legacy && data.transfers ? cleanLinks(data.transfers) : [], legacy };
  }
  function cleanLinks(links) {
    if (!Array.isArray(links) || links.some(link => !validId(link.targetId) || !Number.isFinite(Date.parse(link.transferredAt)))) throw new Error('invalid_links');
    return links.map(link => ({ targetId: link.targetId, transferredAt: link.transferredAt }));
  }
  function cleanTransfer(transfer) {
    if (!transfer || typeof transfer !== 'object' || !validId(transfer.sourceId) || !Number.isFinite(Date.parse(transfer.transferredAt))) throw new Error('invalid_transfer');
    return { sourceId: transfer.sourceId, sourceEdition: '4e', transferredAt: transfer.transferredAt,
      rulesVersion: transfer.rulesVersion === '5e-group-v1' ? '5e-group-v1' : 'pending',
      adjustments: Array.isArray(transfer.adjustments) ? transfer.adjustments.filter(item => typeof item.name === 'string' && Number.isInteger(item.before) && Number.isInteger(item.after) && item.after >= 0 && item.before >= item.after).map(item => ({ name: item.name, before: item.before, after: item.after })) : [],
      sourceName: typeof transfer.sourceName === 'string' ? transfer.sourceName : '',
      sourceStatus: transfer.sourceStatus === 'deceased' ? 'deceased' : 'alive', sourceState: cleanState(transfer.sourceState) };
  }
  function filename(record, date = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(part => [part.type, part.value]));
    const name = record.name.replace(/[^\p{L}\p{N}._-]+/gu, '_').slice(0, 80) || 'character';
    return `${name}_${record.edition}_${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}_${record.id}.json`;
  }
  class Store {
    constructor(storage, allowedFields) {
      this.storage = storage;
      this.allowedFields = allowedFields;
      const raw = storage.getItem(KEY);
      if (raw) {
        this.data = JSON.parse(raw);
        if (this.data.version !== 2 || !Array.isArray(this.data.characters) || !this.data.active) throw new Error('invalid_store');
        const ids = new Set();
        this.data.characters.forEach(record => {
          if (!validId(record.id) || ids.has(record.id) || typeof record.name !== 'string' || !record.name.trim() || !['4e', '5e'].includes(record.edition) || !['alive', 'deceased'].includes(record.status)) throw new Error('invalid_record');
          ids.add(record.id);
          record.state = this.clean(record.state);
          if (record.transfer) record.transfer = cleanTransfer(record.transfer);
          if (record.transfers) record.transfers = cleanLinks(record.transfers);
          if (record.recovery) { record.recovery.state = this.clean(record.recovery.state); }
        });
      } else {
        this.data = { version: 2, edition: '4e', active: {}, characters: [] };
        const names = JSON.parse(storage.getItem('characters') || '[]');
        if (!Array.isArray(names) || names.some(name => typeof name !== 'string' || !name.trim())) throw new Error('invalid_legacy');
        for (const name of new Set(names)) {
          const state = this.clean(JSON.parse(storage.getItem('state-' + name) || '{}'));
          this.data.characters.push({ id: uuid(), name, edition: '4e', status: 'alive', state, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }
        this.data.active['4e'] = this.data.characters[0]?.id || null;
        this.persist(this.data); // legacy keys are deliberately retained
      }
    }
    clean(state) {
      const clean = cleanState(state);
      if (this.allowedFields) for (const key of Object.keys(clean)) {
        if (!TABLES.includes(key) && !this.allowedFields.has(key)) delete clean[key];
      }
      return clean;
    }
    persist(next) {
      const raw = JSON.stringify(next);
      this.storage.setItem(KEY, raw);
      if (this.storage.getItem(KEY) !== raw) throw new Error('storage_verification_failed');
      this.data = next;
    }
    commit(change) {
      const next = clone(this.data);
      const result = change(next);
      this.persist(next);
      return result;
    }
    get(id) { return this.data.characters.find(record => record.id === id); }
    list(edition) { return this.data.characters.filter(record => record.edition === edition); }
    create(name, edition, state = {}) {
      const id = uuid(), now = new Date().toISOString();
      this.commit(data => {
        data.characters.push({ id, name, edition, state: this.clean(state), status: 'alive', createdAt: now, updatedAt: now });
        data.active[edition] = id;
      });
      return id;
    }
    save(id, state) {
      const clean = this.clean(state);
      this.commit(data => {
        const record = data.characters.find(record => record.id === id);
        if (!record) throw new Error('unknown_character');
        record.state = clean;
        record.name = clean['char-name']?.trim() || record.name;
        record.updatedAt = new Date().toISOString();
      });
    }
    select(edition, id) {
      if (!['4e', '5e'].includes(edition) || (id && this.get(id)?.edition !== edition)) throw new Error('invalid_selection');
      this.commit(data => { data.edition = edition; data.active[edition] = id; });
    }
    remove(id) {
      this.commit(data => {
        const record = data.characters.find(record => record.id === id);
        if (!record) return;
        data.characters = data.characters.filter(record => record.id !== id);
        if (data.active[record.edition] === id) data.active[record.edition] = data.characters.find(c => c.edition === record.edition)?.id || null;
      });
    }
    setStatus(id, status) {
      if (!['alive', 'deceased'].includes(status)) throw new Error('invalid_status');
      this.commit(data => { data.characters.find(record => record.id === id).status = status; });
    }
    export(id, date = new Date()) {
      const record = this.get(id);
      return { formatVersion: 2, id: record.id, name: record.name, edition: record.edition, status: record.status,
        exportedAt: date.toISOString(), state: this.clean(record.state), transfer: record.transfer || null, transfers: record.transfers || [] };
    }
    import(backup, targetId = null, asCopy = false) {
      const id = targetId || (!asCopy && backup.id && !this.get(backup.id) ? backup.id : uuid());
      if (targetId && this.get(targetId)?.edition !== backup.edition) throw new Error('edition_conflict');
      this.commit(data => {
        let record = data.characters.find(record => record.id === id);
        const now = new Date().toISOString();
        if (record) record.recovery = { state: clone(record.state), name: record.name, status: record.status,
          transfer: record.transfer || null, transfers: record.transfers || [], importedAt: record.importedAt || null, backupAt: record.backupAt || null, savedAt: now };
        else { record = { id, createdAt: now }; data.characters.push(record); }
        Object.assign(record, { name: backup.name, edition: backup.edition, status: backup.status,
          state: this.clean(backup.state), importedAt: now, backupAt: backup.exportedAt, updatedAt: now, transfer: backup.transfer, transfers: backup.transfers || [] });
        data.edition = backup.edition;
        data.active[backup.edition] = id;
      });
      return id;
    }
    recover(id) {
      this.commit(data => {
        const record = data.characters.find(record => record.id === id);
        if (!record?.recovery) throw new Error('no_recovery');
        const recovered = record.recovery;
        Object.assign(record, { state: recovered.state, name: recovered.name, status: recovered.status,
          transfer: recovered.transfer, transfers: recovered.transfers || [], importedAt: recovered.importedAt, backupAt: recovered.backupAt, updatedAt: new Date().toISOString() });
        delete record.recovery;
      });
    }
    transfer(id) {
      const source = this.get(id);
      if (!source || source.edition !== '4e') throw new Error('invalid_source');
      const targetId = uuid(), now = new Date().toISOString();
      const { state, adjustments } = root.WFRP5Rules.convertState(this.clean(source.state));
      this.commit(data => {
        data.characters.push({ id: targetId, name: source.name, edition: '5e', status: source.status, state,
          createdAt: now, updatedAt: now, transfer: { sourceId: id, sourceEdition: '4e', transferredAt: now,
            rulesVersion: '5e-group-v1', adjustments, sourceName: source.name, sourceStatus: source.status, sourceState: this.clean(source.state) } });
        const original = data.characters.find(record => record.id === id);
        original.transfers = [...(original.transfers || []), { targetId, transferredAt: now }];
        data.edition = '5e'; data.active['5e'] = targetId;
      });
      return targetId;
    }
  }
  root.CharacterStore = { Store, TABLES, cleanState, normalizeBackup, filename };
  if (typeof module !== 'undefined') module.exports = root.CharacterStore;
})(typeof window !== 'undefined' ? window : globalThis);
