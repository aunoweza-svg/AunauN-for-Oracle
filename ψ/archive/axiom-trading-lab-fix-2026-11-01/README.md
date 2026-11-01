# AXIOM Trading Lab — ต้นแบบ

เปิด `dist/index.html` ในเว็บเบราว์เซอร์ที่เชื่อมอินเทอร์เน็ต กราฟ TradingView และ Lightweight Charts โหลดจากภายนอก และ replay เรียกข้อมูล 15 นาที BTCUSDT USDⓈ-M Futures จาก Binance โดยตรง หาก browser, เครือข่าย หรือภูมิภาคปฏิเสธการเชื่อมต่อ ระบบจะแจ้งข้อผิดพลาด

เลือกกราฟในหน้าภาพตลาด กดโหลดข้อมูลในหน้าฝึกเทรด แล้วเริ่มรอบใหม่ ระบบเปิดเผยข้อมูลทีละแท่ง ปิดสถานะเพื่อบันทึกใน localStorage และส่งออก JSON จากหน้าบันทึก ข้อมูลบันทึกอยู่ในเบราว์เซอร์และอาจสูญหายหากล้างข้อมูลเบราว์เซอร์

## ขอบเขต

- แบบฝึกคำนวณ P&L เชิงเส้นและค่าธรรมเนียมที่ผู้ใช้กำหนด โดยใช้ราคาปิดแท่งปัจจุบัน ไม่จำลองคำสั่งจริง
- ยังไม่มี leverage, margin, liquidation, funding, slippage, stop loss, take profit หรือการจับคู่คำสั่งที่สมจริง ผลจึงไม่ใช่การจำลอง Futures อย่างครบถ้วน
- การเริ่มรอบใหม่เริ่มที่แท่งที่ 200 ยังเลือกวันเริ่มต้นไม่ได้ และยังไม่มี backtest อัตโนมัติ
- กราฟ TradingView เป็น widget แยกจากข้อมูล Binance ของระบบ replay ราคาและเวลาจึงอาจต่างกัน
- ตรวจจับช่องว่างในแท่งเทียน แต่ยังไม่ได้ตรวจความสอดคล้องของราคากับแหล่งที่สอง
- เว็บไซต์ Sites ถูกลงทะเบียนแบบส่วนตัว แต่ยังไม่ได้เผยแพร่

## การป้องกันข้อมูลและสถานะ

- ต้องปิดสถานะและบันทึกสำเร็จก่อนเริ่มรอบใหม่หรือโหลด dataset ใหม่ ปุ่มและ handler จะไม่ทิ้งสถานะที่ยังเปิด
- ระหว่างโหลด ปุ่มเริ่ม/เดินแท่ง/ซื้อขายถูกพักไว้ โหลดล้มเหลวจะเก็บรอบเดิมให้ฝึกต่อ โหลดสำเร็จต้องกดเริ่มรอบใหม่ก่อนเทรด
- ปิดสถานะจะเขียน journal ให้สำเร็จก่อนเปลี่ยนยอดเงิน หากพื้นที่เต็มหรือเขียนไม่ได้ สถานะและยอดเดิมยังอยู่ ให้แก้การเก็บข้อมูลแล้วลองปิดอีกครั้ง อย่าเพิ่งปิดหน้า
- หาก JSON หรือโครงสร้าง journal เสีย ระบบยังเปิดหน้าและเดิน replay ได้ แต่หยุดเปิดสถานะใหม่เพื่อไม่เขียนทับต้นฉบับ ปุ่มส่งออก JSON จะส่งออกไฟล์ `axiom-trading-journal-recovery.txt` ตามข้อมูลเดิม การกู้คืน/นำเข้ายังต้องจัดการแยก ไม่ได้ล้างหรือซ่อมข้อมูลอัตโนมัติ
- ใช้เทรดจำลองครั้งละหนึ่งแท็บ หากตรวจพบ journal เปลี่ยนจากอีกแท็บจะไม่เขียนทับ; ยังไม่มีฐานข้อมูลหรือ transaction ข้ามแท็บ และสถานะเปิด/ยอดเงิน/replay ไม่ถูกบันทึกข้ามการปิดหน้า

## เปิดผ่าน local server

เรียกจากโฟลเดอร์ `trading-lab` แล้วเข้า `http://localhost:8000`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

ต้องใช้อินเทอร์เน็ตสำหรับ CDN, TradingView และ Binance ไม่มี API key หรือการเชื่อมบัญชีจริง

## ทดสอบ regression

ใช้ Node.js โดยไม่ต้องติดตั้ง dependencies เพิ่ม:

```sh
node tests/regression.cjs
```

ทดสอบ app.js ผ่าน click handlers/ผลที่แสดง ด้วย DOM/chart/network/storage stubs: การบันทึกล้มเหลวและลองซ้ำ, guard สถานะเปิด, reload, JSON/โครงสร้างเสีย, storage เข้าไม่ได้, เก็บรายการเดิม และการเปลี่ยนข้อมูลจากอีกแท็บ นี่ไม่ใช่ browser acceptance

มี `tests/browser.cjs` สำหรับ Chromium จริง ต้องมี Playwright และ Chromium runtime ก่อน ใช้ `PLAYWRIGHT_MODULE` ระบุ package ถ้าไม่ได้ติดตั้งอยู่ใน module path และ `PLAYWRIGHT_BROWSERS_PATH` ตามตำแหน่ง runtime โดยไม่ต้องเพิ่ม dependencies ในต้นแบบ:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser.cjs
```

Browser suite ใช้แท่งราคาสังเคราะห์เฉพาะทดสอบและ block TradingView/fonts เพื่อตรวจ state, localStorage, download และมือถือแบบทำซ้ำได้; โหลด chart library จริงจาก CDN หรือกำหนด `AXIOM_CHART_BUNDLE=/path/to/lightweight-charts.standalone.production.js` ที่เป็น v4.2.3 จึงไม่ยืนยันข้อมูล/symbol ของ TradingView หรือ Binance สด ค่าเริ่มต้น artifact อยู่ `/tmp/axiom-browser-results`
