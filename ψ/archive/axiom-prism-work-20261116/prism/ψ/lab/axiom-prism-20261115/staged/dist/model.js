/* AXIOM personal replay model. No account connectivity or automatic strategies. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.LabModel=api;})(globalThis,()=>{
'use strict';
const VERSION='2.0.0',SCHEMA=2,STEP=900;
const LIMITATIONS=Object.freeze([
 'แบบฝึก P&L เชิงเส้นเท่านั้น ไม่ใช่บัญชี Futures หรือ backtest อัตโนมัติ',
 'BTCUSDT USDⓈ-M Perpetual เป็นสมมติฐานต้นแบบ ยังไม่ยืนยันประเภทสัญญาจากผู้ใช้',
 'เปิดและปิดที่ราคาปิดแท่งที่เห็นทันทีหลังแท่งปิด ไม่มี order book หรือการจับคู่จริง อาจมองโลกในแง่ดี',
 'ค่าธรรมเนียม % ต่อด้าน = ราคา × BTC × อัตรา/100 ล็อกอัตราตอนเข้า; net = gross − fee เข้า − fee ออก',
 'ไม่จำลอง leverage, margin, liquidation, funding, spread, slippage, partial fills, stop loss หรือ take profit; ไม่กันเงินต้นตาม notional และยอดอาจติดลบ',
 'ซ่อนแท่งอนาคตเฉพาะใน replay; dataset ทั้งหมดอยู่ใน browser และภาพตลาดดูแยกได้ ไม่ใช่ blind research',
 'ข้อมูลจาก Binance public USDⓈ-M klines; TradingView แยกแหล่ง/เวลาและอาจล่าช้า ไม่ตรวจเทียบราคากับแหล่งที่สอง',
 'เก็บเฉพาะ browser/origin นี้ ไม่ซิงก์ข้ามเครื่อง พื้นที่เต็มหรือล้าง browser อาจสูญหาย ต้องสำรอง JSON ภายนอก'
]);
function ensure(ok,msg){if(!ok)throw Error(msg);}
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const near=(a,b)=>finite(a)&&finite(b)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b));
const str=(s,max=10000)=>typeof s==='string'&&s.length<=max;
const id=s=>str(s,100)&&/^[a-zA-Z0-9_-]+$/.test(s);
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function dataset(d){
 ensure(d&&id(d.id)&&d.source==='Binance public USDⓈ-M klines'&&d.symbol==='BTCUSDT'&&d.interval==='15m'&&d.timezone==='UTC'&&finite(d.fetchedAt),'dataset metadata ไม่ถูกต้อง');
 ensure(Array.isArray(d.candles)&&d.candles.length>=2&&d.candles.length<=100000,'จำนวนแท่งไม่ถูกต้อง');
 d.candles.forEach((c,i)=>{
  ensure(c&&Number.isSafeInteger(c.time)&&c.time>=0&&c.time%STEP===0&&['open','high','low','close'].every(k=>finite(c[k])&&c[k]>0)&&c.low<=Math.min(c.open,c.close)&&c.high>=Math.max(c.open,c.close)&&c.low<=c.high,'OHLC/เวลาไม่ถูกต้องที่แท่ง '+i);
  if(i)ensure(c.time-d.candles[i-1].time===STEP,'ข้อมูลขาด/ซ้ำ/เรียงผิดที่ '+new Date(c.time*1000).toISOString());
 });
 ensure(d.start===d.candles[0].time&&d.end===d.candles.at(-1).time+STEP,'ขอบเขต dataset ไม่ตรง');
 ensure(Number.isSafeInteger(d.fetchedAt)&&d.fetchedAt>=d.end*1000&&d.fetchedAt<=Date.now(),'dataset มีแท่งอนาคต/ยังไม่ปิด หรือ fetchedAt อยู่ในอนาคต');
 ensure(typeof d.sha256==='string'&&/^[a-f0-9]{64}$/.test(d.sha256),'dataset SHA256 ไม่ถูกต้อง');
 return d;
}
function costs(side,qty,entry,exit,fee){
 const entryFee=entry*qty*fee/100,exitFee=exit*qty*fee/100;
 const gross=(exit-entry)*qty*(side==='Long'?1:-1),net=(gross-entryFee-exitFee)||0;
 ensure([entryFee,exitFee,gross,net].every(finite),'คำนวณเกินขอบเขต');return {entryFee,exitFee,gross,net};
}
function position(p,d){
 ensure(p&&['Long','Short'].includes(p.side)&&finite(p.qty)&&p.qty>0&&finite(p.fee)&&p.fee>=0&&p.fee<=100&&str(p.reason),'ขนาด/ด้าน/fee/เหตุผล ไม่ถูกต้อง');
 ensure(Number.isInteger(p.entryIndex)&&!!d.candles[p.entryIndex]&&p.entry===d.candles[p.entryIndex].close&&p.opened===d.candles[p.entryIndex].time+STEP,'ราคา/เวลาเข้าไม่ตรงกับ dataset');
 ensure(near(p.entryFee,p.entry*p.qty*p.fee/100),'ค่าธรรมเนียมเข้าไม่ตรง');
}
function legacyRecord(r){
 ensure(r&&['Long','Short'].includes(r.side)&&['qty','entry','exit','opened','closed','gross','net','entryFee','exitFee','fee','startingCapital'].every(k=>finite(r[k]))&&r.qty>0&&r.entry>0&&r.exit>0&&r.opened>=0&&r.closed>=r.opened&&r.fee>=0&&r.fee<=100&&r.startingCapital>0&&str(r.reason),'legacy journal ไม่ถูกต้อง');
 const c=costs(r.side,r.qty,r.entry,r.exit,r.fee);for(const k of Object.keys(c))ensure(near(r[k],c[k]),'legacy arithmetic ไม่ตรง');return r;
}
function validate(s){
 ensure(s&&s.schemaVersion===SCHEMA&&s.engineVersion===VERSION&&same(s.limitations,LIMITATIONS),'schema/engine/ข้อจำกัดไม่ตรงกับเวอร์ชันนี้');
 ensure(Array.isArray(s.datasets)&&s.datasets.length<=100&&Array.isArray(s.runs)&&s.runs.length<=100&&Array.isArray(s.legacyRecords)&&s.legacyRecords.length<=10000,'โครงสร้าง journal ไม่ถูกต้อง');
 s.legacyRecords.forEach(legacyRecord);
 const ds=new Map();s.datasets.forEach(d=>{dataset(d);ensure(!ds.has(d.id),'dataset ID ซ้ำ');ds.set(d.id,d)});
 const ids=new Set();
 s.runs.forEach(r=>{
  ensure(r&&id(r.id)&&!ids.has(r.id)&&ds.has(r.datasetId),'run ID/dataset ไม่ถูกต้อง');ids.add(r.id);
  const d=ds.get(r.datasetId);
  ensure(finite(r.createdAt)&&finite(r.initial)&&r.initial>0&&finite(r.balance)&&Number.isInteger(r.startIndex)&&r.startIndex>=0&&Number.isInteger(r.index)&&r.index>=r.startIndex&&r.index<d.candles.length&&str(r.label,200)&&Array.isArray(r.trades)&&r.trades.length<=10000,'run settings ไม่ถูกต้อง');
  let cash=r.initial,previous=r.startIndex;
  for(const t of r.trades){
   position(t,d);
   ensure(t.entryIndex>=previous&&Number.isInteger(t.exitIndex)&&t.exitIndex>=t.entryIndex&&t.exitIndex<=r.index&&t.exit===d.candles[t.exitIndex].close&&t.closed===d.candles[t.exitIndex].time+STEP,'เวลา/ราคาปิดไม่ตรง');
   const c=costs(t.side,t.qty,t.entry,t.exit,t.fee);for(const k of Object.keys(c))ensure(near(t[k],c[k]),'trade arithmetic ไม่ตรง');
   ensure(t.entryFee<cash,'เงินไม่พอจ่าย fee เข้า');cash+=t.net;previous=t.exitIndex;
  }
  if(r.position){position(r.position,d);ensure(r.position.entryIndex>=previous&&r.position.entryIndex<=r.index&&r.position.entryFee<cash,'สถานะเปิดไม่ถูกต้อง');cash-=r.position.entryFee;}
  ensure(near(cash,r.balance),'ยอดเงินไม่ตรง ledger');
 });
 ensure(s.activeRunId===null||ids.has(s.activeRunId),'active run ไม่พบ');
 ensure(s.runs.every(r=>!r.position||r.id===s.activeRunId),'มีสถานะเปิดใน run ที่พักอยู่');
 return s;
}
function empty(legacyRecords=[]){return {schemaVersion:SCHEMA,engineVersion:VERSION,limitations:[...LIMITATIONS],datasets:[],runs:[],activeRunId:null,legacyRecords};}
function active(s){return s.runs.find(r=>r.id===s.activeRunId)||null;}
function data(s,r=active(s)){return r?s.datasets.find(d=>d.id===r.datasetId):null;}
function start(s,d,capital,startIndex,label,runId,now){
 ensure(!active(s)?.position,'ปิดสถานะก่อนเริ่มรอบใหม่');dataset(d);
 ensure(finite(capital)&&capital>0&&Number.isInteger(startIndex)&&startIndex>=0&&startIndex<d.candles.length,'ทุน/วันเริ่มไม่ถูกต้อง');
 if(!s.datasets.some(x=>x.id===d.id))s.datasets.push(d);
 s.runs.push({id:runId,datasetId:d.id,createdAt:now,label,initial:capital,balance:capital,startIndex,index:startIndex,position:null,trades:[]});s.activeRunId=runId;return validate(s);
}
function next(s){const r=active(s),d=data(s);ensure(r&&r.index<d.candles.length-1,'ถึงท้ายข้อมูลแล้ว');r.index++;return validate(s);}
function open(s,side,qty,fee,reason){const r=active(s),d=data(s);ensure(r&&!r.position,'ยังไม่พร้อมเปิดสถานะ');const c=d.candles[r.index];
 const p={side,qty,fee,reason,entryIndex:r.index,entry:c.close,opened:c.time+STEP,entryFee:c.close*qty*fee/100};position(p,d);
 ensure(p.entryFee<r.balance,'เงินไม่พอจ่าย fee เข้า');r.balance-=p.entryFee;r.position=p;return validate(s);
}
function close(s){const r=active(s),d=data(s);ensure(r?.position,'ไม่มีสถานะเปิด');const p=r.position,c=d.candles[r.index],calc=costs(p.side,p.qty,p.entry,c.close,p.fee);
 r.trades.push({...p,...calc,exit:c.close,exitIndex:r.index,closed:c.time+STEP});r.balance+=calc.gross-calc.exitFee;r.position=null;return validate(s);
}
return {VERSION,SCHEMA,STEP,LIMITATIONS,validate,dataset,legacyRecord,empty,active,data,start,next,open,close,costs};
});
