# AunauN — Codex skills verified 2026-11-11

ติดตั้ง/ปรับชุดที่ผู้ใช้อนุญาตสำหรับ Codex/WSL แล้ว รวมชุดบทบาท 16 ตัว

พื้นฐาน 11 ตัว: `rrr`, `forward`, `learn`, `trace`, `where-we-are`, `herdr`, `herdr-whoami`, `herdr-neighbors`, `herdr-peek`, `herdr-hey`, `herdr-structure`

เฉพาะงาน: `product-marketing`, `customer-research`, `marketing-plan`, `analytics`, `ab-testing`

ชุดการตลาดเป็น instructions และ references; ตรวจข้อมูลกลุ่มเป้าหมาย/ตัวชี้วัดก่อนสรุป ไม่เชื่อมบัญชีโฆษณาจากการติดตั้งนี้

## ความจำและ Git

เมื่อผู้ใช้เรียก `/rrr` ให้บันทึกความจำ แล้ว commit/push เฉพาะไฟล์งานตาม AGENTS.md และ workflow เดิม ตรวจ remote และผล push จริง

รักษาตัวตนเดิม ไม่เรียก awaken ใหม่ ไม่สร้าง agent เพิ่มอัตโนมัติ และไม่เปลี่ยนคำสั่งติดตั้งให้เป็นสิทธิ์เผยแพร่/ซื้อขาย

## หลักฐานและข้อจำกัด

Native Codex app-server skills/list ตรวจ cwd ของ repo นี้แล้ว: required 16, repo-local 20, enabled รวมระบบ 25, discovery errors 0; ตรวจ frontmatter และ supporting files ตาม install manifest ผ่าน

ทดสอบเครื่องมือจริงใน fleet: UI search, การคำนวณ/กราฟการเงิน, Yahoo Finance, Hyperliquid public mids และวิดีโอ H.264/AAC พร้อมซับไทยผ่าน ตรวจภาพเรนเดอร์แล้ว คำแนะนำที่เป็น workflow ไม่ได้หมายความว่าได้ทำแคมเปญจริง สร้าง issue/PR จริง หรือทำ valuation บริษัทครบกระบวนการแล้ว

รายงานรวมอยู่ใน repo AunauN: ψ/lab/oracle-fleet-skills-20261111/REPORT.md พร้อม discovery, hashes, backups และผลทดสอบ Windows skills ต้นทางไม่ถูกแก้

เปิด session ใหม่ใน repo นี้หาก session ปัจจุบันยังไม่แสดงสกิล แล้วเรียกชื่อเช่น `$learn`, `$trace`, `$rrr` หรือชื่อสกิลเฉพาะงานตาม host ที่ใช้งาน
