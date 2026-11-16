# Trading Lab — current accepted snapshot, 17 November 2026

สำรองชุดงานล่าสุดตามคำสั่ง `$rrr --push` ของ AunauN ใน repo หลัก ไม่ใช่การตั้ง remote หรือเปลี่ยนนโยบาย GitHub ของ repo ลูก

## สถานะปัจจุบัน

[Trading Lab ปัจจุบัน](trading-lab/README.md) ใช้ **BINANCE:BTCUSDT Spot**, ค่าเริ่มต้น **Heikin Ashi** และสลับแท่งเทียนปกติได้ กราฟภายในมี 6 timeframe: 15m/1h/4h/1d/1w/1M พร้อม CDC/MSO, drawings และ settings แยก workspace จาก replay/journal

ลำดับงานที่ต้องแยก: INDICATOR-INSTALL เพิ่ม CDC/MSO ใน replay → JOURNAL-MARKET เพิ่มการอ่าน journal และ market → TV-DIRECT เปลี่ยนไปเปิด TradingView ภายนอก → OWN-CHART ตามคำเลือกใหม่ของผู้ใช้กลับมามีกราฟภายใน Spot/HA โดยคงช่องเปิด TradingView/Pine เป็นส่วนประกอบ รายงานเก่าเก็บเป็นประวัติ ไม่ใช้แทนสถานะล่าสุด

## หลักฐานและขอบเขตการตรวจ

โค้ดที่คัดลอกตรง accepted/baseline hashes ล่าสุด ตรวจ SHA-256 ทุกไฟล์ของสำเนาอีกครั้ง ดู manifest.json ซึ่งระบุ source และปลายทางชัดเจน

- [Indicator acceptance](evidence/indicator-review-20261116/acceptance.json): pure/independent math และ installed Chromium expanded14 + independent10 ตามผลของ AXIOM/PRISM
- [Journal acceptance](evidence/journal-market-review-20261116/acceptance.json): pure3 และ installed Chromium16 + independent11 ตามรายงานทีม
- [TradingView direct acceptance](evidence/tradingview-direct-20261116/acceptance.json): ขั้นกลางสำหรับ launcher/Pine copy/download ไม่ได้เข้าบัญชีหรือติดตั้ง indicator บนบัญชีผู้ใช้แทน
- [Own-chart acceptance ล่าสุด](evidence/own-chart-20261117/acceptance.json): installed pure5, own-chart Chromium7 + regression16, Spot REST/WS จริงครบ6TF ตามรายงาน AXIOM และ PRISM read-only review
- [CDC pane-label fix ล่าสุด](evidence/cdc-pane-labels-20261117/acceptance.json): ต่อจาก own-chart เพิ่มป้ายแท่งล่าสุดและตัวเลือกที่ใช้ preference เดิม เปลี่ยน5ไฟล์ unit8/Chromium8 ตามรายงาน AXIOM สูตร/บัญชีเดิมคงเดิม

AunauN ตรวจไฟล์/hash/เอกสารและประสานงาน ไม่ได้รันผล browser/live-feed เหล่านี้ใหม่ในคำขอ rrr นี้ Snapshot เก็บ code และ selected evidence เท่านั้น ไม่รวม baseline/candidate ซ้ำทั้งหมด ภาพอ้างอิงต้นฉบับ ภาพบัญชี/ข้อมูลผู้ใช้ หรือ runtime/browser profile รายงานบางส่วนจึงชี้พาธหลักฐานที่ยังเก็บเฉพาะใน repo AXIOM ต้นทาง

## วิธีเปิดสำเนา

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory trading-lab/dist
```

เปิด http://localhost:8000 ด้วย origin เดิมเมื่อต้องการเข้าถึง browser state เดิม หากมี server ของผู้ใช้อยู่แล้วให้ใช้ของเดิม ไม่เปิดทับพอร์ต Runtime ตัวทดสอบ/บริการเบื้องหลังไม่ได้ถูกรวมมา ต้องใช้อินเทอร์เน็ตสำหรับ provider/CDN

## ข้อจำกัดที่ต้องเก็บไว้

ตัวอย่าง screenshot15m ที่ reconstruct ตรง HA OHLC/CDC6decimal/MSO1decimal เป็นหลักฐานเฉพาะตัวอย่าง ไม่ใช่ parity ทุกแท่ง ทุกสัญญาณ หรือครบ6TF ประวัติเริ่มตามข้อมูลที่โหลดและ seed อาจต่างจาก TradingView CDC fixedTF/momentum ยังปิด รายงาน live-feed ยืนยันการเชื่อมต่อ ณ เวลาทดสอบ ไม่ใช่การรับรองว่าพร้อมตลอดไป

Practice ยังคงข้อจำกัด linear PnL/fee เดิม ไม่มี execution สมจริง/leverage/margin/liquidation/funding/slippage/automatic backtest ไม่มี credentials/บัญชี/คำสั่งเงินจริง/การ deploy ในชุดสำรองนี้ เก็บต้นฉบับ Pine และ notices ตาม source เดิม ไม่มีการตั้งข้ออ้าง license เพิ่ม

Implementation: PRISM และ AXIOM ตามรายงานแต่ละขั้น; sole accepted installer: AXIOM เซสชันปัจจุบัน AunauN Oracle (AI) เป็นผู้ประสานและจัดชุดสำรอง


## Role retrospective packages in this same publication

ผู้ใช้/ทีมขอให้ AunauN เป็นผู้เผยแพร่ repo หลักเพียงตัวเดียว จึงรวมแพ็กเกจที่แต่ละ Oracle เตรียมและตรวจไว้ด้วย:

- [AXIOM current package](axiom/README.md): app27ไฟล์เดิมที่ตรงกับสำเนาด้านบน, หลักฐาน own-chart/CDC label ล่าสุด, retrospective/lesson และ metrics เฉพาะแถวล่าสุด
- [PRISM retrospective package](prism/README.md): retrospective/lesson ฉบับตรงต้นทาง รวมเรื่อง design-md-validator ในเซสชัน PRISM, metrics เฉพาะแถวล่าสุด พร้อมmanifest/SHA256SUMS ไม่รวมimplementationอื่น

สำเนา metrics ในแต่ละโฟลเดอร์เป็น excerpt เพื่อส่งต่อ ห้ามนำไปทับ full session-metrics.md ใน repo ลูก ตรวจ manifest ของทั้งสองชุดและ PRISM SHA256SUMS แล้ว ไม่แก้ shared metrics ของลูก ไม่สร้าง commit/push ใน repo ลูก
