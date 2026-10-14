---
pattern: "Separate learning, installation, connection and live readiness; verify bulk skill contents against a pinned commit"
date: 2026-10-15
source: "rrr: Workshop MD File"
concepts: [skills, installation, provenance, mcp, categories, verification]
---

# Verified skill installation

- การศึกษา repo สร้างความรู้และเอกสาร การติดตั้งสกิลเพิ่ม instructions การลงทะเบียน MCP เพิ่มเครื่องมือ และการเชื่อมบัญชีให้เข้าถึงข้อมูลจริง ต้องรายงานสถานะแต่ละชั้นแยกกัน
- เพิ่มสกิลหลายตัวให้ pin source commit ตรวจทั้งจำนวน ไฟล์อ้างอิง และเนื้อหาเทียบ Git blob hash พร้อม manifest จะตรวจย้อนหลังและอัปเดตได้ง่ายกว่าอาศัยข้อความ Installed อย่างเดียว
- จัดหมวดธุรกิจด้วยดัชนีและคู่มือโดยรักษาชื่อสกิลต้นฉบับ เพื่อให้การค้นหาและ cross-reference ใช้ต่อได้ ตัวหมวดไม่ทำให้เนื้อหาทั่วไปกลายเป็นความเชี่ยวชาญเฉพาะอุตสาหกรรมโดยอัตโนมัติ
- พิมพ์ report เฉพาะ status, identity, inventory counts และ limitations ที่เกี่ยวข้อง เก็บ full JSON เป็น local evidence แทนการส่ง graph ทั้งหมดเข้า context
- Production MCP smoke เป็นหลักฐานว่า server เริ่มและตอบคำขอได้; ยังต้องตรวจ active agent session ก่อนกล่าวว่า agent เชื่อมแล้ว

หลักฐานรอบนี้: REA 6.5.0 MCP smoke ผ่าน; marketing skills 50 ตัว/322 ไฟล์ตรง source commit `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467`

[Retrospective](../retrospectives/2026-10/15/00.11_rea-tourism-marketing.md)
