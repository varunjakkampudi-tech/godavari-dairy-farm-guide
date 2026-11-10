(() => {
  'use strict';

  function normalizeRows(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 100).map(row => ({
      item: String(row?.item ?? '').slice(0, 160),
      amount: String(row?.amount ?? '').slice(0, 32),
      evidence: String(row?.evidence ?? '').slice(0, 240)
    }));
  }

  function summarize(rows) {
    const list = normalizeRows(rows);
    let documentedSubtotal = 0;
    let documentedCount = 0;
    let missingAmount = 0;
    let missingEvidence = 0;
    for (const row of list) {
      const amount = row.amount.trim() === '' ? NaN : Number(row.amount);
      const validAmount = Number.isFinite(amount) && amount >= 0;
      if (!validAmount) {
        missingAmount += 1;
        continue;
      }
      if (!hasEvidence(row.evidence)) {
        missingEvidence += 1;
        continue;
      }
      documentedSubtotal += amount;
      documentedCount += 1;
    }
    return { documentedSubtotal, documentedCount, missingAmount, missingEvidence };
  }

  function hasEvidence(value) {
    const text = String(value ?? '').trim();
    const match = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (!match) return false;
    if (!text.slice(0, match.index).trim()) return false;
    const [, year, month, day] = match.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }

  function csvCell(value) {
    let text = String(value ?? '');
    if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function toCsv(scenarios) {
    const rows = [['scenario', 'cost item', 'amount INR', 'quote evidence (provider/date)', 'subtotal inclusion']];
    for (const [scenario, sourceRows] of Object.entries(scenarios || {})) {
      const items = normalizeRows(sourceRows);
      const summary = summarize(items);
      for (const item of items) {
        const amount = item.amount.trim() === '' ? NaN : Number(item.amount);
        const included = Number.isFinite(amount) && amount >= 0 && hasEvidence(item.evidence);
        rows.push([scenario, item.item, item.amount, item.evidence, included ? 'documented user entry; unverified' : 'excluded until amount and quote evidence are entered']);
      }
      rows.push([scenario, 'Documented subtotal (unverified)', String(summary.documentedSubtotal), '', 'Only entries with amount and source/date']);
    }
    return '\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
  }

  const api = { normalizeRows, summarize, hasEvidence, csvCell, toCsv };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.LayoutCostCore = api;
})();
