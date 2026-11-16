// CDC pane label adapted from © piriya33, MPL-2.0; exact Pine and license notice retained in source/ and cdc.js.
/* AXIOM chart workspace: public Binance Spot data; drawings/settings never change replay/account. */
(function(root,factory){if(typeof module==='object')module.exports=factory(require('./indicators.js'));else root.LabOwnChart=factory(root.LabIndicators)})(globalThis,I=>{
'use strict';
const INTERVALS={'15m':900000,'1h':3600000,'4h':14400000,'1d':86400000,'1w':604800000,'1M':null},COUNT=500,KEY='axiom_chart_workspace_v1';
const copy=x=>JSON.parse(JSON.stringify(x));
function defaults(){return {version:1,interval:'15m',chartType:'heikin-ashi',indicators:I.defaults(),volume:false,follow:true,drawings:{}}}
function periodStart(time,interval){
 if(!Object.hasOwn(INTERVALS,interval)||!Number.isSafeInteger(time)||time<0)throw Error('กรอบเวลา/เวลาไม่รองรับ');
 if(interval==='1M'){const d=new Date(time);return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1)}
 const step=INTERVALS[interval],base=interval==='1w'?Date.UTC(1970,0,5):0;return Math.floor((time-base)/step)*step+base;
}
function shift(time,interval,n=1){if(interval!=='1M')return time+INTERVALS[interval]*n;const d=new Date(time);return Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+n,1)}
function bounds(interval,now=Date.now()){const end=periodStart(now,interval);return {begin:shift(end,interval,-COUNT),end}}
function candle(r,interval){
 if(!Array.isArray(r)||r.length<7||!Number.isSafeInteger(r[0])||periodStart(r[0],interval)!==r[0]||r[6]!==shift(r[0],interval)-1)throw Error('ขอบเขตเวลาแท่งไม่ถูกต้อง');
 const numeric=x=>(typeof x==='string'&&x.trim()!==''||typeof x==='number')&&Number.isFinite(Number(x));if(!r.slice(1,6).every(numeric))throw Error('ราคา/ปริมาณไม่ถูกต้อง');
 const c={time:r[0]/1000,open:Number(r[1]),high:Number(r[2]),low:Number(r[3]),close:Number(r[4]),volume:Number(r[5]),closed:true};
 if(![c.open,c.high,c.low,c.close].every(v=>v>0)||c.volume<0||c.low>Math.min(c.open,c.close)||c.high<Math.max(c.open,c.close))throw Error('ราคา OHLC หรือปริมาณไม่ถูกต้อง');return c;
}
function validateRows(rows,interval,begin,end){
 if(!Object.hasOwn(INTERVALS,interval)||!Number.isSafeInteger(begin)||!Number.isSafeInteger(end)||periodStart(begin,interval)!==begin||periodStart(end,interval)!==end||shift(begin,interval,COUNT)!==end||!Array.isArray(rows)||rows.length<2||rows.length>COUNT||(!['1w','1M'].includes(interval)&&rows.length!==COUNT))throw Error('ข้อมูลแท่งปิดไม่ครบหรือช่วงเวลาไม่ถูกต้อง');
 const result=rows.map(r=>candle(r,interval));
 for(let i=0;i<result.length;i++)if(result[i].time*1000<begin||result[i].time*1000>=end||(i&&result[i].time*1000!==shift(result[i-1].time*1000,interval)))throw Error('ข้อมูลขาด/ซ้ำหรือเวลาแท่งไม่ถูกต้อง');
 if(shift(result.at(-1).time*1000,interval)!==end||(rows.length===COUNT&&result[0].time*1000!==begin))throw Error('ข้อมูลขาดต้น/ท้ายช่วง');return result;
}
function validateStream(event,interval){
 const k=event?.k;if(event?.e!=='kline'||event.s!=='BTCUSDT'||!k||k.s!=='BTCUSDT'||k.i!==interval||typeof k.x!=='boolean'||!Number.isSafeInteger(event.E)||event.E<k.t||event.E>k.T+60000)throw Error('สตรีมไม่ตรงตลาด/กรอบเวลาหรือเวลาไม่ถูกต้อง');
 return {...candle([k.t,k.o,k.h,k.l,k.c,k.v,k.T],interval),closed:k.x,eventTime:event.E};
}
// A finalized stream candle wins over a REST snapshot that was captured earlier.
function mergeBars(bars,incoming,interval){
 const merged=new Map(bars.map(c=>[c.time,c]));for(const c of incoming){const old=merged.get(c.time);if(!old?.closed||!old.eventTime)merged.set(c.time,c)}
 const next=[...merged.values()].sort((a,b)=>a.time-b.time);for(let i=1;i<next.length;i++)if(next[i].time*1000!==shift(next[i-1].time*1000,interval))throw Error('ข้อมูลตลาดขาดช่วง กรุณาโหลดหน้าใหม่');return next.length>10000?incoming:next;
}
function chartCandles(bars,kind){
 if(!['candles','heikin-ashi'].includes(kind))throw Error('ชนิดแท่งไม่รองรับ');if(kind==='candles')return bars;
 let previous;return bars.map(c=>{const close=(c.open+c.high+c.low+c.close)/4,open=previous?(previous.open+previous.close)/2:(c.open+c.close)/2;return previous={...c,open,close,high:Math.max(c.high,open,close),low:Math.min(c.low,open,close)}});
}
function validateWorkspace(w){
 const fail=()=>{throw Error('workspace กราฟไม่ถูกต้อง')},positive=x=>Number.isFinite(x)&&x>0;
 if(!w||w.version!==1||!['candles','heikin-ashi'].includes(w.chartType)||!Object.hasOwn(INTERVALS,w.interval)||typeof w.volume!=='boolean'||typeof w.follow!=='boolean'||!w.drawings||Array.isArray(w.drawings)||typeof w.drawings!=='object')fail();I.validate(w.indicators);
 for(const [interval,items] of Object.entries(w.drawings)){
  if(!Object.hasOwn(INTERVALS,interval)||!Array.isArray(items)||items.length>20)fail();
  for(const line of items){if(!line||!['horizontal','trend'].includes(line.kind))fail();if(line.kind==='horizontal'){if(!positive(line.price))fail()}else if(!Array.isArray(line.points)||line.points.length!==2||!line.points.every(p=>p&&Number.isSafeInteger(p.time)&&p.time>0&&positive(p.value))||line.points[0].time>=line.points[1].time)fail()}
 }return w;
}
// CDC Pine's single latest label.new object (source lines144–162).
function cdcLabel(c,v,previous,enabled=true){
 if(!enabled||!c||!v)return null;
 const signal=v.buy?'BUY next bar':v.sell?'SELL next bar':null,trend=v.bullish?'bullish':v.bearish?'bearish':'sideways';
 return {time:c.time,price:c.close>v.slow?c.high:c.low,above:c.close>v.slow,
  background:v.buy?'#4caf50':v.sell?'#ff5252':'#b2b5be',color:v.buy?'#000000':v.sell?'#ffffff':c.close>previous?.close?'#4caf50':'#ff5252',
  lines:[...(signal?[signal]:[]),'BTCUSDT '+Number(c.close.toFixed(6))+' USDT','currently in a '+trend+' trend']};
}
function mount(){
 const $=s=>document.querySelector(s),box=$('#own-chart-workspace'),priceEl=$('#own-price-chart'),oscEl=$('#own-oscillator'),status=$('#own-feed-status'),toolStatus=$('#own-tool-status'),settingsStatus=$('#own-settings-status');
 let w=defaults(),chart,series,volume,view,bars=[],displayBars=[],values=[],byTime=new Map(),request,epoch=0,loading=false,lastReceipt=null,mode=null,pending=null,horizontal=[],trends=[],timer,socket,streamEpoch=0,hovered=null,labelUpdate=()=>{};
 try{const raw=localStorage.getItem(KEY);if(raw){if(raw.length>65536)throw Error('workspace ใหญ่เกินไป');w=validateWorkspace(JSON.parse(raw))}}catch(e){settingsStatus.textContent='อ่าน workspace เดิมไม่ได้ ใช้ค่าเริ่มต้นสำหรับกราฟหน้านี้';}
 const isBTC=()=>$('#symbol').value==='BINANCE:BTCUSDT',active=()=>isBTC()&&!$('#market').classList.contains('hidden')&&!document.hidden;
 const date=t=>new Date(t).toLocaleString('th-TH-u-ca-gregory',{timeZone:'Asia/Bangkok',hour12:false}),number=n=>n.toLocaleString('en-US',{maximumFractionDigits:4});
 function save(){try{const raw=JSON.stringify(validateWorkspace(w));if(raw.length>65536)throw Error('workspace ใหญ่เกินไป');localStorage.setItem(KEY,raw);settingsStatus.textContent='บันทึก workspace กราฟใน browser นี้แล้ว'}catch(e){settingsStatus.textContent='ใช้ค่าชั่วคราวในหน้านี้ บันทึก workspace ไม่สำเร็จ: '+e.message}}
 function resize(){if(chart&&active()){chart.applyOptions({width:priceEl.clientWidth,height:priceEl.clientHeight});view.resize();labelUpdate()}}
 const currentLabel=()=>cdcLabel(displayBars.at(-1),values.at(-1),displayBars.at(-2),w.indicators.cdc.enabled&&w.indicators.cdc.assist);
 function paintLabel(ctx,size){
  const label=currentLabel();if(!label||!active()||size.width<80||size.height<80)return;
  const x=chart.timeScale().timeToCoordinate(label.time),y=series.priceToCoordinate(label.price);
  if(x===null||y===null||x<0||x>size.width||y<0||y>size.height)return;
  ctx.save();ctx.beginPath();ctx.rect(0,0,size.width,size.height);ctx.clip();
  const fontSize=size.width<300?12:14,lineHeight=fontSize+5,padding=10;ctx.font=fontSize+'px sans-serif';
  // Fit the text inside the price pane, including on a narrow phone screen.
  let lines=[];for(const line of label.lines){let text='';for(const word of line.split(' ')){const next=text?text+' '+word:word;if(text&&ctx.measureText(next).width>size.width-34){lines.push(text);text=word}else text=next}if(text)lines.push(text)}
  const width=Math.min(size.width-14,Math.max(...lines.map(l=>ctx.measureText(l).width))+padding*2),height=lines.length*lineHeight+padding*2;
  const left=Math.max(7,Math.min(size.width-width-7,x-width/2)),tip=y+(label.above?-8:8),top=Math.max(6,Math.min(size.height-height-6,label.above?tip-10-height:tip+10));
  ctx.fillStyle=label.background;
  const edge=label.above?top+height:top,arrowX=Math.max(left+10,Math.min(left+width-10,x));
  if(label.above?tip>edge:tip<edge){ctx.beginPath();ctx.moveTo(arrowX-7,edge);ctx.lineTo(arrowX+7,edge);ctx.lineTo(x,tip);ctx.closePath();ctx.fill()}
  ctx.beginPath();ctx.roundRect(left,top,width,height,5);ctx.fill();ctx.fillStyle=label.color;ctx.textAlign='center';ctx.textBaseline='top';
  lines.forEach((line,i)=>ctx.fillText(line,left+width/2,top+padding+i*lineHeight));ctx.restore();
 }
 function showCandle(c,v){if(!c)return;const change=(c.close-c.open)/c.open*100;$('#own-ohlc').textContent=`${new Date(c.time*1000).toISOString().replace('.000Z',' UTC')}  ·  O ${number(c.open)}   H ${number(c.high)}   L ${number(c.low)}   C ${number(c.close)}   ${change>=0?'+':''}${change.toFixed(2)}%   Vol ${number(c.volume)} BTC`;
  if(v)$('#own-indicator-readout').textContent=`CDC ${v.zone} · EMA ${v.fast.toFixed(6)} / ${v.slow.toFixed(6)}   |   MSO ${v.macd.toFixed(6)} · Signal ${v.signal.toFixed(6)} · Hist ${v.hist.toFixed(6)}`;
 }
 function clearAnnotations(){if(!chart)return;horizontal.forEach(l=>series.removePriceLine(l));trends.forEach(l=>chart.removeSeries(l));horizontal=[];trends=[]}
 function annotations(){clearAnnotations();const times=new Set(bars.map(b=>b.time));for(const [i,line] of (w.drawings[w.interval]||[]).entries()){
  if(line.kind==='horizontal')horizontal.push(series.createPriceLine({price:line.price,color:'#d9b878',lineWidth:1,lineStyle:2,axisLabelVisible:true,title:'H'+(i+1)}));
  else if(line.points.every(p=>times.has(p.time))){const l=chart.addLineSeries({color:'#c8a5ff',lineWidth:2,lastValueVisible:false,priceLineVisible:false,crosshairMarkerVisible:false});l.setData(line.points);trends.push(l)}
 }$('#own-drawing-count').textContent=(w.drawings[w.interval]||[]).length+'/20 เส้น · '+w.interval;}
 function tool(next){mode=next;pending=null;document.querySelectorAll('[data-own-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ownTool===next)));toolStatus.textContent=next==='horizontal'?'คลิกบนกราฟราคาเพื่อวางเส้นแนวนอน':next==='trend'?'คลิกจุดเริ่มต้นและจุดสิ้นสุดบนแท่งราคา':'ลากเพื่อเลื่อน · ล้อเมาส์เพื่อซูม · Esc ยกเลิกเครื่องมือ';}
 function init(){if(chart)return;if(!globalThis.LightweightCharts)throw Error('โหลดเครื่องมือกราฟไม่สำเร็จ ตรวจเครือข่ายแล้วรีเฟรชหน้า');
  chart=LightweightCharts.createChart(priceEl,{width:priceEl.clientWidth,height:priceEl.clientHeight,layout:{background:{color:'#171b26'},textColor:'#a8b9ca'},grid:{vertLines:{visible:false},horzLines:{visible:false}},crosshair:{mode:0},timeScale:{timeVisible:true,rightOffset:4},rightPriceScale:{minimumWidth:86,borderColor:'#28374a'}});
  series=chart.addCandlestickSeries({upColor:'#27c499',downColor:'#ef6478',wickUpColor:'#27c499',wickDownColor:'#ef6478',borderVisible:false});
  const labelRenderer={draw(target){target.useMediaCoordinateSpace(scope=>paintLabel(scope.context,chart.paneSize()))}};
  series.attachPrimitive({attached(p){labelUpdate=p.requestUpdate},detached(){labelUpdate=()=>{}},updateAllViews(){},paneViews(){return [{zOrder:()=> 'top',renderer:()=>labelRenderer}]},autoscaleInfo(start,end){const label=currentLabel(),last=displayBars.at(-1),index=displayBars.length-1;if(!label||index<start||index>end)return null;return {priceRange:{minValue:last.low,maxValue:last.high},margins:{above:label.above?100:0,below:label.above?0:100}}}});
  volume=chart.addHistogramSeries({priceFormat:{type:'volume'},priceScaleId:'volume',lastValueVisible:false,priceLineVisible:false});volume.priceScale().applyOptions({scaleMargins:{top:.83,bottom:0},visible:false});view=LabIndicatorView.create(chart,series,oscEl);
  chart.subscribeCrosshairMove(p=>{const c=p.seriesData.get(series);if(c&&p.time){const actual=displayBars.find(b=>b.time===p.time);hovered=p.time;showCandle(actual,byTime.get(p.time))}else{hovered=null;showCandle(displayBars.at(-1),values.at(-1))}});
  chart.subscribeClick(p=>{if(!mode||!active()||!p.point||typeof p.time!=='number')return;const price=series.coordinateToPrice(p.point.y);if(!Number.isFinite(price)||price<=0)return;const items=w.drawings[w.interval]||(w.drawings[w.interval]=[]);if(items.length>=20){toolStatus.textContent='ครบ 20 เส้นแล้ว ล้างเส้นก่อนเพิ่ม';return}
   if(mode==='horizontal')items.push({kind:'horizontal',price});else if(!pending){pending={time:p.time,value:price};toolStatus.textContent='เลือกจุดสิ้นสุดของเส้นแนวโน้ม';return}else{if(p.time===pending.time){toolStatus.textContent='เลือกจุดสิ้นสุดต่างแท่งจากจุดแรก';return}items.push({kind:'trend',points:[pending,{time:p.time,value:price}].sort((a,b)=>a.time-b.time)})}tool(null);save();annotations();
  });
 }
 function latest(){if(chart&&bars.length)chart.timeScale().setVisibleLogicalRange({from:Math.max(0,bars.length-120),to:bars.length+4})}
 function render(first=false){if(!active()||!bars.length)return;init();displayBars=chartCandles(bars,w.chartType);values=I.calculate(displayBars,w.indicators);byTime=new Map(values.map(v=>[v.time,v]));
  view.render(displayBars,values,w.indicators,{cdc:$('#own-cdc').checked,mso:$('#own-mso').checked});volume.setData(w.volume?displayBars.map(c=>({time:c.time,value:c.volume,color:c.close>=c.open?'#23756588':'#8d405388'})):[]);series.priceScale().applyOptions({scaleMargins:{top:.08,bottom:w.volume ? .2 : .08}});annotations();const selected=displayBars.find(b=>b.time===hovered)||displayBars.at(-1);showCandle(selected,byTime.get(selected.time));
  const last=displayBars.at(-1),v=values.at(-1),assist=$('#own-assist'),showAssist=w.indicators.cdc.enabled&&w.indicators.cdc.assist;assist.classList.toggle('hidden',!showAssist);assist.textContent=showAssist?`${v.buy?'BUY next bar · ':v.sell?'SELL next bar · ':''}BTCUSDT ${number(last.close)} USDT · currently in a ${v.bullish?'bullish':v.bearish?'bearish':'sideways'} trend`:'';$('#own-quote').textContent=number(last.close)+' USDT'+(w.chartType==='heikin-ashi'?' · HA':'');$('#own-market-quote').textContent='ราคาตลาด Spot '+number(bars.at(-1).close)+' USDT';$('#own-quote').classList.toggle('down',last.close<last.open);$('#own-bar-state').textContent=last.closed?'แท่งปิดแล้ว':'แท่งกำลังก่อตัว · สัญญาณเปลี่ยนได้';$('#own-history').textContent=`${bars.length} แท่งที่มี · เริ่ม EMA ที่ต้นชุดข้อมูล${values.at(-1).warmup?' · ประวัติยังน้อยกว่า period ที่ตั้ง':''}`;box.dataset.interval=w.interval;box.dataset.chartType=w.chartType;const closed=bars.findLast(b=>b.closed);if(closed)box.dataset.lastClosed=String(shift(closed.time*1000,w.interval)/1000);box.dataset.lastTime=String(last.time);resize();if(first)latest();
 }
 function stopStream(){streamEpoch++;if(socket){socket.onclose=null;socket.onerror=null;socket.close();socket=null}}
 function openStream(){stopStream();if(!active())return;const token=streamEpoch,interval=w.interval,badge=$('#own-stream-status');badge.textContent='กำลังเชื่อมต่อสตรีม…';
  try{socket=new WebSocket('wss://stream.binance.com:443/ws/btcusdt@kline_'+interval);socket.onmessage=e=>{if(token!==streamEpoch||!active()||interval!==w.interval)return;try{const incoming=validateStream(JSON.parse(e.data),interval),last=bars.at(-1);if(!last)return;if(incoming.time<last.time||(incoming.time===last.time&&last.closed&&!incoming.closed)||(incoming.time===last.time&&last.eventTime>incoming.eventTime))return;if(incoming.time>last.time&&incoming.time*1000!==shift(last.time*1000,interval)){badge.textContent='สตรีมขาดช่วง กำลังโหลดข้อมูลใหม่';refresh();return}if(incoming.time===last.time)bars[bars.length-1]=incoming;else bars.push(incoming);if(bars.length>10000){badge.textContent='ประวัติครบขีดจำกัด กำลังเริ่มชุดใหม่';bars=[];refresh();return}render();if(w.follow&&incoming.time!==last.time)chart.timeScale().scrollToRealTime();badge.textContent='LIVE · Binance · '+date(Date.now());}catch(err){badge.textContent='สตรีมตรวจไม่ผ่าน: '+err.message}};
   const fallback=()=>{if(token===streamEpoch&&active())badge.textContent='สตรีมไม่พร้อม · ใช้แท่งปิดจาก REST ทุก 60 วินาที; แท่งที่ยังไม่ปิดอาจล่าช้า'};socket.onerror=fallback;socket.onclose=fallback;
  }catch(e){badge.textContent='สตรีมไม่พร้อม ใช้ REST ทุก 60 วินาที'}
 }
 function deactivate(){epoch++;request?.abort();stopStream();loading=false;$('#own-refresh').disabled=false;$('#own-stream-status').textContent='พักการรับข้อมูลเมื่อไม่ได้เปิดกราฟ';}
 async function refresh(){if(loading||!active())return;loading=true;$('#own-refresh').disabled=true;const id=++epoch,interval=w.interval;request=new AbortController();status.textContent='กำลังอ่านแท่งปิด '+interval+' จาก Binance…';
  try{const {begin,end}=bounds(interval),u=new URL('https://api.binance.com/api/v3/klines');u.search=new URLSearchParams({symbol:'BTCUSDT',interval,startTime:String(begin),endTime:String(end-1),limit:String(COUNT)});const r=await fetch(u,{signal:AbortSignal.any([request.signal,AbortSignal.timeout(20000)])});if(!r.ok)throw Error('Binance HTTP '+r.status);const incoming=validateRows(await r.json(),interval,begin,end);if(id!==epoch||interval!==w.interval||!active())return;
   const first=!bars.length,lastTime=bars.at(-1)?.time,next=mergeBars(bars,incoming,interval);bars=next;lastReceipt=Date.now();render(first);if(!first&&w.follow&&bars.at(-1).time!==lastTime)chart.timeScale().scrollToRealTime();status.textContent=`Binance Spot · BTCUSDT · ${interval} · แท่งล่าสุดปิด ${date(end)} · รับข้อมูล ${date(lastReceipt)} (เวลาไทย)`;openStream();
  }catch(e){if(e.name!=='AbortError')console.error('Chart update failed',e);if(id===epoch&&e.name!=='AbortError')status.textContent='โหลดกราฟไม่สำเร็จ: '+e.message+(lastReceipt?' · แสดงข้อมูลเดิมที่รับ '+date(lastReceipt):' · ยังไม่มีข้อมูลราคา');}
  finally{if(id===epoch){loading=false;$('#own-refresh').disabled=false}}
 }
 function activate(){box.classList.toggle('hidden',!isBTC());$('#own-unavailable').classList.toggle('hidden',isBTC());if(!active()){deactivate();return}if(bars.length)render();refresh()}
 const fields={cdc:{source:['Source',['close','open','high','low','hl2','hlc3','ohlc4']],fast:['Fast EMA',1],slow:['Slow EMA',1],smooth:['Smoothing',1],paint:['สีแท่ง',true],showFast:['เส้น Fast',true],showSlow:['เส้น Slow',true],signals:['สัญญาณ Buy/Sell',true],assist:['ข้อความแนวโน้ม',true],ribbon:['Ribbon',true]},mso:{period:['Stochastic period',1],fast:['Fast EMA',1],slow:['Slow EMA',2],signal:['Signal EMA',2],scheme:['Histogram scheme',['#1','#2']],histogram:['Histogram',true],momentumBackground:['พื้นหลัง momentum',true],crossovers:['เครื่องหมายจุดตัด',true]}};
 for(const [group,spec] of Object.entries(fields)){const f=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=group==='cdc'?'CDC ActionZone':'Modified Stochastic MACD';f.append(legend);for(const [key,[label,kind]] of Object.entries(spec)){const l=document.createElement('label');l.textContent=label;const e=document.createElement(Array.isArray(kind)?'select':'input');e.id='own-'+group+'-'+key;if(Array.isArray(kind)){kind.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;e.append(o)});e.value=w.indicators[group][key]}else if(kind===true){e.type='checkbox';e.checked=w.indicators[group][key]}else{e.type='number';e.min=kind;e.max=1000;e.step=1;e.value=w.indicators[group][key]}l.append(e);f.append(l)}$('#own-indicator-inputs').append(f)}
 $('#own-settings-form').addEventListener('submit',e=>{e.preventDefault();try{const next=copy(w.indicators);for(const [group,spec] of Object.entries(fields))for(const key of Object.keys(spec)){const input=$('#own-'+group+'-'+key);next[group][key]=input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value):input.value}I.validate(next);w.indicators=next;$('#own-labels').checked=next.cdc.assist;save();render()}catch(err){settingsStatus.textContent=err.message}});
 $('#own-chart-type').value=w.chartType;$('#own-chart-type').onchange=()=>{w.chartType=$('#own-chart-type').value;hovered=null;tool(null);save();render()};
 $('#own-timeframe').value=w.interval;$('#own-timeframe').onchange=()=>{deactivate();w.interval=$('#own-timeframe').value;bars=[];displayBars=[];values=[];hovered=null;byTime.clear();lastReceipt=null;tool(null);clearAnnotations();view?.clear();volume?.setData([]);$('#own-quote').textContent='—';$('#own-market-quote').textContent='';$('#own-ohlc').textContent='';$('#own-indicator-readout').textContent='';$('#own-assist').textContent='';$('#own-history').textContent='';delete box.dataset.lastClosed;box.dataset.interval=w.interval;save();refresh()};
 for(const key of ['volume','follow']){$('#own-'+key).checked=w[key];$('#own-'+key).onchange=()=>{w[key]=$('#own-'+key).checked;save();if(key==='volume')render()}}
 $('#own-labels').checked=w.indicators.cdc.assist;$('#own-labels').onchange=()=>{w.indicators.cdc.assist=$('#own-labels').checked;$('#own-cdc-assist').checked=w.indicators.cdc.assist;save();render()};
 $('#own-cdc').checked=w.indicators.cdc.enabled;$('#own-mso').checked=w.indicators.mso.enabled;for(const group of ['cdc','mso'])$('#own-'+group).onchange=()=>{w.indicators[group].enabled=$('#own-'+group).checked;save();render()};
 document.querySelectorAll('[data-own-tool]').forEach(b=>b.onclick=()=>tool(mode===b.dataset.ownTool?null:b.dataset.ownTool));
 $('#own-clear-drawings').onclick=()=>{w.drawings[w.interval]=[];tool(null);save();if(chart)annotations()};$('#own-fit').onclick=()=>{if(chart){chart.timeScale().fitContent();series.priceScale().applyOptions({autoScale:true})}};$('#own-latest').onclick=latest;$('#own-refresh').onclick=refresh;
 $('#own-fullscreen').disabled=!document.fullscreenEnabled;$('#own-fullscreen').onclick=async()=>{try{if(document.fullscreenElement===box)await document.exitFullscreen();else await box.requestFullscreen()}catch(e){toolStatus.textContent='เปิดเต็มจอไม่สำเร็จ: '+e.message}};
 document.addEventListener('fullscreenchange',resize);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active())tool(null)});window.addEventListener('resize',resize);if(globalThis.ResizeObserver)new ResizeObserver(resize).observe(priceEl);
 $('#symbol').addEventListener('change',activate);document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',activate));document.addEventListener('visibilitychange',activate);
 function startTimer(){clearInterval(timer);timer=setInterval(()=>{if(active())refresh()},60000)}window.addEventListener('pagehide',()=>{clearInterval(timer);deactivate()});window.addEventListener('pageshow',()=>{startTimer();activate()});startTimer();tool(null);activate();
}
return {INTERVALS,defaults,periodStart,shift,bounds,validateRows,validateStream,mergeBars,chartCandles,validateWorkspace,cdcLabel,mount};
});
