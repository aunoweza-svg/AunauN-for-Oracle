// Source-link positions are distinct from independently verified business locations.
const GooglePlaceMap = (() => {
 let map, AdvancedMarkerElement, PinElement, markers=[], ready=false;
 const centers={'ทั้งหมด':{lat:19.37,lng:100.13},'เมือง':{lat:19.19,lng:99.90},'เชียงคำ':{lat:19.54,lng:100.32}};
 function hasPosition(p){return (p.positionVerified===true || p.positionSource==='source-link') && Number.isFinite(p.lat) && Number.isFinite(p.lon) && p.lat>=-90 && p.lat<=90 && p.lon>=-180 && p.lon<=180;}
 function message(text){document.getElementById('map-message').textContent=text; document.getElementById('map-message').hidden=!text;}
 async function init(key){
   if(!key){message('ยังไม่ได้ตั้งค่า Google Maps API key · รายการและลิงก์นำทางยังใช้งานได้');return;}
   message('กำลังโหลด Google Maps…');
   window.gm_authFailure=()=>{ready=false;message('Google Maps ไม่ผ่านการตรวจสอบ API key หรือ billing โปรดตรวจการตั้งค่า');};
   const callback='initPhayaoGoogleMap';
   const load=new Promise((resolve,reject)=>{window[callback]=resolve; const script=document.createElement('script');script.async=true;script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(key)+'&v=weekly&loading=async&callback='+callback;script.onerror=()=>reject(new Error('network'));document.head.appendChild(script);setTimeout(()=>reject(new Error('timeout')),15000);});
   try{await load;const maps=await google.maps.importLibrary('maps');const marker=await google.maps.importLibrary('marker');AdvancedMarkerElement=marker.AdvancedMarkerElement;PinElement=marker.PinElement;map=new maps.Map(document.getElementById('map'),{center:centers['ทั้งหมด'],zoom:9,mapId:'DEMO_MAP_ID',mapTypeControl:false,streetViewControl:false});ready=true;message('');window.dispatchEvent(new Event('phayao-map-ready'));}
   catch(e){message('โหลด Google Maps ไม่สำเร็จ โปรดตรวจอินเทอร์เน็ตและการตั้งค่า API key');}
 }
 function update(places,area,onSelect){
   const eligible=places.filter(hasPosition);document.getElementById('map-count').textContent=`แสดง ${ready?eligible.length:0} จาก ${places.length} แห่ง · พิกัดจากลิงก์ต้นฉบับ ยังไม่ได้ยืนยันสถานที่ทุกแห่ง · จุดที่ลิงก์ซ้ำอาจซ้อนกัน`;
   if(!ready)return;
   markers.forEach(marker=>marker.map=null);markers=[];
   map.setCenter(centers[area]);map.setZoom(area==='ทั้งหมด'?9:12);
   const groups=new Map();for(const p of eligible){const k=`${p.lat},${p.lon}`;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p)}
   for(const group of groups.values()){const p=group[0],stay=p.type==='ที่พัก';const pin=new PinElement({background:stay?'#185849':'#d96339',borderColor:'#ffffff',glyphColor:'#ffffff',glyph:group.length>1?String(group.length):(stay?'H':'S')});const marker=new AdvancedMarkerElement({map,position:{lat:p.lat,lng:p.lon},title:group.map(x=>x.name).join(' / '),content:pin.element,gmpClickable:true});marker.addListener('click',()=>onSelect(p.id));markers.push(marker);}
 }
 function focus(p){if(ready && hasPosition(p)){map.panTo({lat:p.lat,lng:p.lon});map.setZoom(16);return true;}return false;}
 return {init,update,focus,hasPosition};
})();
