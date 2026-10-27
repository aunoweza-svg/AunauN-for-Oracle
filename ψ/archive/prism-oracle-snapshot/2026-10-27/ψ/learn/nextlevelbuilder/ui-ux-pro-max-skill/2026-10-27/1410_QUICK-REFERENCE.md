# UI UX Pro Max — คู่มืออ้างอิงฉบับย่อ

ศึกษาซอร์ส `nextlevelbuilder/ui-ux-pro-max-skill` ที่ commit `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03` โดยอ่านไฟล์ ไม่ได้ติดตั้งหรือทดลองรันเครื่องมือ

## ทำอะไร

เป็นชุดคำแนะนำ UI/UX พร้อมข้อมูลค้นหาและเครื่องมือสร้างข้อเสนอ design system สำหรับเว็บ มือถือ และเดสก์ท็อป ผลอาจรวมโครงหน้า สไตล์ สี ตัวอักษร เอฟเฟกต์ ข้อควรเลี่ยง และรายการตรวจ ([README.md](../origin/README.md), [SKILL.md](../origin/.claude/skills/ui-ux-pro-max/SKILL.md)). คำแนะนำเป็นจุดเริ่มต้นที่ต้องตรวจความเหมาะสมกับผู้ใช้และงานจริง ไม่ใช่การรับประกันคุณภาพหรือการเข้าถึง

## เริ่มใช้งานตามเอกสารต้นทาง

- README แนะนำติดตั้ง CLI แพ็กเกจ `ui-ux-pro-max-cli` และใช้ `uipro init --ai codex` ภายในโปรเจกต์สำหรับ Codex CLI; มี `uipro init --dry-run` ให้ดูการดำเนินการก่อนเขียน ([README: Installation](../origin/README.md)). การศึกษาซอร์สครั้งนี้ไม่ได้ติดตั้งสกิลหรือ CLI และไม่ยืนยันว่าเปิดใช้ในเซสชันปัจจุบัน
- สคริปต์ค้นหาต้องใช้ Python 3.x และ standard library ตาม README; ตัวอย่างใน skill ใช้ Python เรียก `scripts/search.py` ผ่านพาธจริงของสกิล ([README: Prerequisites](../origin/README.md), [SKILL.md](../origin/.claude/skills/ui-ux-pro-max/SKILL.md)). ไม่ได้ตรวจว่า Python พร้อมใช้ในเครื่อง
- README อธิบายว่าหลังติดตั้งสามารถขอทำงาน UI/UX ด้วยภาษาธรรมดาได้ เช่น “สร้าง dashboard สำหรับวิเคราะห์ข้อมูล”; การเปิดใช้จริงขึ้นกับ client และสกิลที่โหลดในเซสชัน ([README: Usage](../origin/README.md)).

## วิธีเลือกค้นหา

1. เข้าใจชนิดผลิตภัณฑ์ กลุ่มผู้ใช้ บริบท สไตล์ และตรวจ stack ของโปรเจกต์ก่อน หากยังตรวจไม่ได้ให้ถามแทนการเดา แม้ README กล่าวถึงค่าเริ่มต้น HTML + Tailwind แต่ `SKILL.md` ฉบับที่ตรวจระบุให้ตรวจ stack จริงและไม่สมมติ ([README: Supported Stacks](../origin/README.md), [SKILL.md: Step 1](../origin/.claude/skills/ui-ux-pro-max/SKILL.md)).
2. งานหน้าใหม่หรือแนวทางภาพรวมใช้ `--design-system`; ปัญหาเฉพาะใช้ `--domain` เช่น `ux`, `color`, `typography`, `chart`; คำแนะนำตามเทคโนโลยีใช้ `--stack` ที่ตรวจพบ ([SKILL.md: Query Contract](../origin/.claude/skills/ui-ux-pro-max/SKILL.md)).
3. ใช้คำค้นสั้นที่มีเป้าหมายหลักหนึ่งข้อ ตรวจผลให้ตรงงาน หากไม่พบหรือไม่ตรงให้ลองปรับคำค้นหรือระบุ domain/stack หนึ่งครั้ง หากยังไม่มีผลให้บอกว่าใช้คำแนะนำทั่วไป ไม่อ้างว่าเป็นผลค้นหา ([SKILL.md: Query Contract](../origin/.claude/skills/ui-ux-pro-max/SKILL.md)).
4. เมื่อต้องบันทึก design system ใช้ `--persist` พร้อม `--output-dir` ที่ชี้ project root; ตรวจไฟล์เดิมก่อน และ `--force` ต้องได้รับอนุญาตอย่างชัดเจนตามสกิล ([SKILL.md: Persist Design System](../origin/.claude/skills/ui-ux-pro-max/SKILL.md)).

ตัวอย่างแนวคำค้นสำหรับ PRISM เมื่อเครื่องมือพร้อม: `tourism booking mobile` เพื่อศึกษาแนวทาง design system; `dashboard chart legend` สำหรับประเด็นกราฟ; `form error summary` สำหรับ feedback ในฟอร์ม ทั้งหมดเป็นโจทย์ตัวอย่าง ไม่ใช่ผลการค้นหาที่รันแล้ว

## นำไปใช้กับงาน PRISM

- เริ่มจากสิ่งที่ผู้ใช้ต้องทำและข้อมูลที่จำเป็น เช่น นักท่องเที่ยวเลือกวันและจอง หรือผู้บริหารอ่านสถานะงาน; ตรวจลำดับข้อมูลก่อนเลือก visual style
- ตรวจ keyboard focus, ชื่อปุ่ม, สีและความเปรียบต่าง, responsive, ข้อความที่ยาว และ reduced motion ตามบริบท ([SKILL.md: Rule Categories](../origin/.claude/skills/ui-ux-pro-max/SKILL.md), [README: Resilient Text](../origin/README.md)).
- Dashboard การเทรดและบริหารงานควรมี legend และคำอธิบายข้อมูล ไม่ใช้สีอย่างเดียวสื่อความหมาย; ปรับข้อเสนอให้สอดคล้องกับระบบและผู้ใช้จริง ([SKILL.md: Charts & Data](../origin/.claude/skills/ui-ux-pro-max/SKILL.md)).
- การ retheme ระบบเดิมควรสำรวจ tokens และ components ก่อน ปรับทีละส่วน และตรวจ contrast, focus, responsive และธีมที่รองรับ; ผลค้นหาเองไม่ได้แก้โปรแกรมให้อัตโนมัติ ([README: Apply a theme](../origin/README.md)).

ตัวเลขใน catalog เป็นจำนวนที่ repository ระบุสำหรับ commit นี้ ไม่ใช่หลักฐานว่าแต่ละคำแนะนำผ่านการทดสอบกับผลิตภัณฑ์ของ AunauN ต้องตรวจผลกับงานและบริบทจริงเสมอ
