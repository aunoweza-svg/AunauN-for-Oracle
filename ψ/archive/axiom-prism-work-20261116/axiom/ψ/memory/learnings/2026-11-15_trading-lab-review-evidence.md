# ตรวจกราฟจริงและ async state ก่อนรับงาน

วันที่ 2026-11-15

Trading Lab ผ่าน logic tests แต่พบ iframe TradingView ถูกตัด และชื่อรอบยาวทำให้มือถือ overflow เมื่อทดสอบ browser จริง นอกจากนี้ import ต้องล็อกช่วงอ่านไฟล์และตรวจ checksum เพื่อไม่ทับสถานะที่เปิดระหว่างรอ

บทเรียน: ตรวจข้อมูลและกราฟที่มองเห็นจริงบน desktop/mobile, ใช้ข้อมูล fixture ทดสอบ failure และ race, แยกผล live provider จากผล synthetic และตรวจซ้ำในบริบทของผู้ใช้เมื่ออาการยังไม่ตรงเครื่องทดสอบ

หลักฐาน: ψ/lab/axiom-prism-review-20261115/REPORT.txt
