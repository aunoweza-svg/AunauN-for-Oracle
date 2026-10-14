---
pattern: "Validate installation in layers: content, runtime, startup, provider access, and analytic validity"
date: 2026-10-15
source: "rrr: Workshop MD File"
concepts: [installation, verification, skills, dependencies, finance, portability]
---

# Installation evidence ladder

1. **Content integrity** — pin source commit; ตรวจไฟล์และบันทึก namespace adaptations เมื่อชื่อชน
2. **Runtime compatibility** — environment แยกและ dependency check; เก็บ Python version และ resolved distributions เพราะ source SHA ไม่ล็อก dependency ranges
3. **Startup behavior** — ตรวจ CLI และ installed-package UI/resources ด้วย headless navigation ตามขอบเขตงาน
4. **Provider access** — ต้องทดสอบ data/model connection แยกเมื่อได้รับโจทย์และมี credentials ที่เลือกแล้ว การติดตั้งไม่ยืนยันสิทธิ์เข้าถึงบริการ
5. **Analytic validity** — ผลวิเคราะห์หรือ backtest ต้องตรวจข้อมูล สมมติฐาน leakage และต้นทุนจริง การเปิดโปรแกรมผ่านไม่ใช่หลักฐานผลตอบแทน

เก็บ UV_CACHE_DIR และ runtime options ให้เหมือนกันใน install/check/freeze เพื่อไม่ให้ verification เผลอเขียน default path ที่ติด sandbox

การ sync GitHub ย้ายความจำ เอกสาร และ manifests ได้ แต่ global skills, virtualenv, provider credentials และ portfolio ledger ต้องมีขั้นตอนเตรียมบนแต่ละเครื่องเอง

หลักฐานรอบนี้: Finance Skills 26 ตัว/99 ไฟล์ โดยมี alias adaptation 1 จุด; AIHF 2.5.0 บน Python 3.12.15 มี 93 distributions และ CLI/headless smoke ผ่าน แต่ยังไม่มี live market/model test

[Retrospective](../retrospectives/2026-10/15/00.54_finance-research-installation.md)
