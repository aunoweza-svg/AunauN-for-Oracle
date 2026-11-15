# AXIOM Trading Lab — personal prototype v2

งาน AXIOM-PRISM-20261115 · implementation โดย PRISM · ต้องให้ AXIOM ตรวจรับก่อนแจ้งว่าเสร็จ

เปิดจากโฟลเดอร์ `trading-lab` ด้วย browser รุ่นปัจจุบัน:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

เข้า `http://localhost:8000` โดยใช้ hostname/port เดิมทุกครั้ง (localStorage แยก origin รวม localhost กับ 127.0.0.1) ต้องรองรับ Web Locks และ Web Crypto บน localhost หรือ secure context จึงบันทึกได้ ไม่แนะนำ file:// ต้องใช้อินเทอร์เน็ตสำหรับ Binance, TradingView และ CDN กราฟ/ฟอนต์ ไม่มี API key ไม่มีการเชื่อมบัญชีหรือส่งคำสั่งเงินจริง ไม่ได้ deploy หรือเปลี่ยน Sites ที่ลงทะเบียนไว้

## วิธีฝึกและกติกา

1. หน้า market เลือก BTC หรือหุ้นไทยที่มีในรายการ กราฟ TradingView เป็น iframe แยกกับ replay มีข้อความแหล่งข้อมูล เวลาร้องขอ และข้อจำกัด แอปอ่านสถานะราคา/ความล่าช้าภายใน iframe ไม่ได้ ตรวจเวลาแท่ง/สัญลักษณ์ delayed ใน widget เอง เวลา request ไม่ใช่เวลาอัปเดตราคา **ผลตรวจ 15 พ.ย. 2026: SET:SET, SET:PTT, SET:ADVANC ถูก widget ปฏิเสธ (only available on TradingView / symbol does not exist) จึงไม่มีกราฟหุ้นไทยทั้งสามภายในแอป** ข้อความไทยแจ้งทันทีเมื่อเลือก SET พร้อมลิงก์เปิด symbol บน TradingView ภายนอก ผู้ให้บริการกำหนดสิทธิ์/ความล่าช้า ไม่มีราคาสังเคราะห์ทดแทน และไม่ได้จัดหา provider แบบเสียเงิน
2. หน้า replay โหลดแท่งปิด BTCUSDT/15m จาก Binance USDⓈ-M public klines ย้อน 90 วัน โดยปัดปลายช่วงลง boundary 15 นาที ต้องได้ 8,640 แท่งเรียงต่อเนื่องครบช่วง ตรวจ open/close time, OHLC, gap, duplicate และ pagination หากขาดแม้ต้น/ท้ายจะปฏิเสธชุดใหม่พร้อมเก็บรอบเดิมไว้ ไม่มีการเติมช่องว่าง
3. อ่านข้อจำกัดและติ๊กยอมรับ เลือกเวลา **เปิดแท่งเริ่มต้นเป็น UTC** ทุก 15 นาทีที่มีจริง ระบุทุนและชื่อ/เป้าหมายรอบ แล้วเริ่มรอบใหม่ ใช้แท่งก่อนหน้าที่มีเป็น warm-up กราฟแสดง prefix ถึงแท่งที่เลือกเท่านั้น เวลาเข้าออกเป็นเวลาปิดแท่ง = เวลาเปิด +15 นาที แกนกราฟ UTC เช่นกัน
4. กดเดินทีละแท่ง เปิด Long/Short ได้หนึ่งสถานะ ค่าธรรมเนียม % ต่อด้านและจำนวน BTC ระบุตอนเข้าและล็อกในรายการนั้น เปลี่ยนช่อง fee ภายหลังไม่เปลี่ยน fee ของสถานะเดิม ปิดสถานะที่ท้ายชุดข้อมูลได้ แต่เดินต่อไม่ได้
5. การเริ่มรอบ/เดินแท่ง/เปิด/ปิด ต้องบันทึก snapshot สำเร็จก่อนเปลี่ยนยอดและสถานะ ถ้า quota เต็มหรือข้อมูลเปลี่ยนจากแท็บอื่นจะไม่ commit การกระทำนั้น ส่งออกข้อมูลก่อนแก้ storage แล้วลองใหม่ การโหลดข้อมูลสำเร็จต้องเริ่มรอบใหม่ก่อนเทรด ส่วนโหลดล้มเหลวฝึกต่อจากรอบเดิมได้

ราคาที่ใช้ทั้งเข้าและออกคือ close ของแท่งที่เห็น หลังแท่งปิดทันที ไม่มี execution จริง:

