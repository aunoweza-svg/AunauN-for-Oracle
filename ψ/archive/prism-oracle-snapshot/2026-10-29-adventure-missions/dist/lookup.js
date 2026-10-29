// Candidate place identifiers are derived from the feature IDs in the original links.
// No marker is created unless the Places API returns a matching Google Maps CID.
const LINK_FEATURES = {
 '1-43':['30d9d32dad227b03','48eb5e70391e47f8'],
 '2-15':['30d7ecf24822a81d','e62648570f9f08e3'],
 '2-20':['30d7edfe9c88dc63','420e17e9e494394a'],
 '2-23':['30d7edab0bb221fb','db12b521f4815249'],
 '2-24':['30d7ede773c59cb7','7db7efe93148c299'],
 '2-25':['30d7ed9ec17a4fc5','3149ceb45494bd63'],
 '2-26':['30d7ed004856d2f5','ceb7d524a8f8c943'],
 '2-27':['30d7eda7b6ba440f','cbd7f019cd47ad78'],
 '2-28':['30d7ecf0d4ee1be7','dd7709fb31b334b6']
};
function candidatePlaceId(parts){
 const bytes=[10,18,9]; for(const hex of [parts[0],parts[1]]){if(bytes.length>3)bytes.push(17);let value=BigInt('0x'+hex);for(let i=0;i<8;i++){bytes.push(Number(value&255n));value>>=8n;}}
 return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function resolveLinkFeatures(){
 const status=document.getElementById('lookup-status');let done=0,matched=0;const failures={};
 try{
  const {Place}=await google.maps.importLibrary('places');
  for(const [id,parts] of Object.entries(LINK_FEATURES)){
   try{const place=new Place({id:candidatePlaceId(parts)});await place.fetchFields({fields:['id','location','googleMapsURI']});
    const uri=new URL(place.googleMapsURI);const cid=uri.searchParams.get('cid');const expected=BigInt('0x'+parts[1]).toString();
    if(cid===expected&&place.location){const p=PLACES.find(x=>x.id===id);p.lat=place.location.lat();p.lon=place.location.lng();p.positionVerified=true;matched++;}else{failures[cid?'CID ไม่ตรง':'ไม่มี CID ในผล API']=(failures[cid?'CID ไม่ตรง':'ไม่มี CID ในผล API']||0)+1;}
   }catch(e){const reason=String(e?.code||e?.name||'API error');failures[reason]=(failures[reason]||0)+1;}
   done++;status.textContent=`ตรวจลิงก์สถานที่ ${done}/9 · ยืนยันรหัสตรงกัน ${matched}`;
   window.dispatchEvent(new Event('phayao-map-ready'));
  }
  // The source URL is a search rather than a place link. Verify the business name
  // and source phone before accepting the Places result, rather than using the map viewport.
  try{const {places}=await Place.searchByText({textQuery:'นาคาธารา รีสอร์ท พะเยา',fields:['displayName','location','nationalPhoneNumber'],maxResultCount:5,language:'th'});
   const matches=places.filter(p=>p.location && (p.nationalPhoneNumber||'').replace(/\D/g,'')==='054430838' && /นาคาธารา|naga\s*tara/i.test(p.displayName||''));
   if(matches.length===1){const p=PLACES.find(x=>x.id==='1-4');p.lat=matches[0].location.lat();p.lon=matches[0].location.lng();p.positionVerified=true;matched++;}
  }catch(e){/* An unverified result is not placed. */}
  status.textContent=`ตรวจ 10 ลิงก์เพิ่มเติมแล้ว พบสถานที่ตรงกัน ${matched} แห่ง (ลิงก์ค้นหาตรวจชื่อและเบอร์โทร)${Object.keys(failures).length?' · ผลที่ยังไม่จับคู่: '+Object.entries(failures).map(([key,value])=>key+' '+value).join(', '):''}`;
  window.dispatchEvent(new Event('phayao-map-ready'));
 }catch(e){status.textContent='ตรวจสถานที่ผ่าน Places API ไม่สำเร็จ โปรดตรวจว่า Demo Key ใช้ Places API (New) ได้';}
}
