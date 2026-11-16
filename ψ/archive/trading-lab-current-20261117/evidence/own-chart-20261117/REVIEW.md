# OWN-CHART-20261117 — installed and verified

ผู้ใช้ยืนยัน **BINANCE:BTCUSDT Spot** ตามภาพล่าสุด แทนข้อเสนอ Perpetual เดิม ติดตั้งกราฟส่วนตัวด้วย TradingView Lightweight Charts4.2.3 ที่ `trading-lab/dist` แล้ว เปิด http://localhost:8000 และรีเฟรชจากoriginเดิม

ค่าเริ่มต้น **Heikin Ashi** ตามหลักฐานภาพ มีตัวเลือกแท่งเทียนปกติ CDC ActionZone/MSO ใช้PineเดิมบนOHLCตามชนิดแท่ง มี6TF15m/1h/4h/1d/1w/1M, OHLC/readout6ทศนิยม, เส้นสัญญาณ, volume, สตรีมราคา, เลื่อน/ซูม/พอดี/ล่าสุด/เต็มจอ, เส้นแนวนอน/แนวโน้ม2จุด20เส้นต่อTF, workspaceจำค่าในbrowser และช่องเปิดTradingView/Pineต้นฉบับ

## ขอบเขตความตรงกับภาพ

ภาพใหม่ `reference-spot.png` แสดงตัวเลขที่สอดคล้องกับHA ไม่ใช่แท่งraw ค่าHAclose64942.0725 คำนวณได้จากrawopenจากSpotAPI+H/Lในภาพ+bidในภาพ (อนุมานrawlastเท่ากับbid) HAopenปัด2ทศนิยมตรง64895.56; CDC fast64722.74674088969/slow64623.34491625396 ตรงภาพ6ทศนิยม; MSO.5549609169/.2307178484/.3242430686ตรงภาพ.6/.2/.3ที่1ทศนิยม ดู `check-screenshot.cjs`/`heikin-ashi-reference-comparison.json`

เป็นการreconstructตัวอย่างแท่งกำลังก่อตัวหนึ่งภาพเท่านั้น **ยังไม่ยืนยันทุกแท่ง/ทุกสัญญาณ/ครบ6TF** ประวัติseedเริ่มจาก500แท่งที่โหลด (สัปดาห์/เดือนตามที่มีจริง) และเก็บต่อขณะเปิด อาจต่างจากTradingView ค่าตั้งCDCfixedTF/momentumปิดตามโหมดที่รองรับและตัวอย่างที่ตรวจ ไม่อ้างว่าได้ตรวจhiddenflagsทุกตัว ไม่มีCSVที่ต้องให้ผู้ใช้ส่งหรือบัญชีProที่ต้องซื้อ

## ผลตรวจ

- Installed pure suites5ชุด PASS รวมownchart7cases: calendar Monday/leap/month/year, feed/stream validation, finalizedWSvsdelayedREST, settings/drawings, HArecursion/forming recompute
- Installed actual Chromium + LWC4.2.3: ownchart7groups และregression16groups PASS/errors[] ครอบคลุมสลับTF/races/hover/เส้นจริงด้วยเมาส์/จำค่าหลังreload/mobile และบัญชี/fee/quota/import/recovery/open-position/no-future-replay
- Public **Spot REST** ครบ6TF validated; weekly483/monthly111แท่งปิดตามอายุการเปิดตลาดไม่เติมข้อมูล
- Installed Chromium กับ public **Spot WebSocketครบ6TF** ได้framesจริงทุกTFและLIVE/errors[] ณ2026-11-17ประมาณ01:06น.ไทย แยกHAquoteกับราคาตลาดSpotในUI หลักฐาน `installed-live-browser/results.json` และscreenshots
- Real PRISMอ่านอย่างเดียวตรวจเดิมพบและแก้REST/WSoverwrite, restoredTFlink, hoverreadoutreset และwording; finaldeltaSpot/HA/nullcrosshairguards PASS ไม่มีข้อบกพร่องที่รายงานค้าง AunauN Oracleได้รับcontextและตอบOWN-CHART-ACK ไม่แก้/ติดตั้งซ้ำ
-10ไฟล์เปลี่ยน/เพิ่ม ติดตั้งผ่านbaselinehashpreflightและatomicreplace(indexท้ายสุด) 17ไฟล์baselineคงเดิม รวมmodel/journal/สูตรCDC/MSO/ต้นฉบับPine ตรวจhashหลังติดตั้งและHTTP200/indexตรงรุ่นติดตั้ง ดู`installation.json`/`accepted-hashes.json`

แก้sharedcrosshairadapterให้ไม่ส่งpositionไปtargetseries/scaleที่ว่าง ป้องกันValueisnullหลังล้างเส้นและเปลี่ยนTF ใช้browserทดสอบreproduceก่อนและผ่านหลังแก้ ส่วนrawmarketfeed/HAtransformแยกกัน และworkspacekeyaxiom_chart_workspace_v1ไม่แก้snapshot/backup/legacyของการฝึก

ไม่มีdeploy/push/ล็อกอิน/เปลี่ยนบัญชี/ส่งคำสั่งซื้อขาย ตัวserverlocalhost8000ใช้retainedruntimeของsession ไม่ใช่daemonที่ติดตั้งลงระบบ ข้อมูลราคาจริงในภาพตรวจคือเวลานั้น ไม่ใช่ราคาปัจจุบันตลอดไป
