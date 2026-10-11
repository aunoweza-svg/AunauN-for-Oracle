# AunauN // Knowledge Core

เว็บเรียนรู้ KlakMath ผ่าน mental model ของนักพัฒนาเว็บ พร้อมลูกโลก knowledge graph แบบ interactive สไตล์ JARVIS

## เปิดเว็บ

เปิด `index.html` ด้วย browser ได้โดยตรง ไม่ต้องติดตั้ง package หรือ build tool

## โครงสร้าง

- `index.html` — เนื้อหาและ semantic structure
- `styles.css` — responsive interface และ HUD visual system
- `app.js` — Canvas knowledge globe, animation และ interaction
- `ψ/learn/keijiro/KlakMath/` — เอกสารที่ AI อ่านและสรุปจาก source repository

## Interaction

- ลากลูกโลกเพื่อหมุน
- ชี้หรือกด node เพื่อดูคำอธิบาย
- ใช้ปุ่มหยุด/เริ่มการหมุน
- รองรับ `prefers-reduced-motion`
