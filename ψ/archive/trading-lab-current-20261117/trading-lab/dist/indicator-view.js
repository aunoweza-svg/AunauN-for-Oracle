/* Chart adapter. Calculations and account execution remain separate. */
(function(root){
'use strict';
root.LabIndicatorView={create(priceChart,priceSeries,element){
 let oscillator,macd,signal,hist,fast,slow,syncing=false,byTime=new Map(),prices=new Map(),values=[],config,display,priceUpdate=()=>{},oscUpdate=()=>{},levels=[];
 function primitive(chart,series,paint){let update=()=>{};const renderer={draw(target){target.useMediaCoordinateSpace(scope=>paint(scope.context,chart.paneSize()))}};
  series.attachPrimitive({attached(p){update=p.requestUpdate},detached(){update=()=>{}},updateAllViews(){},paneViews(){return [{zOrder:()=> 'bottom',renderer:()=>renderer}]}});return ()=>update();
 }
 function pricePaint(ctx,size){if(!config||!display.cdc||!config.cdc.enabled)return;ctx.save();ctx.beginPath();ctx.rect(0,0,size.width,size.height);ctx.clip();
  for(let i=1;i<values.length;i++){const a=values[i-1],b=values[i],x1=priceChart.timeScale().timeToCoordinate(a.time),x2=priceChart.timeScale().timeToCoordinate(b.time);if(x1===null||x2===null)continue;
   const y1=fast.priceToCoordinate(a.fast),y2=fast.priceToCoordinate(b.fast),z1=slow.priceToCoordinate(a.slow),z2=slow.priceToCoordinate(b.slow);
   if(config.cdc.showFast&&config.cdc.showSlow&&[y1,y2,z1,z2].every(Number.isFinite)){ctx.globalAlpha=.1;ctx.fillStyle=b.bull?'#4caf50':b.bear?'#ff5252':'#363a45';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineTo(x2,z2);ctx.lineTo(x1,z1);ctx.closePath();ctx.fill()}
   if(config.cdc.ribbon){ctx.globalAlpha=1;ctx.fillStyle=b.bullish?'#4caf50':b.bearish?'#ff5252':'#363a45';ctx.fillRect(x1,config.cdc.ribbonPosition==='Top'?0:size.height-5,Math.max(1,x2-x1),5)}
  }ctx.restore();
 }
 function oscPaint(ctx,size){if(!config)return;ctx.save();ctx.globalAlpha=.1;ctx.beginPath();ctx.rect(0,0,size.width,size.height);ctx.clip();
  for(let i=0;i<values.length;i++){const v=values[i],x=oscillator.timeScale().timeToCoordinate(v.time);if(x===null)continue;const previous=i?oscillator.timeScale().timeToCoordinate(values[i-1].time):null,next=i+1<values.length?oscillator.timeScale().timeToCoordinate(values[i+1].time):null;const width=next!==null?next-x:previous!==null?x-previous:6;if(config.mso.momentumBackground){ctx.fillStyle=v.momentumColor;ctx.fillRect(x-width/2,0,width+1,size.height)}
   if(config.mso.crossovers&&(v.oscUp||v.oscDown)){ctx.globalAlpha=1;ctx.fillStyle=v.oscUp?'#00ff00':'#ff0000';const y=v.oscUp?size.height-5:5;ctx.beginPath();ctx.moveTo(x,y+(v.oscUp?-3:3));ctx.lineTo(x-3,y+(v.oscUp?3:-3));ctx.lineTo(x+3,y+(v.oscUp?3:-3));ctx.closePath();ctx.fill();ctx.globalAlpha=.1}}const zero=macd.priceToCoordinate(0);if(zero!==null){ctx.globalAlpha=.2;ctx.strokeStyle='#808000';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,zero);ctx.lineTo(size.width,zero);ctx.stroke()}ctx.restore();
 }
 const syncRange=(from,to)=>from.timeScale().subscribeVisibleLogicalRangeChange(range=>{if(syncing||!range)return;syncing=true;try{to.timeScale().setVisibleLogicalRange(range)}finally{syncing=false}});
 function init(){if(oscillator)return;
  oscillator=LightweightCharts.createChart(element,{width:element.clientWidth,height:element.clientHeight,layout:{background:{color:'#020406'},textColor:'#aabbc8'},grid:{vertLines:{color:'#1c3040'},horzLines:{color:'#1c3040'}},timeScale:{timeVisible:true},rightPriceScale:{minimumWidth:80}});
  macd=oscillator.addLineSeries({color:'#0066ff',lineWidth:2,title:'MSO'});signal=oscillator.addLineSeries({color:'#ff6600',lineWidth:2,title:'Signal'});hist=oscillator.addHistogramSeries({base:0,title:'Histogram'});
  oscUpdate=primitive(oscillator,macd,oscPaint);priceChart.applyOptions({rightPriceScale:{minimumWidth:80}});syncRange(priceChart,oscillator);syncRange(oscillator,priceChart);
  const cross=(source,target,targetSeries,value)=>source.subscribeCrosshairMove(p=>{if(syncing)return;syncing=true;try{const v=value(p.time);if(p.time&&Number.isFinite(v)&&targetSeries.priceToCoordinate(v)!==null&&target.timeScale().timeToCoordinate(p.time)!==null)target.setCrosshairPosition(v,p.time,targetSeries);else target.clearCrosshairPosition()}finally{syncing=false}});
  cross(priceChart,oscillator,macd,t=>byTime.get(t)?.macd);cross(oscillator,priceChart,priceSeries,t=>prices.get(t)?.close);
 }
 function resize(){if(oscillator&&!element.classList.contains('hidden'))oscillator.applyOptions({width:element.clientWidth,height:element.clientHeight});priceUpdate();oscUpdate()}
 return {resize,clear(){values=[];config=undefined;byTime.clear();prices.clear();priceSeries.setData([]);priceSeries.setMarkers([]);for(const line of [fast,slow,macd,signal,hist])if(line)line.setData([]);element.classList.add('hidden');priceUpdate();oscUpdate()},render(candles,result,settings,visibility){
  if(result.length!==candles.length)throw Error('Indicator timeline must match visible replay prefix');
  values=result;config=settings;display={cdc:visibility.cdc&&settings.cdc.enabled,mso:visibility.mso&&settings.mso.enabled};byTime=new Map(values.map(v=>[v.time,v]));prices=new Map(candles.map(c=>[c.time,c]));
  const range=priceChart.timeScale().getVisibleLogicalRange();
  priceSeries.setData(candles.map((c,i)=>display.cdc&&config.cdc.paint?{...c,color:values[i].barColor,wickColor:values[i].barColor,borderColor:values[i].barColor}:c));
  if(!fast){fast=priceChart.addLineSeries({color:'#ff5252',lineWidth:2,title:'CDC fast'});slow=priceChart.addLineSeries({color:'#2196f3',lineWidth:2,title:'CDC slow'});priceUpdate=primitive(priceChart,fast,pricePaint)}
  const line=k=>values.map(v=>Number.isFinite(v[k])?{time:v.time,value:v[k]}:{time:v.time});
  fast.applyOptions({visible:display.cdc&&config.cdc.showFast});slow.applyOptions({visible:display.cdc&&config.cdc.showSlow});fast.setData(display.cdc?line('fast'):[]);slow.setData(display.cdc?line('slow'):[]);
  const markers=[];if(display.cdc&&config.cdc.signals)for(const v of values){if(v.buy)markers.push({time:v.time,position:'belowBar',color:'#4caf50',shape:'circle'});if(v.sell)markers.push({time:v.time,position:'aboveBar',color:'#ff5252',shape:'circle'})}priceSeries.setMarkers(markers);
  element.classList.toggle('hidden',!display.mso);
  if(display.mso){init();resize();macd.applyOptions({lineWidth:config.mso.lineWidth,autoscaleInfoProvider:base=>{const info=base();return {...(info||{}),priceRange:{minValue:Math.min(info?.priceRange.minValue??0,config.mso.oversold),maxValue:Math.max(info?.priceRange.maxValue??0,config.mso.overbought)}}}});signal.applyOptions({lineWidth:config.mso.lineWidth});macd.setData(line('macd'));signal.setData(line('signal'));hist.setData(config.mso.histogram?values.map(v=>Number.isFinite(v.hist)?{time:v.time,value:v.hist,color:v.histColor}:{time:v.time}):[]);
   levels.forEach(l=>macd.removePriceLine(l));levels=[{price:0,color:'#ffffff',lineStyle:2},{price:config.mso.overbought,color:'#ff0000',lineStyle:0},{price:config.mso.oversold,color:'#00ff00',lineStyle:0}].map(l=>macd.createPriceLine({...l,lineWidth:1,axisLabelVisible:true}));
   macd.setMarkers([]);
  }
  if(range){syncing=true;try{priceChart.timeScale().setVisibleLogicalRange(range);if(oscillator&&display.mso)oscillator.timeScale().setVisibleLogicalRange(range)}finally{syncing=false}}
  priceUpdate();oscUpdate();
 }};
}};
})(globalThis);
