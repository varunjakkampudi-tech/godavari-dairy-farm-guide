const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '..', 'pages', 'breeding-calves.html');
let html = fs.readFileSync(file, 'utf8');
if (!html.includes('id="breeding-calendar"')) {
  const section = `<section class="panel" id="breeding-calendar" aria-labelledby="breeding-calendar-heading"><h2 id="breeding-calendar-heading">Individual animal breeding and calving calendar</h2><p>Record observed dates and dates supplied by your veterinarian or AI technician. For an estimated calving window, enter its start as the event date and its end below. This calendar makes no pregnancy assessment and calculates no due date. Entries are part of the browser-local Farm Records event ledger and its JSON/CSV backups.</p><form id="breeding-event-form" class="formgrid"><label>Animal ID<input name="animalId" maxlength="32" required></label><label>Milestone<select name="milestone" required><option>Heat or service observed</option><option>Veterinarian-recorded pregnancy check</option><option>Veterinarian-estimated calving window</option><option>Calving observed</option><option>Newborn calf follow-up</option><option>Other professional follow-up</option></select></label><label>Event date or window start<input name="date" type="date" required></label><label>Window end / next follow-up date, if supplied<input name="followUpDate" type="date"></label><label>Event details<input name="detail" maxlength="140" placeholder="For example: technician visit recorded"></label><label>Notes<input name="notes" maxlength="300"></label><div><button class="button" type="submit">Save breeding event</button></div></form><p id="breeding-calendar-status" role="status" aria-live="polite"></p><label>Filter this calendar by animal ID<input id="breeding-animal-filter" type="search" autocomplete="off"></label><div id="breeding-calendar-list" class="tablewrap" aria-live="polite"></div><p class="muted">To edit or delete a saved entry, open <a href="records.html">Farm Records</a> and filter the activity log to Breeding and calving. Dates saved here are user-entered observations or professional estimates, not verified by the app.</p></section>`;
  const end = html.indexOf('</article>');
  if (end < 0) throw new Error('Breeding page article insertion point missing');
  html = html.slice(0, end) + section + html.slice(end);
}
if (!html.includes('assets/breeding-calendar.js')) {
  const head = html.indexOf('</head>');
  if (head < 0) throw new Error('Breeding page head insertion point missing');
  html = html.slice(0, head) + '<script defer src="../assets/records-core.js"></script><script defer src="../assets/breeding-calendar.js"></script>' + html.slice(head);
}
fs.writeFileSync(file, html);
