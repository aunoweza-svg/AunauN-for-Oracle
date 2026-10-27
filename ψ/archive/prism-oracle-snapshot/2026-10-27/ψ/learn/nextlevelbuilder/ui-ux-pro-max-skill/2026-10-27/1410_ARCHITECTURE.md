# สถาปัตยกรรม UI UX Pro Max

ศึกษา repository อิสระ `nextlevelbuilder/ui-ux-pro-max-skill` ที่ commit `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03` ด้วยการอ่านซอร์ส ไม่ได้ติดตั้งหรือรันเครื่องมือ

## ส่วนประกอบ

- [`src/ui-ux-pro-max/data/`](../origin/src/ui-ux-pro-max/data/) เก็บข้อมูลออกแบบใน CSV แยกตามเรื่อง เช่น `styles.csv`, `colors.csv`, `typography.csv`, `ux-guidelines.csv`, `charts.csv`, `products.csv` และ `ui-reasoning.csv`; `stacks/` มีไฟล์คำแนะนำแยกตามเทคโนโลยี
- [`src/ui-ux-pro-max/scripts/`](../origin/src/ui-ux-pro-max/scripts/) มี Python สำหรับค้นข้อมูล สร้าง design system ตรวจข้อมูลและกฎ reasoning; ภายในมี tests แบบ unittest
- [`src/ui-ux-pro-max/templates/`](../origin/src/ui-ux-pro-max/templates/) รวม template เนื้อหา skill และไฟล์การตั้งค่าตามแพลตฟอร์ม; [`codex.json`](../origin/src/ui-ux-pro-max/templates/platforms/codex.json) ระบุ path ติดตั้ง `.agents/skills/ui-ux-pro-max` ของ Codex
- [`cli/`](../origin/cli/) เป็นตัวติดตั้งที่เขียน TypeScript; [`cli/src/index.ts`](../origin/cli/src/index.ts) กำหนด `init`, `versions`, `update`, `uninstall` และ `init --dry-run` เพื่อดูแผนก่อนเขียน
- [`gallery/`](../origin/gallery/), [`projects/`](../origin/projects/) และ [`docs/`](../origin/docs/) เก็บส่วน gallery ตัวอย่างโปรเจกต์ และเอกสาร ตามโครงสร้างที่ตรวจพบ

## เส้นทางการทำงาน

[`search.py`](../origin/src/ui-ux-pro-max/scripts/search.py) รับคำสั่งแล้วเรียก `search` หรือ `search_stack` ใน [`core.py`](../origin/src/ui-ux-pro-max/scripts/core.py) ซึ่งอ่านข้อมูล CSV และมีคลาสจัดอันดับ BM25 ส่วนโหมด design system เรียก [`design_system.py`](../origin/src/ui-ux-pro-max/scripts/design_system.py) โดย `DesignSystemGenerator` รวมข้อมูลและใช้กฎที่ parse/apply จาก [`reasoning_contract.py`](../origin/src/ui-ux-pro-max/scripts/reasoning_contract.py) เพื่อประกอบข้อเสนอ ผลเป็นจุดตั้งต้นในการออกแบบ ไม่ใช่หลักฐานว่าผลงานผ่านการทดสอบกับผู้ใช้จริง

## Dependencies และคุณภาพ

สคริปต์ค้นหาที่ตรวจใช้ Python standard library เช่น `csv`, `re`, `pathlib`, `argparse` และ `json` ([core.py](../origin/src/ui-ux-pro-max/scripts/core.py), [search.py](../origin/src/ui-ux-pro-max/scripts/search.py)) ส่วน CLI ประกาศ dependencies เช่น `commander`, `chalk`, `ora`, `prompts` และ TypeScript เป็น dev dependency ([cli/package.json](../origin/cli/package.json)). ไฟล์ package ยังระบุสคริปต์ตรวจข้อมูล ทดสอบ Python และ typecheck; การศึกษานี้ไม่ได้รันทดสอบเหล่านั้น

[`skill.json`](../origin/skill.json) ระบุ version `2.15.0`; [`cli/package.json`](../origin/cli/package.json) ระบุ CLI version `2.5.0` เป็นคนละแพ็กเกจ จึงไม่ควรถือว่าเลขเวอร์ชันต้องตรงกัน การ clone ซอร์สเพียงอย่างเดียวไม่ได้ติดตั้ง skill หรือรับรองว่าใช้งานได้ในเซสชันนี้
