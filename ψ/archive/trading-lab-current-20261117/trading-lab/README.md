# AXIOM Trading Lab — personal prototype v2

Baseline AXIOM-PRISM-20261115 ตรวจรับแล้ว · Indicator extension INDICATOR-INSTALL-20261116 โดย PRISM ต้องให้ AXIOM ตรวจอิสระและติดตั้งก่อนถือว่าเสร็จ

เปิดจากโฟลเดอร์ `trading-lab` ด้วย browser รุ่นปัจจุบัน:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

เข้า `http://localhost:8000` โดยใช้ hostname/port เดิมทุกครั้ง (localStorage แยก origin รวม localhost กับ 127.0.0.1) ต้องรองรับ Web Locks และ Web Crypto บน localhost หรือ secure context จึงบันทึกได้ ไม่แนะนำ file:// ต้องใช้อินเทอร์เน็ตสำหรับ Binance, TradingView และ CDN กราฟ/ฟอนต์ ไม่มี API key ไม่มีการเชื่อมบัญชีหรือส่งคำสั่งเงินจริง ไม่ได้ deploy หรือเปลี่ยน Sites ที่ลงทะเบียนไว้

## วิธีฝึกและกติกา

1. หน้า market แสดงกราฟ BTCUSDT Spot ของ Binance ด้วย TradingView Lightweight Charts และ CDC/MSO จาก Pine ของผู้ใช้ เลือก 15m/1h/4h/1d/1w/1M เลื่อน/ซูม เปิด volume และวาดเส้นแนวนอน/แนวโน้มได้ กราฟ TradingView ต้นฉบับและ Pine ยังอยู่ในส่วนอ้างอิงที่พับไว้ หุ้นไทยเปิดผ่าน TradingView ภายนอก
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

## Indicators — INDICATOR-INSTALL-20261116

Replay เท่านั้น: CDC ActionZone V3 2020 (user Pine v5) และ Modified Stochastic MACD Oscillator - Vitali Apirine (user Pine v4) คำนวณใน browser จาก dataset/replay prefix เดียวกับราคา ไม่มีคำสั่งซื้อขายอัตโนมัติ Market TradingView iframe ไม่รับ custom Pine และข้อมูล market ยังคงแยกจาก replay

กด Indicators เพื่อเลือกค่าของ **รอบใหม่** แล้วกดเริ่มรอบใหม่ ค่าที่ตั้งไม่ย้อนเปลี่ยนรอบที่กำลังฝึก ปุ่มแสดง CDC/MSO เป็น visibility ของรอบปัจจุบันและไม่แก้ ledger/config ที่บันทึก `assist` เปิด/ปิดข้อความช่วยอ่าน CDC จริง; fast/slow, bar paint, signals, ribbon และตัวเลือก MSO มีผลตามค่าที่บันทึกต่อรอบ มี legend ตัวเลขกับ warmup/history status แยกจาก assist

