const fs = require('node:fs');
const path = require('node:path');
const { parseInventory } = require('./build-source-register.js');

const root = path.resolve(__dirname, '..');
const sourcesPath = path.join(root, 'research', 'sources.md');
const outputPath = path.join(root, 'research', 'source-link-audit.json');
const timeoutMs = 12000;
const concurrency = 6;

async function check(url) {
  const checkedAt = new Date().toISOString();
  let response;
  let method = 'HEAD';
  let headError;
  try {
    response = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    headError = String(error.message || error);
  }
  if (!response || [403, 404, 405, 410, 501].includes(response.status)) {
    method = 'GET';
    try {
      response = await fetch(url, { method, headers: { Range: 'bytes=0-0' }, redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
      const result = { url, method, status: response.status, finalUrl: response.url, checkedAt };
      if (headError) result.headError = headError;
      await response.body?.cancel();
      return result;
    } catch (error) {
      return { url, method, status: null, finalUrl: null, checkedAt, error: String(error.message || error), headError };
    }
  }
  await response.body?.cancel();
  return { url, method, status: response.status, finalUrl: response.url, checkedAt };
}

async function run() {
  const markdown = fs.readFileSync(sourcesPath, 'utf8');
  const sources = parseInventory(markdown);
  const report = new Array(sources.length);
  let next = 0;
  async function worker() {
    while (next < sources.length) {
      const index = next++;
      const source = sources[index];
      report[index] = { sourceId: source[0], title: source[2], ...await check(source[4]) };
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, sources.length) }, worker));
  const result = {
    checkedAt: new Date().toISOString(),
    method: 'HEAD, with GET range fallback for unsupported HEAD',
    note: 'HTTP reachability snapshot only. A successful response does not validate source content, citation accuracy, or professional correctness.',
    sources: report.sort((a, b) => a.sourceId.localeCompare(b.sourceId))
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  const failures = report.filter(item => !item.status || item.status >= 400);
  process.stdout.write(`Checked ${report.length} unique URLs: ${report.length - failures.length} returned HTTP below 400; ${failures.length} need review.\n`);
  for (const failure of failures) process.stdout.write(`${failure.status || failure.error} ${failure.url}\n`);
  if (failures.length) process.exitCode = 1;
}

if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });

module.exports = { check };