- `entryFee = entry × qtyBTC × feePercent / 100`
- `exitFee = exit × qtyBTC × feePercent / 100`
- `gross = (exit − entry) × qtyBTC × direction` โดย Long = +1, Short = −1
- `net = gross − entryFee − exitFee`
- เงินสดหลังเข้า = เงินสดเดิม − entryFee; หลังปิด = เงินสดหลังเข้า + gross − exitFee
- ตัวอย่างทุน 10,000, qty 1 BTC, ราคา 100→110, fee 0.05%: Long gross 10, fee 0.05+0.055, net 9.895, balance 10009.895; Short net −10.105, balance 9989.895
- เข้าและปิดในแท่งเดียวกันยังคิด fee สองด้าน ไม่มีขั้นต่ำ tick/lot หรือการปัดทศนิยมตาม exchange การคำนวณใช้ JavaScript Number และ UI ปัดเพื่อแสดงผล ข้อมูล export เก็บเลขเต็มที่คำนวณได้

**นี่คือแบบฝึก P&L เชิงเส้น ไม่ใช่บัญชี Futures สมจริงหรือ backtest อัตโนมัติ** BTCUSDT USDⓈ-M Perpetual ยังเป็นสมมติฐานต้นแบบ ไม่กันทุนตาม notional และยอดอาจติดลบ ไม่มี leverage, margin, liquidation, funding, spread, slippage, partial fills, stops หรือ take profit การ fill หลังเห็น close อาจมองโลกในแง่ดี Dataset ทั้งหมดอยู่ใน browser และหน้า market ดูแยกได้ จึงไม่ใช่ blind research ข้อจำกัดเดียวกันแสดงก่อนเริ่มและใน export

## Journal, session และ backup

`dist/model.js` เป็นโมเดล/validator แยกจาก DOM; `dist/app.js` ดูแลข้อมูล กราฟ และ persistence

- Snapshot key `axiom_lab_v2`, schema `2`, engine `2.0.0` เก็บข้อจำกัด, datasets (OHLC+source+symbol+interval+UTC+ช่วง+fetchedAt+SHA256), runs (ID/ชื่อ/ทุน/วันเริ่ม/ตำแหน่ง replay/ยอด/สถานะเปิด/รายการ/เหตุผล), activeRunId และ legacyRecords รายการอ้าง dataset ผ่าน run
- Persist snapshot เดียวแบบ atomic ต่อ key ทั้ง journal, ยอด, สถานะเปิดและ replay เมื่อสำเร็จ Reload จึงกู้รอบและสถานะเปิดจาก dataset เดิมโดยไม่ต้องโหลดตลาดใหม่ ไม่รับประกันความคงทนระดับฐานข้อมูลเมื่ออุปกรณ์พังหรือ browser ล้างข้อมูล และข้อความที่ยังไม่ได้เปิดเป็นรายการไม่ใช่ draft ที่บันทึกแล้ว
- Web Locks กัน writer จากแอปรุ่นนี้ซ้อนกัน ตรวจ raw snapshot และ legacy key อีกครั้งใน lock รวม storage events เพื่อหยุดแท็บเก่าที่ข้อมูลเปลี่ยน ใช้ฝึกทีละหนึ่งแท็บเป็นหลัก ซอฟต์แวร์อื่น/แอปรุ่นเก่าที่ไม่ใช้ lock ยังอาจเปลี่ยน storage ได้ จึงไม่ใช่ฐานข้อมูล multi-client
- Journal รุ่นเดิม `axiom_records` เก็บต้นฉบับไว้ ตรวจสูตรและนำมาเป็น legacyRecords เมื่อไม่มี v2 พร้อมระบุว่าขาด dataset/session context ไม่แต่งบริบทหรือ timestamp เพิ่ม
- ส่งออก JSON รวม session ที่ยังเปิด, dataset ทั้งชุด และข้อจำกัด สำรองลงไฟล์ภายนอกทุกครั้งก่อนล้าง browser/ย้ายเครื่อง ไม่มี sync หรือ cloud backup
- นำเข้า snapshot v2 ได้เท่านั้น (ไฟล์ recovery/raw หรือ array รุ่นเก่าไม่ใช่ไฟล์ import v2) ตรวจ JSON, schema/engine, source, OHLC/continuity, SHA256, เวลาแท่งต้องปิดก่อน fetchedAt และ fetchedAt ต้องไม่เป็นอนาคต, ลำดับการเทรด/ราคา/fee/ยอด ledger ก่อนแสดง confirm แทนข้อมูลทั้งชุด ไม่มี merge
- ปิดสถานะปัจจุบันก่อน import/restore; import ล็อกตั้งแต่ File.text ผ่าน checksum/confirmation/commit จึงไม่ทิ้ง position ที่เปิดแทรก ต้องเขียน backup ของ raw snapshot ก่อน import ให้สำเร็จจึงเขียนข้อมูลใหม่ ถ้าล้มเหลว state ปัจจุบันไม่เปลี่ยน (backup อาจเขียนสำเร็จแล้ว)
- Backup key `axiom_lab_v2_backup` เก็บก่อน import หนึ่งชุด ปุ่มคืน backup ใช้ validator เดียวกันและเก็บ snapshot ปัจจุบันเป็น backup แทน จึงสลับกลับได้ Backup ใน browser อาจสูญหายเช่นเดียวกัน ต้องมี export ภายนอก ถ้า backup เป็น raw ที่เสียจะปฏิเสธ restore
- ถ้า snapshot เสีย หยุดเขียนและส่งออก recovery ที่เก็บ raw v2/legacy ได้ สามารถ import ไฟล์ v2 ที่ตรวจผ่านเพื่อกู้กลับ โดยสำรอง raw ที่เสียก่อน ไม่ลบ legacy ต้นฉบับ หาก storage อ่านไม่ได้จะไม่พยายามเขียนหรืออ้างว่ากู้ได้
- ขอบเขต validator: ไม่เกิน 12 MiB ของข้อความ JSON, 100 datasets/100 runs, 100,000 แท่งต่อ dataset และ 10,000 trades ต่อ run/legacy; localStorage จริงมักเต็มก่อนขีดจำกัดนี้ ให้สำรองและใช้ origin แยกหากต้องเก็บงานมาก ยังไม่มี archive/delete UI ขนาดใหญ่
- SHA256 ตรวจการเปลี่ยนข้อมูลและช่วยทำซ้ำ ไม่ใช่ลายเซ็นรับรองแหล่งที่มา ผู้แก้ไฟล์แล้วคำนวณ hash ใหม่ยังทำได้ ต้องเก็บไฟล์ต้นฉบับที่เชื่อถือได้เอง นาฬิกาเครื่องต้องถูกต้องสำหรับการตรวจแท่งปิด

