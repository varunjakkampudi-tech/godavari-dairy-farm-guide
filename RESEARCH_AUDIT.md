# Research audit

## Evidence rules

- Prefer official government, ICAR, NDDB, veterinary university and peer-reviewed sources for normative, health, nutrition and regulatory guidance.
- Every claim must be scoped to its geography, population, date and evidence type. Breed averages do not prove an individual animal's yield; historical district data do not prove today's buyer access; consumer prices are not producer prices.
- Public listings are directories, not confirmation of current service or emergency hours. Interviews require consent; self-reported accounts must remain attributed.
- Keep prescriptions, diagnosis, legal conclusions, plot engineering and profitability recommendations behind qualified review or verified inputs.

## Current source inventory

`research/sources.md` is a human-readable list of primary references. `research/verification-log.md` records claims checked and the boundaries of what they establish. References currently cover official buffalo breed information, Godavari type, animal shelter/health, NDDB nutrition and milk handling, DAHD animal-disease/fodder programs, West Godavari directories, FSSAI advisory and historical NABARD district context. The NDDB husbandry handbook is now cited for postpartum metabolic/reproductive warning-sign summaries; it contains treatment instructions that the app intentionally omits.

The generated `research/source-register.csv` now deduplicates source URLs and provides the requested columns, paraphrased claims/limits, publisher class, explicit unknown metadata, and per-URL HTTP check result/time. Some publication dates, individual access dates, geography and next-review dates remain unknown and are labeled. Publisher class is not an independent evidence-quality assessment. The HTTP audit identified transport errors and does not validate page contents, source accuracy, or claim-to-page coverage. All external URLs in the 24 app HTML pages are now checked against the inventory by a regression test. This verifies citation inventory coverage, not that every cited claim is fully supported by exact source passages; detailed claim-to-passage mapping and complete content review remain incomplete.

## Unverified or missing evidence

- No direct local farm interviews, visits, buyer calls, current procurement terms, seller/stock verification, supplier quotations, lease quotations or construction estimates have been gathered.
- No individual buffalo performance or breed-specific local availability has been verified.
- Current Andhra Pradesh vaccine calendar, clinic hours/on-call response, local fodder yields and plot flood risk are not established in this application.
- No native Telugu translation review or qualified clinical, legal, engineering, nutrition, or investment-grade financial review has occurred.
- No external photos are presently used as evidence; visual coverage is mostly text diagrams plus the local conceptual farm-zone SVG. A license/attribution ledger is still needed before adding photos.

## Audit actions

1. Verify source metadata against each original page and map each substantive claim to the exact supporting passage.
2. Re-run the automated HTTP check when the source list changes; resolve or retain clear transport-error labels and record human source review dates for links used by live pages.
3. Add a structured content/evidence type for official fact, study, historical statistic, self-report, model assumption, local unverified claim, professional review, and physical inspection.
4. Keep local fieldwork requests in [BLOCKERS.md](BLOCKERS.md) until evidence is actually obtained.
