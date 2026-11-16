'use strict';
const M=LabModel,$=s=>document.querySelector(s),KEY='axiom_lab_v2',BACKUP='axiom_lab_v2_backup',OLD='axiom_records';
let state=M.empty(),raw=null,oldRaw=null,readable=false,verifiedState=false,storageAccess=false,busy=true,loading=false,loaded=null,awaitingStart=false,chart,series,indicatorView;
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
function resize(){if(chart)chart.applyOptions({width:$('#chart').clientWidth,height:$('#chart').clientHeight});indicatorView?.resize()}
window.addEventListener('resize',resize);
function draw(){const r=current();if(!r||awaitingStart)return;try{makeChart();const visible=M.data(state).candles.slice(0,r.index+1);
 if(!indicatorView)indicatorView=LabIndicatorView.create(chart,series,$('#oscillator'));
 if(!r.indicators){indicatorView.render(visible,visible.map(c=>({time:c.time})),{cdc:{enabled:false},mso:{enabled:false}}, {cdc:false,mso:false});$('#cdc-assist').textContent='';$('#cdc-assist').classList.add('hidden');$('#indicator-legend').textContent='รอบ v2 เดิม: ไม่มี indicator context บันทึกไว้ เริ่มรอบใหม่เพื่อใช้ indicator';return}
 const values=LabIndicators.calculate(visible,r.indicators),last=values.at(-1);
 indicatorView.render(visible,values,r.indicators,{cdc:$('#display-cdc').checked,mso:$('#display-mso').checked});
 const assist=$('#cdc-assist'),showAssist=r.indicators.cdc.enabled&&r.indicators.cdc.assist&&$('#display-cdc').checked;
 assist.classList.toggle('hidden',!showAssist);assist.textContent=showAssist?`${last.buy?'BUY next bar · ':last.sell?'SELL next bar · ':''}BTCUSDT ${visible.at(-1).close} USDT · currently in a ${last.bullish?'bullish':last.bearish?'bearish':'sideways'} trend`:'';
 $('#indicator-legend').textContent=`${r.indicators.cdc.enabled?'CDC '+last.zone+' · Fast '+last.fast.toFixed(6)+' / Slow '+last.slow.toFixed(6):'CDC ปิด'} | ${r.indicators.mso.enabled?'MSO '+last.macd.toFixed(6)+' / Signal '+last.signal.toFixed(6)+' / Hist '+last.hist.toFixed(6):'MSO ปิด'} · ${last.warmup?'ประวัติน้อยกว่า period ที่ตั้ง ค่าเริ่มต้นยังไวต่อช่วงข้อมูล':'คำนวณจากประวัติที่มี เริ่ม EMA ที่แท่งแรกของ dataset'} · ยังไม่ยืนยัน numerical parity กับ TradingView`;
 }catch(e){status.textContent=e.message}}
function render(){const r=current(),d=M.data(state);
 if(!r){indicatorView?.clear();$('#indicator-legend').textContent='';$('#cdc-assist').textContent='';$('#clock').textContent='ยังไม่เริ่ม';$('#account').textContent='เริ่มรอบใหม่เพื่อจำลอง'}
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
  makeChart();indicatorView?.clear();series.setData([]);$('#indicator-legend').textContent='';$('#cdc-assist').textContent='';loaded=d;awaitingStart=true;
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
 const capital=Number($('#capital').value),label=$('#run-label').value;let indicators;try{indicators=readIndicatorInputs()}catch(e){status.textContent=e.message;return}
 const ok=await transact(s=>M.start(s,d,capital,i,label,uid(),Date.now(),indicators));if(ok){awaitingStart=false;draw();chart.timeScale().fitContent();status.textContent='เริ่มรอบแล้ว แสดงเฉพาะแท่งถึงวันเริ่ม (รวมแท่งปัจจุบัน)';render()}
};
$('#next').onclick=async()=>{if(trading()&&current().index<M.data(state).candles.length-1){if(await transact(M.next))draw()}};
async function open(side){if(!trading()||current().position)return;await transact(s=>M.open(s,side,Number($('#qty').value),Number($('#fee').value),$('#reason').value))}
$('#long').onclick=()=>open('Long');$('#short').onclick=()=>open('Short');
$('#close').onclick=async()=>{if(trading()&&current().position)await transact(M.close)};
function renderRecords(){const el=$('#records');if(!readable){el.textContent='อ่านบันทึกไม่ได้ ต้นฉบับยังอยู่ กรุณาส่งออกข้อมูลเพื่อกู้คืน';return}LabJournal.render(el,state,r=>M.data(state,r));}

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
setupIndicatorInputs();controls();boot();LabOwnChart.mount();LabTradingView.mount();

