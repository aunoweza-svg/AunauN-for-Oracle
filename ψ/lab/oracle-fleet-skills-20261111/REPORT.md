# Oracle fleet skill installation — 2026-11-11

สถานะ: ติดตั้งครบตามชุดที่ผู้ใช้อนุญาตทั้งสี่ repo บน Codex/WSL แล้ว Native discovery ผ่าน ไม่มี discovery errors และตรวจ 189 ไฟล์ที่ติดตั้งเทียบ SHA-256 ผ่าน พร้อมตรวจสำเนาไฟล์เดิมที่ถูกปรับ

| Oracle | พื้นฐาน | เฉพาะงาน | ชุดบทบาท | Repo-local รวม |
|---|---:|---:|---:|---:|
| AunauN | 11 | 5 | 16 | 20 |
| PRISM | 11 | 8 | 19 | 19 |
| Lumina | 11 | 6 | 17 | 17 |
| AXIOM | 11 | 10 | 21 | 21 |

AunauN มี connection skills เดิมอีก 4 ตัวจึงรวม repo-local เป็น 20; ระบบมีสกิลกลางอีก 5 ตัวต่อ cwd รวม imagegen ที่ Lumina ใช้ได้อยู่แล้ว ไม่ติดตั้งซ้ำ การนับนี้ไม่ถือว่าได้สร้างสกิลใหม่ทุกตัว: มีทั้งชุดเดิมที่เก็บไว้ ชุดที่ปรับ และชุดที่เพิ่ม

## รายการติดตั้ง

พื้นฐานทุกตัว: `rrr`, `forward`, `learn`, `trace`, `where-we-are`, `herdr`, `herdr-whoami`, `herdr-neighbors`, `herdr-peek`, `herdr-hey`, `herdr-structure`

- **AunauN:** `product-marketing`, `customer-research`, `marketing-plan`, `analytics`, `ab-testing`
- **PRISM:** `ui-ux-pro-max`, `prototype`, `diagnosing-bugs`, `code-review`, `tdd`, `herdr-wt`, `herdr-ticket`, `herdr-pr`
- **Lumina:** `content-strategy`, `social`, `copywriting`, `ad-creative`, `video`, `ffmpeg-skill`
- **AXIOM:** `yfinance-data`, `company-valuation`, `earnings-preview`, `earnings-recap`, `stock-correlation`, `stock-liquidity`, `hyperliquid-reader`, `sepa-strategy`, `options-payoff`, `etf-premium`

Lumina FFmpeg native name คือ `ffmpeg-skill:ffmpeg-skill` ตาม metadata เดิม ตัวตนทั้งสี่คงเดิม ไม่มี awaken ใหม่

## ผลทดสอบ

- **โครงสร้าง/การโหลด:** native `skills/list` แยก cwd สี่ repo; ไม่มี duplicate name, required ครบ; quick_validate ของ skill-creator ผ่านสำหรับ repo-local ทุกตัว ดู [verification.json](evidence/verification.json) และ [discovery-after.json](evidence/discovery-after.json)
- **PRISM:** UI search สำหรับ tourism booking design system และ keyboard focus ส่งผลจริงจากฐานข้อมูลได้ ไม่ได้เปิด issue/PR/worktree จริง; PRISM ยังไม่มี commit และ repo ลูกทั้งหมดไม่มี origin ณ เวลาตรวจ
- **AXIOM:** environment เฉพาะ repo นำเข้า yfinance/numpy/pandas/scipy/matplotlib และสร้างกราฟได้; fixtures ตรวจ DCF, surprise, correlation, spread, options, ETF premium และ trend ผ่าน ดู [finance-smoke.json](evidence/finance-smoke.json)
- **ข้อมูลตลาดจริง:** Yahoo Finance ส่ง SPY daily 5 แถว; Hyperliquid public allMids ส่ง BTC mid เป็นบวกได้ ดู [providers.json](evidence/providers.json) พร้อมเวลาที่ตรวจ ไม่ใช่การยืนยันคุณภาพข้อมูลทุก endpoint
- **Lumina:** doctor ไม่มี required missing; ตัด/fit/ซับไทยด้วย libass + Noto Sans Thai ได้ H.264/AAC 360x640 ระยะ 2 วินาที รักษาไฟล์ต้นทางไว้ ตรวจ [contact sheet](evidence/lumina-render-thai_sheet.png) แล้ว ภาษาไทยแสดงผลและไม่มี tofu; ดู [media-smoke.json](evidence/media-smoke.json) และ [วิดีโอ](evidence/lumina-render-thai.mp4)
- **ชุดพื้นฐาน 11:** อ้างผลทดสอบก่อนติดตั้ง fleet ที่ [รายงานชุดพื้นฐาน](../codex-oracle-skills-20261111/REPORT.md) รวม retrospective กับ Git remote ทดสอบเฉพาะที่และ Herdr round trip การติดตั้งรอบนี้ตรวจสำเนาชุดลูกตาม manifest อีกครั้ง

