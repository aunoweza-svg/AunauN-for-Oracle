/* External TradingView navigation/preferences only; no account or replay mutations. */
(function(root){
'use strict';
const KEY='axiom_tv_layout_v1';
function layoutURL(value){
 const url=new URL(value.trim());
 if(url.protocol!=='https:'||url.username||url.password||url.port||!/^((www|[a-z]{2})\.)?tradingview\.com$/.test(url.hostname)||!/^\/chart\/[A-Za-z0-9_-]+\/?$/.test(url.pathname))throw Error('ใช้ลิงก์ layout ที่บันทึกไว้ เช่น https://www.tradingview.com/chart/รหัสกราฟ/');
 const symbol=url.searchParams.get('symbol');url.search='';if(symbol&&/^[A-Za-z0-9:._!\/-]{1,80}$/.test(symbol))url.searchParams.set('symbol',symbol);url.hash='';return url.href;
}
function mount(){
 const $=s=>document.querySelector(s),input=$('#tv-layout'),message=$('#tv-layout-status'),saved=$('#saved-layout-link');
 function show(value){saved.classList.toggle('hidden',!value);if(value)saved.href=value;else saved.removeAttribute('href')}
 function symbol(){const value=$('#symbol').value,url=new URL('https://www.tradingview.com/chart/');url.searchParams.set('symbol',value);url.searchParams.set('interval',({'15m':'15','1h':'60','4h':'240','1d':'D','1w':'W','1M':'M'})[$('#own-timeframe')?.value]||'15');$('#market-link').href=url.href;$('#market-link').textContent='เปิด '+value+' บน TradingView';$('#market-availability').textContent='เปิดกราฟและเพิ่ม CDC/MSO บน TradingView โดยตรง สิทธิ์ข้อมูลและจำนวน indicator ขึ้นกับบัญชี TradingView ของคุณ';}
 $('#symbol').addEventListener('change',symbol);$('#own-timeframe')?.addEventListener('change',symbol);symbol();
 try{const raw=localStorage.getItem(KEY);if(raw){const value=layoutURL(raw);input.value=value;show(value)}}catch(e){message.textContent='อ่านลิงก์ layout ไม่สำเร็จ คุณยังเปิดกราฟด้วยปุ่มด้านบนได้'}
 $('#tv-layout-form').addEventListener('submit',event=>{event.preventDefault();try{const value=layoutURL(input.value);localStorage.setItem(KEY,value);input.value=value;show(value);message.textContent='บันทึกลิงก์ layout ใน browser นี้แล้ว เปิดด้วยปุ่ม «เปิด layout ของฉัน» ได้เลย'}catch(e){message.textContent=e instanceof TypeError?'กรุณาวาง URL ของ layout ที่บันทึกใน TradingView':e.message}});
 $('#tv-layout-clear').addEventListener('click',()=>{try{localStorage.removeItem(KEY);input.value='';show('');message.textContent='นำลิงก์ออกจาก browser นี้แล้ว'}catch(e){message.textContent='นำลิงก์ออกไม่สำเร็จ: '+e.message}});
 document.querySelectorAll('[data-copy-pine]').forEach(button=>button.addEventListener('click',async()=>{
  const result=$('#pine-copy-status');button.disabled=true;
  try{const response=await fetch(button.dataset.copyPine);if(!response.ok)throw Error('อ่านไฟล์ Pine ไม่สำเร็จ');const code=await response.text();if(!navigator.clipboard?.writeText)throw Error('browser ไม่รองรับการคัดลอก');await navigator.clipboard.writeText(code);result.textContent='คัดลอก '+button.dataset.name+' แล้ว วางใน Pine Editor ของ TradingView และกด Add to chart'}
  catch(e){result.textContent='คัดลอกไม่สำเร็จ กรุณาใช้ลิงก์ดาวน์โหลด Pine แล้วเปิดไฟล์เพื่อคัดลอกข้อความ'}finally{button.disabled=false}
 }));
}
root.LabTradingView={mount};
})(globalThis);
