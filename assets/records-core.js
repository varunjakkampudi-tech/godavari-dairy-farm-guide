(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FarmRecordCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TABLES = ['animals', 'milk', 'expenses', 'events'];
  const MODULES = [
    ['purchase', 'Purchases and transport'], ['milk-sale', 'Milk sales and buyer settlements'],
    ['feed', 'Feed, fodder and stock'], ['health', 'Health, vaccination and milk withdrawal'],
    ['breeding', 'Breeding, pregnancy and calving'], ['calf', 'Calf care and growth'],
    ['labor', 'Labor, shifts and handovers'], ['task', 'Daily and seasonal tasks'],
    ['inventory', 'Inventory and supplies'], ['equipment', 'Equipment and maintenance'],
    ['cleaning', 'Milking and cleaning'], ['weather', 'Weather and seasonal observations'],
    ['incident', 'Incidents and emergencies'], ['income', 'Other income'], ['water', 'Water, power and utilities']
  ];
  const moduleIds = new Set(MODULES.map(([id]) => id));
  const blank = () => ({ schemaVersion: 2, animals: [], milk: [], expenses: [], events: [] });
  function createId() {
    return globalThis.crypto?.randomUUID?.() || `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
  function plainRow(row) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
    const keys = Object.keys(row);
    return keys.length <= 40 && keys.every(key => {
      const value = row[key];
      return typeof key === 'string' && key.length <= 80 &&
        (typeof value === 'string' ? value.length <= 2000 : ['number', 'boolean'].includes(typeof value) || value === null || value === undefined);
    });
  }
  function validDate(value) {
    return !value || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value);
  }
  function validNumbers(row, fields) {
    return fields.every(key => row[key] === '' || row[key] === null || row[key] === undefined ||
      (Number.isFinite(Number(row[key])) && Number(row[key]) >= 0));
  }
  function validBackup(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const version = Number(value.schemaVersion ?? value.version ?? 1);
    if (!Number.isInteger(version) || version < 1 || version > 2) return false;
    if (!['animals', 'milk', 'expenses'].every(key => Array.isArray(value[key]))) return false;
    if (value.events !== undefined && !Array.isArray(value.events)) return false;
    const lists = TABLES.map(key => value[key] || []);
    if (lists.some(rows => !rows.every(plainRow))) return false;
    if (value.animals.some(a => !String(a.id || '').trim())) return false;
    if (value.milk.some(a => !String(a.date || '').trim() || !String(a.animalId || '').trim())) return false;
    if (value.expenses.some(a => !String(a.date || '').trim() || !String(a.category || '').trim())) return false;
    if ((value.events || []).some(e => !String(e.id || '').trim() || !moduleIds.has(e.module) || !String(e.date || '').trim() || !String(e.description || '').trim())) return false;
    const animalIds = value.animals.map(row => String(row.id).trim().toLocaleLowerCase());
    if (new Set(animalIds).size !== animalIds.length) return false;
    if (value.animals.some(row => !validDate(row.dob) || !validDate(row.purchaseDate) || !validDate(row.calving) || !validNumbers(row, ['cost', 'yield', 'lactation']))) return false;
    if (value.milk.some(row => !validDate(row.date) || !validNumbers(row, ['litres']))) return false;
    if (value.expenses.some(row => !validDate(row.date) || !validNumbers(row, ['amount']))) return false;
    if ((value.events || []).some(row => !validDate(row.date) || !validDate(row.followUpDate) || !validDate(row.withdrawalUntil) || !validNumbers(row, ['quantity', 'amount']))) return false;
    const eventIds = (value.events || []).map(row => row.id);
    if (new Set(eventIds).size !== eventIds.length) return false;
    for (const rows of lists) {
      const ids = rows.map(row => row._key).filter(Boolean);
      if (new Set(ids).size !== ids.length) return false;
    }
    return true;
  }
  function migrate(value) {
    if (!validBackup(value)) throw new Error('Unsupported or invalid farm-record backup.');
    const result = blank();
    for (const table of TABLES) result[table] = (value[table] || []).map(row => ({ ...row, _key: row._key || createId() }));
    return result;
  }
  function filterRows(rows, { query = '', module = '', from = '', to = '' } = {}) {
    const q = String(query).trim().toLocaleLowerCase();
    return rows.filter(row => {
      if (module && row.module !== module) return false;
      if (from && String(row.date || '') < from) return false;
      if (to && String(row.date || '') > to) return false;
      return !q || Object.values(row).some(value => String(value ?? '').toLocaleLowerCase().includes(q));
    });
  }
  function toCSV(rows) {
    if (!rows.length) return '';
    const keys = [...new Set(rows.flatMap(Object.keys))];
    const cell = value => {
      let text = String(value ?? '');
      if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };
    return [keys.map(cell).join(','), ...rows.map(row => keys.map(key => cell(row[key])).join(','))].join('\r\n');
  }
  return { TABLES, MODULES, blank, createId, validBackup, migrate, filterRows, toCSV };
});
