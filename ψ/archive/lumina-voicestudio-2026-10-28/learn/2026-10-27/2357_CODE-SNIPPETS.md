# VoiceStudio — โค้ดและรูปแบบการเชื่อมต่อ

ศึกษาซอร์ส `debpalash/VoiceStudio` commit `bb4077fd5aa5bf69b8554f3850512e0604a19733` เท่านั้น เอกสารนี้เป็นการอ่านซอร์ส ยังไม่ได้ติดตั้งโมเดล เปิดเซิร์ฟเวอร์ สังเคราะห์เสียง หรือทดลองคุณภาพภาษาไทย

## ทิศทางการสร้างเสียง

VoiceStudio ให้เลือก engine; ค่าเริ่มต้นอาศัย k2-fsa/OmniVoice ตาม [README](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/README.md#L37-L42) ส่วน backend ใน `OmniVoiceBackend.generate()` รับข้อความ ภาษา เสียงอ้างอิง และพารามิเตอร์การสร้าง ก่อนส่งให้ตัวโมเดล โดยมีทางใช้ reference cache ([tts_backend.py](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/services/tts_backend.py#L1815)). ความเร็วจริงขึ้นกับเครื่อง โมเดล และความยาวข้อความ ไม่ได้วัดในเครื่องนี้

## ตัวอย่างคำขอ local API

เมื่อแอปและ engine ติดตั้งและเปิดใช้งานแล้ว เอกสารระบุ base URL `http://localhost:3900/v1`; endpoint สร้างเสียงคือ `POST /audio/speech` และมี `GET /audio/voices` สำหรับตรวจ voice profile ([agentic-voice.md](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/agentic-voice.md#L24-L39)). ตัวอย่าง JSON ตาม [SpeechRequest](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/api/routers/openai_compat.py#L243-L309):

```json
{
  "model": "omnivoice",
  "input": "วันนี้ชวนมาแวะกินอาหารเมืองกันที่พะเยาครับ",
  "voice": "default",
  "language": "th",
  "response_format": "wav",
  "speed": 1.0
}
```

ตัวอย่างนี้แสดงรูปแบบข้อมูล ไม่ใช่ผลทดสอบจริง ชื่อ voice อาจเป็น profile ID หรือชื่อ profile ที่มีอยู่; `default` เลือกเสียงเริ่มต้นของ engine ไม่ได้ยืนยันว่าเป็นเสียงผู้ชายหรือเหมาะกับรีวิวร้าน ชื่อเสียงแบบ OpenAI เช่น `alloy` เป็น alias ไปยังเสียงเริ่มต้นของ engine ไม่ใช่การรับประกันว่าได้เสียง OpenAI จริง อีกทั้งคำสั่ง `instructions` อิสระไม่ได้รับประกันว่า OmniVoice จะทำตาม: เอกสารระบุว่ารักษาเฉพาะ voice-design tags ที่รองรับ ([agentic-voice.md](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/agentic-voice.md#L33)).

## MCP และการเลือกภาษา

MCP มี `generate_speech(text, language, profile_id, instruct, speed, steps, format)` และเรียก backend `/generate` โดยส่งฟอร์ม `text`, `speed`, `num_step` และตัวเลือกอื่นที่ระบุ; ผลลัพธ์ขึ้นกับโหมดไฟล์/ทรัพยากร ([mcp_server.py](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/mcp_server.py#L547-L615)). นี่คือ capability ในซอร์ส ไม่ใช่ MCP ที่เชื่อมและพร้อมใช้ในเซสชัน Lumina แล้ว

`docs/languages.md` ระบุ Thai รหัส `th` และ `omnivoice/utils/lang_map.py` map ชื่อ thai เป็น `th`; เอกสาร engine VoxCPM2 และ Confucius4 ระบุภาษาไทยเช่นกัน ([languages](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/languages.md#L610), [VoxCPM2](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/voxcpm2.md), [Confucius4](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/confucius4-tts.md)). รายชื่อภาษาเป็นหลักฐานว่าซอร์สระบุรองรับ ไม่ใช่หลักฐานว่าเสียงไทยจากแต่ละ engine เป็นธรรมชาติ หรือโหลดและรันบนเครื่องนี้ได้

## การทดลองที่เหมาะกับ Lumina

หากมีการติดตั้งและเลือก engine ภายหลัง ให้สร้างประโยคสั้นภาษาไทยเดียวกันด้วย voice ที่มีสิทธิ์ใช้ เปรียบเทียบการออกเสียงชื่อร้าน ความชัด จังหวะ และอารมณ์กับบทรีวิวจริง รวมทั้งวัดเวลาและทรัพยากรที่ใช้ก่อนเลือกใช้ในงาน; การโคลนเสียงต้องได้รับอนุญาตจากเจ้าของเสียงตาม [README](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/README.md#L191-L193).
