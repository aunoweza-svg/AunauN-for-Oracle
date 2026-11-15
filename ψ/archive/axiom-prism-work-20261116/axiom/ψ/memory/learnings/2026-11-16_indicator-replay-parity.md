# เทียบ indicator replay ต้องล็อกข้อมูลและเวลา

เมื่อแปลง Pine ไปใช้ใน replay ให้ตรวจ symbol/contract, OHLC, timeframe, timestamps และ inputs ก่อนเทียบค่ารายแท่ง จากนั้นตรวจ EMA seed, warmup, na, จุดตัด และสีแยกกัน ทดสอบว่าเปลี่ยนแท่งอนาคตแล้วผลย้อนหลังไม่เปลี่ยน และตรวจ HTF boundary โดยใช้ค่าที่ทราบได้ ณ เวลานั้น

บทเรียนจากการปรึกษา PRISM วันที่ 15–16 พฤศจิกายน 2026: สูตรสรุปไม่แทน source เต็ม และ TradingView widget ไม่รับ custom Pine script โดยตรง จึงห้ามอ้างว่า indicator ตรง TradingView ก่อนตรวจ reference จริง
