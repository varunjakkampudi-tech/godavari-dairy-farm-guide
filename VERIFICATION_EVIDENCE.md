# Verification evidence

## Current checkout and remote evidence

- Audited remote `main` SHA: `ad23bf7a64c4256b9bb4793bfcddf594f486a721`.
- At this audit start, local `HEAD` matched `origin/main`; the working tree was clean. The remote workbook additions were fast-forwarded without rewriting history.
- GitHub Actions run [42760014726](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42760014726) succeeded for the exact audited SHA; both `build-test` and `deploy-pages` passed.
- The next public head `7fbdb33e8eba9f61760931ec83753622bdc8fc6b` passed GitHub Actions run [42763002842](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42763002842), including both `build-test` and `deploy-pages`.
- Public repository: [GitHub](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide).
- Public Pages site: [Live app](https://varunjakkampudi-tech.github.io/godavari-dairy-farm-guide/).
- Earlier browser evidence verified homepage, calculator navigation/scenario, global search, an animal record, mobile display at 390×844, and the live conceptual layout SVG. This was a focused smoke check, not full E2E, offline, screen-reader, or accessibility certification.

## Finance studio milestone (working tree; not yet released)

- Added `pages/finance-studio.html` and `assets/finance-simulator.js`, expanded the pure finance core and unit tests, added the page to navigation/search/offline shell, and bumped the service-worker cache to v5.
- `npm run build` succeeded; `npm test` passed 19/19; `node --check assets/calculator-core.js`, `node --check assets/finance-simulator.js`, and `git diff --check` passed locally. These results do not yet represent a GitHub Actions run for this work.
- A local Playwright preview on `http://127.0.0.1:4177/pages/finance-studio.html` used a deliberately illustrative four-animal case (6 L/day each, 90% saleable, ₹60/L, ₹5,000 monthly feed per animal, ₹5,000 lease and ₹20,000 wages monthly, ₹100,000 purchase cost per animal). It rendered 4,622 saleable L, ₹2,77,344 revenue, ₹6,60,000 operating costs, ₹-3,82,656 net operating result, ₹-7,82,656 first-year cash after purchase cost, and ₹229/L break-even price. This is a deterministic software check, not a local cost estimate or a claim about actual farm viability.
- The page displayed the ₹45/₹50/₹55/₹60/₹65/₹70/₹75/₹80 comparison table and 3-vs-4 and employee-vs-owner comparisons. Browser console showed no errors in the recorded session. A 390×844 screenshot showed animal cards and action buttons stacking vertically; screenshot path `.playwright-cli/page-2026-11-10T06-01-00-421Z.png` (ignored local QA artifact). The final browser render had 12 monthly rows, two charts and zero console errors.
- Playwright also saved and reloaded “Local smoke scenario”; CSV and JSON downloads completed with filenames `godavari-monthly-cashflow.csv` and `godavari-finance-scenario.json`. The downloaded CSV header and first rows were inspected locally. Still unverified: print layout, full mobile form completion, offline mode, screen reader/accessibility, and exact-SHA CI/deployment.

## Existing test coverage

The pushed `7fbdb33` CI run covered the 14 tests then present. The current finance-studio working tree has 18 local Node tests, including annual/advanced finance calculations, backup-shape validation, local links/search coverage, diagram/workbook packaging, and buyer settlement arithmetic. It has not yet run in CI. The tests do not cover all flows named in [TEST_MATRIX.md](TEST_MATRIX.md).

## Security and accessibility limits

- No secrets were found in the earlier current-tree token-pattern scan; that is not a full historical secret scanner or dependency audit.
- The public branch was previously rewritten to GitHub noreply commit metadata, and subsequent remote commits use that metadata. Do not make another history rewrite.
- An accessible alt attribute is present on the farm SVG and checked by a unit test. No full WCAG audit, color-contrast run, keyboard/screen-reader audit, or automated accessibility report has been performed.
