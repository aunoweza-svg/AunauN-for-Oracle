// JavaScript adaptation of user-provided Pine v4 "Modified Stochastic MACD
// Oscillator - Vitali Apirine". Supplied Pine has no explicit license header.
// Original exact text/provenance retained in source/. No claim of an open license.
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.MSO=factory()})(globalThis,()=>{
'use strict';
const ema=(previous,value,length)=>previous===null?value:2/(length+1)*value+(1-2/(length+1))*previous;
function calculate(candles,p){let fast=null,slow=null,signal=null,previousHistogram=null,previousMacd=null,previousSignal=null,minQueue=[],maxQueue=[],minHead=0,maxHead=0;
 return candles.map((c,i)=>{
  fast=ema(fast,c.close,p.fast);slow=ema(slow,c.close,p.slow);
  while(minQueue.length>minHead&&candles[minQueue.at(-1)].low>=c.low)minQueue.pop();minQueue.push(i);
  while(maxQueue.length>maxHead&&candles[maxQueue.at(-1)].high<=c.high)maxQueue.pop();maxQueue.push(i);
  while(minQueue[minHead]<=i-p.period)minHead++;while(maxQueue[maxHead]<=i-p.period)maxHead++;
  const lowest=candles[minQueue[minHead]].low,range=candles[maxQueue[maxHead]].high-lowest;
  const stochasticFast=range===0?0:(fast-lowest)/range,stochasticSlow=range===0?0:(slow-lowest)/range;
  const macd=10*(stochasticFast-stochasticSlow);signal=ema(signal,macd,p.signal);const hist=macd-signal;
  const histColor=(p.scheme==='#1'?hist>0:hist>(previousHistogram??0))?'#ff00ff':'#800080';
  const oscUp=previousMacd!==null&&macd>signal&&previousMacd<=previousSignal,oscDown=previousMacd!==null&&macd<signal&&previousMacd>=previousSignal;
  const out={time:c.time,lowest,range,stochasticFast,stochasticSlow,macd,signal,hist,histColor,momentumColor:hist>0?'#00ff00':'#ff0000',oscUp,oscDown};
  previousHistogram=hist;previousMacd=macd;previousSignal=signal;return out;
 });
}
return {calculate};
});
