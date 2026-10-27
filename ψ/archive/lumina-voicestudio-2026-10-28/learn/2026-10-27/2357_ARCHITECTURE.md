# VoiceStudio — Architecture

ศึกษา source snapshot `bb4077fd5aa5bf69b8554f3850512e0604a19733` ของ repository อิสระ [debpalash/VoiceStudio](https://github.com/debpalash/VoiceStudio/tree/bb4077fd5aa5bf69b8554f3850512e0604a19733) วันที่ 2026-10-27; เป็นการอ่านโค้ดและเอกสาร ไม่ใช่ผลทดสอบ runtime หรือหลักประกันคุณภาพเสียงภาษาไทย

## โครงสร้างและเส้นทางข้อมูล

```text
Electron renderer (React) → /api proxy → Python FastAPI backend
                                                ├─ routers / services
                                                ├─ TTS backend adapters → โมเดล / engine
                                                └─ /mcp/ → เครื่องมือสำหรับ agent
```

- `electron/src/main/` ดูแล backend supervisor, protocol/proxy และหน้าต่าง; `electron/src/preload/` เป็นสะพาน IPC; `electron/src/renderer/` เป็น React UI ตาม [electron/README.md](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/electron/README.md) ตัว renderer เรียก `/api/...` ผ่าน dev proxy หรือ production `app://` proxy
- `backend/main.py` สร้าง FastAPI app, รวม router และ mount MCP; `backend/api/routers/generation.py` มี route `POST /generate`; งานบริการและกลไก engine อยู่ใต้ `backend/services/` และ `backend/engines/` ([main.py](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/main.py), [generation.py](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/api/routers/generation.py))
- โฟลเดอร์ `omnivoice/` เก็บโมเดล/CLI Python; `docs/`, `tests/`, `scripts/` เป็นเอกสาร ทดสอบ และเครื่องมือโครงการตามไฟล์จริงที่ตรวจ; `mobile/` และ `native/` มีอยู่ แต่ขอบเขตภายในไม่ได้ตรวจละเอียด ([ต้นทาง](https://github.com/debpalash/VoiceStudio/tree/bb4077fd5aa5bf69b8554f3850512e0604a19733))

## TTS engines

- `backend/services/tts_backend.py` นิยาม interface `TTSBackend` และ `get_active_tts_backend()` เพื่อเลือก adapter; มี `OmniVoiceBackend` และ backend อื่นในไฟล์/engine modules ([tts_backend.py](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/services/tts_backend.py))
- README ระบุค่าเริ่มต้นเป็น VoiceStudio ที่ขับเคลื่อนด้วย k2-fsa/OmniVoice และเลือก engine อื่นได้; รุ่นที่ใช้และความสามารถจึงต้องตรวจเป็นราย engine ไม่เท่ากับว่าทุก engine รองรับทุกภาษา ([README](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/README.md), [feature catalog](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/feature-catalog.md))
- รหัสภาษาไทย `thai → th` ปรากฏใน [lang_map.py](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/omnivoice/utils/lang_map.py); เอกสาร [VoxCPM2](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/voxcpm2.md) ระบุ Thai ด้วย ข้อมูลนี้ไม่พิสูจน์ว่าการออกเสียงเป็นธรรมชาติหรือเครื่องนี้ใช้งานได้

## API และ MCP สำหรับ Lumina

- เอกสารระบุ MCP ที่ติดตั้งบน backend `/mcp/` โดยค่าเริ่มต้นเชื่อม `http://localhost:3900/mcp/`; มี tools เช่น `generate_speech`, `clone_voice`, `design_voice`, `transcribe`, `list_voices` และ `check_health` โดยต้องมี backend ที่ทำงานอยู่ ([docs/mcp.md](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/mcp.md), [backend/mcp_server.py](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/mcp_server.py))
- `OMNIVOICE_MCP_OUTPUT_MODE=files` ช่วยส่งคืนพาธไฟล์แทนเสียง base64 ใน context; `OMNIVOICE_MCP_BASE_PATH` จำกัดพื้นที่อ่าน/เขียนไฟล์ และต้องกำหนดให้ตรงกับสิ่งที่ทั้ง agent และ backend มองเห็น ([docs/mcp.md](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/mcp.md))
- local workflow ใช้ทรัพยากรเครื่อง; README ระบุบริการ remote เป็นทางเลือกและ analytics ต้องยินยอม แต่ดาวน์โหลด model/dependencies อาจต้องใช้เครือข่าย ([README](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/README.md), [MCP](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/mcp.md))

## Dependencies และข้อจำกัด

- [pyproject.toml](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/pyproject.toml) ระบุ Python >=3.11 และ dependencies หลัก เช่น PyTorch, FastAPI, uvicorn, transformers, MCP; [package.json](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/package.json) มี Bun workspace และ Electron scripts
- คู่มือ Windows ระบุ Windows 10/11 x64 และพื้นที่ว่างประมาณ 10 GB สำหรับแอป สภาพแวดล้อม Python และ weights; CPU ใช้ได้แต่ช้ากว่า GPU ตาม README ความพร้อมและ performance ของเครื่องผู้ใช้ยังไม่ผ่านการวัดในงานนี้ ([Windows](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/install/windows.md), [README](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/README.md))
- แอปมี AGPL-3.0 ขณะที่สิทธิ์โมเดล เสียง และผลลัพธ์แยกกัน; ควรตรวจเงื่อนไขของโมเดลที่เลือกและได้รับอนุญาตจากเจ้าของเสียงก่อน clone ([LICENSE-NOTICE.md](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/LICENSE-NOTICE.md))