function setupIndicatorInputs(){
 const el=$('#indicator-inputs'),defaults=LabIndicators.defaults();
 const fields={cdc:{enabled:'ใช้ CDC ในรอบใหม่',source:'Source',fast:'Fast EMA',slow:'Slow EMA',smooth:'Smoothing',paint:'สีแท่ง',showFast:'เส้น fast',showSlow:'เส้น slow',assist:'ข้อความช่วยอ่าน',signals:'สัญญาณ Buy/Sell',ribbon:'Ribbon',ribbonPosition:'Ribbon position'},mso:{enabled:'ใช้ MSO ในรอบใหม่',period:'Stochastic period',fast:'Fast EMA',slow:'Slow EMA',signal:'Signal EMA',histogram:'Histogram',scheme:'Histogram scheme',momentumBackground:'Momentum background',lineWidth:'Line thickness',crossovers:'Crossover markers',overbought:'Overbought',oversold:'Oversold'}};
 for(const [group,items] of Object.entries(fields)){
  const box=document.createElement('fieldset'),title=document.createElement('legend');title.textContent=group==='cdc'?'CDC ActionZone V3 2020':'Modified Stochastic MACD';box.append(title);
  for(const [key,label] of Object.entries(items)){
   const wrap=document.createElement('label');wrap.textContent=label;const value=defaults[group][key];let input;
   const choices=key==='source'?['close','open','high','low','hl2','hlc3','ohlc4']:key==='scheme'?['#1','#2']:key==='ribbonPosition'?['Top','Bottom']:key==='lineWidth'?['1','2']:null;
   if(choices){input=document.createElement('select');for(const v of choices){const option=document.createElement('option');option.value=v;option.textContent=v;input.append(option)}}else{input=document.createElement('input');input.type=typeof value==='boolean'?'checkbox':'number';if(input.type==='checkbox')input.checked=value;else{input.min=key==='oversold'?'':key==='overbought'?'0.5':(group==='mso'&&['slow','signal'].includes(key)?'2':'1');input.max=key==='oversold'?'-0.5':key==='overbought'?'':'1000';input.step=['overbought','oversold'].includes(key)?'0.05':'1'}}
   input.id='ind-'+group+'-'+key;input.value=String(value);wrap.append(input);box.append(wrap);
  }el.append(box);
 }
 const unsupported=document.createElement('p');unsupported.className='note';unsupported.textContent='CDC fixed timeframe (ค่าเดิม D) และ momentum StochRSI ยังไม่รองรับในรุ่นนี้ ปิดไว้เสมอ · การตั้งค่านี้ใช้เมื่อเริ่มรอบใหม่เท่านั้น รอบเดิมใช้ค่าที่บันทึกไว้';el.append(unsupported);
 for(const name of ['cdc','mso']){const label=document.createElement('label');label.className='check';const input=document.createElement('input');input.id='display-'+name;input.type='checkbox';input.checked=true;input.onchange=draw;label.append(input);label.append(document.createTextNode('แสดง '+name.toUpperCase()+' ของรอบปัจจุบัน'));el.append(label)}
 $('#indicator-status').textContent='Chart timeframe 15m เท่านั้น · ค่ามาตรฐานตรง Pine ที่ได้รับ · numerical parity ภายนอกยังไม่ยืนยัน · indicator ไม่เปิดคำสั่งซื้อขาย';
}
function readIndicatorInputs(){const c=LabIndicators.defaults();for(const group of ['cdc','mso'])for(const key of Object.keys(c[group])){const input=$('#ind-'+group+'-'+key);if(!input)continue;c[group][key]=typeof c[group][key]==='boolean'?input.checked:typeof c[group][key]==='number'?Number(input.value):input.value}return LabIndicators.validate(c)}
