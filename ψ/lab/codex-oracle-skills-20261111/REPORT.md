# Codex memory and coordination skills — installed and tested

วันที่ 2026-11-11 · จัดทำโดย AunauN Oracle (AI)

ติดตั้งชุดเฉพาะ repository **11 สกิล / 14 ไฟล์** ใน `.agents/skills/` ปรับให้ Codex ทำงานกับความจำและ Herdr ของโปรเจกต์นี้ได้ รักษาตัวตน AunauN และชุด Windows เดิม ไม่ได้เพิ่ม Oracle/agent ใหม่หรือเปลี่ยน global config

## วิธีเรียก

ใช้ `$rrr`, `$forward`, `$learn`, `$trace`, `$where-we-are`, `$herdr`, `$herdr-whoami`, `$herdr-neighbors`, `$herdr-peek`, `$herdr-hey`, `$herdr-structure` ใน Codex หรือใช้ภาษาธรรมชาติตามคำอธิบาย เช่น “ถาม PRISM ว่าตอนนี้ทำอะไรอยู่”

Native `skills/list` ของ Codex ค้นพบครบทั้ง 11 ตัวเป็น enabled ไม่มี load error ดู [ผล discovery](evidence/codex-discovery.json) ไม่ได้สร้าง thread/model turn เพื่อทำการตรวจนี้ รายการสกิลใหม่พร้อมให้ host ใช้ในเทิร์นถัดไป ถ้าหน้าจอเก่ายังไม่แสดง ให้ตรวจ `/skills` หรือเปิด Codex ใหม่ที่ root ของโปรเจกต์นี้

`/rrr` ในกฎโครงการยังหมายถึง workflow เดิม การเรียกที่รองรับแบบสกิลโดยตรงใช้ `$rrr` หรือข้อความ “ทำ /rrr ให้หน่อย” ไม่ได้เพิ่มหรือทดสอบ custom slash parser ของ CLI แยกต่างหาก

## ทดสอบรายตัว

| สกิล | ผลที่ตรวจจริง | หลักฐาน/ข้อจำกัด |
|---|---|---|
| rrr | รูปแบบและ native discovery ผ่าน; light fixture + selective metrics + commit/push ผ่าน | [integration](evidence/rrr-integration.json); remote เป็น local bare repo ใน /tmp ไม่ใช่ผลทดสอบ GitHub production |
| forward | ใช้แนวทางสกิลเขียน handoff ระหว่างงาน ระบุ scope ผลจริงและขั้นต่อไป | [handoff](../../inbox/handoff/2026-11-11_01-19_codex-skills-test.md); ไม่เปลี่ยน mode หรือสั่ง commit |
| learn | ศึกษาชุดสกิลจริงพร้อม source pointers และข้อจำกัด | [study](../../learn/local/aunaun-codex-skills/aunaun-codex-skills.md); ไม่รัน codebase อื่นหรือสืบทอด architecture ผิดเป้าหมาย |
| trace | ค้นอำนาจ rrr และข้อกำหนด metrics จาก AGENTS.md กับ memory จริง | [trace](../../memory/traces/2026-11-11/0119_rrr-auto-push-authority.md); ไม่มี Oracle MCP หรือ session mining |
| where-we-are | สรุป current context แยกเสร็จ/กำลังทำ/ไม่ได้ทำ โดยไม่พึ่ง recap | [status check](evidence/where-we-are.md) |
| herdr | ใช้ installed CLI จริง; context/socket guard และ read-only helper ผ่าน | outside-Herdr negative test ไม่เรียก socket; sandbox denial ถูกรายงานก่อนใช้ escalation |
| herdr-whoami | ระบุ caller จริง cwd, branch และ conversation ได้ | [whoami](evidence/herdr-whoami.json) |
| herdr-neighbors | แยกไม่มี geometric neighbor ออกจากสมาชิกใน workspace ได้ | [neighbors](evidence/herdr-neighbors.json); ทั้งสี่ตัวอยู่คนละแท็บ |
| herdr-peek | อ่าน PRISM ที่ยืนยัน repo/conversation แล้วโดยไม่ส่งข้อความก่อน | อ่านพบคำตอบเดิมและ prompt พร้อมรับงาน; ไม่สรุปว่ากำลังทำโค้ดจากบันทึกเก่า |
| herdr-hey | ส่งคำถามทดสอบไป PRISM และอ่านคำตอบใหม่หลังคำถามได้ | [round-trip](evidence/prism-roundtrip.json), รหัส `AUNAUN-SKILLS-11-HEY-20261111`; PRISM ตอบว่าพร้อมรับงาน |
| herdr-structure | สร้างต้นไม้ workspace/tab/pane จากข้อมูลสดและทำเครื่องหมาย caller | [structure](evidence/herdr-structure.json); แสดง ownership ของ workspace แยกจาก cwd ของ pane |

