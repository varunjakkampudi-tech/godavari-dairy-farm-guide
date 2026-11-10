# Test matrix

| Area | Current evidence | Remaining acceptance work |
|---|---|---|
| Finance arithmetic | Node tests cover annual liters/revenue, annualized costs, break-even, zero output/input clamping, 365-day lactation calendar, 12 monthly cash rows, buyer-price responsiveness, animal count, staff cost, calving delay, seasonal factors, EMI, depreciation and working-capital calculation. | Finance studio browser smoke verified local save/load, CSV and JSON downloads. Remaining: every stress-case output, print, zero-yield and no-loan browser edge cases; review simplified accounting formulas. |
| Backup validation | Node tests accept simple schema and reject missing tables/IDs/nested object values. | Corrupt/oversized/wrong-version import, duplicate IDs, migration, browser roundtrip and failure quota. |
| Static routes | Test scans HTML `href`/`src` paths for missing local files. | External link health, anchors/heading IDs, Pages path and post-deploy route checks. |
| Search | Test confirms an index entry for every page and home. | Ranking, exact excerpts, topic/symptom coverage, keyboard/empty states, Telugu query and offline test. |
| Diagrams/workbook | Tests assert layout SVG packaging/alt text and workbook presence/navigation/checklist phrases. | Browser visual/mobile/print test and usability review with a worker. |
| Buyer calculator | 3 Node tests cover per-litre, per-kg milk, per-kg fat, missing density, rejection bounds, deductions and rounding tolerance. Playwright local smoke produced expected comparison and downloaded expected CSV at 390×844. | Test formula-safe CSV adversarial values, keyboard, offline/live routes and real buyer formula confirmation. |
| Finance studio | Local browser rendered a four-animal plan, price grid and comparison table with zero console errors in the observed session. | Browser automation for saved scenario restore, downloads, print, mobile, and offline behavior. |
| Browser/E2E | Earlier focused manual smoke of home, finance, search, record save and mobile layout. | Automated Playwright flows, CRUD/import/export, themes/language, emergency, employee, offline and post-deploy smoke. |
| Accessibility | Layout SVG has `role`, title/description, image alt, keyboard-operable native controls. | WCAG checks, contrast, focus, forms/errors, keyboard-only, screen reader and mobile zoom. |
| Security | CSV formula escaping, import structure checks, output escaping in record renderer, no tracked secret-file names in prior scan. | XSS audit across all dynamic HTML, broader malicious imports, dependency scan, full secret-history scan, CSP/external request review. |
| CI/CD | Run 42760014726 built/tested/uploaded/deployed exact audited SHA. | Add static analysis, E2E, accessibility, security/link/citation gates and post-deploy smoke. |

Do not mark a row complete from code inspection alone. Record exact command, exit status, commit SHA, CI URL and scope in [VERIFICATION_EVIDENCE.md](VERIFICATION_EVIDENCE.md).
