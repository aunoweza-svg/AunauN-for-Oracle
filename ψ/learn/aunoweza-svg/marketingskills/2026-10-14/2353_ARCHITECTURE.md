# Marketing Skills — โครงสร้างและองค์ประกอบ

สำรวจ `aunoweza-svg/marketingskills` ที่ commit `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467` วันที่ 2026-10-14 โดยอ่านซอร์ส ไม่ติดตั้งหรือเรียกใช้โปรแกรมของโครงการ

## โครงการนี้คืออะไร

เป็นคลัง **Agent Skills ด้านการตลาด** ให้ AI agent โหลดคำแนะนำตามโจทย์ ตั้งแต่การวางแผน เขียนข้อความ SEO โฆษณา ไปจนถึงวิเคราะห์ conversion และรายได้ ตัวคลังไม่ได้เป็นบริการ agent ที่รันเอง เอกสารระบุการใช้งานกับหลาย agent ที่รองรับ Agent Skills specification ([README.md](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/README.md))

Manifest ของ Claude และ Codex ระบุรุ่น **2.11.29**, ผู้สร้าง Corey Haines, MIT และยังชี้ homepage/repository ไปที่ `coreyhaines31/marketingskills` จึงต้องแยกชื่อ fork ที่สำรวจออกจากชื่อ upstream ที่เอกสารใช้อยู่ ([Claude manifest](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/.claude-plugin/plugin.json), [Codex manifest](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/.codex-plugin/plugin.json))

## โครงสร้างที่ตรวจพบ

จำนวนด้านล่างนับไฟล์และโฟลเดอร์ของ checkout โดยตรง

| ตำแหน่ง | บทบาท |
|---|---|
| `skills/` | 50 โฟลเดอร์สกิล มี `SKILL.md` เป็นจุดเริ่มต้น และบางสกิลมี `references/`, `assets/`, `evals/` |
| `tools/clis/` | 66 ไฟล์ JavaScript สำหรับเรียก API เครื่องมือการตลาด |
| `tools/integrations/` | 104 คู่มือ Markdown สำหรับ integration |
| `tools/REGISTRY.md`, `tools/SETUP.md` | ค้นเครื่องมือและเตรียมการเชื่อมบัญชี |
| `tools/composio/` | คู่มือชั้นเชื่อมต่อและแผนที่ toolkit ของ Composio |
| `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/` | Manifest สำหรับการแจกจ่ายและติดตั้ง plugin |
| `scripts/` | ตรวจ version, package ZIP และ sync ข้อมูล partner |
| `tests/` | regression ของ validator, CLI/asset contract tests และ Python packaging tests |
| `.github/workflows/` | CI สำหรับ validation, version, regression, packaging, sync และ release |

อ้างอิงโครงสร้าง: [skills](https://github.com/aunoweza-svg/marketingskills/tree/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills), [tools](https://github.com/aunoweza-svg/marketingskills/tree/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tools), [scripts](https://github.com/aunoweza-svg/marketingskills/tree/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/scripts), [tests](https://github.com/aunoweza-svg/marketingskills/tree/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tests)

## จุดเริ่มต้นและบริบทที่ใช้ร่วมกัน

1. Agent เลือกสกิลจาก `name` และ `description` ใน frontmatter แล้วอ่าน `SKILL.md`; manifest ทั้งสองชี้ไปยัง `skills/` ([AGENTS.md](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/AGENTS.md))
2. `product-marketing` เป็นฐานข้อมูลบริบท: สร้างหรือดูแล `.agents/product-marketing.md` ของโครงการผู้ใช้ เก็บผลิตภัณฑ์ กลุ่มเป้าหมาย positioning และ messaging; เอกสาร README ระบุให้สกิลอื่นอ่านบริบทนี้ก่อนทำงาน ([product-marketing/SKILL.md](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills/product-marketing/SKILL.md), [README.md](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/README.md))
3. สกิลเชื่อมกันด้วยคำแนะนำและเอกสารอ้างอิง จึงเป็น workflow ที่ agent ตีความ ไม่พบ application server หรือ scheduler กลางใน root ที่สำรวจ
4. API operation เป็นอีกชั้นหนึ่ง เช่น `tools/clis/ga4.js` อ่าน token จาก environment และใช้ `fetch`; `--dry-run` คืนรายละเอียด request โดยปิดบัง Authorization ([ga4.js](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tools/clis/ga4.js))

## Runtime, dependencies และการแจกจ่าย

- สกิลเป็นเนื้อหา Markdown ไม่มี build step; AGENTS.md ระบุ CLI เป็น Node.js 18+ แบบไม่มี package dependencies และ checkout ไม่พบ `package.json` หรือ dependency lockfile ([AGENTS.md](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/AGENTS.md))
- API tools ต้องมีบัญชีและ credential ของบริการที่เลือก; การมีสกิลหรือคู่มืออยู่ไม่ได้แปลว่าเชื่อมบริการครบแล้ว ([tools/SETUP.md](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tools/SETUP.md))
- Packaging ใช้ Python standard library และ Git สร้าง ZIP จาก revision ที่กำหนด; CI ใช้ Python 3.12 ([package_skills.py](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/scripts/package_skills.py), [skill-packaging.yml](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/.github/workflows/skill-packaging.yml))
- Version แยก repo release กับ `metadata.version` รายสกิล; CI ตรวจ version และเอกสารอ้างอิง ส่วน regression CI ใช้ Node 20 ตรวจ syntax และ contract tests ([check-versions.yml](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/.github/workflows/check-versions.yml), [regression-tests.yml](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/.github/workflows/regression-tests.yml))

## สิ่งที่ควรจำ

องค์ประกอบหลักคือ **บริบทผลิตภัณฑ์ → สกิลตามโจทย์ → คู่มือ/CLI ของบริการที่ต้องใช้** จึงนำมาเสริมความสามารถ agent ด้านการตลาดได้โดยเลือกเฉพาะงานและบริการที่ต้องการ ความเหมาะสมกับ Tourism Marketing เป็นการประยุกต์ใช้เพิ่มเติม ไม่ใช่ความสามารถเฉพาะอุตสาหกรรมที่ยืนยันจากโครงสร้างนี้
