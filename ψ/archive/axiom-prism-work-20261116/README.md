# AXIOM + PRISM — Trading Lab work snapshot, 16 November 2026

AunauN ขอให้อัปเดตงานของ AXIOM และ PRISM ขึ้น GitHub จึงสำรองชุดงานที่เกี่ยวข้องใน AunauN-for-Oracle ทั้งสอง repo ลูกยังไม่มี remote ไม่สร้าง repo ใหม่ ไม่เปลี่ยน remote หรือ commit ใน repo ลูก

## สิ่งที่อยู่ในชุดนี้

- **AXIOM:** [Trading Lab v2 ที่ติดตั้งจริง](axiom/trading-lab/README.md), [รายงานตรวจรับ](axiom/ψ/lab/axiom-prism-review-20261115/REPORT.txt), baseline/candidate/installed evidence และความจำงานล่าสุด
- **PRISM:** [candidate implementation](prism/ψ/lab/axiom-prism-20261115/staged/README.md), [implementation report](prism/ψ/lab/axiom-prism-20261115/REVIEW-REPORT.md), source baseline, patch, installer, model/browser/live evidence และความจำงานล่าสุด
- **แผน indicator 15–16 พ.ย.:** CDC ActionZone และ Modified Stochastic MACD Oscillator ยังเป็นงานออกแบบ ไม่มี implementation หรือผล parity ใหม่ รายละเอียดอยู่ใน retrospective/lesson ของแต่ละตัว ไม่อ้างว่าทดสอบ indicator ผ่านแล้ว
- **manifest.json:** รายชื่อ source/snapshot/ขนาด/SHA-256 ทุกไฟล์ที่คัดลอก พร้อมผลตรวจชุดเผยแพร่

## สถานะที่ตรวจครั้งนี้

ไฟล์ AXIOM ที่ใช้งานและ PRISM staged ตรงกับ accepted manifest ทั้ง 9 ไฟล์ของแต่ละฝั่ง ตรวจ SHA-256 ของสำเนาทุกไฟล์แล้วก่อน commit ไม่รัน browser/API tests ใหม่เพียงเพื่อสำรอง byte-identical files ผล model10/browser11/independent6 และ live provider เป็นผลที่ AXIOM/PRISM บันทึกไว้วันที่ 15 พ.ย. ไม่ใช่ผลทดสอบใหม่ของ AunauN วันที่เผยแพร่

manifest/รายงานบางไฟล์เป็นประวัติในขั้น staged หรือก่อนแก้ overflow จึงคงข้อความเดิมไว้ การตรวจรับล่าสุดใช้ REPORT.txt, installed-hashes.json และ installed-browser ของ AXIOM ไม่ใช้ status เก่าใน PRISM manifest ตัดสินแทน

## วิธีเปิดสำเนาที่ใช้งานได้

จากโฟลเดอร์นี้:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory axiom/trading-lab/dist
```

เปิด http://localhost:8000 โดยใช้ origin เดิมเมื่อต้องการอ่าน browser state เดิม ต้องใช้อินเทอร์เน็ตสำหรับ CDN, Binance และ TradingView ดู [README ของแอป](axiom/trading-lab/README.md) ก่อนฝึก รายงาน/installer เก่าบางตัวอ้างพาธเครื่องเดิม ไม่ควรรัน installer จาก snapshot โดยไม่ตรวจปลายทาง

## ข้อจำกัด

เป็น personal prototype และ linear PnL ไม่ใช่ Futures execution สมจริง ไม่มี leverage/margin/liquidation/funding/slippage/SL/TP หรือ automatic backtest SET/PTT/ADVANC ถูก widget จำกัด จึงมีคำอธิบายและลิงก์ TradingView ภายนอก ไม่อ้างว่ามีกราฟหุ้นไทยในแอป ไม่มีการ deploy เชื่อมบัญชี หรือใช้เงินจริงในคำขอเผยแพร่ครั้งนี้

ไม่รวม credentials, .git, node_modules, runtimes, cache, browser localStorage, ข้อมูลบัญชี/พอร์ตส่วนตัว หรือชุดงานอื่นของสอง Oracle ไม่ใช่ snapshot ทั้ง repo การ copy นี้ไม่เปลี่ยนสิทธิ์ rrr ของลูกและไม่ให้ auto-push ใหม่โดยปริยาย

สร้างโดย AunauN Oracle (AI); implementation PRISM; acceptance/independent review AXIOM; source provenance และรายละเอียดตรวจอยู่ในไฟล์แนบ
