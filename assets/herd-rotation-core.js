(function(root,factory){
"use strict";
const api=factory();
if(typeof module==="object"&&module.exports) module.exports=api;
else root.DairyRotationCore=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const DEFAULTS=Object.freeze({capital:1500000,animalPrice:110000,siteSetup:200000,equipment:40000,depositTransport:70000,adultFeedDay:240,monthlyFixed:40000,calfMonthly:1500,calvingCost:3000,averageYield:8,realizedPrice:75,salePct:95,lactationDays:300,calvingInterval:453,extraDelay:0,buyerDelay:15,monthlyOther:0,loanPayment:0,months:24,adultLossDays:0,adultLossCount:0,calfSalePrice:0,calfSaleAgeDays:540,calfSaleFraction:0});
const COHORTS=Object.freeze([
{id:"B01",purchaseDay:0,ageAtPurchase:25},{id:"B02",purchaseDay:0,ageAtPurchase:130},
{id:"B03",purchaseDay:0,ageAtPurchase:215},{id:"B04",purchaseDay:0,ageAtPurchase:290},
{id:"B05",purchaseDay:90,ageAtPurchase:45},{id:"B06",purchaseDay:90,ageAtPurchase:225},
{id:"B07",purchaseDay:180,ageAtPurchase:75},{id:"B08",purchaseDay:180,ageAtPurchase:280}
]);
function finite(v){return typeof v==="number" && Number.isFinite(v)}
function validate(a,cohorts){
if(!a||typeof a!=="object")throw new Error("Missing inputs");
const ranges={capital:[0,100000000],animalPrice:[0,10000000],siteSetup:[0,10000000],equipment:[0,10000000],depositTransport:[0,10000000],adultFeedDay:[0,10000],monthlyFixed:[0,10000000],calfMonthly:[0,100000],calvingCost:[0,1000000],averageYield:[0,35],realizedPrice:[0,300],salePct:[0,100],lactationDays:[100,400],calvingInterval:[320,1000],extraDelay:[0,360],buyerDelay:[0,180],monthlyOther:[0,10000000],loanPayment:[0,10000000],months:[1,60],adultLossDays:[0,360],adultLossCount:[0,24],calfSalePrice:[0,10000000],calfSaleAgeDays:[90,1500],calfSaleFraction:[0,1]};
for(const [k,[min,max]] of Object.entries(ranges)){if(!finite(a[k])||a[k]<min||a[k]>max)throw new Error("Invalid "+k)}
if(!Number.isInteger(a.months)||!Number.isInteger(a.buyerDelay)||!Number.isInteger(a.extraDelay)||!Number.isInteger(a.adultLossDays)||!Number.isInteger(a.adultLossCount))throw new Error("Day and count fields must be integers");
if(a.calvingInterval+a.extraDelay<=a.lactationDays)throw new Error("Calving interval must exceed lactation days");
if(!Array.isArray(cohorts)||cohorts.length>24||!cohorts.length)throw new Error("1–24 animal records required");
const ids=new Set();
for(const c of cohorts){
if(!c||typeof c.id!=="string"||ids.has(c.id)||!Number.isInteger(c.purchaseDay)||c.purchaseDay<0||c.purchaseDay>1800||!finite(c.ageAtPurchase)||c.ageAtPurchase<0||c.ageAtPurchase>=a.calvingInterval+a.extraDelay)throw new Error("Invalid/duplicate animal cohort");
ids.add(c.id)
}
}
function lactationCurve(day,lactationDays){
// Deliberately illustrative curve, not measured Murrah population coefficients.
// Peak after calving, then progressive decline; normalized to preserve entered lactation average.
const x=day/lactationDays;
const raw=x<0.1?0.87+x*2.3:x<0.3?1.1:x<0.65?1.1-(x-0.3)*0.7:x<1?0.855-(x-0.65)*1.2:0;
return Math.max(0,raw)
}
function meanCurve(days){let sum=0;for(let d=0;d<days;d++)sum+=lactationCurve(d,days);return sum/days}
function simulate(overrides={},animals=COHORTS){
const a=Object.assign({},DEFAULTS,overrides);
validate(a,animals);
const cycle=a.calvingInterval+a.extraDelay;
const length=a.months*30;
const avgCurve=meanCurve(a.lactationDays);
const pay=Array(length+a.buyerDelay+1).fill(0);
const activeCalves=[];
const byDay=[];
let cash=a.capital-a.siteSetup-a.equipment-a.depositTransport;
let minCash=cash, maxAdults=0, zeroMilkDays=0, calvesBorn=0, totalMilk=0,totalEarned=0,totalCashReceived=0,totalCashExpense=0,totalPurchases=0,totalCalfSale=0;
for(let day=0;day<length;day++){
const purchasedToday=animals.filter(c=>c.purchaseDay===day).length*a.animalPrice;
cash-=purchasedToday;totalPurchases+=purchasedToday;
const adults=animals.filter(c=>c.purchaseDay<=day);
maxAdults=Math.max(maxAdults,adults.length);
let producing=0, milk=0,births=0;
for(const c of adults){
const elapsed=day-c.purchaseDay;
const phase=(c.ageAtPurchase+elapsed)%cycle;
const previous=c.ageAtPurchase+elapsed-1;
if(elapsed>0&&Math.floor((c.ageAtPurchase+elapsed)/cycle)>Math.floor(previous/cycle)){
births++;
activeCalves.push({born:day,dam:c.id});
}
if(phase<a.lactationDays){
let eligible=true;
if(a.adultLossDays>0 && adults.indexOf(c)<a.adultLossCount && day>=180 && day<180+a.adultLossDays) eligible=false;
if(eligible){producing++;milk+=a.averageYield*lactationCurve(Math.floor(phase),a.lactationDays)/avgCurve}
}
}
calvesBorn+=births;
let sold=0,saleIncome=0;
if(a.calfSaleFraction>0&&a.calfSalePrice>0){
const due=activeCalves.filter(c=>!c.sold&&day-c.born>=a.calfSaleAgeDays);
const allowed=Math.floor((calvesBorn)*a.calfSaleFraction)-activeCalves.filter(c=>c.sold).length;
for(const c of due.slice(0,Math.max(0,allowed))){c.sold=true;sold++;saleIncome+=a.calfSalePrice;}
}
const calvesHeld=activeCalves.filter(c=>!c.sold).length;
const sellable=milk*a.salePct/100;
const earned=sellable*a.realizedPrice;
pay[day+a.buyerDelay]+=earned;
const received=pay[day]+saleIncome;
const expense=adults.length*a.adultFeedDay+(a.monthlyFixed+a.monthlyOther+a.loanPayment)/30+calvesHeld*a.calfMonthly/30+births*a.calvingCost;
cash+=received-expense;
minCash=Math.min(minCash,cash);
if(milk===0)zeroMilkDays++;
totalMilk+=sellable;totalEarned+=earned;totalCashReceived+=received;totalCashExpense+=expense;totalCalfSale+=saleIncome;
byDay.push({day,adults:adults.length,producing,calvesHeld,births,sold,sellable,earned,received,expense,purchases:purchasedToday,closingCash:cash});
}
const months=[];
for(let m=0;m<a.months;m++){
const rows=byDay.slice(m*30,m*30+30);
const sum=k=>rows.reduce((s,r)=>s+r[k],0);
months.push({month:m+1,adultCountEnd:rows[29].adults,avgMilking:sum("producing")/30,calvesHeldEnd:rows[29].calvesHeld,births:sum("births"),sold:sum("sold"),saleableLitres:sum("sellable"),revenueEarned:sum("earned"),cashReceived:sum("received"),operatingCosts:sum("expense"),animalPurchases:sum("purchases"),netCash:sum("received")-sum("expense")-sum("purchases"),closingCash:rows[29].closingCash});
}
return{assumptions:a,cohorts:animals.map(c=>Object.assign({},c)),months,summary:{minCash,closingCash:cash,zeroMilkDays,maxAdults,calvesBorn,totalMilk,totalEarned,totalCashReceived,totalCashExpense,totalPurchases,totalCalfSale,negativeCashMonths:months.filter(m=>m.netCash<0).length,negativeOperatingMonths:months.filter(m=>m.cashReceived-m.operatingCosts<0).length,siteAndSetup:a.siteSetup+a.equipment+a.depositTransport}};
}
return{DEFAULTS,COHORTS,lactationCurve,simulate,validate};
});