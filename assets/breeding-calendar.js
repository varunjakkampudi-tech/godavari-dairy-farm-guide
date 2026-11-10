(function () {
  'use strict';
  const Core = window.FarmRecordCore;
  const form = document.getElementById('breeding-event-form');
  const list = document.getElementById('breeding-calendar-list');
  const filter = document.getElementById('breeding-animal-filter');
  const status = document.getElementById('breeding-calendar-status');
  if (!Core || !form || !list || !filter || !status) return;

  const KEY = 'gdfg-records-v2';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  function load() {
    try {
      const current = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (current && Core.validBackup(current)) return Core.migrate(current);
      const legacy = JSON.parse(localStorage.getItem('gdfg-records-v1') || 'null');
      if (legacy && Core.validBackup(legacy)) return Core.migrate(legacy);
    } catch { /* Keep the guide readable if local storage is unavailable or malformed. */ }
    return Core.blank();
  }
  let db = load();

  function render() {
    const query = filter.value.trim().toLocaleLowerCase();
    const rows = db.events
      .filter(row => row.module === 'breeding' && (!query || String(row.animalId || '').toLocaleLowerCase().includes(query)))
      .sort((a, b) => a.date.localeCompare(b.date) || String(a.animalId).localeCompare(String(b.animalId)));
    if (!rows.length) {
      list.innerHTML = '<p class="muted">No breeding or calving events saved yet. Add an entry above or use the breeding module in Farm Records.</p>';
      return;
    }
    list.innerHTML = `<table class="record-table"><thead><tr><th>Date / window start</th><th>Window end / follow-up</th><th>Animal ID</th><th>Milestone / notes</th></tr></thead><tbody>${rows.map(row => `<tr><td>${esc(row.date)}</td><td>${esc(row.followUpDate || 'Not entered')}</td><td>${esc(row.animalId || 'Not entered')}</td><td>${esc(row.description)}${row.notes ? `<br><small>${esc(row.notes)}</small>` : ''}</td></tr>`).join('')}</tbody></table>`;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.followUpDate && values.followUpDate < values.date) {
      status.textContent = 'The follow-up or window end cannot be earlier than the event date.';
      form.elements.followUpDate.focus();
      return;
    }
    const next = load();
    const id = Core.createId();
    next.events.unshift({
      id, _key:id, module:'breeding', date:values.date, animalId:values.animalId.trim(),
      description:`${values.milestone}${values.detail.trim() ? ` — ${values.detail.trim()}` : ''}`,
      quantity:'', unit:'', amount:'', status:'Recorded', followUpDate:values.followUpDate,
      withdrawalUntil:'', notes:values.notes.trim()
    });
    if (!Core.validBackup(next)) {
      status.textContent = 'This entry could not be validated. Check the animal ID and dates, then try again.';
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      db = next;
      render();
      form.reset();
      status.textContent = 'Breeding event saved on this device and included in Farm Records JSON and CSV backups.';
    } catch {
      status.textContent = 'Could not save. Browser storage may be unavailable or full. Export a backup from Farm Records before continuing.';
    }
  });

  filter.addEventListener('input', render);
  render();
})();
