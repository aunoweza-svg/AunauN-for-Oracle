# สถาปัตยกรรม repository `mattpocock/skills`

ศึกษาซอร์สอิสระที่ commit `59db609eb1e18aaf59b63284d0e52255aff0c63c` เท่านั้น ไม่ได้ติดตั้งสกิลหรือทดลอง plugin

## โครงสร้างที่ตรวจพบ

- [`skills/engineering/`](../origin/skills/engineering/) มี 20 โฟลเดอร์ที่มี `SKILL.md` สำหรับงานวิศวกรรม เช่น ออกแบบ ทดสอบ วินิจฉัย bug และทบทวนโค้ด; [`skills/productivity/`](../origin/skills/productivity/) มี 7 สกิลสำหรับการสื่อสารและทำงานร่วมกัน
- [`skills/in-progress/`](../origin/skills/in-progress/) มี 7 ไฟล์ `SKILL.md` ณ commit นี้; README ของโฟลเดอร์อธิบายว่าเป็น beta และไม่รวมใน plugin; [`skills/misc/`](../origin/skills/misc/) มี 4 สกิลที่ไม่ได้โปรโมตใน plugin; [`skills/deprecated/`](../origin/skills/deprecated/) ไม่มี `SKILL.md` ณ commit นี้ จำนวนได้จากการนับไฟล์จริง ไม่ใช่การนับรายการใน README
- แต่ละสกิลมี `SKILL.md` เป็นคำอธิบายและวิธีทำงาน บางสกิลมีเอกสารหรือไฟล์ช่วยประกอบในโฟลเดอร์เดียวกัน; ตัวอย่าง [`tdd/SKILL.md`](../origin/skills/engineering/tdd/SKILL.md) อ้าง `tests.md` และ `mocking.md`
- [`docs/`](../origin/docs/), [`scripts/`](../origin/scripts/), [`.claude-plugin/`](../origin/.claude-plugin/), [`.github/workflows/`](../origin/.github/workflows/) และ [`.agents/`](../origin/.agents/) มีอยู่จริงใน repository แต่ไม่ใช่โครงสร้างหรือกติกาของ PRISM

## การแจกจ่ายและ lifecycle

[`plugin.json`](../origin/.claude-plugin/plugin.json) ระบุรายการ 27 สกิลจาก engineering และ productivity และ [`marketplace.json`](../origin/.claude-plugin/marketplace.json) ประกาศ plugin `mattpocock-skills` [README](../origin/README.md) อธิบายทางเลือกติดตั้งแบบ plugin หรือคัดลอกไฟล์แบบแก้ไขได้ และระบุว่าต้องเลือกแนวทางให้เหมาะกับ agent เพื่อไม่ให้ได้สกิลซ้ำ นี่เป็นคำแนะนำของ upstream ไม่ใช่หลักฐานว่าติดตั้งใน PRISM แล้ว

[README engineering](../origin/skills/engineering/README.md) และ [README productivity](../origin/skills/productivity/README.md) แยก user-invoked กับ model-invoked; ส่วนแรกระบุแนวทางควบคุมการเรียกอัตโนมัติสำหรับ Claude และ Codex ความพร้อมจริงขึ้นกับ host และสกิลที่โหลดในเซสชัน

สกิล [`setup-matt-pocock-skills`](../origin/skills/engineering/setup-matt-pocock-skills/SKILL.md) อธิบายการเลือก issue tracker, triage labels และตำแหน่งเอกสาร domain ในแต่ละโปรเจกต์ เป็น workflow แบบถามและเขียนไฟล์ ไม่ได้รันในการศึกษานี้ สกิลบางตัว เช่น [`implement-spec`](../origin/skills/engineering/implement-spec/SKILL.md) มี workflow แบบ subagent/worktree และ issue tracker: การนำไปใช้จริงต้องพิจารณาสิทธิ์ เครื่องมือ และคำสั่งของผู้ใช้กับ host ปัจจุบัน

## Build และเครื่องมือ

[`package.json`](../origin/package.json) ระบุแพ็กเกจ private เวอร์ชัน 1.3.1, npm 10.9.4 และสคริปต์ changeset / version / check-plugin-version พร้อม dev dependencies ของ Changesets; ตัวเลขนี้เป็นข้อมูลจากซอร์ส ไม่ใช่เวอร์ชันที่ติดตั้งใน PRISM [`scripts/link-skills.sh`](../origin/scripts/link-skills.sh) ระบุชัดว่าเป็นสคริปต์สำหรับผู้ดูแล ไม่ใช่ installer ที่รองรับ; การศึกษานี้ไม่ได้เรียกสคริปต์หรือติดตั้ง dependencies
