const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const pagesDir = path.join(root, 'pages');
const packagedPagesDir = path.join(root, 'dist', 'pages');
const packagedAssetsDir = path.join(root, 'dist', 'assets');
const htmlFiles = fs.readdirSync(pagesDir).filter((name) => name.endsWith('.html'));
const failures = [];
const warnings = [];

for (const name of htmlFiles) {
  const html = fs.readFileSync(path.join(pagesDir, name), 'utf8');
  const fail = (message) => failures.push(`${name}: ${message}`);
  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) fail('missing document language');
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) fail('missing page title');
  if (!/<h1\b[^>]*>\s*[^<]+/i.test(html)) fail('missing primary heading');
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1];
  if (!description) fail('missing or nonstandard description metadata');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1];
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(attrs)) fail('image missing alt attribute');
    if (/\balt\s*=\s*["']\s*["']/i.test(attrs) && !/\b(?:role\s*=\s*["']presentation["']|aria-hidden\s*=\s*["']true["'])/i.test(attrs)) warnings.push(`${name}: empty-alt image without explicit decorative marker`);
  }
  for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(href)) continue;
    const target = decodeURIComponent(href.split(/[?#]/, 1)[0]);
    if (!target) continue;
    const sourceTarget = path.resolve(pagesDir, target);
    if (sourceTarget.startsWith(root + path.sep) && fs.existsSync(sourceTarget)) continue;
    const pageTarget = path.resolve(packagedPagesDir, target);
    const assetTarget = path.resolve(packagedAssetsDir, target.replace(/^(?:\.\.\/)+assets\//, ''));
    if (pageTarget.startsWith(path.join(root, 'dist') + path.sep) && fs.existsSync(pageTarget)) continue;
    if (target.includes('/assets/') && assetTarget.startsWith(packagedAssetsDir + path.sep) && fs.existsSync(assetTarget)) continue;
    if (!sourceTarget.startsWith(root + path.sep)) fail(`relative link escapes repository root: ${href}`);
    else fail(`missing local link target in source/package: ${href}`);
  }
}

const sourceInventory = fs.readFileSync(path.join(root, 'research', 'sources.md'), 'utf8');
if (!/https?:\/\//.test(sourceInventory)) failures.push('research/sources.md: no source URLs found');
const tracked = require('node:child_process').execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of tracked.filter((name) => /\.(?:js|html|md|json|css)$/i.test(name))) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)) failures.push(`${file}: private-key material detected`);
}
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(`Content audit: ${htmlFiles.length} pages, ${failures.length} errors, ${warnings.length} warnings. This checks basic metadata, source/package local links, duplicate IDs, image alt attributes and obvious private-key markers; it does not assess WCAG conformance, source validity, clinical correctness, or Git history.`);
if (failures.length) process.exitCode = 1;
