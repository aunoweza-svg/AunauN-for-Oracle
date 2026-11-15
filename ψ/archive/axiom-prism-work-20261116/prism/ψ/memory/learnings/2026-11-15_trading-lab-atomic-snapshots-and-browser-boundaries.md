---
date: 2026-11-15
source: AXIOM-PRISM-20261115 / FOUR-RRR-20261115
concepts: [atomic-snapshot, async-import, browser-layout, independent-review]
---

# Trading Lab: ตรวจขอบเขต async และสิ่งที่ผู้ใช้เห็นจริง

snapshotที่กู้คืนได้ต้องรวมdataset, replayindex, ledgerและposition แล้วpersistสำเร็จก่อนcommitlive state การimportต้องlockตั้งแต่File.textผ่านSHA256/confirmation/transaction พร้อมตรวจpositionซ้ำในlock เพราะawaitเป็นช่วงที่ผู้ใช้แทรกการเปิดสถานะได้ ต้องทดสอบด้วยการหน่วงแต่ละช่วงและตรวจว่าข้อมูลเดิมไม่สูญหาย

mobileacceptanceใช้ชื่อไม่เว้นวรรค200ตัวและชื่อว่างที่แสดงUUID หลังchartมีข้อมูลแล้วresize desktop→mobile กำหนดminmax(0,1fr), min-width:0และoverflow-wrap:anywhereให้account รอสองanimationframesและpolldocument/account/canvascontainment ไม่ใช้screenshotเป็นdelay เคสใหม่failก่อนแก้CSSและผ่านสองรอบหลังแก้ (mobile scrollWidth390ตรงviewport390, account scrollWidth309ตรงclientWidth309)

third-partywidgetต้องตรวจiframeboundsและข้อมูลที่มองเห็น HTTP200/iframe/canvasอย่างเดียวไม่พิสูจน์กราฟที่ใช้ได้ กรณีนี้placeholderดันiframeลงนอกกรอบ แก้fixedouter+100%containerwrapperแล้วBTCมีOHLCจริง ส่วนSETทั้งสามยังถูกproviderปฏิเสธ จึงแจ้งไทยทันทีและให้externalsymbol linksตามขอบเขตที่ตกลง

ส่งงานข้ามrepoด้วยstaged+original+manifest+patch+hash-guardedinstaller ให้เจ้าของreporeview/ติดตั้งแล้วตรวจinstalled files แยกคำว่าimplementationพร้อมจากตรวจรับผ่านจริง การขอrrrไม่ใช่สิทธิ์เพิ่มremoteหรือเผยแพร่

หลักฐาน: ψ/lab/axiom-prism-20261115/REVIEW-REPORT.md, browser/results.json, browser-overflow-pass1/results.json, browser/layout-results.json, widget/results.json และรายงานตรวจรับAXIOMที่อ้างในretrospective

ข้อจำกัด: เป็นบทเรียนจากChromium/ต้นแบบนี้ ไม่แทนทุกbrowser/ฟอนต์ และSHA256ไม่ใช่ลายเซ็นรับรองแหล่งราคา