สกิลเชิงกระบวนการ เช่น marketing/research/code review ถูกปรับคำสั่งและตรวจโครงสร้าง/การโหลด แต่ไม่ได้อ้างว่าทำแคมเปญ ตรวจหุ้นจริงครบทุกบท หรือรีวิวโค้ด production ครบทุก workflow การติดตั้งไม่ได้เชื่อมบัญชีโฆษณา เครื่องมือสร้างวิดีโอภายนอก หรือ API ที่ต้องใช้กุญแจ Optional transcription engines ไม่ได้ติดตั้ง

## Runtime และวิธีใช้

- PRISM: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py 'tourism booking mobile' --design-system` จาก cwd ของ PRISM
- AXIOM: `tools/finance/python <script.py>`; ดู tools/finance/README.md และ requirements.lock.txt ใน AXIOM มี 31 packages แยก .venv
- Lumina: `python3 tools/media.py _contract doctor --json`; ดู tools/ffmpeg-WSL.md ใน Lumina ใช้ CPU render บน Linux, FFmpeg portable ไม่เปลี่ยน system PATH
- เรียกสกิลด้วย `$learn`, `$trace`, `$rrr` หรือเลือกชื่อที่ host แสดง; เริ่ม session ใหม่ใน cwd ของ Oracle หากรายการสกิลยังเป็น cache เก่า

## การปรับให้ตรง Codex

รักษา reference/supporting files เดิม; เก็บ instructions ต้นทางใน references/upstream.md ของชุดที่ปรับและแก้ relative links ตามที่จัดวาง ใช้ local paths ของแต่ละ repo ไม่มีการบังคับ Claude CLI, รุ่นโมเดล, การสร้าง subagents หรือ Tracker ภายนอก การตลาดบันทึกแผนใน ψ/writing/marketing-plans แทน HOME; finance แยกข้อมูล/เวลา/สมมติฐาน; Hyperliquid adapter อนุญาตเฉพาะ public read requests และปฏิเสธ account/write request types

## ความจำและ Git

AunauN `/rrr` คง auto commit/push ตาม AGENTS.md และ workflow 2026-10-26 ส่วน repo ลูกบันทึกความจำภายใน repo เป็นค่าเริ่มต้น ไม่ใช้ remote ของแม่ การติดตั้งครั้งนี้ไม่ได้เรียก `/rrr` และไม่ได้ commit/push production เก็บไฟล์งานอื่นไว้

## แหล่งที่มาและการย้อนกลับ

- [install-plan.json](install-plan.json): allowlist, roots, source origins/hashes และ old/new file SHA-256
- [installed.json](installed.json): ไฟล์ที่เขียนสำเร็จ; backups/ เก็บเฉพาะไฟล์เดิมที่ถูกปรับ ไม่ใช่ snapshot ทั้ง repo
- ชุด marketing/finance มาจาก Windows skills ที่มีอยู่แล้ว; ไม่แก้ต้นทาง Windows ชุด PRISM/Lumina เก็บ supporting files เดิม
- FFmpeg archive จาก release FFmpeg-Builds ตรวจ SHA-256 กับ API asset digest ก่อนติดตั้ง; archive SHA-256 `e23cba7ad8d313977fa2df85b2af44cf030cb8df967a3838948c1a90856780e8`
- uv 0.13.7 archive SHA-256 `c5221ff41b7892bfc223543883600125f6a47fe845093e0f5bdff4f359196d83`; ใช้สร้าง environment ภายใน AXIOM
- Noto Sans Thai และ OFL มาจาก Google Fonts upstream; ดู license ที่ tools/fonts/OFL.txt ใน Lumina
- Runtime binaries, venv และ cache ถูก gitignore; เมื่อย้ายเครื่องต้อง restore ตาม README ไม่ถือว่า clone แล้วใช้งาน binary ได้ทันที
- การย้อนกลับให้ตรวจสถานะจริงและคืนเฉพาะไฟล์ใน manifest จาก backup ตาม role ไม่ลบทั้ง .agents/skills หรือทับงานที่เปลี่ยนภายหลัง
