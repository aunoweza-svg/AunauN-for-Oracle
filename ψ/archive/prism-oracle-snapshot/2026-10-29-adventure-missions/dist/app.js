const areas = ['ทั้งหมด','เมือง','เชียงคำ'];
const types = ['ทั้งหมด','ที่พัก','ร้านอาหาร','คาเฟ่','ของที่ระลึก'];
for(const p of PLACES){const position=LINK_POSITIONS[p.id];if(position){p.lat=position.lat;p.lon=position.lon;p.positionSource='source-link';}if(PLACE_OVERRIDES[p.id])Object.assign(p,PLACE_OVERRIDES[p.id]);}
const views = {'ทั้งหมด':'ภาพรวมพะเยา & เชียงคำ', 'เมือง':'ภาพรวมเมืองพะเยา', 'เชียงคำ':'ภาพรวมเชียงคำ'};
let area='ทั้งหมด', type='ทั้งหมด', query='', selected=null;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function chips(id, options, current, handler) { $(id).innerHTML=options.map(x=>`<button type="button" aria-pressed="${x===current}">${esc(x==='เมือง'?'เมืองพะเยา':x)}</button>`).join(''); [...$(id).children].forEach((b,i)=>b.addEventListener('click',()=>handler(options[i]))); }
function render(){
 chips('areas',areas,area,x=>{area=x;selected=null;render()}); chips('types',types,type,x=>{type=x;selected=null;render()});
 const filtered=PLACES.filter(p=>(area==='ทั้งหมด'||p.area===area)&&(type==='ทั้งหมด'||p.type===type)&&p.name.toLocaleLowerCase().includes(query));
 $('count').textContent=`${filtered.length} แห่ง`;
 $('list').innerHTML=filtered.length?filtered.map(p=>`<button class="place" type="button" data-id="${esc(p.id)}" aria-pressed="${selected===p.id}"><span class="symbol ${p.type==='ที่พัก'?'stay':'shop'}" aria-hidden="true">${p.type==='ที่พัก'?'⌂':'✳'}</span><span class="place-text"><strong>${esc(p.name)}</strong><small>${esc(p.type)} · ${p.area==='เมือง'?'เมืองพะเยา':esc(p.area)} · ${p.type==='ที่พัก'?'จุดรับแผนที่':'จุดรับแสตมป์'}</small></span><span class="arrow" aria-hidden="true">↗</span></button>`).join(''):'<p class="empty">ไม่พบสถานที่ ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>';
 document.querySelectorAll('.place').forEach(b=>b.addEventListener('click',()=>selectPlace(b.dataset.id)));
 $('map-title').textContent=views[area]; GooglePlaceMap.update(filtered,area,selectPlace); renderDetail();
}
function selectPlace(id){selected=id;const p=PLACES.find(x=>x.id===id);renderDetail();document.querySelectorAll('.place').forEach(x=>x.setAttribute('aria-pressed',x.dataset.id===id));if(p)GooglePlaceMap.focus(p);if(matchMedia('(max-width: 800px)').matches)$('detail').scrollIntoView({behavior:'smooth',block:'center'});}
function renderDetail(){const p=PLACES.find(x=>x.id===selected); if(!p){$('detail').innerHTML='<div><span class="kicker">SELECT A PLACE</span><h3>เลือกสถานที่จากรายการ</h3><p>ดูรายละเอียดและเปิดลิงก์ Google Maps จากข้อมูลต้นทาง</p></div><span class="detail-arrow">↖</span>';return} const duplicate=PLACES.filter(x=>x.url===p.url&&x.id!==p.id); $('detail').innerHTML=`<div><span class="kicker">${p.type==='ที่พัก'?'จุดรับแผนที่':'จุดรับแสตมป์'} / ${esc(p.area)}</span><h3>${esc(p.name)}</h3><p>${esc(p.type)} · โทร ${esc(p.phone||'ไม่มีข้อมูล')}</p>${GooglePlaceMap.hasPosition(p)?'<p>หมุดอ้างอิงพิกัดในลิงก์ต้นฉบับ โปรดตรวจสอบปลายทางก่อนเดินทาง</p>':'<p>ลิงก์ต้นฉบับยังไม่มีพิกัดที่นำมาแสดงได้</p>'}${p.id==='1-32'?'<p class="duplicate">ลิงก์ต้นทางชี้ไปยังตำแหน่งที่ดูอยู่นอกพะเยา โปรดตรวจสอบ</p>':''}${duplicate.length?`<p class="duplicate">ลิงก์ในไฟล์ต้นทางซ้ำกับ ${duplicate.map(x=>esc(x.name)).join(', ')} หมุดใช้ตำแหน่งเดียวกัน โปรดตรวจสอบปลายทางก่อนเดินทาง</p>${duplicate.map(x=>`<button class="shared-place" type="button" data-shared="${esc(x.id)}">ดู ${esc(x.name)}</button>`).join('')}`:''}<a class="action" href="${esc(p.url)}" target="_blank" rel="noopener">เปิด Google Maps ↗</a></div>`;document.querySelectorAll('[data-shared]').forEach(b=>b.addEventListener('click',()=>selectPlace(b.dataset.shared)));}
$('search').addEventListener('input',e=>{query=e.target.value.trim().toLocaleLowerCase();selected=null;render()}); render();
let lookupStarted=false;
window.addEventListener('phayao-map-ready',()=>{render();if(!lookupStarted){lookupStarted=true;resolveLinkFeatures();}});
try{GooglePlaceMap.init(localStorage.getItem('phayao-google-maps-key')||'');}catch(e){GooglePlaceMap.init('');}
$('key-form').addEventListener('submit',e=>{e.preventDefault();const key=$('api-key').value.trim();if(!key)return;try{localStorage.setItem('phayao-google-maps-key',key);location.reload();}catch(err){$('map-message').textContent='เบราว์เซอร์ไม่อนุญาตให้บันทึกคีย์';}});
$('clear-key').addEventListener('click',()=>{localStorage.removeItem('phayao-google-maps-key');location.reload();});
