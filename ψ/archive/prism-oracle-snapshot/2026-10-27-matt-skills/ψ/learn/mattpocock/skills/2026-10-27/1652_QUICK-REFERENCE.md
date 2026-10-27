# mattpocock/skills — คู่มืออ้างอิงฉบับย่อ

ศึกษา repository อิสระ [mattpocock/skills](https://github.com/mattpocock/skills) ที่ commit `59db609eb1e18aaf59b63284d0e52255aff0c63c` จากไฟล์ต้นฉบับ การอ่านครั้งนี้ไม่ได้ติดตั้งสกิล ตั้งค่า issue tracker หรือทดลอง workflow

## คืออะไร

เป็นชุดคำแนะนำสำหรับ AI coding agents ที่แยก workflow เป็นสกิลขนาดเล็ก เช่น ทำความเข้าใจโจทย์ สร้างต้นแบบ ตรวจบั๊ก ทดสอบ และ review ตาม [README](../origin/README.md) สกิลในชุดถูกแยกระหว่าง **user-invoked** (ผู้ใช้สั่งเรียก) กับ **model-invoked** (ผู้ใช้เรียกหรือโมเดลเลือกใช้เมื่อเหมาะสม) ข้อจำกัดจริงของ client และคำสั่งผู้ใช้ยังมีผลเหนือแนวทางของ repository

## สำรวจไฟล์ที่มีจริง

นับเฉพาะโฟลเดอร์ระดับถัดจาก `skills/<หมวด>/` ที่มี `SKILL.md` ใน checkout นี้:

- **engineering — 20:** ask-matt, code-review, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, implement, implement-spec, improve-codebase-architecture, pr, prototype, research, retro, setup-matt-pocock-skills, tdd, to-spec, to-tickets, triage, wayfinder, wizard
- **productivity — 7:** grill-me, grilling, handoff, teach, to-questionnaire, wait-what, writing-for-agents
- **in-progress — 7:** chief-of-staff, claude-handoff, loop-me, setup-ts-deep-modules, writing-beats, writing-fragments, writing-shape
- **misc — 4:** git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit
- **deprecated — 0:** ไม่มีโฟลเดอร์ที่มี `SKILL.md` ในหมวดนี้

รวม **38 โฟลเดอร์สกิล** ตามไฟล์ที่ตรวจ ไม่ใช่จำนวนสกิลที่ติดตั้งหรือเปิดใช้ใน PRISM; [engineering](../origin/skills/engineering/README.md), [productivity](../origin/skills/productivity/README.md), [misc](../origin/skills/misc/README.md) และ [deprecated](../origin/skills/deprecated/README.md) แสดงหมวดและการใช้งาน ส่วน [in-progress](../origin/skills/in-progress/README.md) ระบุว่าเป็น beta และไม่รวมใน plugin; รายการ README ของหมวดนี้ไม่ได้กล่าวถึง `chief-of-staff` แม้พบ `SKILL.md` จริง

## สิ่งที่น่าสนใจสำหรับ PRISM

| สกิล | ประโยชน์ที่เป็นไปได้ | สิ่งที่ควรตรวจ |
|---|---|---|
| [prototype](../origin/skills/engineering/prototype/SKILL.md) | ทดลองตรรกะหรือเปรียบเทียบ UI หลายแนวทางก่อนพัฒนาจริง | ตัวอย่างเป็นต้นแบบชั่วคราว; workflow ต้นฉบับเสนอการเก็บผลใน branch/issue ซึ่งต้องสอดคล้องกับคำสั่งและสิทธิ์ของงาน |
| [diagnosing-bugs](../origin/skills/engineering/diagnosing-bugs/SKILL.md) | สร้างและย่อวิธีทำซ้ำ จัดลำดับสมมติฐาน ตรวจทีละข้อ แล้วตรวจผลแก้ | ปรับขนาดกระบวนการตามความรุนแรงและบริบท ไม่ถือว่าทุกปัญหาต้องมีขั้นตอนเท่ากัน |
| [tdd](../origin/skills/engineering/tdd/SKILL.md) | ใช้ red/green เป็นรอบเล็กและทดสอบพฤติกรรมผ่าน interface | ต้นฉบับกำหนดให้ยืนยัน seams ก่อนเขียน test; คำสั่งผู้ใช้และกติกา runtime ที่ใช้งานอยู่มีลำดับสูงกว่า |
| [code-review](../origin/skills/engineering/code-review/SKILL.md) | ตรวจแยกความสอดคล้องมาตรฐานกับสิ่งที่ spec ขอ | ต้องมีจุดอ้างอิง diff และอาจต้องใช้ spec, tracker และ parallel agents; หากขาดข้อมูลให้ระบุขอบเขต |
| [improve-codebase-architecture](../origin/skills/engineering/improve-codebase-architecture/SKILL.md) | หาโอกาสลดความซับซ้อนและปรับความสามารถในการทดสอบ | ต้นฉบับเสนอรายงาน HTML และเรียกใช้เมื่อผู้ใช้สั่ง; ใช้ตามเครื่องมือและสิทธิ์ที่มีจริง |
| [handoff](../origin/skills/productivity/handoff/SKILL.md) และ [teach](../origin/skills/productivity/teach/SKILL.md) | ส่งต่อบริบทหรือจัดการเรียนรู้ต่อเนื่อง | อ่านวิธีจัดเก็บของแต่ละสกิลและหลีกเลี่ยงการสร้างบันทึกซ้ำกับ workflow ของโปรเจกต์ |

## Setup และผลข้างเคียง

[README](../origin/README.md) เสนอวิธีติดตั้งผ่าน plugin สำหรับ Codex หรือไฟล์แบบแก้ไขได้ โดยบอกให้เลือกวิธีเดียวเพื่อลดสำเนาซ้ำ และเสนอเรียก [setup-matt-pocock-skills](../origin/skills/engineering/setup-matt-pocock-skills/SKILL.md) เพื่อกำหนด issue tracker, labels และตำแหน่งเอกสารของโปรเจกต์ การ setup อาจแก้ไฟล์คำสั่งและเอกสารใน repo; tracker แบบ GitHub/GitLab ต้องมีเครื่องมือและปลายทางที่พร้อม

บาง workflow มีผลต่อภายนอก: [to-spec](../origin/skills/engineering/to-spec/SKILL.md) ระบุการส่ง spec ไป issue tracker ส่วน prototype กล่าวถึง branch และ issue ดังนั้นต้องตรวจขอบเขตที่ผู้ใช้มอบหมาย สิทธิ์ และกติกาการสื่อสาร/เผยแพร่ก่อนลงมือ การอ่านครั้งนี้ไม่ได้ดำเนินการเหล่านั้น
