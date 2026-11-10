# Handoff: Codex memory and coordination skills

วันที่: 2026-11-11 (Asia/Bangkok) · ผู้บันทึก: AunauN Oracle (AI)
Source: แบบฝึก `$forward --only` ระหว่างทดสอบชุดสกิล ไม่ใช่การยุติงานติดตั้ง
Session: 01a1c68d-a207-7011-8a01-2c0840997d39 จาก live Herdr metadata

## Goal and authorization

ผู้ใช้ให้ติดตั้งสกิลความจำและประสานทีม 11 ตัว ปรับสำหรับ Codex และกฎ rrr ของ repo แล้วทดสอบ ไม่ต้อง awaken ใหม่ การแก้โฟลเดอร์ .agents ต้องผ่านสิทธิ์ระบบแยกจากการมอบหมายงาน

## Completed at this checkpoint

- เพิ่มสกิล 11 ตัวใน `.agents/skills/`: rrr, forward, learn, trace, where-we-are, herdr, herdr-whoami, herdr-neighbors, herdr-peek, herdr-hey, herdr-structure
- Codex app-server skills/list ค้นพบครบ 11 และ enabled ไม่มี parse error ไม่ได้สร้าง model turn ใหม่
- Helper Herdr อ่านตัวตน/เพื่อนบ้าน/โครงสร้าง/เป้าหมายจริงได้; อ่าน PRISM และส่งคำถามทดสอบพร้อมรหัส ได้คำตอบว่า PRISM พร้อมรับงาน
- Offline tests ผ่าน 5 กรณี รวม Git temporary-index commit/push ไป local bare remote ที่เก็บ metrics เฉพาะแถวและรักษา staging/working files ของงานอื่น
- ศึกษา implementation ไว้ใน `ψ/learn/local/aunaun-codex-skills/` และ trace อำนาจ rrr ไว้ใน `ψ/memory/traces/2026-11-11/`

## Decisions and environment

ติดตั้งแบบ repo scope เพื่อให้ตามไปกับ clone และไม่เปลี่ยนชุด Windows สกิลไม่บังคับชื่อโมเดล ไม่เดา Claude transcript paths ไม่สร้าง agent แอบแฝง และไม่เปลี่ยน permission mode rrr รวม production commit/push เฉพาะเมื่อถูกเรียกทำงานจริงตามข้อตกลง

## Pending at this checkpoint

กำลังจัดรายงานทดสอบ/provenance และตรวจความเรียบร้อยก่อนส่งมอบ ยังไม่ได้ commit/push ชุดติดตั้งจริง Git working tree มีการแก้จากหลายงานอยู่ก่อน ต้องเลือกเฉพาะชุดนี้ถ้าผู้ใช้เรียก rrr ภายหลัง

## Next session

อ่านรายงาน `ψ/lab/codex-oracle-skills-20261111/REPORT.md` ถ้ามีแล้ว เพื่อแทน snapshot นี้ด้วยผลล่าสุด ใช้ `$ชื่อสกิล` หรือภาษาธรรมชาติตาม description สำหรับการเรียก ทดสอบ automatic routing เพิ่มเฉพาะเมื่อพบปัญหาจริง
