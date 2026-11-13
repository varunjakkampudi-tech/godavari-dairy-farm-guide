# Godavari Dairy Farm Guide

Practical planning and operations app for a small buffalo dairy in West Godavari, Andhra Pradesh.

> **Latest release:** FAQ and offline searchable knowledge index published from `e6b8399`; exact-SHA checks, Pages deployment and live route smoke passed. See [release evidence](VERIFICATION_EVIDENCE.md) and the [full completion tracker](MASTER_CHECKLIST.md).

> **Status:** Public, research-led planning app. The code and static site are published, but local fieldwork and professional review are still open. It is educational decision support, not veterinary diagnosis, legal advice, investment advice, or a verified buyer/supplier directory. Never treat ₹70–₹80/L as a confirmed procurement rate.

[Open the live guide](https://varunjakkampudi-tech.github.io/godavari-dairy-farm-guide/) · [Source repository](https://github.com/varunjakkampudi-tech/godavari-dairy-farm-guide) · [Completion and evidence tracker](PROGRESS.md)

## Hybrid milk + calf business plan (proposal, 13 November 2026)

Read the [complete hybrid milk-shop supply, dairy collection, animal-rotation and calf-sale plan](plans/HYBRID-MILK-CALF-BUSINESS-PLAN.md). It includes a phased 2-animal partner pilot, 10-adult illustration, milk-channel allocation, calf unit economics, cash-flow and downside scenarios, safety/compliance gates and a verification checklist. **No zero-loss or guaranteed-profit claim is made.** The illustrated pilot loses cash; the illustrated ten-adult operating surplus excludes financing, depreciation and some rearing costs. This document is proposed for review and does not replace the existing calculators or veterinary/field verification.

## Open and use

Open `index.html` in a modern browser, or serve the folder using a local static web server. The app has no backend, database server, paid API, or runtime dependency. GitHub Pages paths are relative and the deployment workflow uses static files. The install prompt requires a supported browser and HTTPS; offline pages are cached after the first successful online visit.

To rebuild guide pages and run checks (Node.js 20+ recommended; browser tests need Chromium):

```sh
npm ci
npx playwright install chromium
npm run build
npm test
npm run audit:content
npm run test:e2e
```

The deployment workflow runs a live route and asset smoke after Pages deployment. To run it manually, set `SITE_URL` to the deployed Pages root before `npm run smoke:pages`.

## App features

- Responsive multi-page guide covering feasibility, breed comparison, buying, layout, feed, daily operations, milking, health/emergency contacts, seasonal care, breeding/calves, markets, staff, vaccination, pests, legal questions and local fieldwork.
- Global search now ranks guide sections, individual buffalo breeds and 37 health-condition summaries; topic filters, excerpts, keyboard Enter/Escape, section/card/row deep links, cached offline index, and a small unreviewed Telugu keyword alias map support discovery. These keyword aliases are not a Telugu content translation. The [FAQ](pages/faq.html) answers common beginner questions with direct links. Light/dark preference persists in this browser.
- The shared interface has an English/Telugu beta switch for navigation and basic controls, with the choice saved in this browser. A visible notice explains that most guide content remains English and the Telugu strings need native-speaker review; this is not yet a complete bilingual guide.
- The refreshed buffalo-head and Godavari-delta mark uses forest green (`#174b3b`), rice cream, sage and harvest gold; the interface carries the same palette in light and dark modes. The same logo and browser theme color are used across generated guides, the home page, favicon and install manifest. The responsive offline shell caches guide pages and static assets. A local packaged-build browser smoke verified cached finance navigation and the offline fallback on an uncached nested route. Actual app installation and mobile browser behavior have not been verified.
- The [annual calculator](pages/finance.html) and [finance studio](pages/finance-studio.html) estimate animal-level 365-day production calendars, monthly cash flow, EMI, depreciation, break-even, working capital and price/staff/herd/yield stress cases. Save scenarios locally, print a planning report, or export CSV/JSON. They are assumption-driven models, not forecasts; missing local evidence is reported as `INSUFFICIENT EVIDENCE`.
- Animal, milk, expense and 15-category farm activity registers support edit/delete, search, module/date filters, versioned local records, JSON/CSV export and validated JSON import. Version-1 records are migrated while retaining the original recovery copy.
- A symptom safety aid lets a user select multiple signs and routes the highest urgency to conservative first steps. It does not diagnose or prescribe; its clinical routing still requires local veterinary review. An Emergency link is available in the header on every page.
- The PWA manifest and service worker provide an install prompt on supported browsers, a versioned offline guide shell, network-first page navigation, and an offline fallback page. Open the app online once to install and populate the offline cache; confirm a page is available offline before relying on it.
- A printable [launch and employee workbook](pages/launch-workbook.html) organizes buyer, site, veterinary, finance and startup checks into 30-day, 90-day, six-month and first-year evidence gates.
- The [farm layout studio](pages/layout.html) contains accessible conceptual site, shed, front/side elevations, section, airflow/heat and drainage diagrams plus animal, clean/dirty and manure flows. Its low/medium/higher scope quote collector totals only amounts entered with a dated source, saves in this browser and exports CSV; it does not estimate market costs. The diagrams are not construction drawings; local survey, engineering review and written lease permissions are required before building.
- The [visual library](pages/visual-library.html) gathers seven locally stored, original SVG diagrams, with captions, source/license notes, related guides and full-size viewing. The images are conceptual illustrations, not farm photographs, breed proof, or construction approvals.
- The [daily operations guide](pages/operations.html) includes an editable illustrative schedule, a buyer-pickup time control that aligns the morning preparation sequence, task checkoffs and an owner handover summary. Times and durations are not a prescribed shift, overnight starts warn for review, and checkoffs are session-only.
- The [milking guide](pages/milking.html) provides a 20-step hygienic workflow, a visual sequence, abnormal-milk separation reminders and withdrawal-period cautions. Validate it against buyer requirements, product labels and professional instruction.
- The [feeding guide](pages/feeding.html) estimates annual fodder area coverage and also compares month-by-month usable green-fodder harvest against month-specific nutritionist-entered demand. Monthly inputs save in this browser and export to CSV. The month view makes seasonal deficits visible but does not forecast crops, carry surplus across months or prescribe a ration; local yields, feed quality and demand still need measurement and professional advice.
- The [health guide](pages/health.html) combines a no-diagnosis symptom navigator with 37 searchable, source-linked condition summaries. It avoids lay dosing and treatment procedures; all summaries require veterinary review and do not replace professional care.
- The [vaccination reference](pages/vaccination.html) summarizes dated DAHD national campaign guidance for FMD and brucellosis, links to 2026 field SOPs, and helps prepare animal-specific questions for a veterinarian. Current Andhra Pradesh campaign adoption and individual eligibility are unverified; the page provides no injection instructions, prescription, universal calendar, or calculated withdrawal time.
- The [breeding and calf guide](pages/breeding-calves.html#reproduction-timeline) provides a source-linked checklist from service records to newborn follow-up, including calving escalation. It does not estimate pregnancy dates or authorize obstetric intervention.
- The same guide includes an individual-animal breeding and calving calendar. Record observed events and dates supplied by a veterinarian or AI technician, filter by animal ID, and manage entries through Farm Records. Entries share the browser-local event ledger and JSON/CSV exports; the app does not assess pregnancy or calculate due dates.
- The [20-question decision center](pages/getting-started.html#decision-center) organizes required evidence for viability, herd size, breed, land, staffing, production, health, seasons and expansion. Questions remain `INSUFFICIENT EVIDENCE` until the user records a dated source; entered notes are explicitly unverified, saved locally, and linked to the relevant tools.
- The [seasonal guide](pages/seasons.html) includes summer, monsoon and cooler-period checklists with IMD context. A single year of rainfall observations is not a plot-level flood assessment; use current alerts and inspect the actual site.
- The [pest guide](pages/pests.html#pest-control-plan) uses an integrated prevention-first checklist for mosquitoes, flies, ticks and rodents, with feed/milk contamination and night-safety reminders. It intentionally omits pesticide directions; a veterinarian and current label must guide any product use.
- The [milk settlement comparison](pages/buyer-comparison.html) applies user-entered per-litre, per-kg-milk or per-kg-fat rates, rejected volume, quality adjustments and deductions. It is a calculation aid, not a directory or source of actual buyer prices.
- The [buffalo purchase worksheet](pages/buying.html#purchase-comparison) compares up to four animals' entered claims and dated morning/evening observations, then lists missing evidence. Entries are page-only and are not saved. It does not rank animals or provide veterinary clearance.
- The [breed library](pages/breeds.html) filters the ICAR-NBAGR registered-breed list and shows a generic original buffalo illustration. The illustration is not breed-specific, and individual breed media/profiles remain incomplete.

## Local data safety

Farm register entries stay on the current browser/device. They are not encrypted, synced, or backed up automatically. Browser storage can be cleared or lost. Export a JSON backup regularly and keep an independent copy. Do not use shared/public devices or enter sensitive personal/banking information. Public hosting does not upload localStorage records to the repository, but anyone using that same browser profile can access them.

## Research and decision limits

The official sources and verification queue are in [`research/sources.md`](research/sources.md) and [`research/verification-log.md`](research/verification-log.md); the build also creates a deduplicated [CSV source traceability register](research/source-register.csv), with a curated source-type class and missing dates/geography labeled explicitly. The [evidence legend](pages/research.html) distinguishes source types from farmer/seller reports, model assumptions, unverified local claims, professional judgment and physical-inspection tasks. A source class is not a truth or quality rating, and does not replace checking the cited passage. ICAR-CIRB describes the local Godavari buffalo tract; this does not establish pedigree or yield for an individual seller's animal. West Godavari district lists government veterinary facilities; call to confirm service scope and hours. FSSAI’s 11 March 2026 advisory makes registration relevant for milk producers outside a specified cooperative-member arrangement and for vendors; check the precise category for the actual sales route.

No farm visits, owner interviews, buyer calls, supplier quotes, plot survey, construction estimate, or local animal inspection have been done. The app therefore contains no “verified local farm success story,” current center price, trusted animal seller, or investment-grade profit conclusion. District comparisons and the final go/no-go decision require field evidence.

Health pages focus on recognizing warning signs, safe immediate actions, and calling a veterinarian. They intentionally omit layperson medication doses and treatment instructions. Vaccine schedules must be confirmed with the district veterinarian for the identified animal and current campaign.

## Project structure

```text
assets/       shared styles, navigation, calculators, records, offline support
pages/        separate subject guides and tools
research/     sources, source register, link audit and verification log
scripts/      reproducible page builder
tests/        calculation, import validation and static-link tests
.github/      GitHub Pages workflow
MASTER_CHECKLIST.md, IMPLEMENTATION_STATUS.md, VERIFICATION_EVIDENCE.md,
BLOCKERS.md, RESEARCH_AUDIT.md, ARCHITECTURE.md, DATA_MODEL.md,
TEST_MATRIX.md, USER_GUIDE.md, EMPLOYEE_MANUAL.md, DEPLOYMENT.md
```

The requirement-level state and evidence are tracked in [`MASTER_CHECKLIST.md`](MASTER_CHECKLIST.md). It distinguishes implemented software from local fieldwork and professional review that remain outstanding.

## Publication and contribution

This project is public on GitHub Pages. Every push to `main` builds and tests the site; the deployment job is controlled by the repository variable `PUBLISH_PAGES`. Public hosting does not make private farm records public: register data stays in the browser profile where it was entered. See [`PROGRESS.md`](PROGRESS.md) for remaining field evidence and professional reviews.

To contribute, open an issue describing the page, source, or reproducible problem. For animal-health, regulatory, price, or investment claims, include a dated primary source and note the location and limits it covers. Do not submit identifiable farm or worker information.

## Evidence and limitations

The guide separates official references, planning calculations, and local questions. Public sources do not establish current milk buyer access, procurement settlement terms, local animal prices, plot suitability, or a profitable business case for an individual farm. Those require direct, dated local evidence. Veterinary material is for recognition, prevention, recordkeeping, and escalation; a qualified veterinarian must decide diagnosis, treatment, and vaccination for each animal.

**Completion status:** the repository and app are public, but the full business platform brief is not 100% complete. See the requirement-by-requirement [master checklist](MASTER_CHECKLIST.md), [external blockers](BLOCKERS.md), and [verification evidence](VERIFICATION_EVIDENCE.md). In particular, real buyer terms, farm interviews, local quotations, plot/animal inspections, Telugu editorial review, and qualified professional review remain open.
