# VoiceStudio — คู่มือย่อสำหรับ Lumina

ศึกษาจากซอร์ส `debpalash/VoiceStudio` commit `bb4077fd5aa5bf69b8554f3850512e0604a19733` วันที่ 2026-10-27 เป็นการอ่านซอร์สและเอกสาร **ยังไม่ได้ติดตั้งหรือทดลองสร้างเสียงไทย** คำกล่าวด้านคุณภาพและความเร็วเป็นข้อมูลผู้พัฒนา ไม่ใช่ผลทดสอบเครื่องนี้

## ใช้ทำอะไร

VoiceStudio เป็นแอปสร้างและโคลนเสียง พากย์วิดีโอ ถอดเสียง และทำหนังสือเสียง มี API และ MCP โดยเครื่องมือเสียงทำงานในเครื่องได้ ทั้งนี้การดาวน์โหลดโมเดลและตัวเลือกบริการออนไลน์ยังใช้เครือข่ายได้ ([README](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/README.md)).

## ภาษาไทยและเสียงบรรยาย

- [VoxCPM2](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/voxcpm2.md) ระบุภาษาไทยใน 30 ภาษาที่รองรับ และสร้างลักษณะเสียงจากคำอธิบายโดยไม่ต้องใช้เสียงต้นแบบ หรือใช้เสียงต้นแบบสำหรับโคลนได้; ผลลัพธ์ตามเอกสารเป็น 48 kHz ต้องทดลองภาษาไทยจริงก่อนตัดสินความเป็นธรรมชาติ
- [OmniVoice](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/omnivoice.md) เป็น engine ค่าเริ่มต้น: [รายการภาษา](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/languages.md) มีภาษาไทย แต่เอกสาร engine ระบุว่าคุณภาพสำเนียงต่างกันและ voice design ฝึกบนอังกฤษ/จีน จึงไม่ควรรับรองคุณภาพไทยโดยไม่ได้ฟังตัวอย่างจริง
- [Confucius4-TTS](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/confucius4-tts.md) ระบุภาษาไทย แต่เป็น opt-in และต้องมีไฟล์เสียงต้นแบบ; เอกสารทดสอบจริงที่ยกมาคือภาษาอังกฤษบน Apple Silicon CPU ไม่ใช่ภาษาไทยบน Windows

## Windows และทรัพยากร

- [คู่มือ Windows](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/install/windows.md) ระบุ Windows 10/11 x64; Windows ARM ทดลองอยู่ แอป Electron พร้อมระบบเตรียม Python, FFmpeg และโมเดลเมื่อเริ่มใช้
- คู่มือระบุพื้นที่ว่างประมาณ 10 GB สำหรับแอป สภาพแวดล้อมและโมเดล; เส้นทาง CPU ไม่มี NVIDIA ระบุว่าการติดตั้ง PyTorch แบบ CPU ต้องการพื้นที่ว่างประมาณ 5 GiB เทียบ 9 GiB สำหรับ CUDA ซึ่งเป็นบริบท runtime ไม่ใช่ขนาดรวมทุก engine; engine เสริมอาจใช้หลาย GB ต่อชุด ตรวจพื้นที่จริงและขนาดรุ่นก่อนดาวน์โหลด
- ใช้ CPU ได้แต่ช้ากว่า; NVIDIA ที่มี driver รองรับใช้ CUDA ได้ ส่วน AMD Windows มี ROCm เฉพาะฮาร์ดแวร์/ไดรเวอร์ที่รองรับและต้อง opt in; GPU Intel Arc เป็น experimental และติดตั้งปกติไม่ใช้ XPU ([คู่มือ Windows](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/install/windows.md))
- OmniVoice แนะนำ GPU VRAM 6 GB; 4 GB อาจสลับใช้ RAM และช้าหรือหมดเวลา ส่วน GGUF เป็นอีกทางเลือกสำหรับเครื่องหน่วยความจำน้อย ([OmniVoice](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/omnivoice.md)). เครื่องของผู้ใช้และความเร็วจริงยังไม่ตรวจในเอกสารนี้
- ไฟล์ weights ดาวน์โหลดครั้งแรก; VoxCPM2 เป็น checkpoint หลาย GB ขณะที่ Confucius4 ระบุ weights รวมราว 5 GB ([VoxCPM2](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/voxcpm2.md), [Confucius4](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/engines/confucius4-tts.md), [ดาวน์โหลดโมเดล](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/downloading-models.md))

## สิทธิ์และการใช้กับร้านอาหาร

ตัวแอปเป็น AGPL-3.0 แต่สิทธิ์ weights, tokenizer และเสียงต้นแบบแยกกัน ([LICENSE-NOTICE](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/LICENSE-NOTICE.md)). เอกสารระบุ weights ค่าเริ่มต้น `k2-fsa/OmniVoice` เป็น CC-BY-NC และ tokenizer มีเงื่อนไขอื่นด้วย จึงไม่ควรสมมติว่าใช้กับงานโปรโมตร้านเชิงพาณิชย์ได้

สำหรับ `openbmb/VoxCPM2` inventory ระบุ metadata `apache-2.0` แต่มีสถานะ `unreviewed` และ `commercial_use: false` พร้อมหมายเหตุว่าต้องตรวจ component และ attribution แยก [ข้อมูลในซอร์ส](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/backend/config/model_licenses.json). ค่านี้สื่อว่าโครงการยังไม่รับรอง ไม่ใช่ข้อสรุปทางกฎหมายว่า upstream ห้ามทั้งหมด. ก่อนใช้งานเชิงพาณิชย์ต้องตรวจ terms ของ model revision และส่วนประกอบจริง รวมสิทธิ์เสียงต้นแบบ และใช้เสียงบุคคลโดยได้รับอนุญาตเท่านั้น ([README](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/README.md)).

## ลำดับทดลองเมื่อผู้ใช้ต้องการติดตั้ง

1. ตรวจ RAM, GPU/VRAM, พื้นที่ว่างและข้อจำกัดระบบจริง เลือก Windows Electron และรุ่น release ให้ตรงเครื่อง; เอกสารแนะนำตรวจ SHA256 ของ installer ([Windows](https://github.com/debpalash/VoiceStudio/blob/bb4077fd5aa5bf69b8554f3850512e0604a19733/docs/install/windows.md))
2. ตรวจขนาดดาวน์โหลดและเงื่อนไขโมเดลก่อนเลือก สร้างตัวอย่างไทยสั้น 1–2 ประโยค แล้วฟังการออกเสียงชื่อร้าน จังหวะ และความเป็นธรรมชาติ เปรียบเทียบเสียงที่ได้รับอนุญาต
3. หากคุณภาพและสิทธิ์เหมาะสม ค่อยสร้างเสียงเต็ม ปรับผสมกับบรรยากาศในวิดีโอ และตรวจไฟล์จริงก่อนส่งมอบ

**สถานะ:** ศึกษาเท่านั้น ยังไม่ได้ติดตั้งแอป weights หรือ runtime ของ VoiceStudio ยังไม่มีผลทดสอบการสร้างเสียงหรือ benchmark บนเครื่องนี้
