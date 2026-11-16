/* Read-only BTC market chart. Its data/settings never enter replay/account storage. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.LabMarket=factory()})(globalThis,()=>{
'use strict';
const STEP=900000,COUNT=500;
function validateRows(rows,begin,end){
 if(!Array.isArray(rows)||rows.length!==COUNT)throw Error('ข้อมูลตลาดไม่ครบ 500 แท่งปิด');
 const candles=rows.map((r,i)=>{
  if(!Array.isArray(r)||r.length<7||r[0]!==begin+i*STEP||r[6]!==r[0]+STEP-1||r[6]>=end)throw Error('เวลาแท่งผิดหรือข้อมูลขาด/ซ้ำ');
  const c={time:r[0]/1000,open:Number(r[1]),high:Number(r[2]),low:Number(r[3]),close:Number(r[4])};
  if(![c.open,c.high,c.low,c.close].every(v=>Number.isFinite(v)&&v>0)||c.low>Math.min(c.open,c.close)||c.high<Math.max(c.open,c.close))throw Error('ราคา OHLC ตลาดไม่ถูกต้อง');return c;
 });
 if(!Number.isSafeInteger(begin)||begin%STEP!==0||end-begin!==COUNT*STEP)throw Error('ช่วงเวลาแท่งตลาดไม่ถูกต้อง');return candles;
}
function mount(){
 const $=s=>document.querySelector(s),box=$('#native-market'),status=$('#live-status'),price=$('#live-chart'),osc=$('#live-oscillator');
 let chart,series,view,candles=[],loading=false,request,refreshId=0,lastSuccess=null;
 const config=LabIndicators.defaults();
 const isBTC=()=>$('#symbol').value==='BINANCE:BTCUSDT.P';
 const active=()=>isBTC()&&!$('#market').classList.contains('hidden')&&!document.hidden;
 const date=t=>new Date(t).toLocaleString('th-TH-u-ca-gregory',{timeZone:'Asia/Bangkok',hour12:false});
 function resize(){if(chart&&active()){chart.applyOptions({width:price.clientWidth,height:price.clientHeight});view.resize()}}
 function render(){if(!active()||!candles.length)return;
  if(!window.LightweightCharts)throw Error('โหลดเครื่องมือกราฟไม่สำเร็จ กรุณารีเฟรชหลังตรวจอินเทอร์เน็ต');
  const first=!chart;if(first){chart=LightweightCharts.createChart(price,{width:price.clientWidth,height:price.clientHeight,layout:{background:{color:'#101c29'},textColor:'#aabbc8'},grid:{vertLines:{color:'#1c3040'},horzLines:{color:'#1c3040'}},timeScale:{timeVisible:true},rightPriceScale:{minimumWidth:80}});series=chart.addCandlestickSeries({upColor:'#51c8a8',downColor:'#ef7580',borderVisible:false,wickUpColor:'#51c8a8',wickDownColor:'#ef7580'});view=LabIndicatorView.create(chart,series,osc)}
  const output=LabIndicators.calculate(candles,config);view.render(candles,output,config,{cdc:$('#live-cdc').checked,mso:$('#live-mso').checked});resize();if(first)chart.timeScale().setVisibleLogicalRange({from:Math.max(0,candles.length-150),to:candles.length});
  const last=candles.at(-1),v=output.at(-1);$('#live-price').textContent=`ราคาปิดล่าสุด ${last.close.toLocaleString('th-TH')} USDT · แท่งปิด ${date((last.time+900)*1000)} (เวลาไทย)`;
  $('#live-legend').textContent=`CDC ${v.zone} · EMA ${v.fast.toFixed(2)} / ${v.slow.toFixed(2)} | MSO ${v.macd.toFixed(4)} / Signal ${v.signal.toFixed(4)} / Histogram ${v.hist.toFixed(4)}`;
  box.dataset.lastClosed=String(last.time+900);
 }
 async function refresh(){
  if(loading||!active())return;loading=true;$('#live-refresh').disabled=true;const id=++refreshId;request=new AbortController();status.textContent='กำลังตรวจแท่งปิดล่าสุดจาก Binance…';
  try{
   const end=Math.floor(Date.now()/STEP)*STEP,begin=end-COUNT*STEP;
   const url=new URL('https://fapi.binance.com/fapi/v1/klines');url.search=new URLSearchParams({symbol:'BTCUSDT',interval:'15m',startTime:String(begin),endTime:String(end-1),limit:String(COUNT)});
   const response=await fetch(url,{signal:AbortSignal.any([request.signal,AbortSignal.timeout(20000)])});if(!response.ok)throw Error('Binance HTTP '+response.status);
   const incoming=validateRows(await response.json(),begin,end);if(id!==refreshId||!isBTC())return;
   const merged=new Map(candles.map(c=>[c.time,c]));incoming.forEach(c=>merged.set(c.time,c));const next=[...merged.values()].sort((a,b)=>a.time-b.time);
   for(let i=1;i<next.length;i++)if(next[i].time-next[i-1].time!==900)throw Error('มีช่องว่างระหว่างข้อมูลเดิมกับข้อมูลใหม่ กรุณารีเฟรชหน้าเพื่อเริ่มชุดตลาดใหม่');
   const reset=next.length>10000;candles=reset?incoming:next;lastSuccess=Date.now();render();status.textContent=`Binance USDⓈ-M Futures · BTCUSDT · แท่งปิด 15 นาที · รับข้อมูลสำเร็จ ${date(lastSuccess)} (เวลาไทย) · ตรวจแท่งใหม่ทุก 60 วินาทีเมื่อเปิดหน้านี้${reset?' · เริ่มชุดตลาดใหม่ 500 แท่งหลังครบขีดจำกัดแสดงผล':''}`;
  }catch(e){if(id===refreshId&&e.name!=='AbortError'){if(!lastSuccess)$('#live-price').textContent='ยังไม่มีราคาตลาด';status.textContent='อัปเดตตลาดไม่สำเร็จ: '+e.message+(lastSuccess?' · กราฟยังเป็นข้อมูลเดิมจาก '+date(lastSuccess):' · ยังไม่มีข้อมูลกราฟ ไม่มีราคาทดแทนจำลอง');}}
  finally{if(id===refreshId){loading=false;$('#live-refresh').disabled=false}}
 }
 function deactivate(){if(request)request.abort();refreshId++;loading=false;$('#live-refresh').disabled=false}
 function activate(){box.classList.toggle('hidden',!isBTC());if(!active()){deactivate();return}if(candles.length){render();resize()}refresh()}
 $('#symbol').addEventListener('change',activate);
 document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',activate));
 document.addEventListener('visibilitychange',activate);window.addEventListener('resize',resize);
 $('#live-refresh').onclick=refresh;$('#live-cdc').onchange=$('#live-mso').onchange=()=>{try{render()}catch(e){status.textContent=e.message}};
 const timer=setInterval(()=>{if(active())refresh()},60000);window.addEventListener('pagehide',()=>{clearInterval(timer);deactivate()},{once:true});
 if(window.ResizeObserver)new ResizeObserver(resize).observe(price);
 activate();
}
return {validateRows,mount};
});
