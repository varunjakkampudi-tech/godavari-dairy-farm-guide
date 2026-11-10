# Implementation status

Snapshot before the current IPM release: public `main` at `2e607977a4fe91b8642ad802ec51ae4642fec6e7`; the IPM work in the current checkout is local and not yet published. This file distinguishes working code from externally verifiable requirements. Use [MASTER_CHECKLIST.md](MASTER_CHECKLIST.md) as the canonical item inventory.

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
- Published health page has 23 source-linked summaries and filters; summaries are not vet reviewed and are not an exhaustive clinical encyclopedia.
- Published vaccination/medicine reference is non-prescriptive and links to editable health records; no vaccine calendar or medicine schedule is generated.
- Published seasonal guide has checklists and an accessible readiness diagram, citing IMD 2024 observations only as one-year context; current alerts and parcel survey remain necessary.
- Local IPM builder adds prevention-first mosquito/fly/tick/rodent guidance; 43 tests pass locally, publication pending.

## Major gaps

- The health, breed, feed, legal, seasonal and milking content is introductory rather than the requested complete handbook; professional review is absent.
- Breed registry filter and purchase comparison exist, but full breed profiles/photos and a nutrient-calculating ration planner are absent. The symptom navigator is a first-response routing aid, not a complete disease knowledge base or clinically reviewed decision tool. Local buyer/supplier directory, verified farmer case study and phone-confirmed emergency service directory remain absent.
- The finance studio is not a fully validated financial product: no price-by-fat/SNF settlement mode, detailed amortization, validated animal lactation curves, multi-year projections, verified local costs or accountant review. Several cost categories remain approximate or manually grouped.
- Records use a generic event ledger for many categories. Module-specific reporting/forms, additional quota/data-loss tests and professional review remain.
- There is no bilingual localization system, comprehensive employee mode (the current schedule is a starter task aid), automated browser suite, accessibility/security pipeline or complete requirement coverage. The PWA install flow was only synthetically prompted; actual installation and mobile behavior remain unverified.

## Release evidence

Latest verified public release before IPM: `2e607977a4fe91b8642ad802ec51ae4642fec6e7`; seasonal page and SVG returned HTTP 200 after exact-SHA CI passed. IPM source changes currently pass build and 43 tests; exact-SHA workflow and live route verification are pending. The larger health encyclopedia and licensed local clinical review remain incomplete.
