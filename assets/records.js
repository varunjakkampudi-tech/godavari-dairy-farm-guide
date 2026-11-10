(function () {
  'use strict';
  const STORAGE_KEY = 'gdfg-records-v2';
  const LEGACY_KEY = 'gdfg-records-v1';
  const Core = window.FarmRecordCore;
  let migrationMessage = '';

  function load() {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Core.validBackup(current)) return Core.migrate(current);
    } catch { /* Keep the page available when storage is unavailable or damaged. */ }
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
      if (Core.validBackup(legacy)) {
        const upgraded = Core.migrate(legacy);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
          migrationMessage = 'Older records were copied into the version-2 register. The version-1 source remains stored as a recovery copy until you clear all records.';
        } catch {
          migrationMessage = 'Older records were loaded but could not be copied to the new register because browser storage may be full. Export a backup before continuing.';
        }
        return upgraded;
      }
    } catch { /* A failed migration leaves the original version-1 data untouched. */ }
    return Core.blank();
  }
  let db = load();
  const statusNode = document.getElementById('record-status');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const status = message => { statusNode.textContent = message; };

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      render();
      return true;
    } catch {
      status('Could not save. Browser storage may be unavailable or full. Export any records still visible, then free device storage or use a backup.');
      return false;
    }
  }
  function table(rows, columns, kind) {
    if (!rows.length) return '<p class="muted">No entries yet.</p>';
    return `<table class="record-table"><thead><tr>${columns.map(c => `<th>${c[1]}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${rows.map(row => `<tr>${columns.map(c => `<td>${escape(row[c[0]])}</td>`).join('')}<td><button type="button" data-record-edit="${kind}" data-key="${escape(row._key)}">Edit</button> <button type="button" data-record-delete="${kind}" data-key="${escape(row._key)}">Delete</button></td></tr>`).join('')}</tbody></table>`;
  }
  function renderLegacy() {
    document.getElementById('animal-list').innerHTML = table(db.animals, [['id','Animal ID'],['breed','Breed/type'],['dob','Birth date'],['purchaseDate','Purchase date'],['cost','Cost ₹'],['lactation','Lactation'],['calving','Last calving'],['yield','Yield L'],['notes','Notes']], 'animals');
    document.getElementById('milk-list').innerHTML = table(db.milk, [['date','Date'],['animalId','Animal ID'],['session','Milking'],['litres','Litres'],['notes','Notes']], 'milk');
    document.getElementById('expense-list').innerHTML = table(db.expenses, [['date','Date'],['category','Category'],['amount','₹'],['notes','Notes']], 'expenses');
  }
  function renderEvents() {
    const filters = {
      query: document.getElementById('event-search').value,
      module: document.getElementById('event-module-filter').value,
      from: document.getElementById('event-from').value,
      to: document.getElementById('event-to').value
    };
    const rows = Core.filterRows(db.events, filters);
    const names = Object.fromEntries(Core.MODULES);
    const shown = rows.map(row => ({ ...row, moduleLabel: names[row.module] || row.module }));
    document.getElementById('event-list').innerHTML = table(shown, [['date','Date'],['moduleLabel','Module'],['animalId','Animal ID'],['description','Entry'],['quantity','Quantity'],['amount','Amount ₹'],['status','Status'],['followUpDate','Follow-up'],['withdrawalUntil','Milk hold until'],['notes','Notes']], 'events');
    document.getElementById('event-count').textContent = `${rows.length} of ${db.events.length} log entries`;
  }
  function render() { renderLegacy(); renderEvents(); applyGlobalSearch(); }
  function values(form) { return Object.fromEntries(new FormData(form).entries()); }
  function resetEdit(form) {
    delete form.dataset.editKey;
    const submit = form.querySelector('[type="submit"]');
    submit.textContent = submit.dataset.defaultLabel;
    form.querySelector('[data-cancel-edit]')?.remove();
  }
  function beginEdit(form, row, label) {
    for (const [key, value] of Object.entries(row)) {
      if (form.elements[key]) form.elements[key].value = value ?? '';
    }
    form.dataset.editKey = row._key;
    const submit = form.querySelector('[type="submit"]');
    submit.dataset.defaultLabel ||= submit.textContent;
    submit.textContent = `Update ${label}`;
    if (!form.querySelector('[data-cancel-edit]')) {
      const cancel = document.createElement('button');
      cancel.type = 'button'; cancel.className = 'button alt'; cancel.dataset.cancelEdit = '';
      cancel.textContent = 'Cancel edit'; cancel.addEventListener('click', () => { form.reset(); resetEdit(form); });
      submit.parentElement.append(cancel);
    }
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function saveForm(form, key) {
    const row = values(form), editKey = form.dataset.editKey;
    if (key === 'animals' && db.animals.some(a => a.id.toLocaleLowerCase() === row.id.toLocaleLowerCase() && a._key !== editKey)) {
      status('Animal ID already exists. Use a unique ID for each animal.'); return;
    }
    row._key = editKey || Core.createId();
    const index = editKey ? db[key].findIndex(item => item._key === editKey) : -1;
    if (index >= 0) db[key][index] = row; else db[key].unshift(row);
    if (persist()) { form.reset(); resetEdit(form); status(editKey ? 'Record updated on this browser.' : 'Record saved on this browser. Export a backup.'); }
  }
  for (const [formId, key] of [['animal-form','animals'],['milk-form','milk'],['expense-form','expenses']]) {
    const form = document.getElementById(formId);
    const submit = form.querySelector('[type="submit"]'); submit.dataset.defaultLabel = submit.textContent;
    form.addEventListener('submit', event => { event.preventDefault(); saveForm(form, key); });
  }
  const eventForm = document.getElementById('event-form');
  const eventSubmit = eventForm.querySelector('[type="submit"]'); eventSubmit.dataset.defaultLabel = eventSubmit.textContent;
  eventForm.addEventListener('submit', event => {
    event.preventDefault(); const row = values(eventForm), editKey = eventForm.dataset.editKey;
    row.id = editKey || Core.createId(); row._key = row.id;
    const index = editKey ? db.events.findIndex(item => item._key === editKey) : -1;
    if (index >= 0) db.events[index] = row; else db.events.unshift(row);
    if (persist()) { eventForm.reset(); resetEdit(eventForm); status(editKey ? 'Farm log updated on this browser.' : 'Farm log saved on this browser.'); }
  });

  document.addEventListener('click', event => {
    const edit = event.target.closest('[data-record-edit]');
    if (edit) {
      const row = db[edit.dataset.recordEdit].find(item => item._key === edit.dataset.key);
      const formId = { animals:'animal-form', milk:'milk-form', expenses:'expense-form', events:'event-form' }[edit.dataset.recordEdit];
      const labels = { animals:'animal', milk:'milk entry', expenses:'expense', events:'farm log' };
      if (row && formId) beginEdit(document.getElementById(formId), row, labels[edit.dataset.recordEdit]);
      return;
    }
    const del = event.target.closest('[data-record-delete]');
    if (!del || !confirm('Delete this record from this browser?')) return;
    const list = db[del.dataset.recordDelete], index = list.findIndex(item => item._key === del.dataset.key);
    if (index >= 0) { list.splice(index, 1); if (persist()) status('Record deleted.'); }
  });

  function applyGlobalSearch() {
    const q = document.getElementById('record-search').value.trim().toLocaleLowerCase();
    document.querySelectorAll('.record-table tbody tr').forEach(row => row.classList.toggle('hide', !!q && !row.innerText.toLocaleLowerCase().includes(q)));
  }
  document.getElementById('record-search').addEventListener('input', applyGlobalSearch);
  for (const id of ['event-search','event-module-filter','event-from','event-to']) document.getElementById(id).addEventListener(id === 'event-search' ? 'input' : 'change', renderEvents);

  function download(name, content, mime) {
    const url = URL.createObjectURL(new Blob([content], { type: mime })), anchor = document.createElement('a');
    anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  document.getElementById('export-json').addEventListener('click', () => download('godavari-farm-records.json', JSON.stringify({ version: 2, schemaVersion: 2, exportedAt: new Date().toISOString(), ...db }, null, 2), 'application/json'));
  document.getElementById('export-csv').addEventListener('click', () => {
    for (const key of Core.TABLES) download(`godavari-${key}.csv`, Core.toCSV(db[key]), 'text/csv');
  });
  document.getElementById('import-file').addEventListener('change', async event => {
    try {
      const file = event.target.files[0]; if (!file) return;
      if (file.size > 5_000_000) throw Error('Backup exceeds the 5 MB safety limit');
      const parsed = JSON.parse(await file.text()); if (!Core.validBackup(parsed)) throw Error('Backup structure or field values are invalid');
      if (!confirm('Replace all current local records with this backup? Export a backup first if needed.')) return;
      db = Core.migrate(parsed); if (persist()) status('Backup imported and saved. Export a fresh copy.');
    } catch (error) { status('Import failed: ' + error.message); }
    finally { event.target.value = ''; }
  });
  document.getElementById('clear-data').addEventListener('click', () => {
    if (!confirm('Permanently clear all farm records in this browser, including the preserved version-1 source? Export a backup first if needed.')) return;
    db = Core.blank();
    try {
      localStorage.removeItem(LEGACY_KEY); localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); render(); status('All records cleared from this browser.');
    } catch {
      render(); status('Records were removed from available browser keys, but storage could not save the empty version-2 register. Check local storage before reloading.');
    }
  });
  if (migrationMessage) status(migrationMessage);
  render();
})();
