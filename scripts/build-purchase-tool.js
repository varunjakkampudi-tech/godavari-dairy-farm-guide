const fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'..','pages','buying.html');let html=fs.readFileSync(file,'utf8');
if(!html.includes('id="purchase-comparison"')){
 const head='<script defer src="../assets/purchase-compare-core.js"></script><script defer src="../assets/purchase-compare.js"></script>';
 html=html.replace('</head>',`${head}</head>`);
 const block=`<section class="panel" id="purchase-comparison" aria-labelledby="compare-heading"><span class="eyebrow">Private, on-device worksheet</span><h2 id="compare-heading">Compare up to four buffaloes</h2><p>Enter only a tag or nickname. Data remains in this page until you close or reload it; it is not saved or uploaded. Price and claims are seller-provided until independently verified. This is not a ranking or veterinary clearance.</p><div id="purchase-animals"></div><button class="button alt" type="button" id="add-animal">Add animal</button><button class="button" type="button" id="compare-animals">Compare evidence</button><button class="button alt" type="button" id="print-comparison">Print / save PDF</button><div id="purchase-results" aria-live="polite"></div><p class="muted">Record at least three separate days of complete morning and evening milkings. Yield shown is only the observed daily average; it is not a lactation or annual forecast. Have an independent veterinarian choose and perform examinations and tests. No result here means “safe”, “healthy”, “pregnant”, “disease-free” or “approved”.</p></section>`;
 const point='<section data-searchable><h2>Why it matters</h2>';
 if(!html.includes(point))throw Error('Buying page insertion point missing');html=html.replace(point,block+point);fs.writeFileSync(file,html);
}
