# Implementation status

Historical implementation snapshot; current automated and release evidence is in [PROGRESS.md](PROGRESS.md) and [VERIFICATION_EVIDENCE.md](VERIFICATION_EVIDENCE.md). Latest verified public main before current work was `0b663ddd09ae5c350f1f6948dc82da9c5ce5dde5`. This file distinguishes working code from externally verifiable requirements. Use [MASTER_CHECKLIST.md](MASTER_CHECKLIST.md) as the canonical item inventory.

## Available now

- Static, responsive multi-page guide hosted on GitHub Pages.
- Generated topic pages and cross-page text search with excerpts.
- Theme preference, browser-local checklists, cache-first service worker, annual calculator, published finance studio, and local records system with animal/milk/expense/event modules.
- Printable farm launch and employee workbook with buyer/site/vet/finance gates and a first-90-day checklist.
- Conceptual accessible one-acre farm zoning SVG; it is explicitly not to scale or construction-ready.
- Official-source research list and explicit local verification tasks.
- Published at `cd87d1b`: buyer comparison and the finance studio. Finance has a 365-day animal calendar, monthly cash flow, price and stress comparisons, local save/load, and print/CSV/JSON controls. Local browser smoke covered save/load, both downloads, chart rendering and mobile stacking; print/offline/accessibility and all stress calculations remain incomplete.
- Published records v2: stable keys, v1 migration, create/edit/delete, search and module/date filters, and 15 activity-ledger categories. Local browser smoke covered v1 migration, preserving the original key, duplicate-ID rejection, animal/milk/expense/log edits, event search, v2 JSON export/import and all four CSV download events. PWA shell is deployed; 27 local tests pass. Packaged desktop offline navigation/fallback and local symptom triage browser smoke are recorded.
- Published purchase comparison: on-page four-animal worksheet with dated AM/PM yield observations and evidence-gap display; page-session only, non-ranking and not a professional assessment.
- Published breed registry library filters/sorts the current NBAGR buffalo breed list and separates the CIRB Godavari regional profile; it intentionally does not invent missing breed-specific production, price or availability values.
- Published purchase guidance includes a vet-preparation checklist and four-animal staged plan; local professional review remains open.
- Published conceptual layout has shed, ventilation/roof heat and rain/wastewater SVGs, text flow diagrams and cost-quote collection guidance; it is not surveyed or construction-ready.
- Published employee aid has an editable illustrative schedule and handover summary with session-only checkoffs; no employee field test has occurred.
- Published milking page has a 20-step visual SOP; trained-milker, veterinarian, food-safety and buyer review remains open.
- Published feed page has a user-input fodder area coverage estimator and ration discussion-note form; it generates no individualized prescription. West Godavari yields, crop calendar, prices and nutritionist review remain open.
- Published health page has 26 source-linked summaries and filters; summaries are not vet reviewed and are not an exhaustive clinical encyclopedia.
- Published vaccination/medicine reference is non-prescriptive and links to editable health records; no vaccine calendar or medicine schedule is generated.
- Published seasonal guide has checklists and an accessible readiness diagram, citing IMD 2024 observations only as one-year context; current alerts and parcel survey remain necessary.
- Published IPM guide adds prevention-first mosquito/fly/tick/rodent guidance. Exact-SHA CI and live page/search checks passed in run `42777877013`.
- Published breed media includes an original, generic accessible buffalo silhouette. Breed-specific authentic media and livestock expert review remain open.
- Published localization switch adds persisted English/Telugu preference for shared navigation and basic controls, marks localized chrome with `lang`, and displays a notice that substantive Telugu translation is not yet reviewed. Exact-SHA run `42779209471` passed both CI jobs; live `nav.js` and home routes returned HTTP 200 with the selector present. Follow-up Playwright CLI smoke verified Telugu labels, the review notice and persistence after reload; full accessibility checks remain open.
- Published reproduction timeline adds staged service-to-newborn records, calving warning escalation and browser-local checkboxes, sourced to ICAR-CIRB/NDDB; it does not calculate a due date or permit obstetric intervention. Exact-SHA run `42782675592` passed CI and live breeding page/search routes were verified.
- Published decision center maps the brief’s 20 business questions to required evidence and app tools. Missing note/date/source returns `INSUFFICIENT EVIDENCE`; recorded material stays labeled unverified. Local browser smoke covered save/reload/clear after fixing stale in-memory state. Exact-SHA run `42785655683` passed build/deploy; live page/assets and the 0/20 Playwright snapshot were verified. It is an evidence organizer, not an integrated financial verdict.

## Major gaps

- The health, breed, feed, legal, seasonal and milking content is introductory rather than the requested complete handbook; professional review is absent.
- Breed registry filter and purchase comparison exist, but full breed profiles/photos and a nutrient-calculating ration planner are absent. The symptom navigator is a first-response routing aid, not a complete disease knowledge base or clinically reviewed decision tool. Local buyer/supplier directory, verified farmer case study and phone-confirmed emergency service directory remain absent.
- The finance studio is not a fully validated financial product: no price-by-fat/SNF settlement mode, detailed amortization, validated animal lactation curves, multi-year projections, verified local costs or accountant review. Several cost categories remain approximate or manually grouped.
- Records use a generic event ledger for many categories. Module-specific reporting/forms, additional quota/data-loss tests and professional review remain.
- Telugu localization is partial: shared navigation and basic controls have a persisted language switch, but substantive guide content remains English and the strings need native-speaker review. The browser suite now covers 14 functional/accessibility/offline/mobile checks locally; employee workflows remain a guide/checklist rather than a complete role-based mode. Broader accessibility/security checks and full requirement coverage remain absent. A real mobile overflow was found and fixed during this browser pass. The PWA install flow was only synthetically prompted; actual installation and mobile behavior remain unverified.

## Release evidence

Latest code release `9a89654ba469fdb644f6cf2be3ebd8ede1bd69cf`; exact-SHA run `42796992430` passed build, dependency audit, 48 unit tests, 15 browser/accessibility tests, content audit, Pages deployment and live post-deploy smoke. The current worktree matches `origin/main`. Documentation head `b62dc02a5c2b4d22b6f7a50be91380b022032b09` passed exact-SHA run `42782961803`. Focused Playwright CLI smoke covered live Telugu shared navigation/persistence and the breeding timeline; full browser, accessibility and health review remain incomplete.
