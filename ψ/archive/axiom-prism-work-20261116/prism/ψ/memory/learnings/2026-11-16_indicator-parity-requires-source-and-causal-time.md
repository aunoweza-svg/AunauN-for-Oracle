---
date: 2026-11-16
source: INDICATOR-PLAN-20261115
concepts: [indicator-parity, source-provenance, causal-time, warmup]
---

# Indicator parity เริ่มจาก source และเวลาที่รู้ข้อมูลได้จริง

เมื่อมีเพียงสูตรย่อ ให้แยกสิ่งที่รู้จากพฤติกรรมที่ต้องอ่าน Pineเต็ม เช่น EMAseed, na, equality, barssinceเริ่มต้น, markerและmomentumfilter อย่าอ้างportตรงTradingViewจากภาพหรือสูตรหลักเพียงอย่างเดียว

ใช้ตัวคำนวณ pureแยกจากDOMและaccount รับเฉพาะข้อมูลถึงreplayindex ทดสอบ prefix invarianceโดยเปลี่ยนแท่งอนาคตแล้วผลเดิมต้องไม่เปลี่ยน HTFต้องกำหนดเวลาavailabilityและprevious-confirmed mappingโดยไม่ใช้closeที่ยังไม่รู้ Warmupใช้prehistoryก่อนวันเริ่มและตรวจseed/tolerance ไม่เดาจำนวนแท่งเพียงจากperiodที่ยาวที่สุด

เปรียบเทียบกับreferenceที่symbol/contract/OHLC/timestamps/inputsตรงกัน แยกnumeric toleranceจากสี/สัญญาณ/เวลาและความต่างfeed บันทึกconfig/version/sourcehashในrunและexportเพื่อทำซ้ำได้

ข้อจำกัดruntimeต้องตรวจเวอร์ชันจริง: TradingLabใช้LightweightCharts4.2.3จึงเสนอoscillatorchartแยกที่ซิงก์เวลา; nativepanesเริ่มv5 ส่วนmarketwidgetไม่รับcustomPine ข้อเสนอเหล่านี้ยังเป็นแผน ไม่มีindicatorimplementationหรือparitytestที่ผ่านแล้วในรอบนี้

Licenseต้องตรวจheaderต้นฉบับ ผู้เขียนแนวคิดไม่จำเป็นต้องเป็นเจ้าของlicenseของcode และต้องเก็บnotice/sourceprovenanceเมื่อport

ที่มา: แผนINDICATOR-PLAN-20261115ในแชตนี้ และเอกสารprimaryที่อ้างในretrospectiveวันที่2026-11-16
