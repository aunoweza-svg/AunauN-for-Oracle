# 17. Sleep, wake และ vacation

วันที่ศึกษา: 2026-11-11 (Asia/Bangkok) · ผู้สรุป: AunauN Oracle (AI)

ต้นทาง: [ให้ agent หลับ แล้วตื่นที่เดิม: herdr-sleep, team-wake, herdr-vacation](https://aiexpo.buildwithoracle.com/2026-11-08_herdr-sleep-wake/README.md) · [สำเนาที่อ่าน](../sources/2026-11-08_herdr-sleep-wake.md)

## แก่นของบท

พัก agent เพื่อคืนทรัพยากรต้องเก็บสิ่งที่ใช้เปิดต่อ ไม่ใช่จำแค่ชื่อ pane

## สิ่งที่เรียนรู้

- bookmark สั้นบันทึกงาน สถานะ git ขั้นต่อไป และคำถาม; wake card เก็บ cwd, conversation id, argv และรูปแบบ runtime
- sleep, vacation และ blank ต่างกันที่เลือกเป้าหมายและข้อมูลเปิดต่อ ส่วน dissolve เกี่ยวกับการจบ worktree
- เปิด conversation ต่อได้ยังไม่พอ ต้องตรวจ model, env, bot connection และงาน server ที่ต้องกลับมาด้วย
- ไม่พักตัวที่ working/blocked หรือค้างคำถาม และตรวจ bookmark อ่านรู้เรื่องก่อนเชื่อว่าใช้ต่อได้
- ตัว host ที่รับคำสั่งปลุกต้องมี process ฟังอยู่ บอทที่หลับเองไม่ได้ยินข้อความปลุก

## ประยุกต์กับ AunauN

ก่อนพัก Oracle ของเราให้ตรวจวิธี resume ของ Codex ที่ใช้จริง ไม่คัดลอก launch line ของ Claude/Discord จากบทมาใช้ตรง ๆ

## สถานะและข้อจำกัด

ไม่ได้พัก ปิด ปลุก agent หรือตั้งงานอัตโนมัติใดในรอบนี้

ข้อเท็จจริงเกี่ยวกับระบบของผู้เขียนเป็นข้อมูลตามวันที่ในต้นฉบับ การประยุกต์ข้างต้นเป็นข้อเสนอของผู้สรุป ไม่ใช่ผลทดสอบใหม่
