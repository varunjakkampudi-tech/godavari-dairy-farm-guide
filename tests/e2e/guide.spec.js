const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;
const fs=require('node:fs');

for(const route of ['/','/pages/getting-started.html','/pages/records.html','/pages/visual-library.html','/pages/breeding-calves.html','/pages/legal.html','/pages/emergency.html','/pages/research.html','/pages/operations.html','/pages/health.html','/pages/layout.html','/pages/feeding.html','/pages/vaccination.html','/pages/faq.html']){
  test(`automated accessibility scan ${route}`,async({page})=>{
    await page.goto(route);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations.map(({id,impact,help,nodes})=>({id,impact,help,nodes:nodes.length}))).toEqual([]);
  });
}

test('launch roadmap exposes all four evidence gates and remains accessible on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/pages/launch-workbook.html#decision-roadmap');
  const roadmap=page.locator('#decision-roadmap');
  for(const heading of ['Day 30 — ready before purchase','Day 90 — controlled pilot','Month 6 — season and resilience','Month 12 — complete annual cycle']) await expect(roadmap.getByRole('heading',{name:heading})).toBeVisible();
  for(const id of ['gate30-result','gate90-result','gate6m-result','gate12m-result']) await expect(page.locator(`#${id}`)).toBeVisible();
  const results=await new AxeBuilder({page}).include('#decision-roadmap').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations.map(({id,impact,help,nodes})=>({id,impact,help,nodes:nodes.length}))).toEqual([]);
  expect(await page.locator('body').evaluate(el=>el.scrollWidth<=innerWidth)).toBeTruthy();
});

test('vaccination guide distinguishes national campaign guidance from local authorization',async({page})=>{
  await page.goto('/pages/vaccination.html');
  await expect(page.getByRole('heading',{name:'National programme context checked 10 November 2026'})).toBeVisible();
  await expect(page.locator('article')).toContainText('female bovine calves aged 4–8 months');
  await expect(page.locator('article')).toContainText('current Andhra Pradesh campaign');
  await expect(page.locator('article')).toContainText('has not verified Andhra Pradesh adoption');
  await expect(page.locator('article')).toContainText('No product list, dose, self-medication instruction');
  await expect(page.getByRole('link',{name:'Open farm records to enter a vet-confirmed health event'})).toHaveAttribute('href','records.html#event-form');
  for(const source of ['OperationalGuidelinesforLHDCP21052025.pdf','OMWithAnnex.pdf','SOPBrucellosis.pdf']) await expect(page.locator(`a[href*="${source}"]`).first()).toBeVisible();
});

