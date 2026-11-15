const $=s=>document.querySelector(s), status=$('#status');
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.view').forEach(x=>x.classList.toggle('hidden',x.id!==b.dataset.view));if(b.dataset.view==='journal') renderRecords();if(b.dataset.view==='replay'&&chart) chart.applyOptions({width:$('#chart').clientWidth});});
function tv(){const el=$('#tv');el.replaceChildren();const inner=document.createElement('div');inner.className='tradingview-widget-container__widget';inner.style.height='100%';el.append(inner);const script=document.createElement('script');script.src='https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';script.async=true;script.text=JSON.stringify({autosize:true,symbol:$('#symbol').value,interval:'15',timezone:'Asia/Bangkok',theme:'dark',style:'1',locale:'th',allow_symbol_change:true,hide_side_toolbar:false});el.append(script)}
$('#symbol').onchange=tv;tv();
let chart,series,candles=[],index=-1,position=null,balance=0,initial=0;
let loading=false,running=false,records=[],journalWritable=false,journalRaw=null;

function validRecord(r){
  return r && typeof r==='object' && ['Long','Short'].includes(r.side)
    && ['qty','entry','exit','opened','closed','gross','net','entryFee','exitFee','fee','startingCapital'].every(k=>Number.isFinite(r[k]))
    && r.qty>0 && r.entry>0 && r.exit>0 && r.opened>=0 && r.closed>=r.opened
    && r.fee>=0 && r.entryFee>=0 && r.exitFee>=0 && r.startingCapital>0
    && typeof r.reason==='string';
}
try{
  journalRaw=localStorage.getItem('axiom_records');
  const parsed=journalRaw===null?[]:JSON.parse(journalRaw);
  if(!Array.isArray(parsed)||!parsed.every(validRecord))throw Error('รูปแบบบันทึกไม่ถูกต้อง');
  records=parsed;
  journalWritable=true;
}catch(e){
  $('#storage-status').textContent=journalRaw===null
    ?'อ่านบันทึกในเบราว์เซอร์ไม่ได้ กรุณาอนุญาตการเก็บข้อมูลแล้วโหลดหน้าใหม่ ระหว่างนี้ดูกราฟและเดิน replay ได้ แต่เปิดสถานะใหม่ไม่ได้'
    :'บันทึกเดิมเสียหรือรูปแบบไม่ถูกต้อง ระบบเก็บต้นฉบับไว้และหยุดเปิดสถานะใหม่ กดส่งออก JSON ในหน้าบันทึกเพื่อสำรองต้นฉบับสำหรับกู้คืน';
}

