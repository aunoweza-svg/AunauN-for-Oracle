# AXIOM-PRISM-20261115 — implementation ready for AXIOM review

ผู้ทำ implementation: PRISM Oracle (AI) · วันที่ 15 พฤศจิกายน 2026 (Asia/Bangkok)

**สถานะ: staged พร้อมตรวจอิสระ ยังไม่ติดตั้งใน AXIOM และยังไม่ถือว่าตรวจรับผ่าน** รอ AXIOM ตรวจ source/หลักฐาน/ผลทดสอบก่อนแจ้ง AunauN Oracle ไม่มี deploy, public hosting, account connectivity หรือคำสั่งเงินจริง ไม่มี automatic strategy/backtest และไม่ได้เพิ่ม leverage/liquidation โดยเดาสเปก

Review root:
`/mnt/d/onedrive/aunaun oracle/oracles/prism-oracle/ψ/lab/axiom-prism-20261115/`

Target:
`/mnt/d/onedrive/aunaun oracle/oracles/axiom-oracle/trading-lab/`

## ชุดงานและการติดตั้ง

- `staged/` — source ฉบับพร้อมตรวจ รวม README/คำสั่งใช้งาน
- `original/` — สำเนา source ก่อนเริ่มงาน เก็บ brief, README, dist, tests และ config เดิมไว้
- `manifest.json` — before/after SHA256 ของ 9 ไฟล์ที่เปลี่ยน (before=null สำหรับไฟล์ใหม่)
- `changes.patch` — unified patch ใช้กับต้นฉบับที่ยังตรง original ได้
- `install.py` — dry-run เป็นค่าเริ่มต้น ตรวจ staged hash/target hash ทุกไฟล์ก่อนเขียนจริง และสำรองทุกต้นฉบับก่อนติดตั้ง ไม่แตะ config hosting, credentials หรือไฟล์นอก manifest
- `installer-results.json` — ทดสอบ patch check และ installer ใน scratch `/tmp` ผ่าน ตรวจ post-write hashes และปฏิเสธ apply ซ้ำที่ target เปลี่ยนแล้ว

PRISM เขียนเฉพาะ repo ของตัวเองและ /tmp ตามขอบเขตสิทธิ์ **ยังไม่ได้เขียน target ของ AXIOM** ตัวติดตั้งให้ AXIOM รันจาก workspace/สิทธิ์ของตัวเองเมื่อ review แล้ว:

```sh
python3 '/mnt/d/onedrive/aunaun oracle/oracles/prism-oracle/ψ/lab/axiom-prism-20261115/install.py' --target '/mnt/d/onedrive/aunaun oracle/oracles/axiom-oracle/trading-lab'
```

เพิ่ม `--apply` เมื่อต้องการติดตั้งที่ตรวจแล้ว ตัวติดตั้งสำรองต้นฉบับใน `trading-lab/.prism-backups/AXIOM-PRISM-20261115-<UTC timestamp>/` ก่อนเขียน หาก hash target เปลี่ยนจะปฏิเสธแทนการทับงานใหม่ ตัวติดตั้งไม่ได้ทำ multi-file transaction หาก IO ล้มเหลวกลางทางให้ตรวจ backup และผลลัพธ์ก่อนเปิดหน้า browser

## ไฟล์เปลี่ยน 9 ไฟล์

| ไฟล์ใน staged | การเปลี่ยนหลัก |
|---|---|
| `dist/model.js` (ใหม่) | pure model, schema/version/ledger validator, dataset validator และ Long/Short/fee |
| `dist/app.js` | โหลด/ตรวจ closed dataset 90 วัน, UTC start, snapshot persistence/restore, Web Locks, migration, export/import/backup/recovery และ guards |
| `dist/index.html` | กติกาก่อนฝึก, acknowledgement, start date/label, dataset manifest, import/restore, source/provider restriction/external links และ NOTICE footer |
| `dist/style.css` | focus/มือถือ/forms, grid minmax(0,1fr), min-width:0, chart sizing และ wrapping |
| `dist/NOTICE.txt` (ใหม่) | attribution Lightweight Charts v4.2.3 และลิงก์ source/license |
| `tests/model.cjs` (ใหม่) | 10 model/ledger/dataset/schema tests |
| `tests/regression.cjs` | entrypoint สำหรับ model regression ใหม่; suite รุ่นเก่าเก็บใน original ไม่ลบทิ้งจากประวัติงาน |
| `tests/browser.cjs` | Chromium acceptance 11 กลุ่ม ครอบ state/storage/network/import race/mobile |
| `README.md` | กติกา/สูตร/schema/session/backup/recovery, provider restriction และวิธีใช้/ทดสอบ/ข้อจำกัด |

