---
date: 2026-10-27
source: "user-requested skill installation"
concepts: [skills, coding, prototype, debugging, code-review, tdd]
---

# PRISM: สกิลวิศวกรรมสี่ตัว

ติดตั้งจาก `mattpocock/skills` commit `59db609eb1e18aaf59b63284d0e52255aff0c63c` ด้วย Codex skill-installer ไปยัง `.agents/skills/` ของ PRISM:

| Skill | Purpose | Source files | Installed files | SHA-256 mismatches |
|---|---|---:|---:|---:|
| prototype | ทดลอง UI หรือ logic ก่อนสร้างจริง | 4 | 4 | 0 |
| diagnosing-bugs | สร้าง feedback loop และวิเคราะห์สาเหตุ | 3 | 3 | 0 |
| code-review | ตรวจมาตรฐานและข้อกำหนดของงาน | 2 | 2 | 0 |
| tdd | พัฒนาทีละส่วนโดยทดสอบพฤติกรรม | 4 | 4 | 0 |

ตรวจ SHA-256 ทุกไฟล์เทียบ checkout ต้นทาง รวม 13 ไฟล์ ไม่ได้แก้เนื้อหาสกิล ไม่ได้รันทดสอบ workflow จริงหรือเชื่อม issue tracker; การติดตั้งใน workspace ไม่ยืนยันว่ารายการสกิลถูกโหลดใน session ปัจจุบัน ให้เปิด PRISM workspace และเริ่ม session ใหม่แล้วตรวจ

`code-review` ต้นฉบับอาจต้องใช้ spec, issue tracker และ parallel agents; `tdd` อ้าง `codebase-design` เมื่อจำเป็นต้องวิเคราะห์ interface และสกิลนั้นไม่ได้ติดตั้งในรอบนี้ ตรวจข้อกำหนดและเครื่องมือจริงตามโจทย์เสมอ และให้คำสั่งผู้ใช้กับกติกาของ host มีลำดับเหนือคำแนะนำจากสกิล
