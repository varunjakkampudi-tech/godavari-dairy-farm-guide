(function(){
"use strict";
const core=window.DairyRotationCore;
const IDs=["animalPrice","averageYield","realizedPrice","adultFeedDay","monthlyFixed","calfMonthly","buyerDelay","extraDelay","adultLossCount","adultLossDays","monthlyOther","loanPayment"];
const inr=n=>"₹"+new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(n);
const num=n=>new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(n);
let baseline=null;
function read(){const out={};for(const id of IDs){const el=document.getElementById(id);if(el.value.trim()==="")throw Error(id+" is required");out[id]=Number(el.value)}return out}
function cell(row,value){const td=document.createElement("td");td.textContent=String(value);row.appendChild(td)}
function calculate(){
const status=document.getElementById("status");
try{
const options=read();
baseline=core.simulate(options);
const stress=core.simulate({...options,averageYield:options.averageYield*0.8,realizedPrice:Math.max(0,options.realizedPrice-10),adultFeedDay:options.adultFeedDay*1.2,extraDelay:Math.min(360,options.extraDelay+60),buyerDelay:Math.min(180,options.buyerDelay+15),adultLossCount:2,adultLossDays:60});
const table=document.getElementById("comparison");table.textContent="";
for(const [label,scenario] of [["Baseline",baseline],["Stress: −20% milk, −₹10/L, +20% feed, +60d calving delay, 2 milking adults unavailable for 60d",stress]]){
const s=scenario.summary,tr=document.createElement("tr");
for(const v of [label,inr(s.totalEarned),inr(s.totalCashExpense),inr(s.minCash),inr(s.closingCash),s.negativeOperatingMonths+" / 24",s.zeroMilkDays])cell(tr,v);
table.appendChild(tr);
}
const rows=document.getElementById("monthrows");rows.textContent="";
for(const m of baseline.months){const tr=document.createElement("tr");for(const v of [m.month,m.adultCountEnd,m.avgMilking.toFixed(1),m.calvesHeldEnd,num(m.saleableLitres),inr(m.cashReceived),inr(m.operatingCosts),inr(m.animalPurchases),inr(m.closingCash)])cell(tr,v);rows.appendChild(tr)}
status.textContent="Baseline: earned milk sales "+inr(baseline.summary.totalEarned)+", cash operating costs "+inr(baseline.summary.totalCashExpense)+", 24-month minimum balance "+inr(baseline.summary.minCash)+", and "+baseline.summary.negativeOperatingMonths+" months of negative operating cash margin. Cash includes the unspent portion of the original ₹15 lakh—not profit.";
const gate=document.getElementById("gate");
gate.textContent=(baseline.summary.minCash<310000?"FAIL protected reserve (₹3.10 lakh): baseline cash drops below the liquidity target. ":"Reserve target remains intact in baseline only. ")+(stress.summary.minCash<310000?"FAIL stress reserve: severe-case cash drops below target. ":"Stress-case reserve remains intact. ")+"Neither result proves guaranteed profitability; confirm milk buyer price, purchase costs, 2-day observed animal production, actual milk records and written farm quotations before investing.";
}catch(e){baseline=null;status.textContent="Invalid scenario: "+e.message;document.getElementById("comparison").textContent="";document.getElementById("monthrows").textContent="";document.getElementById("gate").textContent=""}
}
document.getElementById("compute").addEventListener("click",calculate);
document.getElementById("csv").addEventListener("click",()=>{if(!baseline)return;const headers=["month","adult_count","avg_milking","calves_held","births","saleable_litres","earned_inr","cash_received_inr","operating_costs_inr","animal_purchases_inr","net_cash_inr","closing_cash_inr"];const keys=["month","adultCountEnd","avgMilking","calvesHeldEnd","births","saleableLitres","revenueEarned","cashReceived","operatingCosts","animalPurchases","netCash","closingCash"];const csv=[headers.join(","),...baseline.months.map(r=>keys.map(k=>Number(r[k]).toFixed(2)).join(","))].join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="godavari-phased-rotation-24-months.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
calculate();
})();