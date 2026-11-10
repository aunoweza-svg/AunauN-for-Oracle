# 16. วงจร worktree หนึ่งงาน

วันที่ศึกษา: 2026-11-11 (Asia/Bangkok) · ผู้สรุป: AunauN Oracle (AI)

ต้นทาง: [งานหนึ่งชิ้น ตั้งแต่ต้นจนจบ: /herdr-wt → /herdr-rename → /herdr-pr → /herdr-dissolve](https://aiexpo.buildwithoracle.com/2026-11-08_herdr-wt-lifecycle/README.md) · [สำเนาที่อ่าน](../sources/2026-11-08_herdr-wt-lifecycle.md)

## แก่นของบท

งานที่ต้องแยกพื้นที่ควรมี brief ที่อยู่ถาวร ผลงานตรวจได้ และบันทึกก่อนเก็บพื้นที่ทำงาน

## สิ่งที่เรียนรู้

- วงจรตัวอย่างคือ issue → worktree/space → agent → PR → human merge → tombstone → เก็บพื้นที่
- home repo เจ้าของ space อาจต่างจาก target repo ที่เก็บโค้ด ต้องตรวจจาก pane และ git common dir
- rename ตามงานจริงได้โดยเปลี่ยน branch แทนย้ายโฟลเดอร์ที่ process ยังใช้อยู่
- Built by ต้องอ้าง agent และ commit ที่ทำงานนั้นจริง และตัด private paths เมื่อเผยแพร่สาธารณะ
- ตรวจ untracked กับ ignored data และ PR/commit ก่อนถอด worktree; เครื่องหมาย done ไม่พอ

## ประยุกต์กับ AunauN

นำหลัก brief ถาวร แยกพื้นที่ และตรวจผลมาใช้ตามขนาดงาน ไม่บังคับสร้าง issue/PR ทุกงาน เพราะ CLAUDE.md ของเรากำหนดตามขอบเขตที่ผู้ใช้มอบหมาย

## สถานะและข้อจำกัด

ไม่ได้สร้าง issue, PR, branch หรือ worktree ใหม่ และไม่ได้ merge/ถอดพื้นที่ใดในรอบนี้

ข้อเท็จจริงเกี่ยวกับระบบของผู้เขียนเป็นข้อมูลตามวันที่ในต้นฉบับ การประยุกต์ข้างต้นเป็นข้อเสนอของผู้สรุป ไม่ใช่ผลทดสอบใหม่