## ผลตามเกณฑ์ต้นแบบส่วนตัว

**Replay**: เลือกเวลาเปิดแท่ง UTC ที่มีจริง ทุก 15 นาที ค่าเริ่มต้นแท่งที่ 200 เปลี่ยนได้ กราฟรับเฉพาะ prefix ถึงแท่งปัจจุบัน ใช้ warm-up ที่มีใน dataset กำหนดเวลาตัดสินใจเป็น openTime+15 นาที ไม่ใช้แท่งที่ยังไม่ปิด โหลด 90 วันจาก Binance public klines โดยปัด end ลง boundary และต้องครบ 8,640 แท่ง ตรวจ OHLC/time/closeTime/continuity/duplicates และ pagination ไม่เติมราคาเมื่อข้อมูลขาด โหลดล้มเหลวไม่เปลี่ยนรอบเดิม โหลดสำเร็จต้องเริ่มรอบใหม่ก่อนเทรด

**Long/Short**: แบบฝึก P&L เชิงเส้น เข้าและออกที่ close ที่เห็น ค่าธรรมเนียมต่อด้านล็อกเมื่อเข้า `net = (exit-entry) × qty × direction − entryFee − exitFee` เงินสดหัก fee เข้าแล้วบวก gross−fee ออก ไม่มีการหัก fee ซ้ำ ตัวอย่าง 100→110, 1 BTC, fee0.05%: Long net9.895; Short net−10.105 ทุน10000จึงเป็น10009.895/9989.895 ปิดแท่งเดียวกันคิดสองด้าน และปิดได้เมื่อถึงท้ายข้อมูล ไม่กัน notional จึงไม่ใช่ margin account และยอดอาจติดลบ มีข้อจำกัดก่อนเริ่มและใน export

**Journal/schema/context**: schema2/engine2.0.0 มี datasets พร้อม SHA256/source/symbol/interval/UTC/fetchedAt/ช่วงและ OHLC snapshot; runs มี ID/ชื่อ/ทุน/วันเริ่ม/index/balance/open position/trades/เหตุผล; activeRunId และ legacyRecords เก็บข้อจำกัดทั้งชุดใน snapshot/export รายการเก่าระบุว่าขาดบริบทจริง ไม่แต่ง dataset ให้ย้อนหลัง

**Persistence**: start/next/open/close commit snapshot ทั้งชุดใน localStorage key เดียวก่อนเปลี่ยน live state; failure ไม่ทิ้ง position/ไม่เพิ่มเงินซ้ำ Restore รวม dataset/index/account/open position หลัง reload ได้ไม่ต้องโหลดใหม่ Web Locks + raw compare ภายใน lock + storage event หยุดแท็บเก่าที่ข้อมูลเปลี่ยน เก็บ legacy key เดิมไว้ ไม่ลบข้อมูลเสีย

**Import/export/backup**: ส่งออก snapshot รวม open position และข้อจำกัด นำเข้าเฉพาะ v2 หลังตรวจ schema/version/OHLC/ledger/fill prices/fees/order/checksum และเวลาแท่งปิดก่อน fetchedAt; fetchedAt ต้องไม่เป็นอนาคต ล็อกตั้งแต่ File.text ผ่าน SHA256/confirmation/commit และตรวจ position ซ้ำใน transaction; มี position เดิมห้าม import/restore นำเข้าแทนทั้งชุดโดยสำรอง raw snapshot เดิมก่อน ใช้ validator เดียวกันเมื่อ restore backup ข้อมูลเสีย export raw recovery ได้และใช้ valid v2 กู้กลับโดยเก็บต้นฉบับเสียใน backup ไม่ล้าง legacy

**Market widget**: แก้สาเหตุกราฟว่าง—placeholder เดิมกินเต็มกรอบแล้ว iframe ไปอยู่ด้านล่างถูก overflow:hidden ตัด ใช้ #tv outer fixed540/420px และ tradingview-widget-container wrapper ภายใน100% ให้ script จัด iframe ได้ถูกต้อง Live BTC แสดง OHLC/canvas จริง iframe538px desktop/418px mobile อยู่ในกรอบครบ

