# REA: สถาปัตยกรรมที่ตรวจจากซอร์ส

ศึกษา repository อิสระ `morluto/rea` ที่ commit `0676ad254c206871e0f4b120ba300cbbf9383b62` โดยอ่านซอร์ส ไม่ได้ติดตั้งหรือทดลองรันเครื่องมือ

## ภาพรวม

REA เป็นโปรแกรม TypeScript/Node.js ที่เสนอ CLI และ MCP server สำหรับศึกษาพฤติกรรมโปรแกรมและ artifact หลายชนิด โดยผลการวิเคราะห์ขึ้นกับประเภทเป้าหมาย เครื่องมือและสภาพแวดล้อมที่พร้อมใช้ ([README.md](../origin/README.md), [package.json](../origin/package.json)).

## จุดเริ่มและลำดับการทำงาน

1. `package.json` กำหนดคำสั่ง `rea` และ `rea-agents` ไปที่ `scripts/rea.mjs`; ไฟล์ dispatcher แยกทางระหว่าง MCP stdio, MCP HTTP และคำสั่ง CLI และตรวจว่ามี compiled runtime ใน `dist/` ก่อนโหลด ([package.json](../origin/package.json), [scripts/rea.mjs](../origin/scripts/rea.mjs)).
2. `src/cli.ts` ลงทะเบียนชุดคำสั่งหลายกลุ่ม รวมถึง browser, JavaScript, binary, Android และ evidence; `src/main.ts` เริ่ม MCP โดยใช้ stdio และโหลดตัวรับ HTTP เมื่อเลือกใช้งาน ([src/cli.ts](../origin/src/cli.ts), [src/main.ts](../origin/src/main.ts)).
3. แผนภาพต้นทางอธิบายว่า CLI และ MCP ไปยัง composition และ application workflows ที่ใช้ร่วมกัน; provider ถูกเชื่อมตามหน้าที่ เช่น browser, Ghidra และ JavaScript ขณะที่ contracts และ domain รองรับข้อมูลและตรรกะ ([docs/architecture.mermaid](../origin/docs/architecture.mermaid)).
4. `src/process/` และ `src/filesystem/` เป็นส่วนฐานที่ดูแลกระบวนการและไฟล์ที่ provider ใช้; แผนภาพระบุ adapter เพิ่มเติมสำหรับ Windows และ native addon ([docs/architecture.mermaid](../origin/docs/architecture.mermaid), [native/windows/README.md](../origin/native/windows/README.md)).

## โครงสร้างและ dependencies

- `src/` มี application, composition, contracts, domain, cli, server และ provider เฉพาะชนิดเป้าหมายจำนวนมาก; `bridge/` มีตัวเชื่อมกับเครื่องมือภายนอก; `docs/`, `tests/` และ `scripts/` เก็บเอกสาร การทดสอบ และสคริปต์ตามลำดับ (ตรวจไดเรกทอรีจริง; [docs/architecture.mermaid](../origin/docs/architecture.mermaid)).
- `package.json` ระบุ Node `^22.23.4 || ^24.22.1 || >=26.12.1`, npm `11.16.0` และสคริปต์ build/check; `tsconfig.build.json` รวมซอร์ส TypeScript โดยยกเว้น tests และ fixtures ([package.json](../origin/package.json), [tsconfig.build.json](../origin/tsconfig.build.json)).
- การวิเคราะห์บางประเภทใช้เครื่องมือภายนอก เช่น Ghidra, Hopper หรือ IDA; README ระบุว่าการวิเคราะห์ JavaScript แบบ static ไม่ต้องใช้ native analysis engine ([README.md](../origin/README.md)). `.gitmodules` ประกาศ submodules หลายรายการ รวมถึง JADX headless, Binwalk, Unblob และ Wakaru แต่การ clone ครั้งนี้ไม่ได้ยืนยันว่าดาวน์โหลด submodules แล้ว ([.gitmodules](../origin/.gitmodules)).

**ข้อจำกัด:** ภาพรวมนี้อ้างแผนภาพและ entry point ที่อ่าน ไม่ใช่การตรวจครบทุก provider หรือการยืนยันว่า REA ทำงานได้บนเครื่องนี้
