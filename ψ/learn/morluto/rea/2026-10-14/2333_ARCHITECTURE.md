# REA — Architecture

อ่าน source ของ `morluto/rea` เท่านั้น วันที่ 2026-10-14; ไม่ติดตั้ง dependency ไม่รันโปรแกรมหรือ tests ข้อสรุปด้านล่างเป็นการอ่านโค้ด ไม่ใช่ผลทดสอบ runtime

## Entry points และเส้นทางหลัก

`rea` และ `rea-agents` ชี้ไปที่ `scripts/rea.mjs` ตัว dispatcher แยก `mcp`/`--mcp`, `mcp doctor` และ CLI ทั่วไป แล้วโหลด runtime จาก `dist/mcp/` หรือ `dist/cli-runtime/` หากไม่มี runtime จะรายงานให้ build ก่อน [package.json](https://github.com/morluto/rea/blob/main/package.json), [scripts/rea.mjs](https://github.com/morluto/rea/blob/main/scripts/rea.mjs)

```text
scripts/rea.mjs
  ├─ CLI: src/cli.ts + src/cli/* (Incur)
  └─ MCP: src/main.ts + src/main/* → src/server/* (stdio)
       ↓
src/composition/* → shared application workflows / BinarySession
       ↓
provider adapters → domain facts, errors, evidence
```

CLI ลงทะเบียน command ตามกลุ่ม capability; MCP parse config, สร้าง session, เปิด initial target แล้วเริ่ม transport พร้อม shutdown handlers การประกอบ binary session ใช้ factory เดียวเพื่อให้ CLI/MCP มี provider selection และ lifecycle ร่วมกัน [src/cli.ts](https://github.com/morluto/rea/blob/main/src/cli.ts), [src/main.ts](https://github.com/morluto/rea/blob/main/src/main.ts), [src/composition/binary.ts](https://github.com/morluto/rea/blob/main/src/composition/binary.ts)

## ชั้นและ abstractions สำคัญ

| ส่วน | หน้าที่จาก source |
|---|---|
| `src/domain/` | ชนิดข้อมูลและ semantics เช่น binary target, evidence, digest, Result และ analysis errors |
| `src/contracts/` | schemas/ชื่อ operations ที่ caller ใช้ร่วมกัน |
| `src/application/` | workflows และ ports เชื่อม analysis, session และ investigation |
| `src/composition/` | ประกอบ providers/services; binary factory สร้าง Hopper, Ghidra, IDA และ lazy auxiliary providers |
| provider directories | adapters แยกตาม engine/format เช่น `hopper`, `ghidra`, `ida`, `browser`, `dotnet`, `wasm`, `evm` |
| `src/process/`, `src/windows/`, `native/windows/` | process supervision และ Windows native boundary |
| `bridge/` | Python/Java/Swift bridge ไปยังเครื่องมือภายนอก |

โครงสร้างชั้นและเส้น dependency อธิบายไว้ใน [docs/architecture.mermaid](https://github.com/morluto/rea/blob/main/docs/architecture.mermaid); ตรวจพบ directories จริงจาก source tree และอ่าน binary composition ประกอบ ไม่ได้ตรวจทุก adapter เป็นรายตัว

`AnalysisProviderRegistry` ตรวจ provider IDs และ capability provenance เรียง candidate ด้วย ID และผูก deep provider ก่อนเริ่ม client; `SessionProviderRouter` ตรวจว่า auxiliary operations ไม่ซ้อนกันหรือซ้อน deep operations [AnalysisProviderRegistry.ts](https://github.com/morluto/rea/blob/main/src/application/binary/AnalysisProviderRegistry.ts), [SessionProviderRouter.ts](https://github.com/morluto/rea/blob/main/src/application/binary/SessionProviderRouter.ts)

`AnalysisExecution` เก็บ normalized result, raw result เมื่อแตกต่าง, provider identity, profile, limitations, locations และ subject; raw result ที่ไม่ได้ส่งมีค่า `null` ช่วยไม่ทำสำเนา normalized result ซ้ำโดยอัตโนมัติ [AnalysisProvider.ts](https://github.com/morluto/rea/blob/main/src/application/AnalysisProvider.ts)

`BinarySession` เชื่อม execution กับการสร้าง Evidence และ session records; investigation แยกเจ้าของ records ผ่าน `InvestigationRecords` และ `EvidenceLedger` Evidence มี schema ของ provider, subject digest/local path และ source location จึงติดตามที่มาของข้อสังเกตได้ [BinarySession.ts](https://github.com/morluto/rea/blob/main/src/application/binary/BinarySession.ts), [InvestigationRecords.ts](https://github.com/morluto/rea/blob/main/src/application/investigation/InvestigationRecords.ts), [evidence.ts](https://github.com/morluto/rea/blob/main/src/domain/evidence.ts)

## Dependencies และ build

แพ็กเกจเป็น Node ESM ชื่อ `rea-agents` version `6.5.0`; ระบุ Node `^22.19.0 || ^24.11.0 || >=26.0.0` และ `npm@11.16.0` dependencies หลักประกอบด้วย MCP client/server SDK, Incur, Zod/Ajv, Babel parser, Playwright Core, WebSocket, Pino และตัวอ่าน artifact เช่น ASAR/ZIP [package.json](https://github.com/morluto/rea/blob/main/package.json)

`compile` ใช้ TypeScript แล้ว bundle ด้วย Rolldown แยก CLI/MCP และคง dependencies ภายนอกกับ dynamic imports แบบ lazy; build ใช้ Turbo และ scripts สร้าง packaged skill artifacts Frida เป็น optional dependency [package.json](https://github.com/morluto/rea/blob/main/package.json), [tsconfig.build.json](https://github.com/morluto/rea/blob/main/tsconfig.build.json), [scripts/bundle-runtime.mjs](https://github.com/morluto/rea/blob/main/scripts/bundle-runtime.mjs)

จุดที่ควรจำ: REA เป็นตัวประสานหลายเครื่องมือโดยให้ CLI/MCP ใช้ workflows และ Evidence semantics ร่วมกัน ความถูกต้องของ adapter กับเครื่องมือจริงยังต้องพิสูจน์ด้วย runtime verification แยกจากการอ่าน source ครั้งนี้
