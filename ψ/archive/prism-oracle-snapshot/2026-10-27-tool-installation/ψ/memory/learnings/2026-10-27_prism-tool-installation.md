---
date: 2026-10-27
source: "user-requested installation"
concepts: [ui-ux, rea, installation, windows, codex, runtime]
---

# PRISM: REA และ UI UX Pro Max

## UI UX Pro Max

- ติดตั้งใน `.agents/skills/ui-ux-pro-max/` ด้วย skill-installer จาก commit `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03`; ไฟล์ต้นฉบับ 73 ไฟล์ hash ตรงทั้งหมด มี bytecode cache เพิ่ม 3 ไฟล์จากการทดสอบ
- Python portable 3.13.17 ใน `tools/runtime/python-3.13.17/`; zip SHA-256 `9e35319bffedab8b36ad44d8f377cb4f1733bcec257a0b6d04d94f01486ddb38` ตรง Python.org และ executable signature Valid
- `& 'tools/runtime/python-3.13.17/python.exe' 'tools/uipro-search.py' 'tourism booking mobile' --design-system -p 'PRISM Test'` ผ่านและส่ง design system กลับมา wrapper เพิ่ม scripts directory ใน Python path เพราะ embeddable Python ไม่เพิ่ม script directory ใน isolated mode
- สกิลระดับ workspace จะค้นพบเมื่อเปิด PRISM workspace และเริ่มเซสชันใหม่; ยังไม่ได้ยืนยันการโหลดใน active session

## REA

- ติดตั้ง `rea-agents@6.8.0` และ dependencies ใน `tools/rea/`; Node.js portable 24.22.1 ใน `tools/runtime/node-v24.22.1-win-x64/`; archive SHA-256 `d2046d28c2c3dcd211ac5145c0bf30e2047ef9dfb306693c8c6e2eccd8b95fa5` ตรง Node.js
- setup `--client codex --yes` ลงทะเบียน MCP ใน `C:/Users/aunow/.codex/config.toml` และติดตั้ง bundled skill ที่ `C:/Users/aunow/.agents/skills/reverse-engineer-anything`; backup `C:/Users/aunow/.codex/config.toml.rea.backup` ผล doctor รายงาน registration และ skill aligned
- การทดสอบ MCP แยกด้วย `tools/rea-mcp-smoke.cjs` ผ่าน initialize และ tools/list พบ 229 tools; ยังไม่พิสูจน์การเชื่อมใน active Codex session ต้องเปิดเซสชันใหม่แล้วตรวจอีกครั้ง
- การทดสอบ `analyze-javascript-application` กับ fixture ภายใน `tools/fixtures/rea-smoke/` ไม่ผ่าน: Windows Application Control ปฏิเสธ `rea-windows-x64.node` แม้ไฟล์ตรง package manifest จึงได้ `capability_unavailable` และผลบางส่วน ห้ามสรุปว่า static JavaScript พร้อมใช้งาน เครื่องมือนี้ยังรายงาน Ghidra/JADX native controls ไม่พร้อม; Ghidra และ IDA ไม่ได้ติดตั้งหรือตั้งค่า
- npm ติดตั้งได้เมื่อใช้ Windows system CA โดยไม่ปิด TLS verification; npm แจ้งว่า script ติดตั้ง Frida ยังไม่ได้รับอนุมัติ จึงไม่ถือว่า Frida พร้อมใช้
- MCP registration ใช้ absolute paths ภายใน workspace; หากย้าย workspace ต้องตรวจและอัปเดต registration ก่อนใช้ runtime folders ถูก ignore จาก Git ต้องติดตั้งใหม่เมื่อ clone