- CDC defaults: source close, EMA smoothing1 → fast12/slow26, paint/fast/slow/assist/signals เปิด, ribbon ปิดและตำแหน่งTop; สีตรง Pine v5 (รวม Black fallback เมื่อไม่เข้า6zones) ไม่ใช้ CSS named colors BUY/SELL เป็น first-green/red ร่วมกับ barssince และค่า na เริ่มต้น ไม่ใช่ simple EMA crossover และข้อความ BUY/SELL next bar เป็นข้อมูลจาก Pine ไม่ได้เปลี่ยนกติกา fill ของ simulator
- CDC fixed timeframe (ต้นฉบับค่า D) และ momentum StochRSI **ยังไม่รองรับ/ปิดเสมอ** รุ่นนี้ validator ปฏิเสธการเปิดสองโหมดดังกล่าวจาก import ด้วย ไม่มีการใช้สูตรอื่นแทน
- MSO defaults: period45, fast12/slow26, signal9; histogram เปิด scheme#1, momentum background เปิด, thickness2, crossover เปิด, levels+1/−1 เมื่อrange0 fast/slow stochasticและmacdเป็น0 แต่signal EMAยังคงdecayจากค่าเดิม scheme#2 เทียบhistogramกับnz(previous histogram)
- คำนวณ EMA แบบ seed ด้วยค่าแรก และ rolling extrema ใช้ข้อมูลที่มีในช่วงเริ่มตาม Pine; ไม่ปิดบัง bootstrap values ด้วยเลข0หรืออ้างว่าค่า EMA converge แล้ว สถานะ warmup ระบุเมื่อประวัติยังน้อยกว่าperiodที่ใช้ แม้พ้นช่วงนี้ก็ยังขึ้นกับ dataset start/prehistory ไม่มี external TradingView numerical parity ที่ยืนยันแล้ว
- รองรับ source open/high/low/close/hl2/hlc3/ohlc4; ไม่รองรับ source ที่อ้าง series ของ indicator ภายนอก จำกัด period1..1000 (MSO slow/signal≥2), thickness1/2, overbought≥0.5/oversold≤−0.5
- v4.2.3 ใช้ chart oscillator แยก ซิงก์ logical range และ crosshairสองทิศทาง ไม่อัปเกรด library CDCมีEMA fill/ribbonผ่านprimitive, circlesตามsignal; MSOมีmomentum background/zero band/levelsและtriangle crossoverที่ขอบpane ข้อความassistCDCแสดงในsummaryใต้กราฟแทนfloating label ของPine ไม่มี pixel parity claim

### Settings และข้อมูลเก่า

คง schema2/engine2.0.0 และstorage keyเดิม โดยเพิ่ม **optional `run.indicators` extension** ที่validateแยก มีindicator version1.0.0, source SHA256, parity=`external-unverified` และค่าคำนวณ/การแสดงผลที่ล็อกเมื่อสร้างรอบ เปลี่ยนinputมีผลเฉพาะรอบใหม่ Export/import/backup/reloadเก็บข้อมูลนี้ครบ ไม่เก็บ derived indicator arrayซ้ำเพราะทำซ้ำได้จากdataset+index+config

รอบv2เดิมไม่มีextensionจะเก็บไว้เหมือนเดิม รวมbalance/trades/openposition/legacyrecords ไม่แต่งcontextย้อนหลัง ไม่มีindicatorแสดงให้รอบเดิมจนเริ่มรอบใหม่ metadataที่มีต้องผ่านvalidator; version/source/unsupported mode/parameterผิดจะปฏิเสธimport การโหลดdatasetใหม่สำเร็จหรือimport snapshotว่างจะล้างoverlay/oscillatorเก่า ป้องกันการเห็นค่าเก่าปน

### Source และ license

`source/` เก็บ Pineเต็มตามข้อความผู้ใช้จาก AXIOM thread พร้อม `provenance.json` และSHA256 CDC `17be67ca761b508386b40dec2bad4f19aec8dec9e1f561fbbf5f2428c73fd248`; MSO `baad49d91d4450cb511eaf5b93b6e4e97e59fc3e0ea1dd19ef7e5bb04cf9c97a`

CDC ©piriya33 MPL-2.0 แยกไฟล์port `dist/cdc.js` พร้อมnotice/license link และต้นฉบับข้อความครบ MSOมีชื่อVitaliApirineในชื่อstudy แต่Pineที่ได้รับไม่มีexplicit license header จึงไม่อ้างopen license การติดตั้งนี้เป็นต้นแบบส่วนตัว ไม่อนุญาตpublication/deploy/pushโดยปริยาย ดู `dist/NOTICE.txt` และfooter

### ตรวจเพิ่ม

```sh
node tests/indicators.cjs
```

Indicator tests ตรวจsource hashes, hand calculations, EMA/na/ties/zero-range, histogram schemes/crossover equality, future-prefix invariance, warmup/prehistory, validation และold-v2 open-position preservation ไม่ใช่TradingViewexport comparison Browser suiteเดิมเพิ่มsettings/assist/toggles/frozen config/reload, actual chart primitives/range sync และlegacy context เพื่อรักษาaccount/storage/import guards ครบ suiteblockfonts/widgetและใช้ราคาสังเคราะห์เฉพาะทดสอบ จึงตรวจlayoutแต่ไม่รับรองThai typographyจากภาพนั้น

