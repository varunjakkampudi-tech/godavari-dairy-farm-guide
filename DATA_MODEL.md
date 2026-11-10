# Data model

## Current browser register schema (version 1)

Storage key: `gdfg-records-v1`. The app stores three arrays locally:

- `animals`: `id`, `breed`, `dob`, `purchaseDate`, `cost`, `lactation`, `calving`, `yield`, `notes`.
- `milk`: `date`, `animalId`, `session`, `litres`, `notes`.
- `expenses`: `date`, `category`, `amount`, `notes`.

Backups include a top-level version/export time and the three arrays. JSON import validates the high-level shape and rejects nested field objects, caps upload size and asks before replacing existing records. CSV output neutralizes formula-leading cells.

## Limits and migration plan

There is no edit/search/filter flow, stable record UUID, date-range validation, schema migration or cross-device sync. The register has no health, feed, pregnancy/calving, calf, buyer settlement, labor/task, inventory, maintenance or incident stores. `localStorage` is appropriate for the current small first version but has size and profile-local limits. Before expanding, define stable IDs and a versioned schema; migrate data conservatively with a preserved backup and explicit failure reporting. IndexedDB is the likely next browser-only store if record volume grows.

## Buyer comparison (local work in progress)

The settlement calculator accepts a user-entered delivered volume, rejected volume, rate basis, price, optional kg/L density and fat percentage, documented adjustment and deductions. It returns payable units, gross/net amount and net per accepted litre. It does not persist an offer or establish a buyer formula. CSV export is a local download.

## Future records

Do not add guessed fields or claim complete farm management until the full record catalog in the master brief has a reviewed schema, validation, export/import coverage and user-facing safeguards.
