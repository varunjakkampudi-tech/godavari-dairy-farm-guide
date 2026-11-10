const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'pages', 'layout.html');
let html = fs.readFileSync(pagePath, 'utf8');

if (!html.includes('id="layout-cost-planner"')) {
  html = html.replace('</head>', '<script defer src="../assets/layout-cost-core.js"></script><script defer src="../assets/layout-cost-planner.js"></script></head>');

  const elevation = `<section class="panel" aria-labelledby="elevation-heading"><h2 id="elevation-heading">Front, side and section views</h2><figure class="farm-plan"><img src="../assets/shed-elevations.svg" alt="Three conceptual not-to-scale buffalo shed drawings: front elevation, side elevation, and airflow section"><figcaption>These views explain relationships only. No dimensions, member sizes, foundations, wind loads or material specifications are supplied. A qualified local engineer must design for the surveyed site, soil, flood level, wind/cyclone exposure, roof drainage and local rules.</figcaption></figure></section>`;
  const elevationPoint = '<section class="panel"><h2>Ventilation and heat</h2>';
  if (!html.includes(elevationPoint)) throw new Error('Layout elevation insertion point missing');
  html = html.replace(elevationPoint, elevation + elevationPoint);

  const planner = `<section class="panel" id="layout-cost-planner" aria-labelledby="layout-cost-heading"><h2 id="layout-cost-heading">Collect real construction quotes</h2><p>Enter only amounts from a dated local quote, invoice or documented estimate. The app does not fill market prices, decide whether a quote is adequate, or say construction is permitted. Use the notes to identify the provider and quote date; confirm scope, taxes, transport, labor, approvals and lease rights separately.</p><div class="layout-scenario-grid"><section class="quote-scenario" data-scenario="low"><h3>Low · reversible scope</h3><p>Lease-approved repairs and movable items; consider restoration and removal costs.</p><div class="quote-lines" role="group" aria-label="Low-scope quote line items"></div><button type="button" class="button alt quote-add">Add cost item</button><p class="quote-total" aria-live="polite"></p></section><section class="quote-scenario" data-scenario="medium"><h3>Medium · engineered improvements</h3><p>Measured improvements to shelter, floors, milking area, water and drainage.</p><div class="quote-lines" role="group" aria-label="Medium-scope quote line items"></div><button type="button" class="button alt quote-add">Add cost item</button><p class="quote-total" aria-live="polite"></p></section><section class="quote-scenario" data-scenario="higher"><h3>Higher · durable designed build</h3><p>Professionally designed durable structure and site services, subject to approvals.</p><div class="quote-lines" role="group" aria-label="Higher-scope quote line items"></div><button type="button" class="button alt quote-add">Add cost item</button><p class="quote-total" aria-live="polite"></p></section></div><div class="actions"><button type="button" class="button" id="quote-export">Export quote comparison CSV</button><button type="button" class="button alt" id="quote-clear">Clear saved quote entries</button></div><p class="muted" id="quote-status" role="status" aria-live="polite">Quote entries stay in this browser only. Empty or undocumented lines are excluded from the evidenced subtotal; included amounts remain user-entered and unverified.</p></section>`;
  const scenarioPoint = '<section class="panel"><h2>Investment scenarios · pricing intentionally not fabricated</h2>';
  if (!html.includes(scenarioPoint)) throw new Error('Layout investment scenario insertion point missing');
  html = html.replace(/<section class="panel"><h2>Investment scenarios · pricing intentionally not fabricated<\/h2>[\s\S]*?<\/section>/, planner);
  fs.writeFileSync(pagePath, html);
}
