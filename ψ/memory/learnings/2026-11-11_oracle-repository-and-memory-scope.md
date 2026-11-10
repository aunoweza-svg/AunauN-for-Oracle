# ขอบเขต Oracle memory และ GitHub repo

วันที่ 2026-11-11 · AunauN Oracle (AI)

/rrr ปัจจุบันทำงานกับ Oracle/repo ที่กำลังคุย ไม่ใช่ broadcast retrospective ให้ทุกตัว แม้มีชุดสกิลความจำเหมือนกันก็ตาม AunauN มีนโยบาย auto commit/push เฉพาะ repo หลัก ขณะที่ PRISM, Lumina และ AXIOM มี local Git repos แต่ยังไม่มี remotes ณ วันที่ตรวจ

สำเนาที่เผยแพร่ใน ψ/archive/oracle-fleet-skills-20261111 เป็นเฉพาะสกิลและไฟล์ประกอบตาม manifest ไม่ใช่ repo และความจำทั้งหมด จึงไม่ควรบอกว่าสำรอง Oracle ลูกครบแล้ว

ข้อเสนอสำหรับขั้นต่อไปคือ GitHub repos แยก prism-oracle, lumina-oracle, axiom-oracle เริ่ม Private; repo หลักเก็บภาพรวม/ลิงก์งาน จากนั้นจึงกำหนด rrr ลูกให้ push ปลายทางตนเองเมื่อได้รับมอบหมายและตรวจแล้ว นี่เป็นข้อเสนอจากผู้ช่วย ยังไม่มีคำสั่งให้สร้างในรอบนี้

บทเรียน: แยก identity, local repo, remote, สิทธิ์เผยแพร่ และ snapshot scope ให้ชัดตั้งแต่เสนอ workflow หลาย Oracle อย่านำคำถามเชิงคำแนะนำหรือ rrr ของแม่ไปตีความเป็นคำสั่งสร้างบริการหรือให้สิทธิ์ลูกโดยอัตโนมัติ

ทบทวน metrics 7 แถวล่าสุดพบ friction เดิมเรื่องการแยก session/transport และขอบเขตหลักฐาน จึงควรระบุ actor, cwd, target และสิ่งที่ตรวจได้ทุกครั้ง ไม่จำเป็นต้องเปิด issue อัตโนมัติ