function canTrade(){return !loading&&running&&!!candles[index]}
function syncControls(){
  const ready=canTrade();
  $('#load').disabled=loading||!!position;
  $('#start').disabled=loading||!!position||!candles.length;
  $('#next').disabled=!ready||index>=candles.length-1;
  $('#long').disabled=$('#short').disabled=!ready||!!position||!journalWritable;
  $('#close').disabled=!ready||!position;
  $('#export').disabled=!journalWritable&&journalRaw===null;
}
function makeChart(){
  if(!window.LightweightCharts)throw Error('โหลดกราฟไม่สำเร็จ ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
  if(chart)return;
  chart=LightweightCharts.createChart($('#chart'),{width:$('#chart').clientWidth,height:$('#chart').clientHeight,layout:{background:{color:'#101c29'},textColor:'#aabbc8'},grid:{vertLines:{color:'#1c3040'},horzLines:{color:'#1c3040'}},timeScale:{timeVisible:true,secondsVisible:false},rightPriceScale:{borderColor:'#304454'}});
  series=chart.addCandlestickSeries({upColor:'#51c8a8',downColor:'#ef7580',borderVisible:false,wickUpColor:'#51c8a8',wickDownColor:'#ef7580'});
}
window.addEventListener('resize',()=>{if(chart)chart.applyOptions({width:$('#chart').clientWidth,height:$('#chart').clientHeight})});
$('#load').onclick=async()=>{
  if(loading)return;
  if(position)return alert('กรุณาปิดสถานะและบันทึกให้สำเร็จก่อนโหลดข้อมูลใหม่');
  loading=true;
  syncControls();
  status.textContent='กำลังโหลดแท่งเทียน Binance ย้อนหลัง 90 วัน…';
  try{
    const end=Date.now(),begin=end-90*86400000;
    let cursor=begin,rows=[];
    while(cursor<end){
      const u=new URL('https://fapi.binance.com/fapi/v1/klines');
      u.search=new URLSearchParams({symbol:'BTCUSDT',interval:'15m',startTime:String(cursor),endTime:String(end),limit:'1000'});
      const res=await fetch(u);
      if(!res.ok)throw Error('Binance ตอบกลับ HTTP '+res.status);
      const data=await res.json();
      if(!Array.isArray(data))throw Error('รูปแบบข้อมูลแท่งเทียนไม่ถูกต้อง');
      if(!data.length)break;
      if(data.some(r=>!Array.isArray(r)||r.length<7||!Number.isFinite(r[0])||!Number.isFinite(r[6])))throw Error('ข้อมูลเวลาไม่ถูกต้อง');
      rows.push(...data.filter(r=>r[6]<end));
      const next=data[data.length-1][0]+900000;
      if(next<=cursor)throw Error('ข้อมูลเวลาไม่ต่อเนื่อง');
      cursor=next;
    }
    const nextCandles=rows.map(r=>({time:r[0]/1000,open:+r[1],high:+r[2],low:+r[3],close:+r[4]}));
    if(nextCandles.length<201)throw Error('ข้อมูลไม่เพียงพอ');
    for(let i=0;i<nextCandles.length;i++){
      const c=nextCandles[i];
      if(![c.open,c.high,c.low,c.close].every(v=>Number.isFinite(v)&&v>0)||c.low>Math.min(c.open,c.close)||c.high<Math.max(c.open,c.close)||c.low>c.high)throw Error('ราคาแท่งเทียนไม่ถูกต้อง');
      if(i&&c.time-nextCandles[i-1].time!==900)throw Error('พบช่องว่างในข้อมูลแท่งเทียน ไม่สามารถเริ่ม replay อย่างน่าเชื่อถือ');
    }
    // Keep the previous run intact until the replacement dataset and chart are ready.
    makeChart();
    series.setData([]);
    candles=nextCandles;
    index=-1;running=false;balance=initial=0;
    $('#clock').textContent='ยังไม่เริ่ม';
    $('#account').textContent='เริ่มรอบใหม่เพื่อจำลอง';
    status.textContent=`โหลดแล้ว ${candles.length.toLocaleString()} แท่ง · ${new Date(candles[0].time*1000).toLocaleString('th-TH')} ถึง ${new Date(candles.at(-1).time*1000).toLocaleString('th-TH')} · Binance Futures`;
  }catch(e){
    status.textContent='โหลดไม่สำเร็จ: '+e.message+(candles.length?' · เก็บรอบเดิมไว้ สามารถฝึกต่อหรือลองโหลดอีกครั้ง':' · ลองโหลดอีกครั้งหลังตรวจเครือข่ายและการเข้าถึง Binance');
  }finally{
    loading=false;
    syncControls();
  }
};
function update(){
  if(!running||!candles[index])return syncControls();
  const c=candles[index],pnl=position?(c.close-position.entry)*position.qty*(position.side==='Long'?1:-1):0;
  $('#clock').textContent=new Date(c.time*1000).toLocaleString('th-TH',{timeZone:'Asia/Bangkok'})+' · ปิด '+c.close.toLocaleString()+' USDT';
  $('#account').textContent=`เงินสดจำลอง ${balance.toFixed(2)} USDT · ${position?position.side+' '+position.qty+' BTC | P&L ยังไม่ปิด '+pnl.toFixed(2)+' USDT':'ไม่มีสถานะ'} · มูลค่าประมาณ ${(balance+pnl).toFixed(2)} USDT`;
  syncControls();
}
$('#start').onclick=()=>{
  if(loading||!candles.length)return;
  if(position)return alert('กรุณาปิดสถานะและบันทึกให้สำเร็จก่อนเริ่มรอบใหม่');
  const v=Number($('#capital').value);
  if(!Number.isFinite(v)||v<=0)return alert('ระบุเงินทุนมากกว่า 0');
  index=199;balance=initial=v;running=true;
  series.setData(candles.slice(0,index+1));
  chart.timeScale().fitContent();
  update();
};
$('#next').onclick=()=>{
  if(canTrade()&&index<candles.length-1){index++;series.update(candles[index]);update()}
};
function open(side){
  if(!canTrade()||position||!journalWritable)return;
  const qty=Number($('#qty').value),fee=Number($('#fee').value);
  if(!Number.isFinite(qty)||qty<=0||!Number.isFinite(fee)||fee<0)return alert('ตรวจสอบขนาดสถานะและค่าธรรมเนียม');
  const price=candles[index].close,entryFee=price*qty*fee/100;
  if(!Number.isFinite(price*qty)||!Number.isFinite(entryFee)||entryFee>=balance)return alert('เงินทุนไม่เพียงพอหรือขนาดสถานะสูงเกินคำนวณ');
  balance-=entryFee;
  position={side,qty,entry:price,entryFee,fee,reason:$('#reason').value,opened:candles[index].time};
  update();
}
$('#long').onclick=()=>open('Long');
$('#short').onclick=()=>open('Short');
$('#close').onclick=()=>{
  if(!canTrade()||!position||!journalWritable)return;
  const price=candles[index].close,exitFee=price*position.qty*position.fee/100,gross=(price-position.entry)*position.qty*(position.side==='Long'?1:-1),net=gross-position.entryFee-exitFee;
  const record={...position,exit:price,closed:candles[index].time,gross,net,exitFee,startingCapital:initial};
  if(!validRecord(record)||!Number.isFinite(balance+gross-exitFee))return alert('คำนวณรายการไม่ได้ กรุณาตรวจขนาดสถานะ');
  const nextRecords=[record,...records];
  let serialized;
  try{
    // Persist first: a failed write must leave balance, records and position untouched.
    // Refuse to overwrite another tab's changes or externally damaged journal.
    if(localStorage.getItem('axiom_records')!==journalRaw)throw Error('บันทึกถูกเปลี่ยนจากอีกหน้าต่าง กรุณาสำรองข้อมูลก่อนโหลดหน้าใหม่');
    serialized=JSON.stringify(nextRecords);
    localStorage.setItem('axiom_records',serialized);
  }catch(e){
    $('#storage-status').textContent='บันทึกปิดสถานะไม่สำเร็จ ยอดเงินและสถานะยังไม่เปลี่ยน: '+e.message+' · สำรองบันทึกเดิมด้วยส่งออก JSON แล้วแก้การเก็บข้อมูลก่อนลองปิดอีกครั้ง อย่าเพิ่งปิดหน้า';
    return;
  }
  journalRaw=serialized;records=nextRecords;balance+=gross-exitFee;position=null;
  $('#storage-status').textContent='บันทึกปิดสถานะสำเร็จ';
  update();
};
function renderRecords(){
  const el=$('#records');el.replaceChildren();
  if(!journalWritable){el.textContent='อ่านบันทึกไม่ได้ ต้นฉบับไม่ได้ถูกแก้ไข ดูข้อความแจ้งเตือนด้านบน';return}
  if(!records.length){el.textContent='ยังไม่มีรายการที่ปิดสถานะ';return}
  for(const r of records){const d=document.createElement('div');d.className='record';d.textContent=`${r.side} ${r.qty} BTC | ${new Date(r.opened*1000).toLocaleString('th-TH')} → ${new Date(r.closed*1000).toLocaleString('th-TH')} | ${r.entry} → ${r.exit} USDT | ผลสุทธิ ${r.net.toFixed(2)} USDT | เหตุผล: ${r.reason||'ไม่ได้ระบุ'}`;el.append(d)}
}
$('#export').onclick=()=>{
  if(!journalWritable&&journalRaw===null)return;
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([journalWritable?JSON.stringify(records,null,2):journalRaw],{type:journalWritable?'application/json':'text/plain'}));
  a.download=journalWritable?'axiom-trading-journal.json':'axiom-trading-journal-recovery.txt';
  a.click();URL.revokeObjectURL(a.href);
};
syncControls();
