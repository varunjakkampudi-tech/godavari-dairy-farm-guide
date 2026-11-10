(() => {
  'use strict';
  const root = document.getElementById('layout-cost-planner');
  if (!root || !window.LayoutCostCore) return;

  const Core = window.LayoutCostCore;
  const key = 'gdfg-layout-quotes-v1';
  const names = { low: 'Low · reversible scope', medium: 'Medium · engineered improvements', higher: 'Higher · durable designed build' };
  const status = document.getElementById('quote-status');
  const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  let saved = {};
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    for (const id of Object.keys(names)) saved[id] = Core.normalizeRows(parsed[id]);
  } catch {
    for (const id of Object.keys(names)) saved[id] = [];
    status.textContent = 'Saved quote data could not be read. Current entries start empty; you can enter quotes again.';
  }

  function readScenario(scenario) {
    return [...scenario.querySelectorAll('.quote-row')].map(row => ({
      item: row.querySelector('[data-field="item"]').value,
      amount: row.querySelector('[data-field="amount"]').value,
      evidence: row.querySelector('[data-field="evidence"]').value
    }));
  }

  function collect() {
    const result = {};
    for (const scenario of root.querySelectorAll('.quote-scenario')) result[scenario.dataset.scenario] = Core.normalizeRows(readScenario(scenario));
    return result;
  }

  function save() {
    saved = collect();
    try {
      localStorage.setItem(key, JSON.stringify(saved));
      status.textContent = 'Quote entries are saved in this browser only. Subtotals include only entered amounts with quote evidence; amounts remain unverified.';
    } catch {
      status.textContent = 'Browser storage is unavailable or full. Current entries remain visible but may be lost when this page closes.';
    }
    updateTotals();
  }

  function field(labelText, fieldName, type, value, placeholder) {
    const label = document.createElement('label');
    label.className = 'quote-field';
    label.append(document.createTextNode(labelText));
    const input = document.createElement('input');
    input.dataset.field = fieldName;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    if (type === 'number') {
      input.min = '0';
      input.step = '0.01';
      input.inputMode = 'decimal';
    }
    label.append(input);
    return label;
  }

  function renderRow(scenario, values = {}) {
    const row = document.createElement('div');
    row.className = 'quote-row';
    row.append(field('Cost item', 'item', 'text', values.item || '', 'e.g., floor repair'));
    row.append(field('Quoted amount (₹)', 'amount', 'number', values.amount || '', 'Enter amount from quote'));
    row.append(field('Quote source and date', 'evidence', 'text', values.evidence || '', 'Provider + date or document'));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button alt quote-remove';
    remove.textContent = 'Remove item';
    remove.setAttribute('aria-label', 'Remove cost item');
    remove.addEventListener('click', () => {
      row.remove();
      if (!scenario.querySelector('.quote-row')) renderEmpty(scenario);
      save();
    });
    row.append(remove);
    scenario.querySelector('.quote-lines').append(row);
    for (const input of row.querySelectorAll('input')) input.addEventListener('input', save);
    return row;
  }

  function renderEmpty(scenario) {
    const empty = document.createElement('p');
    empty.className = 'quote-empty muted';
    empty.textContent = 'No quote items entered for this scope.';
    scenario.querySelector('.quote-lines').replaceChildren(empty);
  }

  function updateTotals() {
    for (const scenario of root.querySelectorAll('.quote-scenario')) {
      const rows = readScenario(scenario);
      const totals = Core.summarize(rows);
      const text = totals.documentedCount
        ? `Documented subtotal: ${currency.format(totals.documentedSubtotal)} from ${totals.documentedCount} entered item(s) · unverified`
        : 'No documented quote subtotal yet. Amounts without a source/date are excluded.';
      const gaps = [];
      if (totals.missingAmount) gaps.push(`${totals.missingAmount} item(s) without a valid amount`);
      if (totals.missingEvidence) gaps.push(`${totals.missingEvidence} amount(s) without quote source/date`);
      scenario.querySelector('.quote-total').textContent = gaps.length ? `${text} — ${gaps.join('; ')}.` : text;
    }
  }

  for (const scenario of root.querySelectorAll('.quote-scenario')) {
    const id = scenario.dataset.scenario;
    const rows = saved[id] || [];
    if (rows.length) rows.forEach(row => renderRow(scenario, row));
    else renderEmpty(scenario);
    scenario.querySelector('.quote-add').addEventListener('click', () => {
      const empty = scenario.querySelector('.quote-empty');
      if (empty) empty.remove();
      renderRow(scenario).querySelector('[data-field="item"]').focus();
      save();
    });
  }
  updateTotals();

  document.getElementById('quote-export').addEventListener('click', () => {
    const blob = new Blob([Core.toCsv(collect())], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'godavari-layout-quote-comparison.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    status.textContent = 'Quote comparison CSV exported. It contains only entries saved in this browser.';
  });

  document.getElementById('quote-clear').addEventListener('click', () => {
    if (!window.confirm('Clear all locally saved layout quote entries from this browser?')) return;
    for (const scenario of root.querySelectorAll('.quote-scenario')) renderEmpty(scenario);
    saved = Object.fromEntries(Object.keys(names).map(id => [id, []]));
    try {
      localStorage.removeItem(key);
      status.textContent = 'All locally saved layout quote entries were cleared.';
    } catch {
      status.textContent = 'Browser storage could not be cleared. Check this browser’s site data settings.';
    }
    updateTotals();
  });
})();
