# Architecture

## Runtime

The app is a static multi-page site. GitHub Actions builds the site into `dist/`; GitHub Pages serves it. There is no application server, cloud database, login system, paid API or runtime package dependency. HTML pages use relative paths so the project can run under its repository path.

## Source layout

- `index.html`: home/dashboard entry point.
- `pages/`: topic pages; subject pages produced by `scripts/build-pages.js` must be changed at the generator/source data, not only in generated HTML.
- `assets/`: shared CSS, navigation/search/theme/checklist logic, calculators, records, service-worker registration and local diagrams.
- `research/`: reference list and verification notes.
- `scripts/`: page/search generation and static packaging.
- `tests/`: Node built-in test runner.
- `.github/workflows/deploy.yml`: build/test/artifact and Pages deployment.

## Data and offline boundary

User-entered records use versioned browser `localStorage` (`gdfg-records-v2`); they are profile/device-local, not encrypted or synced. JSON/CSV export is user-operated. The service worker caches static app resources only, not the register database. There is no authentication boundary between users of one browser profile. The app warns users to avoid sensitive personal/banking data.

## Extension rules

- Keep sources as canonical inputs for generated pages and search index.
- Escape or use text nodes for user-provided content; test imported data and formula-safe CSV.
- Keep buyer, finance and farm estimates explicit about assumptions and evidence quality.
- Avoid health diagnosis/medication automation; safe escalation is the boundary.
- Add new static routes to navigation, search-index build, service-worker shell where needed, package build and link tests.

## Known architectural debt

The site uses shared scripts injected into each page and some generated pages are compact single-line HTML. There is no centralized structured localization or health/breed content schema, no IndexedDB data layer, no automated E2E harness, and no automated accessibility/security analysis. The SVG install icon and PWA install/offline behavior still need real-browser coverage. Finance and buyer comparison use separate static modules; farm data uses a generic event ledger alongside animal, milk and expense tables.
