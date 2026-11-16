# CDC-PANE-LABELS-20261117

แก้ป้ายข้อความแนวโน้ม CDC ที่ขาดบนกราฟส่วนตัว เดิมมีเพียงข้อความใต้กราฟ เพิ่มกรอบpane labelพร้อมลูกศรชี้แท่งล่าสุดตามPine label.newบรรทัด144–162 ใช้ค่าชนิดแท่งปัจจุบัน(HA/ปกติ), bullish/bearish/sideways, BUY/SELL next barเมื่อเกิดสัญญาณ, สีพื้น/ข้อความและเหนือhigh/ใต้lowตามเงื่อนไขเดิม ไม่เพิ่ม labelย้อนหลังซึ่งต้นฉบับลบpreviouslabelอยู่แล้ว

เพิ่มcheckbox «ป้ายแนวโน้ม CDC» ด้านบนกราฟ ใช้setting cdc.assistเดิมและsyncกับ «ข้อความแนวโน้ม» ในformทั้งสองทิศ ไม่resetpreferences ถ้าผู้ใช้ปิดassistไว้ต้องเปิดเพื่อดูป้าย ข้อความใต้กราฟยังคงไว้สำหรับอ่านและaria-describedby

วาดเป็นLightweightCharts4.2foregroundseriesprimitiveติดกับแท่งล่าสุด redrawตามtick/TF/ชนิดแท่ง/resize/zoom/pan มีauto-scale marginเผื่อกรอบ เมื่อเลื่อนพ้นแท่งล่าสุดจะซ่อนและกลับเมื่อกดแท่งล่าสุด รูปร่างและข้อความปรับให้พอดีpaneมือถือ ตำแหน่งpixel/การตัดขอบขึ้นกับviewport ไม่ใช่TradingView Object Tree UI

ผลตรวจ: ownchartunit8cases PASS รวมตัวอย่างbranchสี/ตำแหน่ง/buy/sell/sideways/off, actualChromium+LWC browser8groups PASS/errors[] เพิ่มcaptureข้อความที่rendererวาดจริง ตรวจสี,pan/latest,ปิดassist/CDC,synccheckbox และทดสอบ6TF/livefixture/drawings/settings/reload/mobile/บัญชีเดิม ภาพdesktop1440และmobile390ตรวจด้วยตาแล้ว แสดงbubble/arrowชัด ไม่ล้นหน้า ราคาในภาพทดสอบเป็นsynthetic ไม่ใช่ราคาจริง

เปลี่ยน5ไฟล์ เก็บก่อนแก้ในbaseline/พร้อมSHA256 protectedmodel/journal/สูตรCDC/MSO/indicatorengine/Pineต้นฉบับคงเดิม ไม่เปลี่ยนระบบฝึก/marketfeedหรือเผยแพร่ ข้อจำกัดparityที่บันทึกในงานown-chartเดิมยังเหมือนเดิม ดูacceptance.jsonสำหรับhashและผลตรวจ
