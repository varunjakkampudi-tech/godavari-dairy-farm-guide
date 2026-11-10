const base = process.env.SITE_URL;
if (!base) throw new Error('Set SITE_URL to the deployed Pages root URL.');

const root = new URL(base.endsWith('/') ? base : `${base}/`);
const routes = [
  ['index.html', ['<h1', 'Build the plan before you build']],
  ['pages/getting-started.html', ['decision-center']],
  ['pages/health.html', ['symptom-triage']],
  ['pages/emergency.html', ['Tanuku']],
  ['pages/finance-studio.html', ['Build monthly plan']],
  ['pages/feeding.html', ['seasonal-feed-planner', 'Check fodder balance month by month']],
  ['pages/records.html', ['animal-form', 'export-json']],
  ['pages/visual-library.html', ['visual-card', 'caption']]
];
const assets = [
  'assets/site.css', 'assets/nav.js', 'assets/site.js', 'assets/search-index.json',
  'manifest.webmanifest', 'sw.js', 'offline.html', 'assets/brand-mark.svg', 'assets/favicon.svg', 'assets/seasonal-feed-planner.js'
];

async function get(path) {
  const url = new URL(path, root);
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }
  throw new Error(`${url}: ${lastError.message}`);
}

async function main() {
  for (const [path, markers] of routes) {
    const response = await get(path);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) throw new Error(`${path}: unexpected content type ${type}`);
    const html = await response.text();
    const missing = markers.filter(marker => !html.toLowerCase().includes(marker.toLowerCase()));
    if (missing.length) throw new Error(`${path}: missing expected content: ${missing.join(', ')}`);
    process.stdout.write(`PASS ${path} (${response.status})\n`);
  }
  for (const path of assets) {
    const response = await get(path);
    process.stdout.write(`PASS ${path} (${response.status})\n`);
  }
  process.stdout.write(`Post-deploy smoke passed: ${routes.length} guide pages and ${assets.length} critical assets at ${root}\n`);
}

main().catch(error => {
  process.stderr.write(`Post-deploy smoke failed: ${error.message}\n`);
  process.exitCode = 1;
});