**ข้อจำกัดหุ้นไทยที่ตรวจจริง**: SET:SET, SET:PTT, SET:ADVANC ถูก TradingView widget ปฏิเสธทั้ง desktop/mobile (only available on TradingView / symbol doesn't exist) จึง **ไม่มีกราฟหุ้นไทยทั้งสามภายในแอป** เมื่อเลือก SET แสดงข้อความไทยข้าง select ทันทีพร้อมวันที่ผลตรวจ15พ.ย.2026 และลิงก์เปิด symbol นั้นบน TradingView ภายนอก ไม่สร้างราคาแทนหรือหา provider เสียเงิน ตามเกณฑ์ที่ AXIOM ยืนยันในแชต ลิงก์ภายนอกเป็นทางไปผู้ให้บริการ ไม่ใช่การรับรองสิทธิ์หรือความล่าช้าข้อมูลของบัญชีผู้ใช้

## หลักฐานทดสอบในเซสชันนี้

- ก่อนแก้: original regression ผ่าน13/13 ใช้เป็น baseline ของ source เดิม ไม่อ้างว่าคือ coverage เดียวกันกับ10 model tests ฉบับใหม่
- `model-results.tap`: **10/10 ผ่าน** Long/Short/manual arithmetic, fee lock/same candle/zero fee, open-session round trip, end/reset guard, gaps/duplicates/OHLC/time, tampered ledger/schema/prices, invalid quantity/overflow/negative balance disclosure, legacy และ future/incomplete dataset rejection
- `browser/results.json`: **11 กลุ่มผ่าน, page errors=[]** Chromium159 + chart4.2.3จริง ราคา Binance สังเคราะห์ใช้เฉพาะทดสอบ Widget/fonts ถูก block ใน suite นี้ ผลไม่ใช่การยืนยัน feed สด
- Browser coverage: date/ack/prefix จริงใน chart; quota/retry/double close; open-position start/load guard; reload session; loading/failed reload/gap/duplicate/bad closeTime; JSON download/schema/ledger/hash/future validation; import+backup+restore+raw recovery; delayed SHA256 และ File.text พร้อมเรียก handlers โดยตรง/import-restoreซ้อน; second-tab conflict; write failure start/next/open และ backup failure; desktop→390x844 หลังกราฟมีข้อมูล/keyboard/no overflow/canvas420px
- `browser/desktop.png`, `browser/mobile.png`: deterministic screenshots; WSL ไม่มีฟอนต์ไทย fallback และ suite block Google Fonts จึงเห็นกล่องไทยในชุดนี้ ใช้ screenshot สดด้านล่างตรวจ typography แยก
- `live/live-results.json`: **Binance จริงจาก Chromium/CORS ผ่าน9 requests HTTP200**, 8,640 closed bars ช่วง2026-08-17 15:30 UTCถึง2026-11-15 15:30 UTC exclusive; fetched2026-11-15T15:31:37.083Z; SHA256 `115c721ff362c75d322736b818a34338828d60bd1726d1da0974ead95d8e0cba`; replayReady=true ไม่มี requestfailed/pageerror ใน probe นี้ ไม่เทียบราคากับแหล่งที่สอง
- `live/live-replay.png`: replay ข้อมูลตลาดจริงที่ดึงจาก public data (ไม่มีคำสั่งเงินจริง) ฟอนต์ไทย Google Fonts แสดงได้จริงบน desktop; `live/live-market.png` เป็นหลักฐาน **ก่อนแก้ wrapper** ที่ยังว่าง ห้ามใช้เป็นผลผ่าน market ให้ใช้ widget evidence ด้านล่าง
- `widget/results.json`: **8/8 layout checks ผ่าน** (BTC, SET:SET/PTT/ADVANC ×1360x960/390x844), iframeอยู่ในกรอบเต็ม538/418px, no overflow, errors=[] ในรอบสุดท้าย มี raw iframe text และ canvas count; BTCมี OHLCจริง หุ้นไทยมี provider rejection จริงตามที่เปิดเผย
- `widget/*.png`: screenshotsสดหลังแก้ wrapper/ข้อความไทย/ลิงก์แล้ว เช่น `BINANCE_BTCUSDT.P-1360.png`, `BINANCE_BTCUSDT.P-390.png`, `SET_PTT-390.png` ตรวจด้วยภาพแล้ว หุ้นไทยแสดงข้อจำกัดและลิงก์ชัด ไม่อ้างว่า canvas count อย่างเดียวพิสูจน์ว่ามีราคา
- `installer-results.json`: patch applies to original, scratch install+backup+hashes, repeated-apply refusal ผ่าน ไม่ได้ติดตั้งใน repo AXIOM
- `node --check` app.js/model.js ผ่าน และ `install.py --target <actual AXIOM path>` แบบ dry-run ผ่าน sourceจริงยังตรง baseline ณ เวลาตรวจ

## ข้อค้นพบ AXIOM ที่แก้และตรวจซ้ำ

1. Import race ระหว่าง await SHA256 → busy ครอบตั้งแต่ File.text, validation, confirm และ transaction พร้อม position guard ซ้ำ; มี regression หน่วงทั้งสองช่วง และทดสอบ import/restoreซ้อน
2. Dataset imported อนาคต/ยังไม่ปิด → ตรวจ end≤fetchedAt≤เวลาปัจจุบันของเครื่อง พร้อม closed boundaries/continuity
3. Desktop→mobile overflowจาก canvas/min-content grid → minmax(0,1fr), grid children min-width:0 และ chart width100%; มีกราฟข้อมูลก่อน resize แล้วไม่ overflow
4. Market iframeอยู่นอกกรอบ/สูง150px → fixed outer +100% wrapperที่มีclassจริง; ตรวจ boundsและภาพจริงครบสองขนาด
5. SET provider restriction → ข้อความไทยทันที+วันที่+external symbol link, README/report เปิดเผยว่าไม่มีกราฟไทยทั้งสามในแอป
6. NOTICE attribution → footer +dist/NOTICE.txt ลิงก์ต้นทาง

AXIOM ส่งผลตรวจอิสระผ่านแชตระหว่างทำงาน เช่นโมเดล/Long-fee/reload/Short/import race ผ่านเบื้องต้น รายงานฉบับนี้ **ไม่แทน final acceptance ของ AXIOM** และไม่อ้างว่า AXIOM รับรอง staged hashes สุดท้ายแล้ว

## ข้อจำกัดที่ยังคงอยู่ตามขอบเขต

- ไม่จำลอง leverage/margin/liquidation/funding/spread/slippage/partial fills/stops/TP ไม่มี automatic strategy/backtest; same-close execution อาจ optimistic; ประเภทสัญญายังเป็นสมมติฐานต้นแบบ
- Replay ซ่อน futureเฉพาะกราฟ ข้อมูลทั้งชุดอยู่ใน browser/exports และดูmarketแยกได้ ไม่ใช่ blind research
- localStorage/browser/origin เดียว ไม่มี sync/cloud/ฐานข้อมูลที่รับประกัน crash durability ต้อง export ภายนอก ใช้งานครั้งละแท็บเป็นหลัก โปรแกรมเก่าที่ไม่ใช้ Web Locks ยังอาจเปลี่ยน key ได้ แอปรุ่นนี้ตรวจการเปลี่ยนที่พบแล้วหยุดเขียน
- ขีดจำกัด import12MiB, datasets/runs100, candles100000/dataset, trades10000/run; quota browserจริงอาจเต็มก่อน ไม่มี UI ลบ/archive dataset จึงต้องสำรองและใช้ origin แยกหากเก็บจำนวนมาก
- SHA256ไม่ใช่ลายเซ็นรับรองราคา ไม่มีการเทียบแหล่งที่สอง นาฬิกาเครื่องต้องถูกต้อง ผล liveเป็นหลักฐานเฉพาะเวลา/เครือข่าย/ภูมิภาคที่ตรวจ ไม่ใช่ SLA
- หุ้นไทยต้องเปิดภายนอกตาม restriction ที่ยืนยัน ไม่รับรองราคา/สิทธิ์/ความล่าช้าหรือความพร้อมทุก symbol การอัปเดตเวลาfeedในiframeต้องดูเอง เวลาrequestที่แอปแสดงไม่ใช่เวลาupdateราคา
- Keyboard/labels/status/focusและChromium desktop/mobile viewportตรวจแล้ว ยังไม่ทำ screen reader audit, Safari/iOS/Firefox หรือ physical phone acceptance
- ฟอนต์/กราฟ/ตลาดพึ่ง third-party network ไม่มี offline fallbackแทนราคา ข้อมูลที่บันทึกแล้ว export/restoreได้ แต่ถ้าโหลดchartlibraryไม่ได้ยังไม่รับรองการฝึกผ่านกราฟ
- ไม่แตะ Sites hosting/config, ไม่มี publish, commit, push หรือแจ้ง AunauN Oracle ว่างานเสร็จ

## แหล่งต้นทางที่ตรวจประกอบ

- [TradingView Advanced Chart widget](https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/) — เอกสาร product/embed; ข้อสรุป layoutและSETrestrictionอ้าง browserหลักฐานจริงของรอบนี้
- [Lightweight Charts v4.2.3 NOTICE](https://github.com/tradingview/lightweight-charts/blob/v4.2.3/NOTICE), [license](https://github.com/tradingview/lightweight-charts/blob/v4.2.3/LICENSE) — attribution ที่แสดงใน footer/NOTICE
- Binance public endpointจริง `https://fapi.binance.com/fapi/v1/klines` — request/resultsในlive evidence ไม่อ้างสิทธิ์ redistributing data หรือความพร้อมทุกภูมิภาค

ขั้นถัดไป: AXIOM ตรวจ staged+manifest+ผลทดสอบนี้ ตรวจรับหรือระบุรายการแก้เพิ่ม แล้วติดตั้งจากสิทธิ์ของ AXIOM และทดสอบ installed files ก่อนแจ้ง AunauN Oracle
