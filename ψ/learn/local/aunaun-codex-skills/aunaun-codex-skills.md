# AunauN Codex skills — implementation study

ศึกษาโดย AunauN Oracle (AI), 2026-11-11 · แบบฝึก `$learn --fast .agents/skills/herdr`

## Source identity and coverage

เป้าหมายคือชุดสกิลเฉพาะ repository ที่ `.agents/skills/` ของ AunauN ไม่ใช่แอป Herdr ต้นฉบับ ศึกษา SKILL.md ทั้ง 11 ตัว และ helper Python สองไฟล์ที่เพิ่งติดตั้ง อ่านการเชื่อมโยงกับกฎ rrr ของ repository โดยไม่เปลี่ยนตัวตน Oracle

## Architecture

- แต่ละโฟลเดอร์มี SKILL.md พร้อม name/description เพื่อให้ Codex ค้นพบ workflow ได้ ไม่ใช่ daemon หรือ agent ใหม่หนึ่งตัวต่อสกิล
- สกิลความจำ 5 ตัวเป็นคำสั่งสำหรับผู้ช่วยให้สร้าง/อ่านเอกสารตามบริบท ไม่มีโมเดลหรือ background process ตายตัว
- สกิลประสานทีม 6 ตัวใช้ binary Herdr ที่ติดตั้งอยู่และ caller context จริง
- `herdr/scripts/herdr_inspect.py` แยกการเรียก CLI, การเลือก metadata, การยืนยัน caller และการแก้เป้าหมาย ใช้เฉพาะคำสั่งอ่านสถานะ ไม่มี send/close/start
- `rrr/scripts/stage-metrics-row.py` สร้าง blob สำหรับ Git index จาก HEAD กับแถวที่เลือก ไม่เขียนทับ metrics ใน working tree

## Source pointers

- [Herdr entrypoint](../../../../.agents/skills/herdr/SKILL.md)
- [Read-only helper](../../../../.agents/skills/herdr/scripts/herdr_inspect.py): `call`, `record`, `inspect`, `main`
- [RRR workflow](../../../../.agents/skills/rrr/SKILL.md)
- [Metrics index helper](../../../../.agents/skills/rrr/scripts/stage-metrics-row.py): `stage`
- [Offline behavioral tests](../../../lab/codex-oracle-skills-20261111/test_skills.py)

## Actual verification

Native Codex skills/list ค้นพบสกิลทั้ง 11 ตัวพร้อม enabled ไม่มี load error; เป็นการตรวจ discovery โดยไม่ได้สร้าง model turn ใหม่ การทดลอง helper อ่าน caller, neighbors, structure และ resolve PRISM ผ่าน Herdr socket จริงได้ การทดสอบ offline ใช้ temporary Git repo และ local bare remote เพื่อยืนยัน scope ของ commit/push

## Limits

ยังไม่ได้ทดสอบทุกคำพูดที่ใช้เลือกสกิลอัตโนมัติในเซสชันใหม่ ไม่ได้ทำ push ชุดติดตั้งไป GitHub และไม่ถือผล local Git fixture ว่าเป็นผลยืนยัน credentials/network ของ production ไม่ได้ติดตั้งหรือปลุก Oracle ใหม่
