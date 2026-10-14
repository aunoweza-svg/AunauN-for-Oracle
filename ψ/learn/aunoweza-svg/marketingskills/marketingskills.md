# Marketing Skills Learning Index

## Source

- GitHub: https://github.com/aunoweza-svg/marketingskills
- Reviewed commit: `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467`
- Origin: `./origin/` — Windows junction to `C:/Users/aunow/AppData/Local/Temp/codex-learn-aunoweza-marketingskills`.
- Temporary checkout may be removed by OS cleanup; generated documents remain in this vault.
- Scope: source/documentation review only. No skill installation, account connection, API calls, or runtime verification.

## Explorations

### Installation — 2026-10-15

ติดตั้งครบ 50 สกิลใน `C:/Users/aunow/.codex/skills` ด้วย helper ของ Codex จาก fork และ commit ที่ระบุข้างต้น จัดหมวดใช้งานเป็น Tourism Marketing ตรวจไฟล์ 322 ไฟล์ครบและตรงกับ Git blob ของต้นทาง ไม่มีการเชื่อมบัญชีหรือเรียก API บริการการตลาด

- [ดัชนี Tourism Marketing](TOURISM-MARKETING.md)
- [Installation manifest](tourism-marketing-installation.json)

### 2026-10-14 2353 — standard, 3 agents

- [Architecture](2026-10-14/2353_ARCHITECTURE.md)
- [Code snippets and templates](2026-10-14/2353_CODE-SNIPPETS.md)
- [Quick reference and Tourism Marketing applications](2026-10-14/2353_QUICK-REFERENCE.md)

## Key insights

1. เป็นคลัง Agent Skills ด้านการตลาด 50 สกิล พร้อม CLI JavaScript 66 ไฟล์ ไม่ใช่บริการ agent อิสระ Manifest ระบุรุ่น 2.11.29 และยังใช้ข้อมูลผู้สร้าง/ลิงก์ upstream ของ Corey Haines แม้ repo ที่ศึกษาคือ fork ของผู้ใช้
2. `product-marketing` สร้างบริบทธุรกิจร่วมที่ `.agents/product-marketing.md`; สกิลเฉพาะด้าน เช่น `copywriting`, `cro`, `customer-research` อ่านบริบทนี้ก่อนทำงาน การติดตั้งสกิลกับการเชื่อมบริการ analytics/ads เป็นคนละขั้นตอน
3. แนวทางประยุกต์กับ Tourism Marketing: เริ่มบริบทบริการและนักท่องเที่ยว → วิจัยลูกค้า → เขียนหน้าแพ็กเกจและคอนเทนต์ → วางการวัดผลและทดลองปรับ conversion นี่เป็นการอนุมานจากหน้าที่สกิล ยังไม่ได้ทดสอบกับธุรกิจจริง

## Review

ตรวจเอกสารทั้งสามส่วนเทียบกับไฟล์ source ที่อ้างอิง ตรวจจำนวนสกิล/CLI, shared context, manifest และ GA4 request preview ไม่มีคำศัพท์โครงสร้างจาก host ที่รายการ contamination check กำหนดปรากฏในเอกสาร ผลตรวจนี้ไม่ใช่การรับรองคุณภาพทุกสกิลหรือทุก integration
