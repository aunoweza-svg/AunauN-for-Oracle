# REA — คู่มืออ้างอิงฉบับย่อ

REA (Reverse Engineer Anything) เป็น CLI และ MCP server ให้ agent ตรวจสอบแอป ไบนารี และพฤติกรรมการทำงาน เพื่ออธิบายกลไกพร้อมหลักฐานและข้อจำกัด แล้วใช้ผลไปเขียนและทดสอบ implementation ได้ การวิเคราะห์เป้าหมายเกิดในเครื่อง แต่ผลเครื่องมือจะส่งให้ agent และอยู่ภายใต้นโยบายของผู้ให้บริการโมเดล ([README.md:59–65, 294–301](https://github.com/morluto/rea/blob/main/README.md#how-rea-works))

## ความสามารถ

| เป้าหมาย | สิ่งที่อ่านได้ / เครื่องมือเพิ่มเติม |
|---|---|
| Native binary | pseudocode, assembly, strings, symbols, calls และ references ผ่าน Hopper/Ghidra/IDA |
| JavaScript / Electron | modules, imports, source maps, routes, IPC และ native add-ons; static analysis ไม่ต้องมี native engine |
| .NET | metadata, CIL และ dependency แบบ static ไม่รัน assembly |
| เว็บไซต์ | DOM, scripts, network observations และ screenshots ผ่าน Chrome-family browser |
| Android | APK ผ่าน JADX + JDK, อุปกรณ์ผ่าน adb, resources ผ่าน Apktool และ Flutter metadata แบบ static |
| ข้อมูลเฉพาะทาง | Go/Rust metadata, WASM, EVM, SQLite, network captures, firmware และ recorded signals; requirements ต่างกันตามงาน |

ที่มา: [README.md:164–196](https://github.com/morluto/rea/blob/main/README.md#what-you-can-analyze) งาน static JavaScript/.NET อ่านไฟล์โดยไม่รันแอป; runtime capture รันหรือโต้ตอบกับเป้าหมายด้วยสิทธิ์ผู้ใช้ ([README.md:194–196](https://github.com/morluto/rea/blob/main/README.md#what-you-can-analyze))

## วิธีติดตั้ง — อ้างอิงเท่านั้น ยังไม่ได้รัน

ต้องมี Node.js **22.x ตั้งแต่ 22.19**, **24.x ตั้งแต่ 24.11** หรือ **26+** และ npm; Node 23, 25 และ prerelease ไม่รองรับ SQLite ต้องใช้ Node 24.15+ ในสาย 24 หรือ 26+ ([package.json:44–46](https://github.com/morluto/rea/blob/main/package.json#L44-L46), [installation.md:1105](https://github.com/morluto/rea/blob/main/docs/installation.md#L1105), [README.md:177](https://github.com/morluto/rea/blob/main/README.md#L177))

```powershell
npx rea-agents@latest setup
```

เลือก agent เช่น Codex ตรวจแผนการแก้ไขและอนุมัติใน setup จากนั้น restart agent โปรแกรมเพิ่ม MCP registration และ workflow instructions พร้อม backup configuration เดิม ([README.md:76–91](https://github.com/morluto/rea/blob/main/README.md#quick-start))

ใช้ CLI แยกได้ เช่น:

```powershell
npx -y rea-agents@latest analyze-javascript-application "D:/apps/example" --json
```

หากต้องการคำสั่ง `rea` แบบ global:

```powershell
npm install --global rea-agents
rea --help
```

ที่มา: [README.md:99–120](https://github.com/morluto/rea/blob/main/README.md#use-the-terminal) การติดตั้ง skill อย่างเดียวด้วย `npx skills add morluto/rea --skill reverse-engineer-anything` **ไม่ลงทะเบียน MCP หรือ analysis engines** ([installation.md:422–438](https://github.com/morluto/rea/blob/main/docs/installation.md#skill-only-installation))

## Windows

Static JavaScript มีตัวอย่าง Windows path ใน README ส่วน native Ghidra บน Windows เป็น **experimental read-only P0** ต้องใช้ Windows 10+ x64, target และ temporary volumes เป็น fixed local NTFS, Ghidra 12.1.x (ตรวจด้วย 12.1.4), full 64-bit JDK ในช่วงที่ Ghidra รองรับ (ปัจจุบัน JDK 21+) และ native bundle ที่ตรงกับ package ([README.md:111](https://github.com/morluto/rea/blob/main/README.md#L111), [windows-ghidra-p0.md:9–22, 74–85](https://github.com/morluto/rea/blob/main/docs/windows-ghidra-p0.md#supported-boundary))

ขอบเขต main รับ native x86/x64 PE EXE/DLL และ raw NMOS 6502 ที่ระบุ entry; มี 26 read-only inventory/memory/function operations แต่ไม่ได้หมายถึง feature parity: GUI state, annotations, สถาปัตยกรรม/format อื่น และ Hopper-only operations ใช้ไม่ได้ผ่าน provider นี้ Managed PE/CLI ใช้ provider static แยกต่างหาก ([windows-ghidra-p0.md:20–40](https://github.com/morluto/rea/blob/main/docs/windows-ghidra-p0.md#supported-boundary))

Setup บน Windows ตั้งค่า agent และ bundled skill ได้ แต่ไม่ติดตั้ง Ghidra/JDK และการติดตั้ง Hopper ไม่พร้อมบน Windows งาน firmware, recorded packet/signal และ process capture บางประเภทมีเงื่อนไข Linux หรือ Linux/macOS ([installation.md:780–785](https://github.com/morluto/rea/blob/main/docs/installation.md#L780-L785), [README.md:189–193](https://github.com/morluto/rea/blob/main/README.md#what-you-can-analyze))

## ระวังความต่างระหว่าง main กับ npm

Checkout ที่อ่านระบุ package version 6.5.0 แต่เอกสารบันทึกว่า npm ที่ตรวจเมื่อ 2026-10-11 เป็น 6.4.0 และไม่ยืนยันว่า 6.5.0 เผยแพร่แล้ว `@latest` เลือก npm release; MCP registration ถูก pin กับ version ที่ทำ setup ต้อง refresh และ restart เพื่อใช้รุ่นใหม่ จึงควรตรวจ `npm view rea-agents dist-tags.latest` ก่อนติดตั้งจริง ([package.json:4](https://github.com/morluto/rea/blob/main/package.json#L4), [installation.md:391–420](https://github.com/morluto/rea/blob/main/docs/installation.md#released-package-and-main))

เอกสาร Windows ยังมีข้อความย้อนหลังว่า x86 PE เพิ่มใน main หลัง npm 5.0.0; ให้ใช้ schema/tool list ของ server ที่ติดตั้งจริงและ release notes ของรุ่นนั้นเป็นตัวตัดสิน ([windows-ghidra-p0.md:3–7](https://github.com/morluto/rea/blob/main/docs/windows-ghidra-p0.md#L3-L7), [installation.md:415–420](https://github.com/morluto/rea/blob/main/docs/installation.md#L415-L420))

เอกสารนี้อ่าน source checkout เท่านั้น ไม่ได้ติดตั้ง REA หรือตรวจยืนยันการวิเคราะห์จริงบนเครื่องผู้ใช้