test('research page downloads the deduplicated source traceability CSV',async({page})=>{
  await page.goto('/pages/research.html');
  await expect(page.getByRole('heading',{name:'Evidence types: what a source can and cannot establish'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Open the machine-readable evidence definitions'})).toHaveAttribute('href','../research/evidence-taxonomy.json');
  const link=page.getByRole('link',{name:'Download the source traceability register (CSV)'});
  await expect(link).toBeVisible();
  const [download]=await Promise.all([page.waitForEvent('download'),link.click()]);
  const contents=fs.readFileSync(await download.path(),'utf8');
  expect(download.suggestedFilename()).toBe('source-register.csv');
  expect(contents).toContain('publication_date_or_edition');
  expect(contents).toContain('source_evidence_class');
  expect(contents).toContain('link_check_status');
  expect(contents).toContain('market_context_not_producer_price');
  expect(contents).toContain('Not stated in source inventory; verify source');
  expect(contents).toContain('fssai.gov.in/upload/advisories/2026/03');
});

test('legal guide explains the exact cooperative milk exception conditions',async({page})=>{
  await page.goto('/pages/legal.html');
  await expect(page.getByText(/unless both conditions apply/i)).toBeVisible();
  await expect(page.getByText(/registered members of a dairy cooperative society and sell\/supply all their milk to that society/i)).toBeVisible();
  await expect(page.getByText(/If either cooperative condition is not met/i)).toBeVisible();
  await expect(page.getByRole('link',{name:'FSSAI milk producer advisory, 11 March 2026'})).toHaveAttribute('href',/fssai\.gov\.in\/upload\/advisories\/2026\/03/);
});

test('visual library loads original diagrams, captions, and related links',async({page})=>{
  await page.goto('/pages/visual-library.html');
  await expect(page.getByRole('heading',{name:'Visual library'})).toBeVisible();
  const cards=page.locator('.visual-card');
  await expect(cards).toHaveCount(7);
  await expect(page.getByRole('heading',{name:'Shed front, side and section views'})).toBeVisible();
  for(const image of await cards.locator('img').all()){
    await expect(image).toBeVisible();
    expect(await image.evaluate(el=>el.naturalWidth)).toBeGreaterThan(0);
    await expect(image).toHaveAttribute('alt',/diagram/);
  }
  await expect(page.getByText(/not photographs of real local farms/)).toBeVisible();
  await expect(page.getByRole('link',{name:'Open full-size illustration'}).first()).toHaveAttribute('target','_blank');
});

test('layout quote collector saves documented subtotals, exports safe CSV and clears locally',async({page})=>{
  await page.goto('/pages/layout.html');
  await expect(page.locator('.farm-plan img[src="../assets/shed-elevations.svg"]')).toHaveAttribute('alt',/front elevation, side elevation, and airflow section/i);
  const low=page.locator('.quote-scenario[data-scenario="low"]');
  await low.getByRole('button',{name:'Add cost item'}).click();
  await low.locator('[data-field="item"]').fill('Roof repair');
  await low.locator('[data-field="amount"]').fill('12000');
  await low.locator('[data-field="evidence"]').fill('Local estimate · 2026-11-10');
  await expect(low.locator('.quote-total')).toContainText('12,000');
  const medium=page.locator('.quote-scenario[data-scenario="medium"]');
  await medium.getByRole('button',{name:'Add cost item'}).click();
  await medium.locator('[data-field="item"]').fill('=HYPERLINK("x")');
  await medium.locator('[data-field="amount"]').fill('1');
  await medium.locator('[data-field="evidence"]').fill('Test quotation · 2026-11-10');
  await page.reload();
  await expect(low.locator('[data-field="item"]')).toHaveValue('Roof repair');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#quote-export').click();
  const download=await downloadPromise;
  const fs=require('node:fs/promises');
  const csv=await fs.readFile(await download.path(),'utf8');
  expect(csv).toContain('"\'=HYPERLINK(""x"")"');
  expect(csv).toContain('"12000"');
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#quote-clear').click();
  await expect(low.locator('.quote-row')).toHaveCount(0);
  await expect(page.locator('#quote-status')).toContainText('cleared');
});

test('monthly fodder planner exposes seasonal gaps, persists inputs and exports a transparent plan',async({page})=>{
  await page.goto('/pages/feeding.html');
  const tool=page.locator('#seasonal-feed-planner');
  await expect(tool.getByRole('heading',{name:'Check fodder balance month by month'})).toBeVisible();
  await tool.locator('input[name="year"]').fill('2028');
  for(let month=0;month<12;month++){
    await tool.locator(`input[name="available"][data-month="${month}"]`).fill(month===0?'400':'0');
    await tool.locator(`input[name="dailyDemand"][data-month="${month}"]`).fill('10');
  }
  await expect(tool.locator('#seasonal-feed-result')).toContainText('Annual as-fed availability: 400 kg');
  await expect(tool.locator('#seasonal-feed-result')).toContainText('Annual coverage: 10.9%');
  await expect(tool.locator('#seasonal-feed-result table tbody tr').first()).toContainText('January');
  await expect(tool.locator('#seasonal-feed-result table tbody tr').first()).toContainText('310');
  await page.reload();
  await expect(tool.locator('input[name="year"]')).toHaveValue('2028');
  await expect(tool.locator('input[name="available"][data-month="0"]')).toHaveValue('400');
  const [download]=await Promise.all([page.waitForEvent('download'),tool.locator('#seasonal-feed-export').click()]);
  const csv=await require('node:fs/promises').readFile(await download.path(),'utf8');
  expect(csv).toContain('February');
  expect(csv).toContain('User-entered, unverified farm inputs');
  page.once('dialog',dialog=>dialog.accept());
  await tool.locator('#seasonal-feed-clear').click();
  await expect(tool.locator('#seasonal-feed-status')).toContainText('cleared');
});

test('breed registry filters and sorts the sourced list including the regional type',async({page})=>{
  await page.goto('/pages/breeds.html');
  const rows=page.locator('#breed-table tbody tr');
  await expect(rows).toHaveCount(24);
  await expect(page.locator('#breed-count')).toHaveText('24 of 24 entries');
  await page.locator('#breed-kind').selectOption({label:'Regional population / type'});
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('Godavari');
  await page.locator('#breed-kind').selectOption({value:'all'});
  await page.locator('#breed-search').fill('Murrah');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('Murrah');
  await page.locator('#breed-search').fill('');
  await page.locator('#breed-sort').selectOption('tract');
  const tracts=await page.locator('#breed-table tbody tr td:nth-child(3)').allTextContents();
  expect(tracts).toEqual([...tracts].sort((a,b)=>a.localeCompare(b)));
});

test('original local Godavari buffalo-and-river logo loads and stays linked to home',async({page})=>{
  await page.goto('/');
  const brand=page.locator('.brand');
  await expect(brand).toHaveAttribute('href','index.html');
  await expect(brand).toContainText('Godavari Dairy Farm Guide');
  const mark=brand.locator('img.brand-mark');
  await expect(mark).toHaveAttribute('src','assets/brand-mark.svg');
  expect(await mark.evaluate(el=>el.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href','assets/favicon.svg');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content','#174b3b');
  await expect(page.locator('header')).toHaveCSS('background-color','rgb(23, 75, 59)');
});

test('decision evidence requires note, date and source and persists across reload',async({page})=>{
  await page.goto('/pages/getting-started.html');
  await expect(page.locator('.decision-card')).toHaveCount(20);
  await expect(page.locator('#business-evidence-summary')).toContainText('0 of 20');
  await expect(page.locator('#decision-status-viability')).toHaveText('INSUFFICIENT EVIDENCE');
  await page.locator('#decision-note-viability').fill('Buyer settlement document reviewed');
  await page.locator('#decision-date-viability').fill('2026-11-10');
  await page.locator('#decision-source-viability').fill('Buyer quote ref E2E-1');
  await expect(page.locator('#decision-status-viability')).toContainText('EVIDENCE RECORDED');
  await expect(page.locator('#business-review-count')).toContainText('1/20');
  await page.reload();
  await expect(page.locator('#decision-note-viability')).toHaveValue('Buyer settlement document reviewed');
  await expect(page.locator('#business-review-count')).toContainText('1/20');
  await page.emulateMedia({media:'print'});
  await expect(page.locator('.decision-print-header')).toBeVisible();
  await expect(page.locator('#business-review-date')).not.toBeEmpty();
});

test('buyer-entered fat/SNF settlement calculates net realization without supplying default local rates',async({page})=>{
  await page.goto('/pages/finance-studio.html');
  await expect(page.locator('#settlement-result')).toContainText('No settlement calculated');
  await page.locator('#settlement-basis').selectOption('fat-snf');
  await page.locator('#settlement-litres').fill('100');
  await page.locator('#settlement-fat').fill('7');
  await page.locator('#settlement-snf').fill('9');
  await page.locator('#settlement-fat-rate').fill('180');
  await page.locator('#settlement-snf-rate').fill('40');
  await page.locator('#settlement-deductions').fill('20');
  await page.getByRole('button',{name:'Calculate tested settlement'}).click();
  await expect(page.locator('#settlement-result')).toContainText('₹1,620');
  await expect(page.locator('#settlement-result')).toContainText('₹1,600');
  await expect(page.locator('#settlement-result')).toContainText('₹16/L');
  await expect(page.locator('#settlement-result')).toContainText('does not verify');
});
test("finance monthly plan applies buyer fat/SNF rates and each month pooled test results",async({page})=>{
  await page.goto('/pages/finance-studio.html');
  await page.locator('[name="pricingMode"]').selectOption('fat-snf');
  await page.locator('[name="fatRate"]').fill('180');
  await page.locator('[name="snfRate"]').fill('40');
  await page.locator('[name="deductionPerLitre"]').fill('0.3');
  await page.locator('[name="monthlyDeduction"]').fill('10');
  for(let month=1;month<=12;month++){
    await page.locator(`[name="milkFat${month}"]`).fill('7');
    await page.locator(`[name="milkSnf${month}"]`).fill('9');
  }
  await page.locator('[name="lease"]').fill('10000');
  await page.locator('[name="water"]').fill('1000');
  await page.locator('[name="wages"]').fill('15000');
  await page.locator('[name="vetAnnual"]').fill('12000');
  await page.locator('[name="fodderMonthly"]').fill('1000');
  for(let i=1;i<=4;i++){
    await page.locator(`[name="yield${i}"]`).fill('5');
    await page.locator(`[name="purchase${i}"]`).fill('100000');
    await page.locator(`[name="animalFeed${i}"]`).fill('5000');
  }
  await page.getByRole('button',{name:'Build monthly plan'}).click();
  const result=page.locator('#studio-results');
  await expect(result).toContainText('SCENARIO ONLY');
  await expect(result).toContainText('Buyer rate(s) −15%');
  await expect(result.locator('table').first()).toContainText('₹16/L');
  await expect(result.locator('table').first()).toContainText('₹2,260');
});test('finance studio flags absent buyer, animal, feed, lease, water, labor and veterinary evidence',async({page})=>{
  await page.goto('/pages/finance-studio.html');
  await page.getByRole('button',{name:'Build monthly plan'}).click();
  const result=page.locator('#studio-results');
  await expect(result).toContainText('INSUFFICIENT EVIDENCE');
  for(const issue of ['No buyer-confirmed flat milk price entered','lack observed yield or purchase cost','Feed/fodder cost is missing','Land lease cost is missing','Water cost is missing','Labor value is missing','Veterinary/breeding budget is missing']) await expect(result).toContainText(issue);
  await expect(result).not.toContainText('EVIDENCE RECORDED');
});
test('finance studio calculates a scenario but keeps the result explicitly unverified',async({page})=>{
  await page.goto('/pages/finance-studio.html');
  await page.locator('[name="price"]').fill('60');
  await page.locator('[name="lease"]').fill('10000');
  await page.locator('[name="fodderMonthly"]').fill('20000');
  await page.locator('[name="wages"]').fill('15000');
  await page.locator('[name="water"]').fill('2000');
  await page.locator('[name="vetAnnual"]').fill('12000');
  for(let i=1;i<=4;i++){
    await page.locator(`[name="yield${i}"]`).fill('5');
    await page.locator(`[name="purchase${i}"]`).fill('100000');
  }
  await page.getByRole('button',{name:'Build monthly plan'}).click();
  await expect(page.locator('#studio-results')).toContainText('SCENARIO ONLY');
  await expect(page.locator('#studio-results')).toContainText('evidence not independently verified');
  await expect(page.locator('#studio-results')).toContainText('Month 12');
});

test('finance studio saves and restores assumptions and exports report data',async({page})=>{
  await page.goto('/pages/finance-studio.html');
  await page.locator('[name="pricingMode"]').selectOption('fat-snf');
  await page.locator('[name="fatRate"]').fill('183.5');
  await page.locator('[name="snfRate"]').fill('41.25');
  await page.locator('[name="milkFat1"]').fill('7.2');
  await page.locator('[name="milkSnf1"]').fill('9.1');
  await page.locator('[name="yield1"]').fill('8.4');
  await page.locator('[name="purchase1"]').fill('245000');
  await page.getByRole('button',{name:'Build monthly plan'}).click();
  page.once('dialog',dialog=>dialog.accept('Verified input example'));
  await page.getByRole('button',{name:'Save scenario'}).click();
  await expect(page.locator('#saved-scenarios')).toContainText('Load Verified input example');
  await page.reload();
  await expect(page.locator('#saved-scenarios')).toContainText('Load Verified input example');
  await page.locator('#saved-scenarios button[data-load="0"]').click();
  await expect(page.locator('[name="pricingMode"]')).toHaveValue('fat-snf');
  await expect(page.locator('[name="fatRate"]')).toHaveValue('183.5');
  await expect(page.locator('[name="snfRate"]')).toHaveValue('41.25');
  await expect(page.locator('[name="milkFat1"]')).toHaveValue('7.2');
  await expect(page.locator('[name="milkSnf1"]')).toHaveValue('9.1');
  await expect(page.locator('[name="yield1"]')).toHaveValue('8.4');
  const [csvDownload]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export monthly CSV'}).click()]);
  const csvText=fs.readFileSync(await csvDownload.path(),'utf8');
  expect(csvDownload.suggestedFilename()).toBe('godavari-monthly-cashflow.csv');
  expect(csvText).toContain('Month,Saleable litres,Pooled fat %,Pooled SNF %');
  expect(csvText).toContain('7.2,9.1');
  const [jsonDownload]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export JSON'}).click()]);
  const json=JSON.parse(fs.readFileSync(await jsonDownload.path(),'utf8'));
  expect(json.plan.base.fatRate).toBe(183.5);
  expect(json.plan.animals[0].purchasePrice).toBe(245000);
  await page.emulateMedia({media:'print'});
  await expect(page.locator('#studio-results table').first().locator('tbody tr')).toHaveCount(12);
  await expect(page.locator('#studio-results table').first().locator('tbody tr').last()).toContainText('12');
  await expect(page.locator('#studio-results')).toContainText('INSUFFICIENT EVIDENCE');
});

test('farm animal records save in browser storage and survive reload',async({page})=>{
  await page.goto('/pages/records.html');
  await page.locator('#animal-form [name="id"]').fill('BUF-E2E-01');
  await page.locator('#animal-form [name="breed"]').fill('Test entry');
  await page.locator('#animal-form [name="yield"]').fill('5');
  await page.getByRole('button',{name:'Save animal'}).click();
  await expect(page.locator('#animal-list')).toContainText('BUF-E2E-01');
  await expect(page.locator('#record-status')).toContainText(/saved|record/i);
  await page.reload();
  await expect(page.locator('#animal-list')).toContainText('BUF-E2E-01');
});

test('emergency triage prioritizes urgent signs and reset clears the result',async({page})=>{
  await page.goto('/pages/health.html');
  const form=page.locator('#symptom-triage');
  await expect(form.locator('input[name="symptom"]')).toHaveCount(17);
  await form.locator('input[name="symptom"][value="not-eating"]').check();
  await form.locator('input[name="symptom"][value="breathing"]').check();
  await form.getByRole('button',{name:'Show safe next steps'}).click();
  const result=page.locator('#triage-result');
  await expect(result).toHaveAttribute('role','alert');
  await expect(result).toContainText(/now/i);
  await expect(result.getByRole('link',{name:/emergency contacts/i})).toHaveAttribute('href','../pages/emergency.html');
  await form.getByRole('button',{name:'Clear selections'}).click();
  await expect(result).toHaveClass(/hide/);
  await expect(result).toBeEmpty();
});

test('searchable health encyclopedia exposes expanded condition guides and filters safely',async({page})=>{
  await page.goto('/pages/health.html');
  const cards=page.locator('#condition-library .condition-card');
  await expect(cards).toHaveCount(37);
  await expect(page.locator('#condition-count')).toContainText('Showing 37 of 37');
  await page.locator('#condition-search').fill('uterine prolapse');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText(/call veterinarian immediately/i);
  await page.locator('#condition-search').fill('');
  await page.locator('#condition-urgency').selectOption('urgent');
  await expect(cards).not.toHaveCount(0);
  await expect(page.locator('#condition-count')).toContainText(/of 37 condition guides/);
});

test('district veterinary contact shows live-check date and identifies office number limits',async({page})=>{
  await page.goto('/pages/emergency.html');
  await expect(page.getByText(/official directory checked 10 Nov 2026/i)).toBeVisible();
  await expect(page.getByRole('link',{name:'+91 62818 32610'})).toHaveAttribute('href','tel:+916281832610');
  await expect(page.getByText(/not advertised as 24-hour emergency hotlines/i)).toBeVisible();
  await expect(page.getByRole('link',{name:'West Godavari District Officers directory'})).toBeVisible();
});

test('purchase comparison reports observed evidence gaps without ranking animals',async({page})=>{
  await page.goto('/pages/buying.html');
  const animal=page.locator('.purchase-animal').first();
  await animal.locator('[data-k="tag"]').fill('BUY-E2E-1');
  await animal.locator('[data-k="breed"]').fill('Seller claim');
  for(const [day,date,am,pm] of [[1,'2026-11-01','4','3'],[2,'2026-11-02','5','3'],[3,'2026-11-03','4','4']]){
    await animal.locator(`[data-o="${day}"][data-part="date"]`).fill(date);
    await animal.locator(`[data-o="${day}"][data-part="am"]`).fill(am);
    await animal.locator(`[data-o="${day}"][data-part="pm"]`).fill(pm);
  }
  await page.getByRole('button',{name:'Add animal'}).click();
  const second=page.locator('.purchase-animal').nth(1);
  await second.locator('[data-k="tag"]').fill('BUY-E2E-2');
  await second.locator('[data-o="1"][data-part="date"]').fill('2026-11-01');
  await second.locator('[data-o="1"][data-part="am"]').fill('6');
  await page.getByRole('button',{name:'Compare evidence'}).click();
  const results=page.locator('#purchase-results');
  await expect(results.locator('table')).toBeVisible();
  await expect(results).toContainText('7.7 L/day');
  await expect(results).toContainText('Insufficient observations');
  await expect(results).toContainText('Independent vet examination arranged');
  await expect(results).toContainText(/does not verify them|not a recommendation/i);
  await expect(results).not.toContainText(/winner|best animal/i);
});

test('per-animal breeding events persist in the calendar and Farm Records backup',async({page})=>{
  await page.goto('/pages/breeding-calves.html');
  const form=page.locator('#breeding-event-form');
  await form.locator('[name="animalId"]').fill('BUF-BREED-01');
  await form.locator('[name="milestone"]').selectOption({label:'Veterinarian-estimated calving window'});
  await form.locator('[name="date"]').fill('2027-02-01');
  await form.locator('[name="followUpDate"]').fill('2027-02-15');
  await form.locator('[name="detail"]').fill('Copied from vet record');
  await form.locator('[name="notes"]').fill('Call for professional review if concerns arise');
  await form.getByRole('button',{name:'Save breeding event'}).click();
  const calendar=page.locator('#breeding-calendar-list');
  await expect(calendar).toContainText('BUF-BREED-01');
  await expect(calendar).toContainText('2027-02-01');
  await expect(calendar).toContainText('2027-02-15');
  await expect(calendar).toContainText('Veterinarian-estimated calving window');
  await expect(page.locator('#breeding-calendar-status')).toContainText('included in Farm Records JSON and CSV backups');
  await page.reload();
  await expect(calendar).toContainText('BUF-BREED-01');
  await page.locator('#breeding-animal-filter').fill('not-this-animal');
  await expect(calendar).not.toContainText('BUF-BREED-01');
  await page.locator('#breeding-animal-filter').fill('');
  await page.goto('/pages/records.html');
  await page.locator('#event-module-filter').selectOption('breeding');
  await expect(page.locator('#event-list')).toContainText('BUF-BREED-01');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export JSON backup'}).click();
  const download=await downloadPromise;
  const fs=require('node:fs/promises');
  const backup=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  expect(backup.events.some(row=>row.animalId==='BUF-BREED-01'&&row.date==='2027-02-01'&&row.followUpDate==='2027-02-15')).toBeTruthy();
});

test('breeding calendar rejects a follow-up date before the entered event date',async({page})=>{
  await page.goto('/pages/breeding-calves.html');
  const form=page.locator('#breeding-event-form');
  await form.locator('[name="animalId"]').fill('BUF-BREED-BAD');
  await form.locator('[name="date"]').fill('2027-02-15');
  await form.locator('[name="followUpDate"]').fill('2027-02-01');
  await form.getByRole('button',{name:'Save breeding event'}).click();
  await expect(page.locator('#breeding-calendar-status')).toContainText('cannot be earlier');
  await expect(page.locator('#breeding-calendar-list')).not.toContainText('BUF-BREED-BAD');
});

test('farm records support create, edit, search, and confirmed delete across register types',async({page})=>{
  await page.goto('/pages/records.html');
  await page.locator('#animal-form [name="id"]').fill('BUF-FLOW-01');
  await page.locator('#animal-form [name="breed"]').fill('Godavari type');
  await page.getByRole('button',{name:'Save animal'}).click();
  const animalRow=page.locator('#animal-list tr').filter({hasText:'BUF-FLOW-01'});
  await animalRow.getByRole('button',{name:'Edit'}).click();
  await expect(page.locator('#animal-form [name="id"]')).toHaveValue('BUF-FLOW-01');
  await page.locator('#animal-form [name="notes"]').fill('edited note');
  await page.getByRole('button',{name:'Update animal'}).click();
  await page.locator('#record-search').fill('not-present');
  await expect(animalRow).toHaveClass(/hide/);
  await page.locator('#record-search').fill('edited note');
  await expect(animalRow).not.toHaveClass(/hide/);

  await page.locator('#milk-form [name="date"]').fill('2026-11-10');
  await page.locator('#milk-form [name="animalId"]').fill('BUF-FLOW-01');
  await page.locator('#milk-form [name="session"]').fill('morning');
  await page.locator('#milk-form [name="litres"]').fill('4.5');
  await page.getByRole('button',{name:'Save milk entry'}).click();
  await expect(page.locator('#milk-list')).toContainText('4.5');

  await page.locator('#record-search').fill('');
  await page.locator('#expense-form [name="date"]').fill('2026-11-10');
  await page.locator('#expense-form [name="category"]').fill('fodder');
  await page.locator('#expense-form [name="amount"]').fill('1200');
  await page.getByRole('button',{name:'Save expense'}).click();
  const expenseRow=page.locator('#expense-list tr').filter({hasText:'fodder'});
  await expect(expenseRow).toBeVisible();
  page.once('dialog',dialog=>dialog.accept());
  await expenseRow.getByRole('button',{name:'Delete'}).click();
  await expect(expenseRow).toHaveCount(0);

  await page.locator('#event-form [name="module"]').selectOption('health');
  await page.locator('#event-form [name="date"]').fill('2026-11-10');
  await page.locator('#event-form [name="description"]').fill('Routine observation E2E');
  await page.getByRole('button',{name:'Save farm log'}).click();
  await page.locator('#event-search').fill('Routine observation E2E');
  await expect(page.locator('#event-list')).toContainText('Routine observation E2E');
  await page.locator('#event-module-filter').selectOption('incident');
  await expect(page.locator('#event-list')).not.toContainText('Routine observation E2E');
});

test('records JSON backup exports and restores validated data after confirmation',async({page})=>{
  await page.goto('/pages/records.html');
  await page.locator('#animal-form [name="id"]').fill('BUF-BACKUP-01');
  await page.getByRole('button',{name:'Save animal'}).click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export JSON backup'}).click();
  const download=await downloadPromise;
  const fs=require('node:fs/promises');
  const backup=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  expect(backup.version).toBe(2);
  expect(backup.animals.some(row=>row.id==='BUF-BACKUP-01')).toBeTruthy();
  backup.animals[0].id='BUF-RESTORED-01';
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#import-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
  await expect(page.locator('#record-status')).toContainText('Backup imported');
  await expect(page.locator('#animal-list')).toContainText('BUF-RESTORED-01');
  await expect(page.locator('#animal-list')).not.toContainText('BUF-BACKUP-01');
  await page.reload();
  await expect(page.locator('#animal-list')).toContainText('BUF-RESTORED-01');
});

test('CSV exports contain records and neutralize spreadsheet formulas',async({page})=>{
  await page.goto('/pages/records.html');
  await page.locator('#animal-form [name="id"]').fill('BUF-CSV-01');
  await page.locator('#animal-form [name="notes"]').fill('=HYPERLINK("https://example.invalid")');
  await page.getByRole('button',{name:'Save animal'}).click();
  const downloadsPromise=new Promise(resolve=>{const downloads=[];page.on('download',function collect(download){downloads.push(download);if(downloads.length===4){page.off('download',collect);resolve(downloads)}})});
  await page.getByRole('button',{name:'Export CSV tables'}).click();
  const downloads=await downloadsPromise;
  const fs=require('node:fs/promises');
  const files=await Promise.all(downloads.map(async download=>({name:download.suggestedFilename(),text:await fs.readFile(await download.path(),'utf8')})));
  expect(files.map(file=>file.name).sort()).toEqual(['godavari-animals.csv','godavari-events.csv','godavari-expenses.csv','godavari-milk.csv']);
  const animals=files.find(file=>file.name==='godavari-animals.csv').text;
  expect(animals).toContain('BUF-CSV-01');
  expect(animals).toContain('"\'=HYPERLINK(""https://example.invalid"")"');
});

test('malicious record text is rendered as text and malformed imports preserve existing records',async({page})=>{
  await page.goto('/pages/records.html');
  await page.locator('#animal-form [name="id"]').fill('BUF-XSS-01');
  await page.locator('#animal-form [name="notes"]').fill('<img src=x onerror=alert(1)>');
  await page.getByRole('button',{name:'Save animal'}).click();
  await expect(page.locator('#animal-list img')).toHaveCount(0);
  await expect(page.locator('#animal-list')).toContainText('<img src=x onerror=alert(1)>');
  await page.locator('#import-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":2,"animals":[{"id":"bad"}]}')});
  await expect(page.locator('#record-status')).toContainText('Import failed');
  await expect(page.locator('#animal-list')).toContainText('BUF-XSS-01');
});

test('theme toggle exposes the active mode and keeps its mode label accurate',async({page})=>{await page.goto('/');const toggle=page.locator('#theme-toggle');await expect(toggle).toHaveAttribute('aria-pressed','false');await expect(toggle).toHaveAttribute('aria-label','Switch to dark mode');await toggle.click();await expect(toggle).toHaveAttribute('aria-pressed','true');await expect(toggle).toHaveAttribute('aria-label','Switch to light mode');await toggle.click();await expect(toggle).toHaveAttribute('aria-pressed','false')});test('global search filters topics and deep-links breed and symptom entries with Telugu aliases',async({page})=>{await page.goto('/');await page.locator('#site-search').fill('₹70–₹80 per litre');await page.locator('#search-category').selectOption('faq');await expect(page.locator('header #search-results')).toContainText('confirmed buffalo-milk buying price');await page.locator('header #search-results a').filter({hasText:'confirmed buffalo-milk buying price'}).click();await expect(page).toHaveURL(/faq.html#faq-milk-price/);await expect(page.locator('#faq-milk-price')).toBeVisible();await page.goto('/');await page.locator('#site-search').fill('Mastitis');await expect(page.locator('header #search-results')).toBeVisible();await expect(page.locator('header #search-results')).toContainText('Mastitis / udder inflammation');await expect(page.locator('#search-results a').first()).toHaveAttribute('href',/health\.html#condition-mastitis-udder-inflammation/);await page.locator('#search-category').selectOption('breed');await expect(page.locator('header #search-results')).toContainText('No results');await page.locator('#site-search').fill('Godavari');await expect(page.locator('header #search-results')).toContainText('Godavari buffalo');await page.locator('#search-results a').filter({hasText:'Godavari buffalo'}).click();await expect(page).toHaveURL(/breeds\.html#breed-godavari/);await expect(page.locator('#breed-godavari')).toBeVisible();await page.goto('/');await page.locator('#site-search').fill('జ్వరం');await expect(page.locator('header #search-results')).toContainText(/fever|health/i);await page.locator('#site-search').press('Enter');await expect(page).toHaveURL(/health\.html#condition-/);expect(await page.evaluate(()=>!!document.getElementById(location.hash.slice(1)))).toBeTruthy()});test('global search, Telugu preference, dark theme and employee checklist persist',async({page})=>{
  await page.goto('/');
  await page.locator('#site-search').fill('Hygienic milking');
  await expect(page.locator('header #search-results')).toBeVisible();
  await expect(page.locator('header #search-results')).toContainText('Hygienic milking standard procedure');
  await page.locator('#language-toggle').selectOption('te');
  await expect(page.locator('#translation-note')).toBeVisible();
  await expect(page.locator('#language-toggle')).toHaveValue('te');
  await page.locator('#theme-toggle').click();
  const theme=await page.locator('html').getAttribute('data-theme');
  expect(theme).toBe('dark');
  await page.reload();
  await expect(page.locator('#language-toggle')).toHaveValue('te');
  await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
  await page.goto('/pages/operations.html');
  const firstTask=page.locator('[data-checklist="operations"] input[type="checkbox"]').first();
  await firstTask.check();
  await page.reload();
  await expect(page.locator('[data-checklist="operations"] input[type="checkbox"]').first()).toBeChecked();
});

test('daily operations plan aligns morning preparation to buyer pickup and flags overnight work',async({page})=>{
  await page.goto('/pages/operations.html');
  await expect(page.locator('#buyer-pickup-time')).toHaveValue('06:50');
  await page.locator('#buyer-pickup-time').fill('06:20');
  await page.locator('#align-pickup-time').click();
  await expect(page.locator('[data-time="0"]')).toHaveValue('04:30');
  await expect(page.locator('[data-time="4"]')).toHaveValue('06:05');
  await expect(page.locator('#pickup-adjustment-note')).toContainText('handoff by 06:20');
  await page.locator('#buyer-pickup-time').fill('01:00');
  await page.locator('#align-pickup-time').click();
  await expect(page.locator('#pickup-adjustment-note')).toContainText('previous day');
  await expect(page.locator('#pickup-adjustment-note')).toContainText('rest, staffing and legal working hours');
});

test('employee operations provide repeatable daily/weekly/monthly/seasonal checklists and relief coverage',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/pages/operations.html#recurring-employee-plan');
  const plan=page.locator('#recurring-employee-plan');
  const cadence=['Each shift / every day','Weekly review','Monthly owner review','Before and during changing weather'];
  await expect(plan.locator('details.workitem')).toHaveCount(4);
  for(const [index,label] of cadence.entries()) await expect(plan.locator('details.workitem summary').nth(index)).toContainText(label);
  await expect(plan).toContainText('trained relief person and a second backup');
  await expect(plan).toContainText('do not leave animals unattended');
  await plan.locator('[data-checklist="ops-weekly"] summary').click();
  const weekly=plan.locator('[data-checklist="ops-weekly"] input[type="checkbox"]').first();
  await weekly.check();
  await page.reload();
  await page.locator('#recurring-employee-plan [data-checklist="ops-weekly"] summary').click();
  await expect(plan.locator('[data-checklist="ops-weekly"] input[type="checkbox"]').first()).toBeChecked();
  const results=await new AxeBuilder({page}).include('#recurring-employee-plan').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(results.violations.map(({id,impact,help,nodes})=>({id,impact,help,nodes:nodes.length}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBeTruthy();
});

test('key app pages remain usable at a narrow mobile viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/','/pages/breeds.html','/pages/buying.html','/pages/operations.html','/pages/emergency.html','/pages/finance-studio.html','/pages/feeding.html','/pages/faq.html']){
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    const overflow=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,items:[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,id:e.id,cls:String(e.className||''),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right),width:Math.round(e.getBoundingClientRect().width)})).filter(x=>x.right>document.documentElement.clientWidth||x.left<0).slice(0,12)}));
    expect(overflow.scroll,`horizontal overflow on ${route}: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.width);
  }
});

test('cached guide and browser-local farm records remain available offline',async({page,context})=>{
  await page.goto('/pages/records.html');
  await page.locator('#animal-form [name="id"]').fill('BUF-OFFLINE-01');
  await page.getByRole('button',{name:'Save animal'}).click();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:15000});
  await context.setOffline(true);
  await page.goto('/pages/health.html');
  await expect(page.getByRole('heading',{name:/health/i}).first()).toBeVisible();
  await page.locator('#site-search').fill('mastitis');
  await expect(page.locator('header #search-results')).toContainText('Mastitis / udder inflammation');
  await page.goto('/pages/records.html');
  await expect(page.locator('#animal-list')).toContainText('BUF-OFFLINE-01');
});
