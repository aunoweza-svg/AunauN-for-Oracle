'use strict';
const M=LabModel,$=s=>document.querySelector(s),KEY='axiom_lab_v2',BACKUP='axiom_lab_v2_backup',OLD='axiom_records';
let state=M.empty(),raw=null,oldRaw=null,readable=false,verifiedState=false,storageAccess=false,busy=true,loading=false,loaded=null,awaitingStart=false,chart,series;
const status=$('#status'),storageStatus=$('#storage-status');
const clone=s=>JSON.parse(JSON.stringify(s));
const uid=()=>crypto.randomUUID().replaceAll('-','_');
const utc=t=>new Date(t*1000).toISOString().replace('.000Z',' UTC');
const say=m=>{storageStatus.textContent=m};
async function digest(candles){const bytes=new TextEncoder().encode(JSON.stringify(candles));return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
async function verify(s){M.validate(s);for(const d of s.datasets)if(await digest(d.candles)!==d.sha256)throw Error('dataset checksum ไม่ตรง');return s;}
function parse(text){if(typeof text!=='string'||text.length>12*1024*1024)throw Error('ไฟล์ต้องไม่เกิน 12 MiB');return JSON.parse(text);}
function current(){return M.active(state)}
function trading(){return readable&&!busy&&!loading&&!awaitingStart&&!!current()}
function controls(){const r=current(),p=r?.position,ready=trading();
 $('#load').disabled=busy||loading||!!p;
 $('#start').disabled=!readable||busy||loading||!!p||!(loaded||M.data(state));
 $('#next').disabled=!ready||r.index>=M.data(state).candles.length-1;
 $('#long').disabled=$('#short').disabled=!ready||!!p;
 $('#close').disabled=!ready||!p;
 $('#import').disabled=!storageAccess||busy||loading||!!p;
 $('#restore').disabled=!storageAccess||busy||loading||!!p;
 $('#replay-date').disabled=busy||loading||!!p;
 $('#capital').disabled=busy||loading||!!p;
 $('#export').disabled=busy;
}
function makeChart(){if(chart)return;if(!window.LightweightCharts)throw Error('โหลดกราฟไม่ได้ ตรวจอินเทอร์เน็ตแล้วโหลดหน้าใหม่ (session ยังอยู่ใน browser)');
 chart=LightweightCharts.createChart($('#chart'),{width:$('#chart').clientWidth,height:$('#chart').clientHeight,layout:{background:{color:'#101c29'},textColor:'#aabbc8'},grid:{vertLines:{color:'#1c3040'},horzLines:{color:'#1c3040'}},timeScale:{timeVisible:true},rightPriceScale:{borderColor:'#304454'}});
 series=chart.addCandlestickSeries({upColor:'#51c8a8',downColor:'#ef7580',borderVisible:false,wickUpColor:'#51c8a8',wickDownColor:'#ef7580'});
}
function resize(){if(chart)chart.applyOptions({width:$('#chart').clientWidth,height:$('#chart').clientHeight})}
window.addEventListener('resize',resize);
function draw(){const r=current();if(!r)return;try{makeChart();series.setData(M.data(state).candles.slice(0,r.index+1));}catch(e){status.textContent=e.message}}
function render(){const r=current(),d=M.data(state);
 if(!r){$('#clock').textContent='ยังไม่เริ่ม';$('#account').textContent='เริ่มรอบใหม่เพื่อจำลอง'}
 if(r){const c=d.candles[r.index],p=r.position,pnl=p?(c.close-p.entry)*p.qty*(p.side==='Long'?1:-1):0;
 $('#clock').textContent=`แท่งเปิด ${utc(c.time)} · ตัดสินใจหลังปิด ${utc(c.time+M.STEP)} · close ${c.close} USDT`;
 $('#account').textContent=`รอบ ${r.label||r.id} · เงินสดจำลอง ${r.balance.toFixed(2)} USDT · ${p?p.side+' '+p.qty+' BTC | P&L ยังไม่ปิด '+pnl.toFixed(2):'ไม่มีสถานะ'} · มูลค่าก่อน fee ปิด ${(r.balance+pnl).toFixed(2)} USDT${r.index===d.candles.length-1?' · ท้ายข้อมูล (ยังปิดสถานะได้)':''}`;
 }
 const shown=loaded||d;if(shown){$('#dataset-info').textContent=`Binance public USDⓈ-M klines · BTCUSDT / 15m · ${shown.candles.length} แท่งปิด · ${utc(shown.start)} ถึง ${utc(shown.end)} (ไม่รวมปลายช่วง) · ดึง ${new Date(shown.fetchedAt).toISOString()} · SHA256 ${shown.sha256}`;
 $('#replay-date').min=new Date(shown.start*1000).toISOString().slice(0,16);$('#replay-date').max=new Date((shown.end-M.STEP)*1000).toISOString().slice(0,16);
 }
 renderRecords();controls();
}
// Web Locks serializes origin writers. Compare the entire saved snapshot inside the lock.
// Persist before replacing live state; quota/conflict failures never change the account.
async function transact(change,{backup=false,recovery=false}={}){
 if((!readable&&!recovery)||!storageAccess||busy||loading)return false;busy=true;controls();
 try{
  await navigator.locks.request(KEY,{mode:'exclusive'},async()=>{
   if(localStorage.getItem(KEY)!==raw||localStorage.getItem(OLD)!==oldRaw)throw Error('ข้อมูลเปลี่ยนจากอีกแท็บ กรุณาส่งออก snapshot ของแท็บนี้แล้วโหลดหน้าใหม่');
   const next=clone(state);await change(next);M.validate(next);
   const text=JSON.stringify(next);if(text.length>12*1024*1024)throw Error('snapshot เกิน 12 MiB กรุณาสำรองและเริ่ม origin แยก');
   if(backup)localStorage.setItem(BACKUP,raw===null?JSON.stringify(state):raw);
   localStorage.setItem(KEY,text);raw=text;state=next;readable=true;verifiedState=true;
  });
  say('บันทึก snapshot สำเร็จ · ควรส่งออก JSON เก็บภายนอกเป็นประจำ');return true;
 }catch(e){say('บันทึกไม่สำเร็จ สถานะ/ยอดเดิมยังอยู่: '+e.message);return false;}
 finally{busy=false;render()}
}
async function boot(){
 try{raw=localStorage.getItem(KEY);oldRaw=localStorage.getItem(OLD);storageAccess=!!navigator.locks&&!!crypto.subtle;
  if(raw!==null)state=await verify(parse(raw));
  else if(oldRaw!==null){const old=parse(oldRaw);if(!Array.isArray(old))throw Error('legacy journal ไม่ใช่รายการ');old.forEach(M.legacyRecord);state=M.empty(old)}
  if(!navigator.locks||!crypto.subtle)throw Error('ต้องเปิดผ่าน localhost และ browser ที่รองรับ Web Locks/Web Crypto เพื่อเก็บ session อย่างปลอดภัย');
  readable=true;verifiedState=true;const r=current();if(r){loaded=M.data(state);$('#capital').value=r.initial;$('#replay-date').value=new Date(loaded.candles[r.startIndex].time*1000).toISOString().slice(0,16);draw();status.textContent='กู้คืน session และ dataset จาก snapshot แล้ว รวมสถานะที่ยังเปิด';}
  say(oldRaw!==null?'เก็บ journal รุ่นเดิมไว้ ไม่แก้ต้นฉบับ; รายการเก่าระบุว่าขาดบริบท dataset':'เก็บ snapshot ใน browser/origin นี้เท่านั้น ส่งออก JSON เพื่อสำรองภายนอก');
 }catch(e){readable=false;say('อ่าน/ตรวจข้อมูลไม่ได้ หยุดเขียนเพื่อรักษาต้นฉบับ: '+e.message+' · ส่งออกไฟล์ recovery ก่อนจัดการข้อมูล ห้ามล้าง browser');}
 busy=false;render();
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('nav button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});
 document.querySelectorAll('.view').forEach(x=>x.classList.toggle('hidden',x.id!==b.dataset.view));if(b.dataset.view==='replay'){draw();resize()}if(b.dataset.view==='journal')renderRecords();
});
function tv(){const symbol=$('#symbol').value;
 $('#market-availability').textContent=symbol.startsWith('SET:')?'ผลตรวจ 15 พ.ย. 2026: TradingView widget นี้ไม่รองรับ SET:SET, SET:PTT และ SET:ADVANC จึงไม่มีกราฟหุ้นไทยเหล่านี้ในแอป เปิดกราฟบน TradingView ภายนอกจากลิงก์ด้านล่าง สิทธิ์และความล่าช้ายังขึ้นกับผู้ให้บริการ':'BTC widget จาก TradingView; ตรวจเวลาแท่งและสถานะข้อมูลในกราฟก่อนใช้';
 $('#market-link').href='https://www.tradingview.com/chart/?symbol='+encodeURIComponent(symbol);$('#market-link').textContent='เปิดกราฟ '+symbol+' บน TradingView ภายนอก';
 const el=$('#tv');el.replaceChildren();const container=document.createElement('div');container.className='tradingview-widget-container';container.style.height='100%';container.style.width='100%';el.append(container);
 const inner=document.createElement('div');inner.className='tradingview-widget-container__widget';inner.style.height='100%';inner.style.width='100%';container.append(inner);
 const script=document.createElement('script');script.src='https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';script.async=true;script.text=JSON.stringify({autosize:true,symbol:$('#symbol').value,interval:'15',timezone:'Asia/Bangkok',theme:'dark',style:'1',locale:'th',allow_symbol_change:false,hide_side_toolbar:false});
 $('#market-status').textContent=`ขอ widget ${$('#symbol').value} จาก TradingView เวลา ${new Date().toISOString()} · นี่คือเวลาร้องขอ ไม่ใช่เวลาอัปเดตราคา ดูเวลาแท่ง/สถานะ delayed ใน widget; แอปอ่านหรือยืนยัน feed ใน iframe ไม่ได้`;
 script.onerror=()=>{$('#market-status').textContent='โหลด TradingView script ไม่สำเร็จ ตรวจเครือข่าย/ภูมิภาค; ไม่มีข้อมูลทดแทนจำลอง'};container.append(script);
}
$('#symbol').onchange=tv;tv();
$('#load').onclick=async()=>{
 if(loading||busy||current()?.position)return;loading=true;controls();status.textContent='กำลังโหลดแท่งปิด 90 วันจาก Binance…';
 try{const end=Math.floor(Date.now()/900000)*900000,begin=end-90*86400000;let cursor=begin,rows=[];
  while(cursor<end){const u=new URL('https://fapi.binance.com/fapi/v1/klines');u.search=new URLSearchParams({symbol:'BTCUSDT',interval:'15m',startTime:String(cursor),endTime:String(end-1),limit:'1000'});
   const res=await fetch(u,{signal:AbortSignal.timeout(20000)});if(!res.ok)throw Error('Binance HTTP '+res.status);const page=await res.json();
   if(!Array.isArray(page)||page.length>1000)throw Error('รูปแบบ Binance ไม่ถูกต้อง');if(!page.length)break;
   for(const r of page){if(!Array.isArray(r)||r.length<7||!Number.isSafeInteger(r[0])||r[0]<cursor||r[0]>=end||r[6]!==r[0]+899999)throw Error('เวลาแท่งไม่ถูกต้อง/ซ้ำ/แท่งยังไม่ปิด');rows.push(r)}
   const next=page.at(-1)[0]+900000;if(next<=cursor)throw Error('pagination ไม่เดินหน้า');cursor=next;
  }
  const candles=rows.map(r=>({time:r[0]/1000,open:Number(r[1]),high:Number(r[2]),low:Number(r[3]),close:Number(r[4])}));
  if(candles.length!==8640||candles[0]?.time!==begin/1000||candles.at(-1)?.time!==(end-900000)/1000)throw Error(`ข้อมูลขาด: ต้องมี 8640 แท่งปิดใน ${new Date(begin).toISOString()} ถึง ${new Date(end).toISOString()} ได้ ${candles.length}; ไม่เติมราคาทดแทน`);
  const d={id:'ds_'+uid(),source:'Binance public USDⓈ-M klines',symbol:'BTCUSDT',interval:'15m',timezone:'UTC',fetchedAt:Date.now(),start:begin/1000,end:end/1000,candles,sha256:await digest(candles)};M.dataset(d);
  makeChart();series.setData([]);loaded=d;awaitingStart=true;
  $('#replay-date').value=new Date(candles[Math.min(199,candles.length-1)].time*1000).toISOString().slice(0,16);
  status.textContent='ตรวจครบ 90 วัน ไม่พบข้อมูลขาด/ซ้ำ · เลือกวันเริ่ม UTC แล้วเริ่มรอบใหม่ก่อนเทรด';
 }catch(e){status.textContent='โหลดไม่สำเร็จ: '+e.message+' · เก็บรอบเดิมไว้ ไม่มีราคาสังเคราะห์ทดแทน';}
 finally{loading=false;render()}
};
$('#start').onclick=async()=>{
 if(!readable||busy||loading||current()?.position)return;
 if(!$('#ack').checked){status.textContent='อ่านและยอมรับข้อจำกัดของแบบฝึกก่อนเริ่มรอบ';return}
 const d=loaded||M.data(state);if(!d)return;
 const input=$('#replay-date').value;const t=Date.parse(input+'Z')/1000,i=d.candles.findIndex(c=>c.time===t);
 if(!input||i<0){status.textContent='เลือกเวลาเปิดแท่ง UTC ที่มีจริงใน dataset และตรง 00/15/30/45 นาที';return}
 try{makeChart()}catch(e){status.textContent=e.message;return}
 const capital=Number($('#capital').value),label=$('#run-label').value;
 const ok=await transact(s=>M.start(s,d,capital,i,label,uid(),Date.now()));if(ok){awaitingStart=false;draw();chart.timeScale().fitContent();status.textContent='เริ่มรอบแล้ว แสดงเฉพาะแท่งถึงวันเริ่ม (รวมแท่งปัจจุบัน)';render()}
};
$('#next').onclick=async()=>{if(trading()&&current().index<M.data(state).candles.length-1){if(await transact(M.next))draw()}};
async function open(side){if(!trading()||current().position)return;await transact(s=>M.open(s,side,Number($('#qty').value),Number($('#fee').value),$('#reason').value))}
$('#long').onclick=()=>open('Long');$('#short').onclick=()=>open('Short');
$('#close').onclick=async()=>{if(trading()&&current().position)await transact(M.close)};
function renderRecords(){const el=$('#records');el.replaceChildren();if(!readable){el.textContent='หยุดอ่านบันทึกเพื่อรักษาข้อมูลเดิม ส่งออก recovery ได้';return}
 for(const r of [...state.runs].reverse()){
  const d=document.createElement('div');d.className='record';d.textContent=`รอบ ${r.label||r.id} · dataset ${r.datasetId} · ทุน ${r.initial} → เงินสด ${r.balance.toFixed(2)} USDT · เริ่ม ${utc(M.data(state,r).candles[r.startIndex].time)} · ${r.position?'มีสถานะเปิด':'ไม่มีสถานะเปิด'}`;el.append(d);
  for(const t of r.trades){const row=document.createElement('div');row.className='record';row.textContent=`${t.side} ${t.qty} BTC | ${utc(t.opened)} → ${utc(t.closed)} | ${t.entry} → ${t.exit} | gross ${t.gross.toFixed(4)} − fee ${t.entryFee.toFixed(4)} − ${t.exitFee.toFixed(4)} = net ${t.net.toFixed(4)} USDT | เหตุผล: ${t.reason||'ไม่ได้ระบุ'}`;el.append(row)}
 }
 for(const t of state.legacyRecords){const row=document.createElement('div');row.className='record';row.textContent=`LEGACY: ไม่มี dataset/session context ยืนยันทำซ้ำไม่ได้ · ${t.side} ${t.qty} BTC · net ${t.net} · ${t.reason}`;el.append(row)}
 if(!state.runs.length&&!state.legacyRecords.length)el.textContent='ยังไม่มีรอบฝึก';
}
function download(text,name,type='application/json'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$('#export').onclick=()=>{
 if(verifiedState)download(JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2),'axiom-trading-lab-v2.json');
 else download(JSON.stringify({warning:'RAW RECOVERY ONLY ไม่ใช่ไฟล์สำหรับ import; เก็บต้นฉบับไว้',v2:raw,legacy:oldRaw},null,2),'axiom-trading-lab-recovery.json');
};
async function replace(readText){
 if(!storageAccess||busy||loading||current()?.position)return;
 busy=true;controls();
 try{const text=typeof readText==='function'?await readText():readText;const imported=await verify(parse(text));
  if(!confirm('แทน snapshot ทั้งหมดด้วยไฟล์นี้? ระบบจะสำรอง snapshot ปัจจุบันใน browser ก่อน แต่ควรส่งออก JSON เก็บภายนอกด้วย'))return;
  busy=false;
  const ok=await transact(s=>{if(M.active(s)?.position)throw Error('ปิดสถานะก่อนนำเข้า');for(const k of Object.keys(s))delete s[k];Object.assign(s,imported)},{backup:true,recovery:true});
  if(ok){loaded=M.data(state);awaitingStart=false;if(loaded){const r=current();$('#capital').value=r.initial;$('#replay-date').value=new Date(loaded.candles[r.startIndex].time*1000).toISOString().slice(0,16);draw()}else if(series)series.setData([]);status.textContent='นำเข้า snapshot ผ่าน schema, ledger และ SHA256 แล้ว';render()}
 }catch(e){say('นำเข้าไม่สำเร็จ ข้อมูลเดิมยังอยู่: '+e.message)}
 finally{busy=false;render()}
}
$('#import').onclick=()=>{const f=$('#import-file').files[0];if(!f)return say('เลือกไฟล์ JSON ก่อน');if(f.size>12*1024*1024)return say('ไฟล์เกิน 12 MiB');return replace(()=>f.text())};
$('#restore').onclick=async()=>{try{const saved=localStorage.getItem(BACKUP);if(!saved)return say('ยังไม่มี backup ก่อน import');await replace(saved)}catch(e){say('อ่าน backup ไม่สำเร็จ: '+e.message)}};
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===OLD||e.key===null){readable=false;say('ข้อมูลเปลี่ยนจากอีกแท็บ หยุดเขียนเพื่อรักษาข้อมูล ส่งออก snapshot ของแท็บนี้ก่อนโหลดหน้าใหม่');controls()}});
window.addEventListener('beforeunload',e=>{if(busy||loading){e.preventDefault();e.returnValue=''}});
$('#limitations').textContent=M.LIMITATIONS.join('\n');
controls();boot();
