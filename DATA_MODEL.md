# Farm data model

## Storage boundary

Farm register data stays in the current browser profile under localStorage key `gdfg-records-v2`. It is not sent to GitHub Pages, a remote API, or the service worker cache. The app has no login, encryption, cross-device sync, or automatic backup. Browser storage can be read by other people using that profile, cleared by the browser, or unavailable when quota is exhausted.

## Version 2 schema

The root object has `schemaVersion: 2` and four flat arrays:

The individual breeding calendar writes to the existing `events` array with `module: "breeding"`; it does not add a separate storage table. Event dates and follow-up/window dates are user-entered and validated for format/order, not clinically calculated.

- `animals`: business ID, breed/type, estimated birth date, purchase date/cost, lactation number, last calving, current yield, notes, and generated stable `_key`.
- `milk`: date, animal ID, milking session, volume, notes, and stable `_key`.
- `expenses`: date, category, amount, notes, and stable `_key`.
- `events`: generated `id`/`_key`, module, date, optional animal ID, description, optional quantity/unit and amount, status, follow-up date, optional milk-withdrawal end date, and notes.

Event modules cover purchases/transport; milk sales and buyer settlements; feed/fodder/stock; health, vaccines and milk withdrawal; breeding/pregnancy/calving; calves; labor/handovers; daily/seasonal tasks; inventory; equipment/maintenance; cleaning/milking; weather; incidents/emergencies; other income; and water/power/utilities. This is a user-entered activity ledger: it does not compute a medicine withdrawal time, validate animal health, or replace required domain-specific professional records.

## Migration, validation and backup

On first use, a valid version-1 store under `gdfg-records-v1` is copied into version 2 with stable row keys. The original key is retained as a recovery copy; “Clear all records” removes both versions after confirmation. If storage cannot accept the migration, version-1 data is still loaded in memory and the page asks the user to export a backup.

JSON export includes the schema version and all four tables. Import accepts version 1 or 2, checks required tables, flat field values, event module IDs, duplicate animal/event IDs, numeric non-negativity, ISO calendar dates, and the 5 MB size cap; it asks for confirmation before replacing current records. CSV export produces a separate file per table and prefixes formula-leading values with an apostrophe. Import/export roundtrip behavior still needs broader browser and malformed-file testing.

Record search spans the visible register tables. The activity ledger adds module and date range filtering. Animal, milk, expense, and activity records support create, edit, and confirmed delete. There is no deletion audit trail, multi-user access, database backup, or synchronization.

## Extension rules

Keep fields flat and bounded; never store credentials, identity documents, bank details, or unnecessary personal information. Add a module only with documented field meanings, validation, export/import compatibility, migration tests, and safe worker-facing instructions. Maintain backward-compatible readers where practical and never delete a legacy store during migration.