ตารางนี้แยก behavioral exercise ที่ผู้ช่วยปัจจุบันทำตามสกิล, การทดสอบ helper และ native discovery ออกจากกัน ยังไม่ได้ทดสอบการเลือกสกิลอัตโนมัติทุกสำนวนผ่าน model session ใหม่ หรือสถานการณ์ remote/หลัง reboot ทั้งหมด

## สิ่งที่ปรับจากต้นฉบับ

- ความจำใช้บริบท/metadata ของ Codex และไฟล์จริง ไม่เดา path Claude JSONL หรือชื่อโมเดล
- where-we-are ทำงานได้เอง ไม่เรียก recap ที่ยังไม่มี
- learn/trace ไม่กำหนดจำนวน agent หรือสร้างงานขนานเอง
- forward ไม่บังคับ plan mode/approval flow และไม่ commit/push โดยปริยาย
- rrr คงรูป retrospective/lesson/metrics และให้กฎผู้ใช้ใน repo ทับ default no-staging ของต้นฉบับ ระบุข้อยกเว้น “ยังไม่ push” ชัดเจน
- Git sync เลือกไฟล์/hunk/metrics เฉพาะงาน รักษา staging เดิม ใช้ temporary index เมื่อจำเป็น ตรวจปลายทางและ remote หลัง push
- Herdr ใช้ binary/skill ของรุ่นที่ติดตั้ง ยืนยันตัวตนก่อนอ่าน/ส่ง แยก lifecycle กับการเสร็จงาน และไม่ใช้การเปลี่ยน env/permission เป็นทางลัด
- Helpers ชื่อ `herdr_inspect.py` และ `stage-metrics-row.py`; ตัวแรกอ่านอย่างเดียว ตัวหลังแก้เฉพาะ Git index เมื่อเรียกโดยตรง

## Offline behavioral verification

รัน `python3 ψ/lab/codex-oracle-skills-20261111/test_skills.py` ผ่าน 5 test groups พร้อม frontmatter validation ของทั้ง 11 ตัว ครอบคลุม:

1. ไฟล์ที่ติดตั้งและรูปแบบสกิล
2. ไม่มี HERDR_ENV แล้วต้องหยุดก่อนเรียก socket
3. ไม่มี neighbor key และ stale pane env ไม่ทำให้เดาเพื่อนบ้านผิด
4. เป้าหมายซ้ำต้องไม่เลือกเอง และไม่ส่งหาตัวเอง
5. Git fixture มี staged/unstaged/untracked ของคนอื่นและ metrics หลาย session: commit เฉพาะงาน, push local remote, ตรวจ SHA ตรง, รักษา CRLF/working bytes/staging เดิม, ปฏิเสธ duplicate row และ staged metrics ที่ไม่ใช่ของเรา

Native discovery ตรวจแยกด้วย `check_discovery.py` ซึ่งเปิด app-server ชั่วคราวที่ตัวเองเป็นเจ้าของและปิดเมื่อจบ ไม่สร้าง model turn หรือไปปิด Herdr server

## Sources and provenance

เป็นการปรับใหม่โดย AunauN Oracle ไม่ใช่สำเนาที่อ้างว่าเหมือน upstream ทุกไบต์ อ้างอิง:

- Oracle skills จาก checkout `.oracle-skills-source` revision `9feea093cc853fa0cb4feeb83fcf4b90e0a9c24f`: rrr, TEMPLATE/HOSTS, forward, learn, trace, where-we-are
- [บท Herdr full skills](../../learn/aiexpo/sources/2026-11-08_herdr-skills-full.md) และ installed `herdr --skill` ของ 0.9.5
- AGENTS.md, CLAUDE.md และ `ψ/memory/learnings/2026-10-26_rrr-auto-push-workflow.md` ของ repo นี้
- รูปแบบสกิล/validation จาก system skill-creator; ตำแหน่ง repo-scope และ discovery ตรวจด้วย native Codex ของเครื่องจริง
- [Manifest และ hash ไฟล์ติดตั้ง](installation.json)

## ข้อจำกัดและสถานะ Git

การเรียก Herdr ต้องอยู่ใน managed pane จริงและผ่านสิทธิ์ socket ของ host ยังอาจมี system approval ตามนโยบาย ไม่ปิด sandbox เพื่อให้ผ่าน การตรวจ helper ตามรูปแบบ terminal ปัจจุบันไม่รับประกันว่าอ่านทุก dialog ของอนาคตได้

งานนี้ไม่ได้เรียก rrr เพื่อเผยแพร่ repository จริง จึงยังไม่มี production commit/push ของชุดติดตั้ง และไม่ได้ทดสอบ GitHub credentials/network ซ้ำ ผล offline remote ไม่ใช้รับรองส่วนนี้ เมื่อผู้ใช้เรียก rrr จริงให้ทำ workflow ต่อเนื่องตามข้อตกลง ไม่ขอ workflow approval ซ้ำ
