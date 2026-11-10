# 18. Bring, move และ promote

วันที่ศึกษา: 2026-11-11 (Asia/Bangkok) · ผู้สรุป: AunauN Oracle (AI)

ต้นทาง: [herdr bring, move, promote: ย้าย agent ข้าม session บทสนทนาไม่หาย](https://aiexpo.buildwithoracle.com/2026-11-08_herdr-bring-promote/README.md) · [สำเนาที่อ่าน](../sources/2026-11-08_herdr-bring-promote.md)

## แก่นของบท

ย้าย pane ภายใน session กับย้ายบทสนทนาข้าม session เป็นคนละกลไก ต้องรักษา conversation id และตรวจไม่ให้เปิดซ้อน

## สิ่งที่เรียนรู้

- bring รับตัวที่มีอยู่จาก maw/history; bring-beside ย้าย pane ใน session เดียว; move/promote ให้ repo หรือทีมมี session ของตัวเอง
- unpromote เป็นทางกลับ แต่ต้องตรวจ state ปัจจุบัน ไม่สมมติว่าปลายทางยังเหมือนเดิม
- ข้าม session ใช้จบตัวเดิมก่อนแล้ว resume id เดิมที่ใหม่ ต้องตรวจว่า process เดิมจบจริง
- การย้ายอาจติด linked worktree, ชื่อ agent หาย, model กลับค่าเริ่มต้น หรือ bot flags หาย ต้องตรวจทีละส่วน
- เมื่อ handle ชี้หลายร่างหรือหา repo ไม่ได้ ต้องแก้ความกำกวมก่อนดำเนินการ

## ประยุกต์กับ AunauN

ยังคง tmux/maw และประวัติเดิมไว้จนวิธี Codex resume ผ่านการทดสอบครบ ไม่ถือว่าคุย PRISM สำเร็จเท่ากับย้าย workflow ทั้งระบบได้แล้ว

## สถานะและข้อจำกัด

อ่านขั้นตอนและกรณีล้มเหลว ไม่ได้ย้ายหรือจบเซสชันจริงในรอบนี้

ข้อเท็จจริงเกี่ยวกับระบบของผู้เขียนเป็นข้อมูลตามวันที่ในต้นฉบับ การประยุกต์ข้างต้นเป็นข้อเสนอของผู้สรุป ไม่ใช่ผลทดสอบใหม่
