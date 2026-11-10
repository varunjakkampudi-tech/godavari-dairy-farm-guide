# Research audit

## Evidence rules

- Prefer official government, ICAR, NDDB, veterinary university and peer-reviewed sources for normative, health, nutrition and regulatory guidance.
- Every claim must be scoped to its geography, population, date and evidence type. Breed averages do not prove an individual animal's yield; historical district data do not prove today's buyer access; consumer prices are not producer prices.
- Public listings are directories, not confirmation of current service or emergency hours. Interviews require consent; self-reported accounts must remain attributed.
- Keep prescriptions, diagnosis, legal conclusions, plot engineering and profitability recommendations behind qualified review or verified inputs.

## Current source inventory

`research/sources.md` is a human-readable list of primary references. `research/verification-log.md` records claims checked and the boundaries of what they establish. References currently cover official buffalo breed information, Godavari type, animal shelter/health, NDDB nutrition and milk handling, DAHD animal-disease/fodder programs, West Godavari directories, FSSAI advisory and historical NABARD district context. The NDDB husbandry handbook is now cited for postpartum metabolic/reproductive warning-sign summaries; it contains treatment instructions that the app intentionally omits.

The generated `research/source-register.csv` deduplicates the current 39 source URLs and includes a curated `source_evidence_class`, paraphrased claim summaries/limits, publisher/evidence-quality caveats, explicit unknown metadata and link-check state. `research/source-evidence-classes.json` maps each URL to a controlled class; the build rejects missing, stale or undefined class IDs. `research/evidence-taxonomy.json` separates source classes from claim classes, including fact, research finding, historical statistic, farmer/seller report, model assumption/output, unverified local claim, professional judgment and physical inspection. The public research page explains that a source type is not a source-quality score or proof of a particular claim. The latest URL audit on 10 Nov 2026 covered all 39 URLs: 31 returned below 400, seven DAHD routes returned direct-HTTP 404, and the NCDFI page had a fetch transport failure. Some publication dates, individual access dates, geography and next-review dates remain unknown and are labeled. All external URLs in app HTML pages are checked against the source inventory by regression test. This verifies citation inventory coverage and source-type coverage, not that every cited claim is fully supported by an exact passage; claim-by-claim mapping, source-quality review and complete content review remain incomplete.

## Unverified or missing evidence

- No direct local farm interviews, visits, buyer calls, current procurement terms, seller/stock verification, supplier quotations, lease quotations or construction estimates have been gathered.
- No individual buffalo performance or breed-specific local availability has been verified.
- Current Andhra Pradesh vaccine calendar, clinic hours/on-call response, local fodder yields and plot flood risk are not established in this application.
- No native Telugu translation review or qualified clinical, legal, engineering, nutrition, or investment-grade financial review has occurred.
- No external photos are presently used as evidence; visual coverage is mostly text diagrams plus the local conceptual farm-zone SVG. A license/attribution ledger is still needed before adding photos.

## Audit actions

1. Verify source metadata against each original page and map each substantive claim to the exact supporting passage.
2. Re-run the automated HTTP check when the source list changes; resolve or retain clear transport-error labels and record human source review dates for links used by live pages.
3. Extend the new source-class register into claim-by-claim evidence annotations across all app content; attach the exact source passage, geography/date, reviewer and verification state to each material claim.
4. Keep local fieldwork requests in [BLOCKERS.md](BLOCKERS.md) until evidence is actually obtained.
