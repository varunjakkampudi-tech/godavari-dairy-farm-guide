const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;

for(const route of ['/','/pages/getting-started.html','/pages/records.html','/pages/visual-library.html']){
  test(`automated accessibility scan ${route}`,async({page})=>{
    await page.goto(route);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations.map(({id,impact,help,nodes})=>({id,impact,help,nodes:nodes.length}))).toEqual([]);
  });
}

test('visual library loads original diagrams, captions, and related links',async({page})=>{
  await page.goto('/pages/visual-library.html');
  await expect(page.getByRole('heading',{name:'Visual library'})).toBeVisible();
  const cards=page.locator('.visual-card');
  await expect(cards).toHaveCount(6);
  for(const image of await cards.locator('img').all()){
    await expect(image).toBeVisible();
    expect(await image.evaluate(el=>el.naturalWidth)).toBeGreaterThan(0);
    await expect(image).toHaveAttribute('alt',/diagram/);
  }
  await expect(page.getByText(/not photographs of real local farms/)).toBeVisible();
  await expect(page.getByRole('link',{name:'Open full-size illustration'}).first()).toHaveAttribute('target','_blank');
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

test('finance studio calculates a scenario but keeps the result explicitly unverified',async({page})=>{
  await page.goto('/pages/finance-studio.html');
  await page.locator('[name="price"]').fill('60');
  await page.locator('[name="lease"]').fill('10000');
  await page.locator('[name="fodderMonthly"]').fill('20000');
  await page.locator('[name="wages"]').fill('15000');
  for(let i=1;i<=4;i++){
    await page.locator(`[name="yield${i}"]`).fill('5');
    await page.locator(`[name="purchase${i}"]`).fill('100000');
  }
  await page.getByRole('button',{name:'Build monthly plan'}).click();
  await expect(page.locator('#studio-results')).toContainText('SCENARIO ONLY');
  await expect(page.locator('#studio-results')).toContainText('evidence not independently verified');
  await expect(page.locator('#studio-results')).toContainText('Month 12');
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

test('global search, Telugu preference, dark theme and employee checklist persist',async({page})=>{
  await page.goto('/');
  await page.locator('#site-search').fill('Hygienic milking');
  await expect(page.locator('#search-results')).toBeVisible();
  await expect(page.locator('#search-results')).toContainText('Hygienic milking standard procedure');
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

test('key app pages remain usable at a narrow mobile viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/','/pages/breeds.html','/pages/buying.html','/pages/operations.html','/pages/emergency.html','/pages/finance-studio.html']){
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    expect(overflow,`horizontal overflow on ${route}`).toBeFalsy();
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
  await page.goto('/pages/records.html');
  await expect(page.locator('#animal-list')).toContainText('BUF-OFFLINE-01');
});
