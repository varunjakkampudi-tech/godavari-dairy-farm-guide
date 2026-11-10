# Verification evidence

## Current checkout and remote evidence

- Audited remote `main` SHA: `ad23bf7a64c4256b9bb4793bfcddf594f486a721`.
- At this audit start, local `HEAD` matched `origin/main`; the working tree was clean. The remote workbook additions were fast-forwarded without rewriting history.
- GitHub Actions run [42760014726](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide/actions/runs/42760014726) succeeded for the exact audited SHA; both `build-test` and `deploy-pages` passed.
- Public repository: [GitHub](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide).
- Public Pages site: [Live app](https://varunjakkampudi-tech.github.io/godavari-dairy-farm-guide/).
- Earlier browser evidence verified homepage, calculator navigation/scenario, global search, an animal record, mobile display at 390×844, and the live conceptual layout SVG. This was a focused smoke check, not full E2E, offline, screen-reader, or accessibility certification.

## Local work in progress (not yet in CI)

- Added `assets/market-core.js`, `assets/market-tool.js`, `pages/buyer-comparison.html`, navigation/offline-cache entries and three tests.
- Local `npm run build` succeeded and `npm test` passed 14/14 in this working tree after correcting a floating-point tolerance expectation. No commit or remote CI result exists yet for these changes.
- Playwright CLI on the local static preview verified the form result for 100 L at ₹60/L with ₹10 deduction vs 100 L at ₹55/L: ₹5,990 vs ₹5,500, difference ₹490. CSV download succeeded and contained both rows. A formula-leading buyer label (`=SUM(1,1)`) was escaped with a leading apostrophe in the CSV export. No console errors on a clean localhost origin. The offers stack vertically at 390×844. Latest mobile screenshot: `.playwright-cli/page-2026-11-10T05-33-06-260Z.png`.
- An initial local browser session reported a cached JavaScript syntax error after a file edit. A clean localhost origin loaded the corrected script with no errors. Browser verification was repeated rather than inferring UI correctness from unit tests.
- Still needed: offline route and live Pages route after deployment; browser check was on a local static server.

## Existing test coverage

The 14 local Node tests cover annual calculator calculations, backup-shape validation, local asset links, search-index coverage, layout diagram packaging/alt text, launch workbook presence, and buyer settlement arithmetic/input bounds. They do not cover all app flows named in [TEST_MATRIX.md](TEST_MATRIX.md).

## Security and accessibility limits

- No secrets were found in the earlier current-tree token-pattern scan; that is not a full historical secret scanner or dependency audit.
- The public branch was previously rewritten to GitHub noreply commit metadata, and subsequent remote commits use that metadata. Do not make another history rewrite.
- An accessible alt attribute is present on the farm SVG and checked by a unit test. No full WCAG audit, color-contrast run, keyboard/screen-reader audit, or automated accessibility report has been performed.
