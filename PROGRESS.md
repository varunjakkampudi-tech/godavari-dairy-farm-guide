# Completion tracker

Updated 8 November 2026. Completion means implementation plus reviewable evidence. A topic summary is not equivalent to verified local research or expert approval.

| Workstream | State | Evidence / open work |
|---|---|---|
| Static multi-page app | Implemented, first usable version | 19 guide/tool pages, responsive shared layout, page search, theme switch, navigation, static assets and service-worker cache. Browser smoke test confirmed home and finance navigation. |
| Research-backed guide content | Partial | Major topic framework and official references included. Detailed breed encyclopedia, disease-by-disease protocols, regional fodder/production data, costs, law and local buyer research require further source review and fieldwork. |
| Financial decision tool | Implemented, limited model | Annual lactating-day revenue, saleable fraction, monthly/annual costs, operating margin and break-even price; 5,928 L scenario checked in browser. Excludes owner labor, financing, tax, depreciation and replacement/mortality unless entered in costs. |
| Farm registers | Implemented, first version | Animal, milk and expense forms, local browser persistence, JSON/CSV export, JSON import validation, record deletion. Needs cross-browser import/export QA, local storage quota and data-loss behavior review. |
| Veterinary safety | Basic guardrails implemented | Emergency escalation and no untrained medication directions. Requires review by a qualified local veterinarian before being used as an employee manual. |
| Local verification | Incomplete | No farmer interviews, buyer calls, current settlements, live supplier quotes, plot visit, farm design approval or local veterinary hours confirmation. See research log. |
| Automated checks | Passing | `npm test`: 8/8 tests for calculations, data import validation and local HTML links. |
| Browser QA | Partial | Playwright CLI opened home, navigated to calculator, checked scenario output and saved/rendered an animal record. Initial missing favicon request observed; full browser console sweep and mobile screenshot review remain. |
| Local Git repository | Not initialized | Desktop project files are in place. Local repository/history still to be created. |
| GitHub repository and Pages | Not started; publication approval required | Account authentication was previously confirmed and suggested repository was absent at that time. No repository created and no deployment/live URL exists. Recheck name before creation after owner preview approval. |

## Definition of done

- Requested guide topics have substantive, current, cited content and clear evidence labels.
- Disease, vaccination, nutrition, legal and financial content receives relevant professional or official review.
- Local claims are verified or plainly listed as fieldwork tasks; no farm visits, prices, contacts, quotes or profits are invented.
- Calculator formulas, record persistence, JSON/CSV roundtrip, navigation, source links and GitHub Pages paths are tested.
- Desktop/mobile browser accessibility and layout checks are recorded.
- README and maintenance instructions match the app.
- Owner reviews the complete local preview and explicitly approves public release.
- Only after approval: create the GitHub repository, publish Pages, confirm deployment checks and open the live URL.
