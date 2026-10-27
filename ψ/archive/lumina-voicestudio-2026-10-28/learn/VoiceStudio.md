# VoiceStudio — Learning Index

- Source: [debpalash/VoiceStudio](https://github.com/debpalash/VoiceStudio)
- Snapshot: [`bb4077fd5aa5bf69b8554f3850512e0604a19733`](https://github.com/debpalash/VoiceStudio/tree/bb4077fd5aa5bf69b8554f3850512e0604a19733)
- Local source: `D:/OneDrive/AunauN Oracle/.learn-sources/debpalash/VoiceStudio`; `origin` เป็น Windows junction ในเครื่อง ไม่รวมใน Git และต้องสร้างใหม่เมื่อย้ายเครื่อง
- สำรวจ: 2026-10-27 23:57 Asia/Bangkok, โหมดปกติ

## เอกสาร

- [Architecture](2026-10-27/2357_ARCHITECTURE.md)
- [Code snippets](2026-10-27/2357_CODE-SNIPPETS.md)
- [Quick reference](2026-10-27/2357_QUICK-REFERENCE.md)

## สิ่งที่ Lumina เรียนรู้

VoiceStudio เป็นแอปสร้างเสียงและพากย์ที่ใช้ engine ในเครื่องได้ มี local API/MCP ตามซอร์ส; VoxCPM2 ระบุภาษาไทยและ voice design จากข้อความ แต่ความเป็นธรรมชาติของเสียงไทยยังต้องฟังตัวอย่างจริง Windows guide แนะนำพื้นที่ประมาณ 10 GB และ CPU ทำงานได้ช้ากว่า GPU; engine เพิ่มเติมและ weights ใช้พื้นที่เพิ่ม

ตัวแอปและโมเดลมีสิทธิ์แยกกัน: default OmniVoice มี weights แบบ noncommercial ตาม license notice; inventory ของ VoxCPM2 ยังไม่รับรอง commercial use การศึกษาไม่ใช่การติดตั้ง ยังไม่ได้เปิดแอป เชื่อม MCP ดาวน์โหลดโมเดลหรือสร้างเสียงจริง