## Journal readability และ Market indicators — JOURNAL-MARKET-20261116

หน้าบันทึกแสดงผลสุทธิของรายการที่ปิดทั้งหมดและแต่ละรอบ พร้อมการ์ดกำไร/ขาดทุนที่เขียนเป็นภาษาไทย ระบุเครื่องหมายและหน่วยUSDT ค่าธรรมเนียมรวม จำนวนรายการ ราคาเข้า/ออก ขนาดBTC เหตุผลและเวลาไทย กำไรสุทธิใช้ค่า `net` ที่บันทึกไว้แล้ว ไม่หักfeeซ้ำ ยอดรวมไม่รวมสถานะที่ยังเปิด/ค่าfeeของสถานะค้าง/กำไรลอยตัว แต่ละรอบทุนเริ่มแยกกัน จึงไม่ใช่ผลตอบแทนพอร์ตรวม

รหัสรอบ/รหัสdataset/SHA256ย้ายไปอยู่ในรายละเอียดที่พับไว้ ไม่ใช้รหัสเป็นชื่อรอบเมื่อผู้ใช้ไม่ตั้งชื่อ รายการและข้อมูลเดิมไม่ถูกแก้ ไม่เปลี่ยนสูตรบัญชี/schema/storage key/indicator settings การแสดงผลใช้textContentจึงไม่ตีความเหตุผลที่พิมพ์เป็นHTML Legacy recordsยังอ่านได้พร้อมป้ายข้อจำกัด ไม่เพิ่มcontextย้อนหลัง

## ประวัติรุ่นเปิด TradingView โดยตรง — TV-DIRECT-20261116

ตามแนวทางที่ AunauN เลือก หน้าตลาดใช้ปุ่มเปิด TradingView ตัวเต็มภายนอกแทนกราฟตลาดที่คำนวณในแอปและ widget ปุ่มทั่วไปเปิด symbol ที่เลือก (เริ่มต้น15m) ยังไม่เพิ่ม CDC/MSO อัตโนมัติ ผู้ใช้เข้าสู่บัญชี TradingView แล้วเพิ่มสคริปต์สองตัวครั้งแรกผ่าน Indicators หรือ Pine Editor สร้างแยกคนละสคริปต์ จากนั้น Save/Add to chart และบันทึก layout ของตนเอง จำนวน indicator/ข้อมูลตลาดขึ้นกับบัญชี TradingView

มีปุ่มคัดลอก Pine และลิงก์ดาวน์โหลดสำรองใน `dist/pine/` ซึ่ง byte-identical กับต้นฉบับใน `source/` รวมประกาศผู้เขียน/สิทธิ์เดิม หาก clipboard ถูกปฏิเสธใช้ดาวน์โหลดได้ หน้าแอปไม่ได้เข้าถึงบัญชีหรือเพิ่ม indicator บน TradingView ให้เอง วิธี Pine Editor: https://www.tradingview.com/support/solutions/43000711497-how-to-create-a-new-script/

ช่องเก็บลิงก์ layout เป็นทางเลือก รับเฉพาะ HTTPS ของโดเมน TradingView และเส้นทาง `/chart/<id>/` ตัด query/fragment เก็บใน localStorage key `axiom_tv_layout_v1` แยกจาก snapshot/backup/legacy ไม่รวมลิงก์ส่วนตัวใน export journal ปุ่ม «เปิด layout ของฉัน» เปิด URL ที่บันทึกไว้ ไม่เปลี่ยนตาม dropdown symbol และไม่อ้างว่า sync บัญชี/indicator กับ Trading Lab ปุ่มนำลิงก์ออกลบเฉพาะ preference นี้

หน้าตลาดไม่สร้างกราฟ native/widget และไม่เริ่มเรียก Binance/polling สำหรับตลาดแล้ว `market-view.js` เก็บเป็นไฟล์เดิมที่ไม่ถูกโหลด รุ่นก่อนพร้อมหลักฐานอยู่ใน `ψ/lab/journal-market-review-20261116/` และ backup ของงานนี้ สูตร/account/schema/replay/journal เดิมไม่เปลี่ยน รวม indicator ในหน้าฝึกเทรด ข้อมูลตลาดบน TradingView ไม่ส่งกลับเข้า replay หรือบัญชี

