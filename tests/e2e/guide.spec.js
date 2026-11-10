const {test,expect}=require('@playwright/test');

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
