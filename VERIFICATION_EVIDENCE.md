# Verification evidence

## Current checkout and remote evidence

- Audited remote `main` SHA: `ad23bf7a64c4256b9bb4793bfcddf594f486a721`.
- At this audit start, local `HEAD` matched `origin/main`; the working tree was clean. The remote workbook additions were fast-forwarded without rewriting history.
- GitHub Actions run [42760014726](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42760014726) succeeded for the exact audited SHA; both `build-test` and `deploy-pages` passed.
- The next public head `7fbdb33e8eba9f61760931ec83753622bdc8fc6b` passed GitHub Actions run [42763002842](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42763002842), including both `build-test` and `deploy-pages`.
- Public head `b00087d44e889cfa027c1687639464375a76c7f2` passed GitHub Actions run [42766057101](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42766057101), including both `build-test` and `deploy-pages`. Direct GET requests for `/pages/finance-studio.html` and `/assets/finance-simulator.js` returned HTTP 200.
- Public repository: [GitHub](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide).
- Public Pages site: [Live app](https://varunjakkampudi-tech.github.io/godavari-dairy-farm-guide/).
- Earlier browser evidence verified homepage, calculator navigation/scenario, global search, an animal record, mobile display at 390×844, and the live conceptual layout SVG. This was a focused smoke check, not full E2E, offline, screen-reader, or accessibility certification.

## Finance studio release

- Added `pages/finance-studio.html` and `assets/finance-simulator.js`, expanded the pure finance core and unit tests, added the page to navigation/search/offline shell, and bumped the service-worker cache to v5.
- `npm run build` succeeded; `npm test` passed 19/19; `node --check assets/calculator-core.js`, `node --check assets/finance-simulator.js`, and `git diff --check` passed locally. These results do not yet represent a GitHub Actions run for this work.
- A local Playwright preview on `http://127.0.0.1:4177/pages/finance-studio.html` used a deliberately illustrative four-animal case (6 L/day each, 90% saleable, ₹60/L, ₹5,000 monthly feed per animal, ₹5,000 lease and ₹20,000 wages monthly, ₹100,000 purchase cost per animal). It rendered 4,622 saleable L, ₹2,77,344 revenue, ₹6,60,000 operating costs, ₹-3,82,656 net operating result, ₹-7,82,656 first-year cash after purchase cost, and ₹229/L break-even price. This is a deterministic software check, not a local cost estimate or a claim about actual farm viability.
- The page displayed the ₹45/₹50/₹55/₹60/₹65/₹70/₹75/₹80 comparison table and 3-vs-4 and employee-vs-owner comparisons. Browser console showed no errors in the recorded session. A 390×844 screenshot showed animal cards and action buttons stacking vertically; screenshot path `.playwright-cli/page-2026-11-10T06-01-00-421Z.png` (ignored local QA artifact). The final browser render had 12 monthly rows, two charts and zero console errors.
- Playwright also saved and reloaded “Local smoke scenario”; CSV and JSON downloads completed with filenames `godavari-monthly-cashflow.csv` and `godavari-finance-scenario.json`. The downloaded CSV header and first rows were inspected locally. Still unverified: print layout, full mobile form completion, offline mode, screen reader/accessibility, and exact-SHA CI/deployment.

The changes above were pushed as `b00087d44e889cfa027c1687639464375a76c7f2`; exact-SHA CI and the live route are verified in the remote evidence above.

## Farm register upgrade (working tree; not yet released)

- Added `assets/records-core.js` with version-1/2 validation, migration, stable keys, date/numeric checks, and module/date/search filtering. Expanded `assets/records.js` and `pages/records.html` with version-2 storage, retained legacy recovery key, animal/milk/expense CRUD, 15 activity categories, edit/search/filter controls, and version-1/2 JSON plus four CSV-table exports. Service-worker cache was bumped to v6.
- `npm run build` and `npm test` passed locally with 24/24 tests; `node --check assets/records-core.js`, `node --check assets/records.js`, and `git diff --check` passed before the latest documentation edits.
- Local Playwright preview on port 4180 seeded a version-1 register, reloaded, confirmed schema-v2 migration with the version-1 recovery key intact, edited an animal and created milk, expense and health-log rows, rejected a duplicate animal ID, searched the log, exported JSON and all four CSV tables, and re-imported the v2 JSON after confirmation. Browser console reported zero errors. This used test-only localhost storage.
- Still needed: test expense/milk CRUD, delete confirmation, actual JSON import/export roundtrip, CSV contents, storage-quota failure, mobile/offline use, accessibility, exact-SHA CI and live Records route.

## Existing test coverage

The pushed `b00087d` CI run covered the 19 tests then present. The current local branch has 24 Node tests, including finance, record migration/validation/filtering, buyer arithmetic, local links/search, diagram and workbook packaging. The latest five record tests have not yet run in CI. The tests do not cover all flows named in [TEST_MATRIX.md](TEST_MATRIX.md).

## Security and accessibility limits

- No secrets were found in the earlier current-tree token-pattern scan; that is not a full historical secret scanner or dependency audit.
- The public branch was previously rewritten to GitHub noreply commit metadata, and subsequent remote commits use that metadata. Do not make another history rewrite.
- An accessible alt attribute is present on the farm SVG and checked by a unit test. No full WCAG audit, color-contrast run, keyboard/screen-reader audit, or automated accessibility report has been performed.
