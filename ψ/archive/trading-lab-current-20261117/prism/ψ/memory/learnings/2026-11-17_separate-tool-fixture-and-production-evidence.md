---
date: 2026-11-17
source: Trading Lab reviews and design-md-validator installation in current PRISM conversation
concepts: [evidence-scope, skill-installation, fixtures, reference-parity, communication]
---

# ส่งมอบเครื่องมือและหลักฐานให้ผู้ใช้รู้ว่าเปิดอะไรต่อ

เมื่อติดตั้งหรือเรียนสกิล ให้บอกชื่อและที่อยู่ของ3อย่าง: คู่มือ/เครื่องมือที่ติดตั้ง, ไฟล์ตัวอย่างที่ใช้ทดลอง และเอกสารงานจริงที่มีอยู่หรือยังไม่มี กรณีนี้design-md-validatorติดตั้งแล้วและ7smokecasesผ่าน แต่ยังไม่ได้สร้างDESIGN.mdของTradingLab ผู้ใช้จึงต้องการคำอธิบายว่าไฟล์ที่ทดลองมีอะไร ไม่ใช่แค่คำตอบว่าพร้อมตรวจแล้ว

ตรวจผลตามชั้นของหลักฐานด้วย: CLIexit0อาจมีcontrastwarning, fixturelintผ่านไม่รับรองUIจริง, browsermockผ่านไม่ยืนยันfeedจริง และSpot/HAforming-barsampleที่ตรงความละเอียดแสดงผลไม่พิสูจน์ทุกแท่ง/ทุกสัญญาณ/ทุกTF

งานreviewระหว่างsourceกำลังเปลี่ยนควรผูกreproกับhash/revisionและschemaของevidence แยกfailureของharnessออกจากdefectของแอป ตรวจrawbarsไม่ถูกแปลงทับเมื่อทำHA และแยกราคาดิบจากราคาเฉลี่ยที่แสดงกับinputของindicator ไม่ส่งค่าHAเข้าสูตรบัญชีเดิมโดยปริยาย

หลักฐาน: ψ/lab/design-md-validator-20261117/{install-manifest.json,smoke-results.json,valid.DESIGN.md}, ψ/learn/fabricioctelles/skills/2026-11-17_design-md-validator.md และรายงานOWN-CHARTของAXIOMที่อ้างในretrospectiveรอบนี้ ขอบเขตคือสิ่งที่อ่าน/รันในเซสชัน ไม่ใช่คำรับรองproductionDESIGN.mdหรือfullTradingViewparity
