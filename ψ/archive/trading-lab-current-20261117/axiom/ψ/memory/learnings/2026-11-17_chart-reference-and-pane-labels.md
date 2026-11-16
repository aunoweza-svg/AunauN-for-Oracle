# ตรวจตลาด ชนิดแท่ง และ Pine objects ก่อนอ้างว่า chart ตรง reference

วันที่: 2026-11-17 · AXIOM Oracle · หลักฐานจากงาน OWN-CHART-20261117 และ CDC-PANE-LABELS-20261117

กราฟใช้ symbol เดียวกันก็ยังเทียบผิดได้ถ้า exchange/ตลาด Spot-Perpetual หรือชนิดแท่งต่างกัน งานนี้ผู้ใช้ยืนยัน BINANCE:BTCUSDT Spot ส่วนภาพมีค่า HAclose64942.0725 และ CDC fast/slow64722.746741/64623.344916 เมื่อใช้ actual prior Spot candles แปลง HA แล้วคำนวณได้ตรงทศนิยมที่แสดง MSOปัด1ทศนิยมตรงเช่นกัน

การระบุ HA นี้ใช้ raw last จาก bid ในภาพเป็นข้ออนุมานที่ตัวเลขสนับสนุน เป็นการ reconstruct แท่งที่ยังก่อตัวหนึ่งภาพ ไม่ใช่การยืนยันทุกแท่งหรือทุกสัญญาณ หากต้องพิสูจน์ต่อ ต้องเทียบ closed-bar reference/flags/seed/history ของแต่ละTFแยกกัน

แนวทางใช้ซ้ำ:

1. หลังผู้ใช้เปลี่ยนหรือบันทึกภาพ ตรวจ hash/mtime และเปิดภาพใหม่ อย่าใช้ภาพเก่าใน context โดยอัตโนมัติ
2. ยืนยัน exchange, symbol, Spot/Perpetual, timeframe, chart type, หน่วย/สกุลเงิน และค่าตั้งก่อนเลือก feed
3. เก็บ raw OHLC แยกจาก transformed OHLC; บน HA ให้ CDC/MSO รับ transformed OHLCทั้งหมด ไม่แปลงเฉพาะรูปแท่ง แยกราคาตลาดจริงในUI
4. ตรวจ Pine ทั้ง plots/shapes/fills/label.new และcontrols ข้อความใต้กราฟไม่แทน pane label; sourceส่วนlabelนี้อยู่บรรทัด144–162 และเก็บเพียงlatestlabel
5. ทดสอบ label ตามสี/เงื่อนไข/เหนือhigh-ใต้low, resize/pan/zoom, ปิดassistหรือCDC และจำค่าเดิม ใช้ canvas draw evidence + screenshot ไม่ตรวจเพียงข้อความDOMนอกกราฟ
6. แยก frame ก่อน/หลัง action และเว้น gesture interval ให้ browser testสื่อเจตนาผู้ใช้ ไม่ตีความ double-click หรือประวัติ canvas log เป็น defect ของ renderer

Source evidence:

- `ψ/lab/own-chart-20261117/heikin-ashi-reference-comparison.json`
- `ψ/lab/own-chart-20261117/installed-live-browser/results.json`
- `ψ/lab/cdc-pane-labels-20261117/acceptance.json` และภาพdesktop/mobileในbrowser/
- `trading-lab/source/cdc-actionzone-v3-2020.pine`
