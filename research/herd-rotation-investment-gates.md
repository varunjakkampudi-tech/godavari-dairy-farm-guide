# ₹15 lakh staggered buffalo dairy — investment decision and validation register

**Version:** 2026-11-11. **Status:** NOT INVESTMENT-APPROVED. This is an analytical scenario, not a validated purchase plan. Do not claim "24×7 profit" or zero-loss operation.

## Decision

**NO-GO for unconditional purchase of 8–10 animals at present.** Launch only after written buyer milk settlements, animal-level observed yield, feed and staffing quotations, lease/site suitability and a conservative 24-month model all pass. A full 8-head herd may be unaffordable if animals producing >10 L on sale day cost significantly more than the ₹1.10 lakh assumption. Retain a protected **₹3.10 lakh cash reserve**; do not treat unspent initial capital as profit.

### Proven biology versus assumptions

- ICAR-CIRB Murrah breed parameters: lactation **290–310 days**, calving interval **14.1–19.9 months**, age at first calving **39.9–54.2 months**, 305-day milk yield **1,003–2,057 kg** in the published range (exceptional animals exceed this). Sources: [ICAR-CIRB breeds](https://cirb.res.in/buffalo-breeds/), [Murrah profile](https://cirb.res.in/murrah/).
- Central illustration uses 300 milking days, 453-day calving interval. Long-run milking fraction is 300/453 = **66.2%**, or about 5.3 milking animals out of eight, not eight permanently. Observed farm yield and timing can differ.
- NDDB warns that field buffalo age at first calving is often 43–47 months; 1–2-year calves are **not** milk-ready replacement buffaloes. [NDDB calf rearing](https://www.nddb.org/services/animalnutrition/programmes/calf-rearing-programme).
- Milk buyer rate ₹75/L, animal purchase ₹1.10 lakh/head, adult feed ₹240/day, staff+overhead ₹40,000/month, calf rearing ₹1,500/month each, and every two-month calving target are **assumptions**, not Bhimavaram/Tanuku/Palakollu verified quotes.
- Reference benchmark for a different geographic market and 8 L/day animal: [NABARD 2025–26 sample buffalo unit costs](https://www.nabard.org/auth/writereaddata/tender/pub_2105250400341558.pdf). Never mistake a bank model rate for a seller's actual 10+ L animal price.
- Do not confuse **litres/day**, **kg milk/day**, breed average, lactation average, and a peak observed yield. Fat/SNF settlement deductions, rejected milk and buyer payment cadence are buyer-specific.

## Initial investment — model allowance

| Category | ₹ |
|---|---:|
| 8 adults at ₹1.10 lakh/head | 8,80,000 |
| Housing, water, drainage and cooling | 2,00,000 |
| Milking/hygiene equipment | 40,000 |
| Lease deposits, transport and initial related expenses | 70,000 |
| Protected liquidity | **3,10,000** |
| **Total** | **15,00,000** |

If the shed or eight qualifying animals exceed these allowances, **reduce animal count** and recalculate, rather than financing the difference from the protected liquidity. The ₹15 lakh must also cover any lender margin/EMI if borrowed; enter actual monthly debt service in the model. Capital remaining at any time is not net profit.

## Purchase cohorts: proposed 4 + 2 + 2, not prescribed livestock purchases

| Cohort | When | Animals | Stage examples in simulator | Mandatory control |
|---|---|---:|---|---|
| A | Days 1–90 | 4 | 25, 130, 215, 290 days since last calving | Milk measured in morning and evening over two days, veterinary check, verified date and reproductive history |
| B | Day 91 onward | +2 | 45, 225 days since last calving | Only if actual receipts and feed costs support adding animals |
| C | Day 181 onward | +2 | 75, 280 days since last calving | Only if 90-day forward downside case preserves sufficient cash |

The model's dates are examples, **not claims about animals available for purchase**. Each animal requires its own ID, identification and owner proof, last calving date, pregnancy examination by a qualified professional, individual observed yield, feed condition, quarantine and vet-approved health protocol.

## How income actually works

Daily milk revenue earned = sum over actively lactating adults of (modeled yield adjusted for stage × saleable fraction × actual buyer price). *Cash received* happens only after the entered buyer payment delay. Feed applies to **all purchased adults**, including pregnant and dry buffaloes; calf costs start once a calf is born. Building expenditure, livestock purchases, calf care, missed milk, and worker salary are separate outflows.

The scenario uses a normalized declining lactation curve—not a fitted Murrah population yield model—and assumes repeat conception/calving intervals. A successful model run is **not a forecast of pregnancy**, risk-free production, or guaranteed profit. There is **no assumed calf sale income** until actual signed sale contracts and incurred rearing costs support it. **Zero milk sold days** and **negative cash months** are both distinct indicators.

The [24-month phased simulator](../pages/herd-rotation-simulator.html) exposes the baseline and a downside case: 20% lower milking yield, ₹10/L lower realized milk price, 20% more expensive adult feed, 60 days longer calving cycle, two temporarily nonmilking adults for 60 days and a longer buyer settlement delay. Stress parameters are scenario judgments and **not probability estimates**. Even if the baseline has no zero-milk day, it can still lose cash or fall below minimum reserve.

## Executed deterministic model evidence (11 November 2026)

The fetched branch simulation core was executed with its own default inputs and independent accounting/staging/boundary assertions. The checks **passed**, but these are not a substitute for the repository's Node test suite, browser tests or hosted CI. Amounts are rounded to nearest rupee; these are **hypothetical model outputs**, not observed farm results.

| Case | 24-month milk revenue earned | Operating cash expenses | 24-month closing liquidity | Lowest liquidity | Negative operating-cash months |
|---|---:|---:|---:|---:|---:|
| 8 L/day sustained lactation average, ₹75/L | ₹19,33,016 | ₹23,93,500 | **−₹1,92,367** | **−₹1,92,367** | 23/24 |
| 10 L/day sustained average, ₹75/L | ₹24,16,270 | ₹23,93,500 | ₹2,80,417 | ₹1,87,145 | 14/24 |
| 10 L/day sustained average, ₹80/L | ₹25,77,355 | ₹23,93,500 | ₹4,38,011 | ₹2,44,565 | 9/24 |
| 12 L/day sustained average, ₹75/L | ₹28,99,524 | ₹23,93,500 | ₹7,53,200 | ₹3,05,391 | 4/24 |

Default earned revenue differs from cash received because the buyer pays with a 15-day delay, including unsettled end-of-horizon receivables. Closing liquidity is the portion of ₹15 lakh left after modeled setup, animal purchases, receipts and operating outflows; it is not net accounting profit. These cases ignore depreciation, finance interest, unpaid owner labor and real-world loss events.

**Important:** The 10 L/day scenario at ₹75/L still violates the proposed ₹3.10 lakh minimum liquidity buffer (minimum ~₹1.87 lakh). In a simplified numerical search with all other assumptions unchanged, preserving at least ₹3.10 lakh in every modeled day required around **12.2 L/day sustained average** per actively lactating animal at ₹75/L. This is *not* a suggested target or achievable guarantee; reported standard Murrah breed yields are often materially lower. The correct response is to revisit herd size, buyer rate, costs, financing, and viability—not to assume unusually high productivity.

## Conditional go/no-go gates

| Gate | Required written/observable proof | Status |
|---|---|---|
| Milk buyer | Buyer name, date, fat/SNF basis, kilograms versus litres, quality and antibiotic rejection, payment cycle, sample receipt | **OPEN** |
| Animal supply | Three independent quotations for verified >10 L/day adult animals; observed AM+PM milk for 2 days each; age, parity, health, last calving and pregnancy report | **OPEN** |
| Site | One-acre written lease, drainage and monsoon flood assessment, water volumes, shade/ventilation, shed cost and permissions | **OPEN** |
| Feed | Ration reviewed by livestock nutritionist; green/dry/concentrate supply and delivered monthly prices for wet/dry animals, calves and bad seasons | **OPEN** |
| Operations | Trained worker, paid backup, two milkings/day, sanitation, isolation/quarantine, emergency veterinarian and insurance terms | **OPEN** |
| Financial | Conservative monthly cash positive after full costs; stress-case minimum cash remains solvent; separate depreciation, interest, retained calves and owner labor | **OPEN** |
| Livestock welfare | Vet-guided heat detection, pregnancy testing, calving assistance/referral, colostrum, calf growth and withdrawal records | **OPEN** |
| Regulatory | Verify milk sale category and any FSSAI or local requirements for the exact buyer channel | **OPEN** |

**Do not substitute an online listing or AI-supplied price for a written local quote.** Actual economics and the decision gate remain insufficiently evidenced.

## Daily and monthly controls

- **Daily:** milk by animal in both sessions, discarded or rejected milk, fat/SNF, milk sold, buyer credited, water, feed purchased/consumed, animal behavior, medicine withdrawal, calf feed and expenses.
- **Weekly:** saleable litre cost, feed stock replenishment, supplier payment terms, staff backup and prospective dry-offs.
- **Monthly:** vet-confirmed pregnancy calendar, actual-versus-modeled yield, 90-day low-milk window, cash reserve, calf growth, acquisition/retirement strategy, buyer collections and animal replacement reserve.
- **At calving or illness:** seek qualified veterinarian instructions and maintain welfare, hygiene and medicine withdrawal safeguards; do not follow a financial calendar instead of veterinary judgment.

## Model audit and limitations

The site exposes [rotation core](../assets/herd-rotation-core.js), [scenario UI](../assets/herd-rotation-ui.js) and [regression tests](../tests/herd-rotation.test.js). Tests cover staged buying, payment delays, accounting reconciliation, stress impacts, calf sale assumptions and invalid inputs; do not describe them as hosted green until exact-head CI finishes. The engine does **not** model variable body condition, conception failures individually, calf death, genetic improvement, feed price seasonality, animal mortality/resale, milk fat adjustments or tax depreciation. It should be replaced with animal-level records before investment.

**Final ruling:** For a user demanding literally zero losses and positive profit every day, there is **no valid guaranteed buffalo rotation strategy**. The feasible objective is to maximize the probability of milk continuity while constraining downside losses and maintaining enough cash to survive dry periods and delayed buyer payments.
