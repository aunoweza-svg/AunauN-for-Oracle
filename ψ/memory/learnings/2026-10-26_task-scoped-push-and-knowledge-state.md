---
pattern: "แยกสถานะอ่าน แก้ commit และ push พร้อมตรวจขอบเขต index ใน repository ที่มีหลายงาน"
date: 2026-10-26
source: "rrr: Workshop MD File"
concepts: [git, collaboration, partial-staging, provenance, knowledge-continuity]
---

# ส่งความรู้ข้ามเครื่องด้วยสถานะที่ตรวจได้

การอ่านไฟล์ การแก้และบันทึกไฟล์ การ commit และการ push เป็นคนละสถานะ บอกผู้ใช้ให้ชัดว่าไฟล์ใดอยู่ในเครื่องและไฟล์ใดอยู่บน remote แล้ว การล็อกอินบัญชีเดิมหรือ clone repository ไม่ได้พาไฟล์ untracked และการเปลี่ยนแปลงที่ยังไม่เผยแพร่ไปด้วย

## วิธีปฏิบัติที่นำไปใช้ซ้ำได้

1. ตรวจ git status และ cached diff ก่อนเผยแพร่ แม้เคยให้ชุดคำสั่งตัวอย่างแล้ว เพราะมีงานอื่นเพิ่มได้ระหว่างทาง
2. เลือกไฟล์ของงานที่ได้รับอนุญาตด้วย path ชัดเจน หลีกเลี่ยงการ stage ทุกไฟล์เมื่อ repository มีหลายงาน
3. หาก log หรือ metrics รวมหลายงานในไฟล์เดียว ให้เลือกเฉพาะ hunk/แถวที่เกี่ยวข้องผ่าน index โดยไม่แก้ทับหรือลบงานที่ยังไม่ต้องส่งใน working tree
4. ตรวจชุดไฟล์และ cached diff อีกครั้งก่อน commit; สำหรับไฟล์ binary ที่ต้องคงต้นฉบับ ตรวจ blob ที่ stage เทียบข้อมูลดิบเมื่อมีเหตุให้ต้องยืนยัน
5. push แล้วตรวจ SHA บน remote ให้ตรงกับ commit ที่ต้องการ อย่าถือว่าการ commit ในเครื่องสำเร็จคือการส่งขึ้น GitHub สำเร็จ
6. เมื่อมีคำขออ่านเอกสารเพิ่มเติม ให้บันทึกสถานะว่าอ่านแล้ว แต่อย่าเหมารวมว่าแก้หรือเผยแพร่ไปพร้อมชุดก่อนหน้า
7. การเขียน retrospective รอบใหม่เป็นงานบันทึกในเครื่อง; ต้องมีขอบเขตการเผยแพร่ที่ชัดก่อน stage/commit/push อีกครั้ง

## หลักฐานจากเซสชันนี้

ไฟล์ metrics มีแถว Persona กับแถวจากอีกเซสชัน ผมใช้ partial index patch เลือกเฉพาะแถว Persona และตรวจชุดไฟล์ 7 รายการก่อน commit 280d409 จากนั้นตรวจ remote main ได้ SHA ตรงกับ HEAD ไฟล์แผนการตลาดพะเยาที่อ่านภายหลังยังเป็น untracked จึงไม่อยู่ใน commit นั้น

เมื่ออ่านแผน ให้แยกเป้าหมายออกจากผลจริง และอย่ารวม KPI ระดับโครงการกับตัวเลขเดียวกันที่แสดงซ้ำในระดับกิจกรรม งบกิจกรรมย่อยใช้ตรวจผลรวมได้ แต่ไม่ควรนับงบระดับโครงการซ้ำเป็นยอดใช้จ่ายอีกก้อน

อ้างอิง:
- Commit: https://github.com/aunoweza-svg/AunauN-for-Oracle/commit/280d40980d337c5225816eeebceca1795bd82df3
- Retrospective: D:/OneDrive/เดสก์ท็อป/Workshop MD File/ψ/memory/retrospectives/2026-10/26/22.47_github-sync-and-phayao-plan.md
- Shared metrics: D:/OneDrive/เดสก์ท็อป/Workshop MD File/ψ/memory/learnings/session-metrics.md
