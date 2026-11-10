(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.DairyDecisionCore=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function validDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return false;const d=new Date(`${value}T00:00:00Z`);return !Number.isNaN(d.valueOf())&&d.toISOString().slice(0,10)===value}
function reviewState(entry){const note=String(entry?.note||'').trim(),source=String(entry?.source||'').trim(),date=String(entry?.date||'').trim();if(!note||!source||!validDate(date))return{code:'insufficient',label:'INSUFFICIENT EVIDENCE'};return{code:'entered',label:'EVIDENCE RECORDED — NOT VERIFIED'} }
function cleanEntry(entry){return{note:String(entry?.note||'').slice(0,1000),source:String(entry?.source||'').slice(0,500),date:validDate(entry?.date)?entry.date:''}}
return{validDate,reviewState,cleanEntry};
});
