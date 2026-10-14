---
pattern: "Marketing Skills combines shared product context with task-specific workflows; service connections are separate"
date: 2026-10-14
source: "learn: aunoweza-svg/marketingskills"
concepts: [learn, marketing, agent-skills, tourism, shared-context, analytics]
---

# Learned Marketing Skills

อ่าน source ที่ commit `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467` โดยไม่ติดตั้งหรือรัน integration

- พบ 50 สกิลและ 66 CLI; manifest รุ่น 2.11.29 คลังสกิลให้ agent ใช้ความรู้และ workflow ไม่ใช่ autonomous agent
- แกนหลัก `product-marketing` เก็บ `.agents/product-marketing.md` ให้สกิลอื่นใช้ร่วมกัน สร้างบริบทบริการ กลุ่มลูกค้า และจุดขายก่อนเลือกงานเฉพาะด้าน
- การเพิ่มสกิลไม่เชื่อมบัญชีหรือสร้าง scheduler เอง ส่วน tool integration ต้องมีบริการและ credentials ตามโจทย์ที่ได้รับอนุญาต
- `tools/clis/ga4.js` มี dry-run ที่ปิดค่า Authorization แต่รายงานยังผ่านการตรวจ token ก่อนเริ่ม จึงไม่ควรถือว่า preview ทุกรูปแบบทำได้โดยไม่มี environment token

สำหรับ Tourism Marketing อาจประยุกต์ customer research, copywriting, SEO, CRO และ analytics โดยเปลี่ยนบริบท SaaS/B2B เป็นบริการท่องเที่ยว และวัดผลจริง ข้อนี้เป็นข้อเสนอประยุกต์ ไม่ใช่ผลทดสอบ

[Learning hub](../../learn/aunoweza-svg/marketingskills/marketingskills.md)
