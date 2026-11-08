# Godavari Dairy Farm Guide

Practical planning and operations app for a small buffalo dairy in West Godavari, Andhra Pradesh.

> **Status:** local working app, research incomplete. It is educational decision support, not veterinary diagnosis, legal advice, investment advice, or verified buyer/supplier directory. Never treat ₹70–₹80/L as a confirmed procurement rate.

## Open and use

Open `index.html` in a modern browser, or serve the folder using a local static web server. The app has no backend, database server, paid API, or runtime dependency. GitHub Pages paths are relative and the deployment workflow uses static files.

To rebuild guide pages and run checks (Node.js 20+ recommended):

```sh
npm run build
npm test
```

## App features

- Responsive multi-page guide covering feasibility, breed comparison, buying, layout, feed, daily operations, milking, health/emergency contacts, seasonal care, breeding/calves, markets, staff, vaccination, pests, legal questions and local fieldwork.
- Search filters page content; light/dark preference persists in this browser.
- Calculator annualizes saleable milk by lactating days, separately totals monthly and annual costs, and calculates a break-even milk price. Enter the actual buyer settlement rate and dated cost quotes. Results are not a forecast.
- Animal, milk and expense registers are stored in browser local storage. JSON/CSV export and validated JSON import are included.
- A service worker caches the static app for repeat/offline use after the first successful load.

## Local data safety

Farm register entries stay on the current browser/device. They are not encrypted, synced, or backed up automatically. Browser storage can be cleared or lost. Export a JSON backup regularly and keep an independent copy. Do not use shared/public devices or enter sensitive personal/banking information. Public hosting does not upload localStorage records to the repository, but anyone using that same browser profile can access them.

## Research and decision limits

The official sources and verification queue are in [`research/sources.md`](research/sources.md) and [`research/verification-log.md`](research/verification-log.md). ICAR-CIRB describes the local Godavari buffalo tract; this does not establish pedigree or yield for an individual seller's animal. West Godavari district lists government veterinary facilities; call to confirm service scope and hours. FSSAI’s 11 March 2026 advisory makes registration relevant for milk producers outside a specified cooperative-member arrangement and for vendors; check the precise category for the actual sales route.

No farm visits, owner interviews, buyer calls, supplier quotes, plot survey, construction estimate, or local animal inspection have been done. The app therefore contains no “verified local farm success story,” current center price, trusted animal seller, or investment-grade profit conclusion. District comparisons and the final go/no-go decision require field evidence.

Health pages focus on recognizing warning signs, safe immediate actions, and calling a veterinarian. They intentionally omit layperson medication doses and treatment instructions. Vaccine schedules must be confirmed with the district veterinarian for the identified animal and current campaign.

## Project structure

```text
assets/       shared styles, navigation, calculator, records, offline support
pages/        separate subject guides and tools
research/     sources and verification log
scripts/      reproducible page builder
tests/        calculation, import validation and static-link tests
.github/      GitHub Pages workflow
```

## Publication

The GitHub Pages workflow is prepared, but the site is not published. The original project brief requires owner preview and explicit approval before public release. Build and test runs are independent from publication; the Pages job remains skipped unless the repository variable `PUBLISH_PAGES` is set to `true` after approval and GitHub Pages is configured. See [`PROGRESS.md`](PROGRESS.md) for work that still needs evidence or review.
