const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const inputPath = path.join(root, 'research', 'sources.md');
const outputPath = path.join(root, 'research', 'source-register.csv');
const auditPath = path.join(root, 'research', 'source-link-audit.json');
const classPath = path.join(root, 'research', 'source-evidence-classes.json');
const taxonomyPath = path.join(root, 'research', 'evidence-taxonomy.json');
const header = [
  'source_id', 'subject', 'title', 'publisher', 'url', 'publication_date_or_edition',
  'access_date', 'claim_summary', 'geographic_scope', 'evidence_quality', 'limitations', 'recheck_status',
  'source_evidence_class', 'link_check_status'
];

function loadEvidenceClasses() {
  const classes = JSON.parse(fs.readFileSync(classPath, 'utf8'));
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));
  const unknown = Object.entries(classes).filter(([, id]) => !taxonomy.source_classes[id]);
  if (unknown.length) throw new Error(`Unknown source evidence classes: ${unknown.map(([url, id]) => `${id} for ${url}`).join('; ')}`);
  return classes;
}

function publisherFor(host) {
  if (host.endsWith('fssai.gov.in')) return ['Food Safety and Standards Authority of India', 'Central statutory regulator; official advisory, but business-specific interpretation still requires authority confirmation.'];
  if (host.endsWith('dahd.gov.in')) return ['Department of Animal Husbandry and Dairying, Government of India', 'Central government source; source edition and applicability must be checked.'];
  if (host.endsWith('westgodavari.ap.gov.in')) return ['West Godavari District Administration, Government of Andhra Pradesh', 'Official district administrative listing; live availability/service was not independently confirmed.'];
  if (host.endsWith('mausam.gov.in') || host.endsWith('imd.gov.in') || host.endsWith('imdpune.gov.in')) return ['India Meteorological Department', 'Official meteorological publication; local parcel risk cannot be inferred from district or state summaries.'];
  if (host.endsWith('icar.gov.in')) return ['Indian Council of Agricultural Research', 'Official agricultural research/advisory source; local crop performance must be verified.'];
  if (host.endsWith('cirb.res.in')) return ['ICAR-Central Institute for Research on Buffaloes', 'Official technical research institute; underlying study dates/methods and individual-animal applicability require review.'];
  if (host.endsWith('nbagr.res.in')) return ['ICAR-National Bureau of Animal Genetic Resources', 'Official breed registry; recognition does not prove an individual animal’s identity or performance.'];
  if (host.endsWith('nddb.coop')) return ['National Dairy Development Board', 'Dairy-sector technical guidance; not an individualized veterinary/nutrition prescription.'];
  if (host.endsWith('nabard.org')) return ['National Bank for Agriculture and Rural Development', 'Official institutional planning context; district statistics and named buyers may be historical.'];
  if (host.endsWith('ncdfi.coop')) return ['National Cooperative Dairy Federation of India', 'Dairy-sector consumer-price context; not a producer procurement price.'];
  return [host, 'Publisher type and evidence quality not classified; manual review required.'];
}

function dateFor(text) {
  const month = text.match(/(?:dated|published)\s+(\d{1,2}\s+[A-Za-z]+\s+20\d{2})/i);
  if (month) return month[1];
  const year = text.match(/\b(20\d{2})(?:\s*[–-]\s*(\d{2,4}))?\b/);
  if (year) return year[2] ? `${year[1]}–${year[2]}` : year[1];
  return 'Not stated in source inventory; verify source';
}

function accessDateFor(text) {
  if (/(?:accessed|rechecked|live checked|checked)\s+10\s+Nov(?:ember)?\s+2026/i.test(text)) return '2026-11-10';
  return 'Not recorded per source row';
}

function geographyFor(text) {
  if (/West Godavari/i.test(text)) return 'West Godavari, Andhra Pradesh (as stated in source summary)';
  if (/East and West Godavari|Tanuku, Bhimavaram|Narasapuram/i.test(text)) return 'East and/or West Godavari (as stated in source summary)';
  if (/Andhra Pradesh/i.test(text)) return 'Andhra Pradesh (as stated in source summary)';
  if (/India|national/i.test(text)) return 'India / national (as stated in source summary)';
  return 'Not stated in source inventory; verify source';
}

