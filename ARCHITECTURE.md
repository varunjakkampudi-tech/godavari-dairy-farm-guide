# Architecture

## Runtime

The app is a static multi-page site. GitHub Actions builds the site into `dist/`; GitHub Pages serves it. There is no application server, cloud database, login system, paid API or runtime package dependency. HTML pages use relative paths so the project can run under its repository path.

## Source layout

- `index.html`: home/dashboard entry point.
- `pages/`: topic pages; subject pages produced by `scripts/build-pages.js` must be changed at the generator/source data, not only in generated HTML. Layout and feed-planning enhancements are injected by `scripts/build-layout-planner.js` and `scripts/build-feed-planner.js` during each build.
- `assets/`: shared CSS, navigation/search/theme/checklist logic, brand and favicon SVGs, calculators, records, health-triage core/UI, service-worker registration and local diagrams.
- `research/`: reference list and verification notes.
- `scripts/`: page/search generation, health-page enhancement and static packaging.
- `tests/`: Node built-in test runner.
- `.github/workflows/deploy.yml`: build/test/artifact and Pages deployment.

## Data and offline boundary

User-entered farm records use versioned browser `localStorage` (`gdfg-records-v2`); construction quote notes use `gdfg-layout-quotes-v1`, and monthly feed planning inputs use `gdfg-seasonal-feed-v1`. These stores are separate, profile/device-local, not encrypted or synced. Quote subtotals include only entries with a non-negative amount, provider/source and valid ISO date; entered quotations remain unverified. The fodder planner keeps user-entered monthly fresh/as-fed availability and nutritionist-entered demand; it makes no crop forecast or ration. CSV exports are user-operated. The service worker caches static app resources only, not these data stores. There is no authentication boundary between users of one browser profile. The app warns users to avoid sensitive personal/banking data.

## Extension rules

- Keep sources as canonical inputs for generated pages and search index.
- Escape or use text nodes for user-provided content; test imported data and formula-safe CSV.
- Keep buyer, finance and farm estimates explicit about assumptions and evidence quality.
- Avoid health diagnosis/medication automation; the triage module only routes selected signs to conservative escalation and first-response text, pending licensed veterinary review.
- Add new static routes to navigation, search-index build, service-worker shell where needed, package build and link tests.

## Known architectural debt

The site uses shared scripts injected into each page and some generated pages are compact single-line HTML. There is no centralized structured localization or health/breed content schema, or IndexedDB data layer. Playwright E2E and axe accessibility scans cover selected routes and states; manual keyboard/screen-reader/contrast review and broad security analysis remain. PWA shell/offline navigation has desktop Chromium coverage; actual device installation and cross-browser behavior remain unverified. Finance and buyer comparison use separate static modules; farm data uses a generic event ledger alongside animal, milk and expense tables.
