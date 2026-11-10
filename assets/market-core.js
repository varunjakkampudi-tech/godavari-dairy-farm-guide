(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.DairyMarket=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
  const number=(value,label)=>{const n=Number(value);if(!Number.isFinite(n))throw new Error(`${label} must be a valid number`);return n};
  function compareQuote(input){
    const litres=number(input.litres,'Litres');
    const rejected=number(input.rejectedLitres||0,'Rejected litres');
    const unitPrice=number(input.unitPrice,'Unit price');
    const deduction=number(input.deduction||0,'Deductions');
    const adjustment=number(input.adjustment||0,'Adjustment');
    if(litres<=0||rejected<0||rejected>litres||unitPrice<0||deduction<0)throw new Error('Enter positive delivered milk, valid rejected litres, a non-negative price, and non-negative deductions.');
    const saleableLitres=litres-rejected;
    const basis=input.basis||'litre';
    let payableUnits=saleableLitres;
    if(basis!=='litre'){
      const density=number(input.density,'Measured or buyer-specified kg per litre');
      if(density<=0||density>2)throw new Error('Enter a plausible positive milk density in kg/L.');
      payableUnits*=density;
      if(basis==='kg-fat'){
        const fat=number(input.fatPct,'Fat percentage');
        if(fat<0||fat>20)throw new Error('Fat percentage must be between 0 and 20.');
        payableUnits*=fat/100;
      }else if(basis!=='kg-milk')throw new Error('Choose a supported settlement basis.');
    }else if(!['litre','kg-milk','kg-fat'].includes(basis))throw new Error('Choose a supported settlement basis.');
    const gross=payableUnits*unitPrice+adjustment;
    const net=gross-deduction;
    return{basis,deliveredLitres:litres,rejectedLitres:rejected,saleableLitres,payableUnits,gross,net,effectivePerLitre:saleableLitres?net/saleableLitres:null};
  }
  return{compareQuote};
});
