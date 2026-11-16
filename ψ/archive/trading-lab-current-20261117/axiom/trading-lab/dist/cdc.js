// SPDX-License-Identifier: MPL-2.0
// © piriya33. JavaScript adaptation by PRISM Oracle, 2026-11-16.
// Source: source/cdc-actionzone-v3-2020.pine; original notices retained there.
// This Source Code Form is subject to MPL 2.0: https://mozilla.org/MPL/2.0/
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.CDC=factory()})(globalThis,()=>{
'use strict';
const COLORS={Green:'#4caf50',Blue:'#2196f3',LBlue:'#00bcd4',Red:'#ff5252',Orange:'#ff9800',Yellow:'#ffeb3b',Black:'#363a45'};
const ema=(previous,value,length)=>previous===null?value:2/(length+1)*value+(1-2/(length+1))*previous;
function calculate(candles,p){let price=null,fast=null,slow=null,lastBuy=null,lastSell=null,prevGreen=null,prevRed=null,prevBullish=null,prevBearish=null;
 return candles.map((c,i)=>{
  const input=p.source==='hl2'?(c.high+c.low)/2:p.source==='hlc3'?(c.high+c.low+c.close)/3:p.source==='ohlc4'?(c.open+c.high+c.low+c.close)/4:c[p.source];
  price=ema(price,input,p.smooth);fast=ema(fast,price,p.fast);slow=ema(slow,price,p.slow);
  const bull=fast>slow,bear=fast<slow,green=bull&&price>fast,red=bear&&price<fast;
  const blue=bear&&price>fast&&price>slow,lblue=bear&&price>fast&&price<slow,orange=bull&&price<fast&&price<slow,yellow=bull&&price<fast&&price>slow;
  const buycond=green&&prevGreen===false,sellcond=red&&prevRed===false;
  if(buycond)lastBuy=i;if(sellcond)lastSell=i;
  // Pine v5 barssince is na until the first occurrence, and comparisons with na are na.
  const bullish=lastBuy===null||lastSell===null?null:i-lastBuy<i-lastSell;
  const bearish=lastBuy===null||lastSell===null?null:i-lastSell<i-lastBuy;
  const buy=prevBearish===true&&buycond,sell=prevBullish===true&&sellcond;
  const zone=green?'Green':blue?'Blue':lblue?'LBlue':red?'Red':orange?'Orange':yellow?'Yellow':'Black';
  const out={time:c.time,price,fast,slow,zone,barColor:COLORS[zone],bull,bear,buycond,sellcond,bullish,bearish,buy,sell,barsSinceBuy:lastBuy===null?null:i-lastBuy,barsSinceSell:lastSell===null?null:i-lastSell};
  prevGreen=green;prevRed=red;prevBullish=bullish;prevBearish=bearish;return out;
 });
}
return {calculate,COLORS};
});