ทดสอบ `node tests/regression.cjs`, `node tests/indicators.cjs`, `node tests/journal-market.cjs` (ส่วน pure validator ตลาดเดิมคงไว้เป็น regression ของไฟล์ที่เก็บประวัติ) และ expanded `tests/browser.cjs`: เปิดลิงก์ตาม symbol, ไม่มี market feed อัตโนมัติ, URL allowlist, save/reload/clear preference, clipboard ตรง source/download fallback, snapshot เดิม, account/storage/import/replay/indicator/journal guards และ desktop/mobile ไม่มีการล็อกอินหรือแก้บัญชี TradingView จริงในการทดสอบ


## กราฟส่วนตัว — OWN-CHART-20261117 (รุ่นปัจจุบัน)

ผู้ใช้เปลี่ยนกราฟอ้างอิงเป็น `BINANCE:BTCUSDT` ให้ตรงกับ public feed ของ Binance Spot BTCUSDT ราคาเป็นราคาซื้อขาย Spot ตามที่ผู้ใช้ยืนยันครั้งล่าสุด แทนภาพเดิม CRYPTO:BTCUSD ที่แปลงหน่วยเป็น USDT ใช้ Lightweight Charts 4.2.3 เป็นตัวแสดงกราฟ แปลง Pine เดิมด้วย engine CDC/MSO ที่ตรวจไว้ ไม่มี TradingView account sync

- REST `https://api.binance.com/api/v3/klines` ขอ 500 แท่งปิดเมื่อเปิด/เปลี่ยนกรอบเวลา/ทุก60วินาทีที่หน้ากราฟ active ตรวจขอบแท่ง ความต่อเนื่อง ราคาและปริมาณ ทุก interval รวม 1w เริ่มจันทร์ UTC และ 1M ตามเดือนปฏิทิน ประวัติสัปดาห์/เดือนสั้นกว่า500ได้ตามประวัติการเปิดตลาด ไม่เติมแท่งปลอม
- Stream `wss://stream.binance.com:443/ws/btcusdt@kline_<interval>` เติมแท่งที่กำลังก่อตัว ระบุสถานะชัดเจน สัญญาณแท่งนี้เปลี่ยนได้ ถ้าสตรีมไม่พร้อมมีข้อความแจ้งและใช้ REST แท่งปิดแทน ไม่อ้างเรียลไทม์ขณะ disconnect พักรับข้อมูลเมื่อเปลี่ยนหน้า/ซ่อนแท็บ
- EMA เริ่มจากแท่งแรกของชุด500และเก็บประวัติต่อขณะเปิดหน้า สูงสุด10000แท่ง ประวัติที่ใช้ seed อาจต่างจาก TradingView โดยเฉพาะถ้าตั้งperiodสูง จึงยังไม่รับรองราคา/สัญญาณตรงทุกแท่ง การยืนยันต้องเทียบแท่งปิดเวลาเดียวกันจากกราฟอ้างอิงใหม่และsettingsเดียวกัน ภาพ CRYPTO เดิมไม่ใช่หลักฐาน parity ของ Binance
- กราฟราคา/แผง MSO ซิงก์เวลาและcrosshair แสดง OHLC/indicator6ทศนิยมเมื่อชี้แท่ง แกนเวลา UTC ส่วนเวลารับข้อมูลเป็นไทย เลื่อน/ซูม/พอดีจอ/แท่งล่าสุด/เต็มจอ พร้อม volume และเส้นแนวนอน/แนวโน้ม2จุด สูงสุด20เส้นต่อTF เส้นเก็บเฉพาะbrowser ไม่ใช่ TradingView drawings
- Preference key `axiom_chart_workspace_v1` เก็บTF/ค่าตั้งindicatorร่วมทุกTF/volume/follow และเส้นแยกต่อTF ไม่เขียน snapshot/backup/legacy ของรอบฝึก ค่าตั้งฝึกเดิมยังแยกและ frozen ต่อรอบ ต้นฉบับ Pine/model/schema/สูตรบัญชีไม่เปลี่ยน
- ลิงก์เปิด TradingView ทั่วไปใช้TFปัจจุบันรวมที่restoreจากbrowser URL layoutรับเฉพาะTradingViewHTTPS/chart/id คงเฉพาะquery symbolที่ผ่านvalidation ตัดtracking/fragment ปุ่มlayoutเปิดตามlayoutที่บันทึก

