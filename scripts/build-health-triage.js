const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', 'pages', 'health.html');
let html = fs.readFileSync(file, 'utf8');

if (!html.includes('id="symptom-triage"')) {
  const scripts = '<script defer src="../assets/health-triage-core.js"></script><script defer src="../assets/health-triage.js"></script>';
  html = html.replace('</head>', `${scripts}</head>`);
  const insertionPoint = '<section class="callout"><h2>Emergency decision path</h2>';
  if (!html.includes(insertionPoint)) throw new Error('Health page emergency section insertion point is missing.');
  const widget = `<section class="panel triage-panel" aria-labelledby="triage-heading"><span class="eyebrow">Interactive safety aid · no diagnosis</span><h2 id="triage-heading">What signs do you see?</h2><p>Select every sign you have noticed. This tool only helps route urgency and safe first steps. It cannot identify a disease or replace a veterinarian.</p><form id="symptom-triage"><fieldset><legend>Select all that apply</legend><div id="triage-symptoms" class="triage-list"></div></fieldset><div class="actions"><button class="button" type="submit">Show safe next steps</button><button class="button alt" type="reset">Clear selections</button></div></form><section id="triage-result" class="triage-result hide" tabindex="-1" aria-live="assertive" aria-atomic="true"></section><p class="muted">Emergency signs include breathing distress, collapse or inability to rise, severe abdominal swelling, suspected poisoning, difficult calving, and heavy bleeding. If an animal is deteriorating, call a veterinarian now rather than waiting for this tool.</p><details class="accordion"><summary>Evidence and limits</summary><p>Signs overlap across many conditions and can be difficult to assess. Buffalo-specific and official sources support sign recognition and outbreak reporting; the urgency routing here is a conservative educational aid and has not been clinically validated by a local veterinarian.</p><ul><li><a href="https://www.nddb.coop/farmer/animal-health/disease/others/bloat" rel="noreferrer">NDDB: bloat signs</a></li><li><a href="https://www.nddb.coop/farmer/animal-health/disease/mastitis/clinical" rel="noreferrer">NDDB: clinical mastitis signs</a></li><li><a href="https://buffalopedianew.cirb.res.in/health-management/" rel="noreferrer">ICAR-CIRB: buffalo health management</a></li><li><a href="https://www.dahd.gov.in/sites/default/files/2025-05/OperationalGuidelinesforLHDCP21052025.pdf" rel="noreferrer">DAHD: Livestock Health and Disease Control operational guidelines (2025)</a></li></ul></details><p><a class="button" href="../pages/emergency.html">Emergency contacts and what to report</a></p></section>`;
  html = html.replace(insertionPoint, `${widget}${insertionPoint}`);
  fs.writeFileSync(file, html);
}
