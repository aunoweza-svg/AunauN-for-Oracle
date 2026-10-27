# UI/UX Pro Max — รูปแบบค้นข้อมูลและออกแบบจากซอร์ส

ศึกษา `nextlevelbuilder/ui-ux-pro-max-skill` ที่ commit `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03` เอกสารนี้อธิบายโค้ดที่อ่าน ไม่ใช่ผลการรันหรือการติดตั้ง

## ค้นข้อเสนอจากข้อมูล

[`core.py`](../origin/src/ui-ux-pro-max/scripts/core.py) สร้างดัชนีข้อความด้วย BM25: แปลงข้อความเป็นตัวพิมพ์เล็ก ปรับคำพ้อง ตัดเครื่องหมายวรรคตอนและ stopwords แล้วจัดอันดับตามความเกี่ยวข้องของคำกับข้อมูลในแต่ละแถว ผลเป็นการค้นจากคำ ไม่ใช่หลักฐานว่าข้อเสนอนั้นเหมาะกับผู้ใช้จริงเสมอไป โค้ดยังมีเกณฑ์คะแนนและ coverage ที่อาจทำให้ไม่ส่งผลลัพธ์เมื่อหลักฐานการจับคู่ไม่เพียงพอ

[`ux-guidelines.csv`](../origin/src/ui-ux-pro-max/data/ux-guidelines.csv) เก็บรายการเป็นหมวด ปัญหา platform คำอธิบาย แนวทางที่ควรและไม่ควรทำ ตัวอย่าง และ severity เช่น การไม่ให้ navigation แบบติดขอบบังเนื้อหา PRISM ใช้เป็นรายการตั้งคำถามในการตรวจ UI ได้ โดยตรวจบริบทและผลจริงของแต่ละผลิตภัณฑ์ต่อ

## ประกอบ design system

[`design_system.py`](../origin/src/ui-ux-pro-max/scripts/design_system.py) เริ่มจากค้นประเภทผลิตภัณฑ์ แล้วใช้กฎตามประเภทเพื่อค้นหลาย domain และเลือก style สี typography และรูปแบบหน้า พร้อมคำนึงถึงโหมดสี ตัวเลือก variance, motion และ density เพิ่มน้ำหนักการเลือกเมื่อระบุ จึงเป็นข้อเสนอเริ่มต้นที่ต้องตรวจความเหมาะสมและ accessibility ต่อ ไม่ใช่การรับประกันคุณภาพการออกแบบ

[`search.py`](../origin/src/ui-ux-pro-max/scripts/search.py) แสดงรูปแบบคำสั่ง ตัวอย่างต่อไปนี้เป็นเพียงตัวอย่างที่ปรับจาก interface ของซอร์ส ยังไม่ได้รัน:

```powershell
python src/ui-ux-pro-max/scripts/search.py "tourism booking dashboard" --design-system -p "Tourism Dashboard"
python src/ui-ux-pro-max/scripts/search.py "form validation" --domain ux
```

โหมด `--design-system` ไม่ใช้ `--stack` ที่ส่งร่วมกัน; หากต้องการแนวทางเฉพาะ stack ต้องค้นแยก การใส่ `--persist` เขียนไฟล์ `design-system/<project-slug>/MASTER.md` และ `--page` เพิ่มไฟล์เฉพาะหน้า โดยค่าเริ่มต้นข้าม master ที่มีอยู่ และ `--force` สั่งเขียนทับ ดังนั้นควรตรวจเส้นทางและไฟล์ก่อนใช้

## นำไปใช้กับ PRISM

เริ่มจากระบุผู้ใช้และงาน เช่น dashboard ท่องเที่ยวหรือการบริหาร แล้วใช้คำค้นเพื่อสำรวจ style และ UX ที่เกี่ยวข้อง จากนั้นคัดเลือกข้อเสนอให้เข้ากับข้อมูลจริง ทดลองกับหน้าจอและอุปกรณ์ที่ต้องใช้ และตรวจ accessibility กับสถานะผิดพลาด ผลการค้นเป็น input ให้การตัดสินใจ ไม่ใช่ผลทดสอบกับผู้ใช้