เพิ่ม `node tests/own-chart.cjs` และ `node tests/own-chart-browser.cjs` สำหรับcalendar/feed/stream/REST-race/settings/drawings/hover/mobile/isolation นอกเหนือจากชุดเดิม Browser suites ใช้ราคาsynthetic เพื่อทดสอบพฤติกรรม ไม่ใช่หลักฐานราคาแท้หรือTradingView parity หลักฐานตรวจfeedจริงและรายงานติดตั้งอยู่ `ψ/lab/own-chart-20261117/`


ภาพใหม่ของผู้ใช้เป็น Binance Spot15m และมีหลักฐานเชิงตัวเลขว่าใช้ Heikin Ashi: HAclose64942.0725 และ CDC fast/slow ตรงค่าภาพที่6ทศนิยม MSOตรงค่าที่ปัด1ทศนิยม ดู `heikin-ashi-reference-comparison.json` การreconstructใช้rawopenจากAPIและH/L/bidจากภาพ โดยอนุมานlastเท่ากับbidขณะถ่าย จึงเป็นหลักฐานsnapshotเดียวของแท่งที่กำลังก่อตัว ไม่ใช่parityของทุกแท่ง/ทุกสัญญาณ/ครบ6TF

ตั้งค่าเริ่มต้นเป็น **Heikin Ashi** ตามภาพ มีเมนูแท่งเทียนปกติ `chartType` เก็บในworkspace การแปลง HA ใช้ close=OHLC4, open=(HAopenก่อน+HAcloseก่อน)/2 โดยแท่งแรก seed=(rawopen+rawclose)/2, high/lowครอบrawและHAbody indicatorรับOHLCตามชนิดแท่งทั้งหมด รวมMSO high/low ขณะที่REST/WSคงข้อมูลrawและแสดงราคาตลาดSpotแยกไว้ในUI สูตรบัญชีและแท่ง replay เดิมไม่ได้เปลี่ยนเป็นHA

Crosshair adapterมีguardก่อนซิงก์ไปseries/time scaleที่ว่าง เพื่อแก้ Value is null เมื่อล้างเส้น/เปลี่ยนTFขณะชี้กราฟ เป็นการแก้การแสดงผลในsharedadapter ไม่เปลี่ยนสูตรindicatorหรือรายการฝึก


### CDC pane label — 2026-11-17

เพิ่มกรอบข้อความพร้อมลูกศรที่แท่งล่าสุดบนกราฟราคา ให้ตรงเงื่อนไขlabel.newในPineบรรทัด144–162: bullish/bearish/sideways, BUY/SELL next bar, ตำแหน่งเหนือhighเมื่อclose>SlowMAและใต้lowกรณีอื่น พร้อมสีพื้น/ข้อความตามbuy/sellและcloseเทียบแท่งก่อน ป้ายติดตามแท่งล่าสุดเมื่อซูม/เลื่อน/resize/รับtick และซ่อนเมื่อเลื่อนออกนอกช่วงแท่งล่าสุด มีcheckbox«ป้ายแนวโน้ม CDC»เชื่อมกับsetting«ข้อความแนวโน้ม»เดิม ใช้preferenceเดิมไม่resetค่าผู้ใช้

วาดด้วยforegroundseriesprimitiveของLightweightCharts4.2.3 พร้อมเผื่อระยะในauto-scaleให้เห็นป้าย มีข้อความใต้กราฟสำหรับอ่าน/เข้าถึงได้ต่อไป จุดBuy/Sellวงกลมและสูตรindicatorเดิมยังเหมือนเดิม ไม่แก้Pine/model/schema/การฝึก บันทึกก่อนแก้และผลตรวจอยู่ψ/lab/cdc-pane-labels-20261117
