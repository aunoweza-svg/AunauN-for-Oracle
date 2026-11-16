/* Read-only journal presentation. Never writes storage or account balances. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.LabJournal=factory()})(globalThis,()=>{
'use strict';
const number=new Intl.NumberFormat('th-TH',{minimumFractionDigits:2,maximumFractionDigits:8});
const date=new Intl.DateTimeFormat('th-TH-u-ca-gregory',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Bangkok'});
const money=n=>(n>0?'+':'')+number.format(n)+' USDT';
const result=n=>n>0?'กำไรสุทธิ':n<0?'ขาดทุนสุทธิ':'เท่าทุนสุทธิ';
const tone=n=>n>0?'profit':n<0?'loss':'neutral';
function totals(trades){return trades.reduce((a,t)=>({count:a.count+1,net:a.net+t.net,gross:a.gross+t.gross,fees:a.fees+t.entryFee+t.exitFee}),{count:0,net:0,gross:0,fees:0})}
function render(el,state,datasetForRun){
 const doc=el.ownerDocument,node=(tag,text,cls)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
 const pair=(dl,label,value)=>{dl.append(node('dt',label),node('dd',value))};
 const stats=(summary)=>{const box=node('div',undefined,'journal-stats');const pnl=node('div',undefined,'pnl '+tone(summary.net));pnl.append(node('span',result(summary.net)),node('strong',money(summary.net)));box.append(pnl);for(const [label,value] of [['ปิดแล้ว',summary.count+' รายการ'],['ค่าธรรมเนียมรวม',number.format(summary.fees)+' USDT']]){const cell=node('div');cell.append(node('span',label),node('strong',value));box.append(cell)}return box};
 el.replaceChildren();const all=[...state.runs.flatMap(r=>r.trades),...state.legacyRecords];
 const total=node('section',undefined,'journal-overview');total.id='journal-overview';total.append(node('h3','ผลจากรายการที่ปิดทั้งหมด'),stats(totals(all)),node('p','หักค่าธรรมเนียมเข้าและออกแล้ว · ไม่รวมสถานะที่ยังเปิดและกำไร/ขาดทุนลอยตัว แต่ละรอบฝึกเริ่มด้วยทุนแยกกัน','note'));el.append(total);
 function trade(t,ordinal,legacy=false){const card=node('article',undefined,'record trade-card');card.dataset.result=tone(t.net);
  const head=node('div',undefined,'trade-heading');head.append(node('h4',`รายการที่ ${ordinal} · ${t.side==='Long'?'Long (ฝั่งซื้อ)':'Short (ฝั่งขาย)'}`));const pnl=node('div',undefined,'trade-pnl '+tone(t.net));pnl.append(node('span',result(t.net)),node('strong',money(t.net)));head.append(pnl);card.append(head);
  card.append(node('p',`${date.format(new Date(t.opened*1000))} → ${date.format(new Date(t.closed*1000))} · เวลาไทย`,'note'));
  const dl=node('dl',undefined,'trade-facts');pair(dl,'ขนาดสถานะ',number.format(t.qty)+' BTC');pair(dl,'ราคาเข้า',number.format(t.entry)+' USDT');pair(dl,'ราคาปิด',number.format(t.exit)+' USDT');pair(dl,'ค่าธรรมเนียมทั้งหมด',number.format(t.entryFee+t.exitFee)+' USDT');card.append(dl);
  card.append(node('p','เหตุผลเข้าเทรด: '+(t.reason||'ไม่ได้ระบุ'),'trade-reason'));
  if(legacy)card.append(node('p','บันทึกรุ่นเดิม: ไม่มีข้อมูลรอบหรือชุดราคาให้ตรวจย้อนหลังครบถ้วน','note'));
  const details=node('details'),summary=node('summary','รายละเอียดการคำนวณ');details.append(summary);const calc=node('dl',undefined,'trade-facts');pair(calc,'กำไร/ขาดทุนก่อนค่าธรรมเนียม',money(t.gross));pair(calc,'ค่าธรรมเนียมตอนเข้า',number.format(t.entryFee)+' USDT');pair(calc,'ค่าธรรมเนียมตอนออก',number.format(t.exitFee)+' USDT');pair(calc,'อัตราค่าธรรมเนียมต่อด้าน',t.fee+'%');pair(calc,'ผลสุทธิ',money(t.net));details.append(calc);card.append(details);return card;
 }
 state.runs.map((r,i)=>({r,ordinal:i+1})).reverse().forEach(({r,ordinal})=>{
  const section=node('section',undefined,'journal-run');section.append(node('h3',r.label||'รอบฝึกที่ '+ordinal),node('p','เริ่มฝึก '+date.format(new Date(datasetForRun(r).candles[r.startIndex].time*1000))+' · เวลาไทย','note'),stats(totals(r.trades)));
  const account=node('p',`ทุนเริ่มต้น ${number.format(r.initial)} USDT · เงินสดจำลองคงเหลือ ${number.format(r.balance)} USDT`);section.append(account);
  if(r.position)section.append(node('p',`ยังเปิด ${r.position.side} ${number.format(r.position.qty)} BTC · ผลสุทธิด้านบนยังไม่รวมรายการนี้`,'open-position'));
  if(!r.trades.length)section.append(node('p','ยังไม่มีรายการปิดในรอบนี้','note'));
  [...r.trades].map((t,i)=>({t,ordinal:i+1})).reverse().forEach(x=>section.append(trade(x.t,x.ordinal)));
  const tech=node('details',undefined,'journal-technical');tech.append(node('summary','ข้อมูลรอบสำหรับตรวจสอบ'));const dl=node('dl',undefined,'trade-facts');pair(dl,'รหัสรอบ',r.id);pair(dl,'รหัสชุดข้อมูลราคา',r.datasetId);pair(dl,'แหล่งข้อมูล','Binance USDⓈ-M BTCUSDT · 15 นาที');pair(dl,'SHA256 ชุดราคา',datasetForRun(r).sha256);pair(dl,'Indicator',r.indicators?'เวอร์ชัน '+r.indicators.version+' · ค่าตั้งและ source hashes อยู่ใน JSON export':'รอบเดิม ไม่มี indicator context');tech.append(dl);section.append(tech);el.append(section);
 });
 if(state.legacyRecords.length){const legacy=node('section',undefined,'journal-run');legacy.append(node('h3','รายการจากบันทึกรุ่นเดิม'));state.legacyRecords.forEach((t,i)=>legacy.append(trade(t,i+1,true)));el.append(legacy)}
 if(!state.runs.length&&!state.legacyRecords.length)el.append(node('p','ยังไม่มีบันทึก เริ่มรอบฝึกและปิดสถานะเพื่อดูผลที่นี่','note'));
}
return {totals,render};
});
