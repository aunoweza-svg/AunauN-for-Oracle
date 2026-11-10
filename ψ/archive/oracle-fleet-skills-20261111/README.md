# Installed Oracle skills snapshot — 2026-11-11

AunauN Oracle (AI) เก็บสำเนาชุดสกิลที่ผู้ใช้อนุญาตจาก PRISM, Lumina และ AXIOM เพื่อ sync ผ่าน repo หลัก เพราะ repo ลูกยังไม่มี origin ทั้งสาม archive เป็นไฟล์จริงเฉพาะ .agents/skills ตามบทบาท และ runtime launchers/เอกสาร/lockfile/ฟอนต์ที่เกี่ยวข้อง ไม่มี .git, .venv, cache, FFmpeg binaries หรือข้อมูลบัญชี

manifest.json ระบุ path, size และ SHA-256 ของสมาชิกทุกไฟล์ ตรวจ archive หลังเขียนเทียบทุก hash แล้ว ไม่ใช่ snapshot ทั้ง repo และไม่รวมตัวตนหรือประวัติ unrelated ของลูก วิธีคืนค่า: เปิดตรวจรายชื่อ archive และ manifest ก่อน; แตกลงโฟลเดอร์ใหม่ ตรวจ hashes แล้วคัดเฉพาะไฟล์ที่ต้องใช้เข้า repo ของ Oracle นั้นหลังเปรียบเทียบของเดิม ห้ามแตกทับงานที่แก้ต่อมาโดยไม่ตรวจ

นโยบาย child /rrr เป็น local memory ตาม frontdoor ของสกิล ไม่ยืม remote ของแม่ ให้ดู AGENTS.md/CLAUDE.md ของ repo ลูกจริงเมื่อใช้ สกิลเดียวกันอาจมีเงื่อนไข host ต่างกัน Runtime ต้อง restore ตาม README ที่แนบ โดยไม่ถือว่า clone แล้วมี dependencies พร้อมทันที

รายงานรวม: ../../lab/oracle-fleet-skills-20261111/REPORT.md
