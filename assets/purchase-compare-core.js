(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PurchaseCompare=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const dateOK=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
  function summarize(a){
    const price=String(a.price??'').trim()===''?null:Number(a.price);if(price!==null&&(!Number.isFinite(price)||price<0))throw Error('Asking price must be a non-negative amount or blank.');
    if(a.calvingDate&&!dateOK(a.calvingDate))throw Error('Enter a valid last calving date.');
    const obs=(a.observations||[]).map(o=>({date:o.date,am:String(o.am??'').trim()===''?null:Number(o.am),pm:String(o.pm??'').trim()===''?null:Number(o.pm)})).filter(o=>o.date||o.am!==null||o.pm!==null);
    for(const o of obs){if(o.am!==null&&o.pm===null)continue;if(!dateOK(o.date)||((o.am===null)!==(o.pm===null))||(o.am!==null&&(!Number.isFinite(o.am)||!Number.isFinite(o.pm)||o.am<0||o.pm<0)))throw Error('Each yield observation needs a valid date and non-negative morning and evening litres.');}
    const completeObs=obs.filter(o=>o.am!==null&&o.pm!==null);
    const unique=new Set(completeObs.map(o=>o.date)).size===completeObs.length;
    const complete=completeObs.length>0&&unique;
    return {...a,price,observations:obs,avgDailyLitres:complete?completeObs.reduce((s,o)=>s+o.am+o.pm,0)/completeObs.length:null,observationDays:complete?completeObs.length:0};
  }
  return {summarize};
});