## Tests

ไม่ต้องติดตั้ง dependency สำหรับ model/ledger tests:

```sh
node tests/regression.cjs
```

Chromium acceptance ต้องเตรียม Playwright, Chromium และ shared libraries:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright AXIOM_CHART_BUNDLE=/path/to/lightweight-charts.standalone.production.js node tests/browser.cjs
```

ใช้ `PLAYWRIGHT_BROWSERS_PATH`/`LD_LIBRARY_PATH` หาก runtime อยู่ใน /tmp, `AXIOM_DIST` เพื่อทดสอบ dist อื่น และ `AXIOM_BROWSER_ARTIFACTS` เพื่อเลือก directory หลักฐาน ค่าเริ่มต้น `/tmp/axiom-browser-results-v2` เปิด server ชั่วคราวที่ 127.0.0.1 และปิดใน finally

Suite ใช้ chart library v4.2.3 จริง และ **ราคาสังเคราะห์เฉพาะทดสอบ** ทดสอบ start/hidden future, Long/Short/fee/การปิดซ้ำ, quota และ guards, reload สถานะเปิด, gap/duplicate/เวลาแท่ง, schema/ledger/hash/อนาคต, import/backup/recovery, หน่วง digest เพื่อทดสอบ race, conflict สองแท็บ และ desktop→mobile resize เมื่อกราฟมีข้อมูล ทั้งชื่อรอบไม่เว้นวรรค 200 ตัวและชื่อว่างที่แสดง UUID; รอ animation frames และเงื่อนไข account/canvas containment ก่อน assert โดยไม่ใช้ screenshot เป็น delay Widget/fonts ถูก block ใน deterministic suite จึงไม่ใช่ผลตรวจ feed/symbol/CORS สด ดูผล live probe แยกใน review report

กราฟ replay ใช้ Lightweight Charts 4.2.3 จาก CDN มีลิงก์ attribution ไป TradingView ในหน้า UI; market widget โหลดจาก TradingView เอง ไม่มีการนำข้อมูล widget มาคำนวณ P&L

Live widget ใช้ wrapper ภายใน #tv ที่มีความสูงคงที่ 540px/420px เพื่อให้ embed script จัด iframe ใน tradingview-widget-container ได้ถูกต้อง; footer แสดง NOTICE ของ Lightweight Charts v4.2.3 พร้อมลิงก์ต้นทาง