function parseInventory(markdown, evidenceClasses = loadEvidenceClasses()) {
  const grouped = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('|') || line.startsWith('|---') || line.includes('| Topic | Source |')) continue;
    const cells = line.split('|').slice(1, -1).map(value => value.trim());
    if (cells.length < 3) continue;
    const [topic, sourceCell, claimSummary] = cells;
    const link = sourceCell.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    if (!link) continue;
    const [, title, url] = link;
    const canonicalUrl = url.trim();
    const record = grouped.get(canonicalUrl) || { topic: new Set(), title, url: canonicalUrl, summaries: [], dateText: [], accessText: [] };
    record.topic.add(topic);
    record.summaries.push(claimSummary);
    record.dateText.push(title, claimSummary);
    record.accessText.push(claimSummary);
    grouped.set(canonicalUrl, record);
  }

  const missing = [...grouped.keys()].filter(url => !evidenceClasses[url]);
  const stale = Object.keys(evidenceClasses).filter(url => !grouped.has(url));
  if (missing.length || stale.length) throw new Error(`Source evidence classes must exactly match the source inventory. Missing: ${missing.join(', ') || 'none'}; stale: ${stale.join(', ') || 'none'}`);

  return [...grouped.values()].sort((a, b) => a.url.localeCompare(b.url)).map((record, index) => {
    const host = new URL(record.url).hostname.replace(/^www\./, '');
    const [publisher, quality] = publisherFor(host);
    const combined = record.summaries.join(' | ');
    return [
      `SRC-${String(index + 1).padStart(3, '0')}`,
      [...record.topic].join('; '),
      record.title,
      publisher,
      record.url,
      dateFor(record.title),
      accessDateFor(record.accessText.join(' ')),
      `Paraphrase from research/sources.md (not a direct quotation): ${combined}`,
      geographyFor(`${[...record.topic].join(' ')} ${combined}`),
      quality,
      combined,
      'No item-level next-review date recorded; recheck volatile/legal/contact/weather information before use and all other claims when updating.',
      evidenceClasses[record.url],
      'Not checked'
    ];
  });
}

function quoteCsv(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function buildCsv(markdown) {
  const rows = parseInventory(markdown);
  return [header, ...rows].map(row => row.map(quoteCsv).join(',')).join('\r\n') + '\r\n';
}

function buildLinkAuditSummary(audit) {
  if (!audit) return 'Live link check not run';
  const checks = audit.sources || [];
  const reachable = checks.filter(item => item.status && item.status < 400).length;
  const unresolved = checks.length - reachable;
  return `${reachable}/${checks.length} returned HTTP below 400 on ${audit.checkedAt}; ${unresolved} unresolved (includes transport errors, not all confirmed dead links)`;
}

function buildEnrichedCsv(markdown, audit) {
  const checkByUrl = new Map((audit?.sources || []).map(item => [item.url, item]));
  const rows = parseInventory(markdown).map(row => {
    const check = checkByUrl.get(row[4]);
    let result = 'Not checked';
    if (check) {
      if (check.status && check.status < 400) result = `HTTP ${check.status} at ${check.checkedAt}`;
      else if (check.status) result = `HTTP ${check.status}; review URL (${check.checkedAt})`;
      else result = `Unverified transport error: ${check.error || 'unknown'} (${check.checkedAt})`;
    }
    return [...row.slice(0, -1), result];
  });
  return [header, ...rows].map(row => row.map(quoteCsv).join(',')).join('\r\n') + '\r\n';
}

if (require.main === module) {
  const audit = fs.existsSync(auditPath) ? JSON.parse(fs.readFileSync(auditPath, 'utf8')) : null;
  fs.writeFileSync(outputPath, buildEnrichedCsv(fs.readFileSync(inputPath, 'utf8'), audit));
  process.stdout.write(`Built ${path.relative(root, outputPath)}\n`);
}

module.exports = { header, loadEvidenceClasses, parseInventory, buildCsv, buildEnrichedCsv, buildLinkAuditSummary };
