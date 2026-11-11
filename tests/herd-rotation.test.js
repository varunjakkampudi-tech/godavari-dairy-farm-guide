"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {simulate,COHORTS,DEFAULTS,lactationCurve}=require("../assets/herd-rotation-core.js");
const near=(a,b,t=0.01)=>assert.ok(Math.abs(a-b)<t, "Expected "+a+" ≈ "+b);
test("default staged acquisition buys four, then two, then two",()=>{
const x=simulate();
assert.equal(x.months.length,24);assert.equal(x.months[0].adultCountEnd,4);
assert.equal(x.months[2].adultCountEnd,4);assert.equal(x.months[3].adultCountEnd,6);
assert.equal(x.months[5].adultCountEnd,6);assert.equal(x.months[6].adultCountEnd,8);
assert.equal(x.summary.maxAdults,8);assert.equal(x.summary.totalPurchases,8*DEFAULTS.animalPrice);
});
test("capital ledger and all monthly cash flows reconcile",()=>{
const x=simulate();near(x.summary.closingCash,DEFAULTS.capital-x.summary.siteAndSetup-x.summary.totalPurchases+x.summary.totalCashReceived-x.summary.totalCashExpense);
near(x.months[23].closingCash,x.summary.closingCash);
near(x.months.reduce((s,m)=>s+m.animalPurchases,0),x.summary.totalPurchases);
near(x.months.reduce((s,m)=>s+m.saleableLitres,0),x.summary.totalMilk);
near(x.months.reduce((s,m)=>s+m.operatingCosts,0),x.summary.totalCashExpense);
});
test("milk revenue and zero milking days under zero milk yield",()=>{
const x=simulate({averageYield:0});assert.equal(x.summary.totalMilk,0);assert.equal(x.summary.totalEarned,0);assert.equal(x.summary.zeroMilkDays,720);
});
test("buyer settlement delay alters liquidity, not earned revenue",()=>{
const fast=simulate({buyerDelay:0}),slow=simulate({buyerDelay:60});
near(fast.summary.totalEarned,slow.summary.totalEarned);
assert.equal(slow.months[0].cashReceived,0);
assert.ok(slow.summary.minCash<=fast.summary.minCash);
});
test("later reproduction, feed inflation, low price, fewer milking days worsens net cash",()=>{
const base=simulate();
const low=simulate({averageYield:6.4,realizedPrice:65,adultFeedDay:288,extraDelay:60,adultLossCount:2,adultLossDays:60});
assert.ok(low.summary.closingCash<base.summary.closingCash);
});
test("calf income is zero without a real selling assumption",()=>{
const x=simulate();assert.equal(x.summary.totalCalfSale,0);
assert.ok(x.summary.calvesBorn>=0);
assert.ok(x.summary.totalCashExpense>0);
});
test("lactation curve falls toward drying-off",()=>{
assert.ok(lactationCurve(75,300)>lactationCurve(290,300));
assert.equal(lactationCurve(300,300),0);
});
test("invalid calving cycle and repeated IDs rejected",()=>{
assert.throws(()=>simulate({calvingInterval:320,lactationDays:320}),/Calving interval/);
assert.throws(()=>simulate({},[COHORTS[0],COHORTS[0]]),/Invalid\/duplicate/);
});
test("negative and excessive rates rejected",()=>{
assert.throws(()=>simulate({salePct:110}),/Invalid salePct/);
assert.throws(()=>simulate({animalPrice:-1}),/Invalid animalPrice/);
});
