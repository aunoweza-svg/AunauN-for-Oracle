# REA — คู่มืออ้างอิงฉบับย่อ

ศึกษา repository อิสระ [morluto/rea](https://github.com/morluto/rea) ที่ commit `0676ad254c206871e0f4b120ba300cbbf9383b62` เอกสารนี้เป็นการอ่านซอร์ส ไม่ใช่ผลติดตั้งหรือผลทดสอบโปรแกรม

## REA ทำอะไร

REA (Reverse Engineer Anything) ให้ agent ใช้ MCP สำรวจเป้าหมาย ติดตามโค้ด และรับผลพร้อมหลักฐาน ก่อนนำไปอธิบายหรือสร้างและทดสอบ implementation; CLI มี workflow ด้วย ตัวอย่างงานคือวิเคราะห์ฟีเจอร์ในแอปเพื่อเข้าใจกลไก แล้วสร้างความสามารถคล้ายกัน ([README: How REA works](../origin/README.md))

พื้นที่ที่ README ระบุรวมถึงเว็บไซต์และ browser observations, JavaScript/Electron, native binaries, Android APK, .NET, firmware และไฟล์ network capture แต่แต่ละชนิดมีข้อกำหนดของเครื่องมือและระบบปฏิบัติการแตกต่างกัน ([README: What you can analyze](../origin/README.md))

## การตั้งค่าและการใช้ตามเอกสาร upstream

1. ต้นฉบับระบุ Node.js 22.x ตั้งแต่ 22.23.4, 24.x ตั้งแต่ 24.22.1 หรือ 26.12.1 ขึ้นไป พร้อม npm; รุ่นอื่นที่ไม่อยู่ในช่วงดังกล่าวไม่ใช่ช่วงที่ระบุว่ารองรับ ([README](../origin/README.md), [installation](../origin/docs/installation.md))
2. แนวทางของ README คือ `npx rea-agents setup` เลือก agent ตรวจแผนและอนุมัติ จากนั้นเริ่ม agent ใหม่ โดย setup ลงทะเบียน MCP และคำแนะนำ workflow ที่เข้าคู่กัน; การมีสำเนาซอร์สเพียงอย่างเดียวไม่ได้ยืนยันว่าทั้งสองพร้อมใช้งาน ([README: Quick start](../origin/README.md), [installation: Review setup changes](../origin/docs/installation.md))
3. ตรวจความพร้อมหลังติดตั้งได้ตามเอกสารด้วย `rea doctor --client codex --json`, `rea doctor --skill --json` และสำหรับ provider เช่น `rea doctor --provider ghidra --json`; ตัวคำสั่ง doctor ตามเอกสารเป็นแบบ read-only ([installation: readiness](../origin/docs/installation.md))
4. ตัวอย่างการใช้งานตาม README คือบอก agent ว่าให้ตรวจฟีเจอร์ที่ระบุ แสดงหลักฐาน และสร้างฟีเจอร์ลักษณะเดียวกันสำหรับโปรเจกต์ของตน หรือใช้ CLI `analyze-javascript-application` กับ path ของแอปที่ได้รับอนุญาต ([README: Ask your agent / Use the terminal](../origin/README.md))

## ข้อจำกัดที่เกี่ยวกับ PRISM

- Native analysis เชิงลึกขึ้นกับ provider เช่น Hopper, Ghidra หรือ IDA และความรองรับของ host; JavaScript และ .NET แบบ static บางประเภทไม่ต้องใช้ native engine ([README: What you can analyze / FAQ](../origin/README.md))
- Static analysis อ่านไฟล์โดยไม่รันแอปสำหรับ JavaScript และ .NET ตามที่ README ระบุ ส่วน runtime capture อาจรันหรือโต้ตอบกับ target ด้วยสิทธิ์ผู้ใช้ จึงควรตรวจผลกระทบและ scope ก่อนเลือกวิธี ([README: What you can analyze](../origin/README.md))
- REA ออกแบบสำหรับการศึกษาหรือวิเคราะห์เป้าหมายที่เป็นเจ้าของหรือได้รับอนุญาต และเครื่องมือเชิงพาณิชย์มีเงื่อนไขใบอนุญาตของตนเอง ([DISCLAIMER](../origin/DISCLAIMER.md), [README: License](../origin/README.md))
- ซอร์สอาจมีคุณสมบัติที่ยังไม่ตรงกับรุ่น npm ล่าสุด ควรตรวจความพร้อมของรุ่นและ provider ก่อนสัญญาความสามารถ ([installation](../origin/docs/installation.md))
- การศึกษาครั้งนี้ไม่ได้ติดตั้ง REA ลงทะเบียน MCP เรียกใช้เครื่องมือ หรือทดสอบ target จริง
