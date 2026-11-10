---
pattern: "ตรวจ context จาก shell, agent, app-server และ tool executor แยกจากสิทธิ์ socket และยืนยันงานจริงแบบ end-to-end"
date: 2026-11-11
source: "rrr: AunauN-for-Oracle"
concepts: [herdr, codex, app-server, sandbox, agent-coordination]
---

# Herdr และ Codex: context ไม่เท่ากับ socket access

ใน WSL การตรวจ `printenv HERDR_ENV` ใน shell ของ Herdr ให้ค่า 1 ไม่รับประกันว่า command executor ของ Codex จะได้รับค่าเดียวกัน การตรวจ process ของเซสชันนี้พบ Codex ที่อยู่ใน pane มี Herdr context แต่ shared app-server daemon ไม่มี สาเหตุที่ค่าหายยังไม่ยืนยันแน่นอน

การเปิด `codex --no-daemon -a on-request` ใน shell Herdr ทำให้เครื่องมือของ Codex เซสชันทดลองเห็น context และขออนุมัติเมื่อ sandbox บล็อก socket ได้ ผู้ใช้รายงานการส่งและอ่านข้อความทดสอบจาก Lumina ผ่าน Herdr สำเร็จ แต่บางเซสชันยังไม่มี context และงานจริงครั้งถัดมาส่งผ่าน Codex messaging แทน จึงยังไม่ยืนยัน workflow Herdr เสถียร

อย่าตั้ง HERDR_ENV เองเพื่อข้ามข้อกำหนด อย่าปิด sandbox ตรวจ agent identity, session, pane, transport, delivery และคำตอบของงานจริงแต่ละรอบ และรักษา tmux/maw ไว้จน continuity และการทำงานแทนกันผ่านการทดสอบ
