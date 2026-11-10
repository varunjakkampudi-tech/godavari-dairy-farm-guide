const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {annual,validBackup}=require('../assets/calculator-core.js');const {compareQuote}=require('../assets/market-core.js');
test('annual revenue includes saleable lactating milk only',()=>{const r=annual({herd:4,lactDays:260,yield:6,salePct:95,price:70});assert.equal(r.liters,5928);assert.equal(r.revenue,414960)});
test('operating costs annualize monthly values and include annual costs',()=>{const r=annual({herd:1,lactDays:300,yield:5,salePct:100,price:50,feed:100,labor:200,lease:300,vet:400,ops:500,otherCost:600});assert.equal(r.cost,14200)});
test('break-even price includes cost and subtracts other income',()=>{const r=annual({herd:1,lactDays:100,yield:10,salePct:100,other:1000,feed:100});assert.equal(r.breakEvenPrice,0.2)});
test('zero milk volume produces no break-even price',()=>assert.equal(annual({herd:0}).breakEvenPrice,null));
test('negative production inputs are clamped and days cannot exceed a year',()=>{const r=annual({herd:2,lactDays:400,yield:-4,salePct:150,price:20});assert.equal(r.liters,0);assert.equal(r.breakEvenPrice,null)});
test('backup import accepts valid simple tables',()=>assert.equal(validBackup({animals:[{id:'A1'}],milk:[{date:'2026-01-01',animalId:'A1'}],expenses:[{date:'2026-01-01',category:'feed'}]}),true));
test('backup import rejects missing tables, required identifiers and nested payloads',()=>{assert.equal(validBackup({animals:[],milk:[]}),false);assert.equal(validBackup({animals:[{}],milk:[],expenses:[]}),false);assert.equal(validBackup({animals:[{id:'A',notes:{secret:true}}],milk:[],expenses:[]}),false)});
test('local page links resolve to files in the static app',()=>{const root=path.join(__dirname,'..');const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}walk(root);const broken=[];for(const file of files){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=m[1];if(/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(url))continue;const target=path.resolve(path.dirname(file),url.split('#')[0].split('?')[0]);if(!fs.existsSync(target))broken.push(`${path.relative(root,file)} -> ${url}`)}}assert.deepEqual(broken,[])});
test('global search index covers every guide page',()=>{const root=path.join(__dirname,'..');const idx=JSON.parse(fs.readFileSync(path.join(root,'assets','search-index.json'),'utf8'));for(const f of fs.readdirSync(path.join(root,'pages')).filter(x=>x.endsWith('.html')))assert.ok(idx.some(x=>x.url===`pages/${f}`),`missing search entry for ${f}`);assert.ok(idx.some(x=>x.url==='index.html'))});
test('farm layout diagram is packaged with accessible alternative text',()=>{const root=path.join(__dirname,'..');const html=fs.readFileSync(path.join(root,'pages','layout.html'),'utf8');assert.match(html,/src="\.\.\/assets\/one-acre-zones\.svg"/);assert.match(html,/alt="Concept diagram separating clean access/);assert.ok(fs.existsSync(path.join(root,'assets','one-acre-zones.svg')))});

test('launch workbook has navigation, accessible checklist sections and actionable milestones',()=>{
  const root=path.join(__dirname,'..');
  const workbook=fs.readFileSync(path.join(root,'pages','launch-workbook.html'),'utf8');
  const nav=fs.readFileSync(path.join(root,'assets','nav.js'),'utf8');
  const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
  for(const phrase of ['First 90 days','Veterinary gate','milk payment formula','Farm launch','data-checklist','window.print()'])
    assert.ok(workbook.includes(phrase), 'Workbook missing '+phrase);
  assert.match(nav,/pages\/launch-workbook\.html/);
  assert.match(home,/pages\/launch-workbook\.html/);
});
test('buyer comparison calculates litre-based settlement and documented deductions',()=>{const r=compareQuote({litres:100,rejectedLitres:2,basis:'litre',unitPrice:60,deduction:15});assert.equal(r.net,5865);assert.equal(r.effectivePerLitre,5865/98)});
test('buyer comparison converts kg milk and kg fat only with entered measurements',()=>{assert.equal(compareQuote({litres:80,basis:'kg-milk',unitPrice:50,density:1.03}).net,4120);assert.ok(Math.abs(compareQuote({litres:100,basis:'kg-fat',unitPrice:400,density:1.03,fatPct:7.2}).net-2966.4)<1e-9);assert.throws(()=>compareQuote({litres:80,basis:'kg-milk',unitPrice:50}),/kg per litre/)});
test('buyer comparison rejects impossible rejection and negative deduction inputs',()=>{assert.throws(()=>compareQuote({litres:20,rejectedLitres:21,basis:'litre',unitPrice:50}),/rejected litres/);assert.throws(()=>compareQuote({litres:20,basis:'litre',unitPrice:50,deduction:-1}),/deductions/)});
