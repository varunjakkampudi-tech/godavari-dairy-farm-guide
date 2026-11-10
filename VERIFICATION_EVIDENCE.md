# Verification evidence

## Current checkout and remote evidence

- Breed illustration candidate adds `assets/buffalo-illustration.svg`, inserts it through `scripts/build-breed-library.js`, and precaches it for offline use. It is original generic artwork rather than a breed claim. `npm run build`, `npm test` (43/43), builder syntax check and `git diff --check` pass locally; exact-SHA CI and live verification remain pending.

- IPM release `a1cfd7867316d6dbf8b5406044c314386a009bae` was pushed fast-forward to `main` after confirming the fetched remote was `2e607977a4fe91b8642ad802ec51ae4642fec6e7`. Exact-SHA run [42777877013](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42777877013) succeeded for both `build-test` and `deploy-pages`. Local `npm run build`, `npm test` (43/43), IPM builder syntax check and `git diff --check` passed. Live `pages/pests.html` and `assets/search-index.json` returned HTTP 200; the pest page contains the IPM section and NDDB source link.
- The IPM guide prioritizes environmental/physical controls, monitoring, feed/milk contamination and night safety. It deliberately omits NDDB chemical application directions; no product or local vector risk is verified here.

- Audited remote `main` SHA: `ad23bf7a64c4256b9bb4793bfcddf594f486a721`.
- At this audit start, local `HEAD` matched `origin/main`; the working tree was clean. The remote workbook additions were fast-forwarded without rewriting history.
- GitHub Actions run [42760014726](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42760014726) succeeded for the exact audited SHA; both `build-test` and `deploy-pages` passed.
- The next public head `7fbdb33e8eba9f61760931ec83753622bdc8fc6b` passed GitHub Actions run [42763002842](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42763002842), including both `build-test` and `deploy-pages`.
- Public head `b00087d44e889cfa027c1687639464375a76c7f2` passed GitHub Actions run [42766057101](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42766057101), including both `build-test` and `deploy-pages`. Direct GET requests for `/pages/finance-studio.html` and `/assets/finance-simulator.js` returned HTTP 200.
- Public repository: [GitHub](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide).
- Public Pages site: [Live app](https://varunjakkampudi-tech.github.io/godavari-dairy-farm-guide/).
- Health app release `dcd5f302b5f7f8ecd1b3b4f70bf86aefc24a29f2` passed exact-SHA workflow run [42772156153](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42772156153), including build-test and Pages deployment. A documentation-only follow-up at `137d7796a232fba92ca54661267775b7d61a837f` passed [42772587512](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42772587512), including build-test and Pages deployment.
- Purchase comparison release was subsequently published; the older entries below are historical milestone evidence and must not be read as current release state.
- Registered-breed library release `d9a0e6b5967ce356ae9c6478618eeb21d17f8cad` passed exact-SHA run [42774149192](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42774149192), including build/test and Pages deployment. Live `/pages/breeds.html`, `/assets/breed-data.js`, and `/sw.js` returned HTTP 200, and deployed HTML contains the registry table and source link. Local tests at that release were 33/33. A later local, not-yet-published purchase checklist/stagger plan passes 34/34 after rebuild.
- Current local farm-design updates add three described, labelled SVGs and increase unit/static checks to 35 tests; build/test and `git diff --check` pass locally. Exact-SHA CI, Pages publication and live route checks remain pending.
- Current local employee planner uses editable time inputs, task completion toggles and an accessible session handover summary. `npm run build`, `npm test` (36/36), and `git diff --check` pass; exact-SHA release and live browser interaction checks remain pending.
- Current local generated milking guide adds an accessible flow SVG and 20 ordered hygiene/handling steps. `npm run build`, `npm test` (37/37), and `git diff --check` pass; professional practice review and deployment remain pending.
- Current local feeding tools estimate entered green-mass annual supply/shortage and present a ration discussion form without calculating quantities. Added NDDB/ICAR feed source claims with limits. `npm run build`, `npm test` (39/39), and `git diff --check` pass; local agronomy/nutrition review and release remain pending.
- Current local health library contains 23 structured, searchable condition summaries and links to CIRB/NDDB/DAHD sources, with dose-pattern test coverage. It omits lay treatment protocols and remains unreviewed clinically. Build, tests (40/40), and `git diff --check` pass locally; release and veterinary review remain pending.
- Current local vaccination page provides non-prescriptive disease/medicine questions and links to existing editable health-event records, whose milk-hold date is manually entered from veterinary/label direction. No due-date or withdrawal calculator is present. Build/tests pass 41/41; veterinary validation and deployment remain pending.
- Current local seasonal guide adds summer, monsoon and cooler-period checklist sections, accessible SVG and IMD 2024 event context. Checklist persistence uses existing browser-local checklists. Build/tests pass 42/42; site-specific flood, worker and veterinary review and release remain pending.
- Earlier browser evidence verified homepage, calculator navigation/scenario, global search, an animal record, mobile display at 390×844, and the live conceptual layout SVG. This was a focused smoke check, not full E2E, offline, screen-reader, or accessibility certification.

## Finance studio release

- Added `pages/finance-studio.html` and `assets/finance-simulator.js`, expanded the pure finance core and unit tests, added the page to navigation/search/offline shell, and bumped the service-worker cache to v5.
- `npm run build` succeeded; `npm test` passed 19/19; `node --check assets/calculator-core.js`, `node --check assets/finance-simulator.js`, and `git diff --check` passed locally. These results do not yet represent a GitHub Actions run for this work.
- A local Playwright preview on `http://127.0.0.1:4177/pages/finance-studio.html` used a deliberately illustrative four-animal case (6 L/day each, 90% saleable, ₹60/L, ₹5,000 monthly feed per animal, ₹5,000 lease and ₹20,000 wages monthly, ₹100,000 purchase cost per animal). It rendered 4,622 saleable L, ₹2,77,344 revenue, ₹6,60,000 operating costs, ₹-3,82,656 net operating result, ₹-7,82,656 first-year cash after purchase cost, and ₹229/L break-even price. This is a deterministic software check, not a local cost estimate or a claim about actual farm viability.
- The page displayed the ₹45/₹50/₹55/₹60/₹65/₹70/₹75/₹80 comparison table and 3-vs-4 and employee-vs-owner comparisons. Browser console showed no errors in the recorded session. A 390×844 screenshot showed animal cards and action buttons stacking vertically; screenshot path `.playwright-cli/page-2026-11-10T06-01-00-421Z.png` (ignored local QA artifact). The final browser render had 12 monthly rows, two charts and zero console errors.
- Playwright also saved and reloaded “Local smoke scenario”; CSV and JSON downloads completed with filenames `godavari-monthly-cashflow.csv` and `godavari-finance-scenario.json`. The downloaded CSV header and first rows were inspected locally. Still unverified: print layout, full mobile form completion, offline mode, screen reader/accessibility, and exact-SHA CI/deployment.

The changes above were pushed as `b00087d44e889cfa027c1687639464375a76c7f2`; exact-SHA CI and the live route are verified in the remote evidence above.

## Farm register upgrade (released in `cd87d1b`)

- Added `assets/records-core.js` with version-1/2 validation, migration, stable keys, date/numeric checks, and module/date/search filtering. Expanded `assets/records.js` and `pages/records.html` with version-2 storage, retained legacy recovery key, animal/milk/expense CRUD, 15 activity categories, edit/search/filter controls, and version-1/2 JSON plus four CSV-table exports. Service-worker cache was bumped to v6.
- `npm run build` and `npm test` passed locally with 24/24 tests before the PWA follow-on; `node --check assets/records-core.js`, `node --check assets/records.js`, and `git diff --check` passed before the latest documentation edits.
- Local Playwright preview on port 4180 seeded a version-1 register, reloaded, confirmed schema-v2 migration with the version-1 recovery key intact, edited an animal and created milk, expense and health-log rows, rejected a duplicate animal ID, searched the log, exported JSON and all four CSV tables, and re-imported the v2 JSON after confirmation. Browser console reported zero errors. This used test-only localhost storage.
- Still needed: delete confirmation, storage-quota failure, mobile accessibility and professional review. Records v2 deployment and route were verified at `cd87d1b` / run 42767921432.

## Existing test coverage

The pushed `cd87d1b` CI run covered 24 tests. The current local branch has 25 Node tests, including finance, record migration/validation/filtering, buyer arithmetic, local links/search, diagram and workbook packaging. The PWA test has not run in CI yet. The tests do not cover all flows named in [TEST_MATRIX.md](TEST_MATRIX.md).

## Security and accessibility limits

- No secrets were found in the earlier current-tree token-pattern scan; that is not a full historical secret scanner or dependency audit.
- The public branch was previously rewritten to GitHub noreply commit metadata, and subsequent remote commits use that metadata. Do not make another history rewrite.
- An accessible alt attribute is present on the farm SVG and checked by a unit test. No full WCAG audit, color-contrast run, keyboard/screen-reader audit, or automated accessibility report has been performed.

## PWA verification (v11 released in `dcd5f30`)

- `npm run build` succeeded and `npm test` passed 25/25 after the initial PWA manifest and shell changes.
- On a local Playwright browser against the packaged `dist` build, service worker `gdfg-static-v9` activated and cached `offline.html`, `manifest.webmanifest`, and `pages/finance-studio.html`. With network disabled, the finance page loaded from cache; an uncached nested route displayed the offline fallback and resolved its CSS and finance link to the site root correctly. Network was restored after the check.
- A synthetic `beforeinstallprompt` event exposed the install button in a prior local browser check. This only checks the event handler; actual platform installation, mobile behavior, update lifecycle, and complete console/accessibility review remain unverified.
- Initial PWA changes were published at `e5b7cc9ffb1f4d8964b09a55eff999368252de0a`; exact-SHA run 42770239358 passed build/test and Pages deployment.
- Follow-on v11 smoke initially found a duplicate `pages/health.html` URL in the precache array, preventing worker registration. Removed the duplicate, added a regression test, and verified locally that `gdfg-static-v11` activates; offline navigation rendered the cached Health page, all 17 options, the site-wide Emergency link and stylesheet.
- v11 was published at `dcd5f302b5f7f8ecd1b3b4f70bf86aefc24a29f2`. Exact-SHA run 42772156153 passed build/test and Pages deploy; live manifest, offline, worker, Health and triage-script routes returned HTTP 200.

## Interactive health triage (published in `dcd5f30`)

- Added 17 selectable signs from the brief, with emergency-level routing for breathing distress, collapse/inability to rise, sudden bloat, difficult calving/heavy bleeding, suspected poisoning, and possible contagious mouth/foot lesions. Multi-select results use the highest urgency. The tool explicitly says it does not diagnose and provides no medication/dose instructions.
- A site-wide Emergency header link opens the symptom aid. Results announce through an alert/status region and provide a link to the emergency directory.
- `npm run build` succeeded; `npm test` passed 29/29 after adding urgency, required-sign, outbreak-movement, generated-page/offline-source and duplicate-precache tests. Exact-SHA run 42772156153 passed the workflow for commit `dcd5f302b5f7f8ecd1b3b4f70bf86aefc24a29f2`. Node syntax checks passed for the triage core, UI script and generator.
- Local and live Playwright smoke rendered all 17 choices. Selecting poor appetite plus breathing difficulty displayed the urgent heading, safe immediate steps, alert role and emergency-directory link. Offline local navigation to Health preserved the choices, Emergency header link, and stylesheet. This is UI smoke, not a clinical validation.
- Research checked 10 Nov 2026: NDDB bloat signs; NDDB clinical mastitis signs; ICAR-CIRB buffalo health material; and DAHD 2025 disease-control guidelines. Sources and limitations are recorded in `research/sources.md` and `research/verification-log.md`. The urgency rules and first-response wording still require a licensed local veterinarian's review; the wider disease encyclopedia remains incomplete.
- Current public repository head is `137d7796a232fba92ca54661267775b7d61a837f`; symptom triage code is in `dcd5f302b5f7f8ecd1b3b4f70bf86aefc24a29f2`. The broader disease encyclopedia and licensed clinical review remain incomplete.
