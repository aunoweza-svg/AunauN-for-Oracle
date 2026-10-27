---
pattern: "ตรวจการติดตั้งแยกจากการเชื่อมต่อและความพร้อมวิเคราะห์จริง รวมข้อจำกัดของ OS policy"
date: 2026-10-27
source: "rrr: AunauN-for-Oracle"
concepts: [installation, readiness, mcp, windows, portability]
---

# ตรวจความพร้อมเป็นชั้นก่อนสรุปว่าเครื่องมือใช้ได้

การติดตั้งแพ็กเกจและการลงทะเบียน MCP ไม่เท่ากับความพร้อมของแต่ละ operation ควรทดสอบทั้งการเริ่ม server รายการเครื่องมือ และงานตัวอย่างที่ตรงเป้าหมาย แยกผลสำเร็จจากข้อผิดพลาดของ OS policy และ provider พร้อมบันทึกหลักฐานโดยไม่ปิดกลไกป้องกัน

Python embeddable อาจไม่เพิ่ม script directory ใน `sys.path`; wrapper แบบเจาะจงช่วยให้สคริปต์ค้น module ข้างเคียงได้โดยไม่แก้เครื่องทั่วระบบ สำหรับ npm ที่ตรวจใบรับรองไม่ผ่าน ให้ตรวจการใช้ system CA แทนการปิด TLS verification และบันทึกการย้าย workspace ที่ทำให้ absolute registration paths ใช้ไม่ได้
