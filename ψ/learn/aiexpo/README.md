# ARRA Oracle & Multi-Agent Workflow — บันทึกการเรียน

ศึกษาและสรุปโดย **AunauN Oracle (AI)** วันที่ 2026-11-11 (Asia/Bangkok)

ต้นทาง: [AIExpo Oracle](https://aiexpo.buildwithoracle.com/) · [สารบัญสำหรับ AI](https://aiexpo.buildwithoracle.com/llms.txt)

## ขอบเขตและสถานะ

ตรวจสารบัญสดพบ **21 บท** ต่างจากข้อความ Base64 ที่ผู้ใช้ให้ซึ่งมี 20 บท โดยบทเตรียมติดตั้ง Claude/ChatGPT เป็นส่วนที่เพิ่มมาในสารบัญสำหรับ AI เลขในชุดนี้เรียงตาม llms.txt ที่ดาวน์โหลด จึงต่างจากเลขในข้อความผู้ใช้และเลขที่บทเรียนอ้างกันเอง ใช้ slug/URL ระบุตัวบทเป็นหลัก

ดาวน์โหลด README.md ภาษาไทยครบ 21 บท อ่านและสรุปหลักการ ขั้นตอน ข้อควรตรวจ และการประยุกต์กับโปรเจกต์ครบทุกบท บทคลังสกิลศึกษาในระดับหน้าที่และ workflow ครบ 52 ตัว; **ยังไม่ได้ audit โค้ดทุกบรรทัดหรือรันแบบฝึกหัดทุกบท** สำเนา README อาจรวมโค้ดไว้ แต่ไฟล์ประกอบที่ลิงก์ออกไปไม่ได้ดาวน์โหลดทั้งหมด ไม่ได้ดูวิดีโอ ฟังเสียง ตรวจภาพทุกภาพ หรือเปิด PDF 100 หน้า

คำว่า “ศึกษาเอกสาร” ในตารางไม่ใช่ “ติดตั้งแล้ว” หรือ “ทดสอบผ่านแล้ว” ตัวอย่างคำสั่งและผลรันในต้นฉบับเป็นหลักฐานของผู้เขียน ณ วันที่ระบุ รุ่นซอฟต์แวร์ ราคา แผนบัญชี สิทธิ์ใช้งาน และ UI ต้องตรวจต้นทางทางการก่อนนำไปปฏิบัติ

## ดัชนีรายบท

| ลำดับในชุดนี้ | บันทึกการเรียน | สถานะ |
|---|---|---|
| 01 | [เตรียมเครื่องและสกิล Oracle](lessons/01-claude-chatgpt-install-guide.md) | ศึกษาเอกสาร |
| 02 | [ego(lite): เบราว์เซอร์สำหรับ agent](lessons/02-ego-lite-guide.md) | ศึกษาเอกสาร |
| 03 | [เชื่อม MCP ของบทเรียน](lessons/03-mcp-connect-guide.md) | ศึกษาเอกสาร |
| 04 | [ทำหนัง Oracle: เสียง ภาพ ลูป และตัดต่อ](lessons/04-phukhao-film-guide.md) | ศึกษาเอกสาร |
| 05 | [Phukhao และประวัติครอบครัว Oracle](lessons/05-phukhao-oracle-journey.md) | ศึกษาเอกสาร |
| 06 | [Herdr room: รวม pane แล้วส่งกลับ](lessons/06-herdr-room-lesson.md) | ศึกษาเอกสาร |
| 07 | [สร้าง MCP จากเล็กไปใหญ่](lessons/07-build-mcp-lesson.md) | ศึกษาเอกสาร |
| 08 | [Antigravity CLI กับ MCP](lessons/08-agy-mcp-lesson.md) | ศึกษาเอกสาร |
| 09 | [MCP ส่ง skill และ media](lessons/09-skills-media-mcp-lesson.md) | ศึกษาเอกสาร |
| 10 | [relic5: อ่าน UI และสถานะข้อมูล](lessons/10-relic5-ui-tour.md) | ศึกษาเอกสาร |
| 11 | [ทีม Oracle: บทบาท → charter → runtime](lessons/11-team-ecosystem-lesson.md) | ศึกษาเอกสาร |
| 12 | [Herdr ⌘J และ ⌘L](lessons/12-herdr-cmd-j-lesson.md) | ศึกษาเอกสาร |
| 13 | [ติดตั้ง relic5 และนำเข้าประวัติ](lessons/13-relic5-install.md) | ศึกษาเอกสาร |
| 14 | [ลายเซ็นดิจิทัลของบทเรียน](lessons/14-signature-lesson.md) | ศึกษาเอกสาร |
| 15 | [แผนที่ Herdr 52 สกิล](lessons/15-herdr-skill-map.md) | ศึกษาเอกสาร |
| 16 | [วงจร worktree หนึ่งงาน](lessons/16-herdr-wt-lifecycle.md) | ศึกษาเอกสาร |
| 17 | [Sleep, wake และ vacation](lessons/17-herdr-sleep-wake.md) | ศึกษาเอกสาร |
| 18 | [Bring, move และ promote](lessons/18-herdr-bring-promote.md) | ศึกษาเอกสาร |
| 19 | [Herdr หลายเครื่อง](lessons/19-herdr-machines.md) | ศึกษาเอกสาร |
| 20 | [Herdr ทุกสกิล ฉบับเต็ม](lessons/20-herdr-skills-full.md) | ศึกษาเอกสาร |
| 21 | [หนังสือ Herdr สี่สกิล](lessons/21-herdr-four-skills-book.md) | ศึกษาเอกสาร |

## อ่านต่อและตรวจหลักฐาน

- [สังเคราะห์สำหรับทีม AunauN](SYNTHESIS.md)
- [ดัชนี Herdr ทั้ง 52 สกิล](HERDR-SKILLS.md)
- [สถานะการทดลองจริง](PRACTICE-STATUS.md)
- [รายการต้นทาง ขนาดไฟล์ และ SHA-256](catalog.json)
- [สำเนาสารบัญที่ใช้](sources/catalog-llms.txt)
- `sources/` เก็บ README ต้นฉบับโดยไม่แก้ข้อความ; relative links ในสำเนาอาจเปิดในเครื่องไม่ได้ ให้ใช้ download_url ของบทใน catalog เพื่อกลับไปอ่านไฟล์ประกอบที่เว็บ

## ที่มาและการตรวจความครบ

ใช้ HTTPS GET อ่านไฟล์สาธารณะ ไม่ได้เรียก AIExpo MCP ในเซสชันนี้ SHA-256 ใน catalog ใช้ตรวจสำเนาที่เก็บไว้เท่านั้น **ยังไม่ได้ตรวจ Ethereum signature** และไม่ได้อ้างว่าต้นฉบับทุกข้อถูกต้องเพราะมีลายเซ็น แหล่งต้นฉบับเป็นผลงาน AIExpo Oracle; บันทึก lessons และ synthesis เป็นการเรียบเรียงใหม่ของ AunauN Oracle

รอบนี้เป็นการเรียนและบันทึกตามคำขอ ไม่ได้ติดตั้งสกิล เปลี่ยน config ย้าย/ปิด agent ส่งประวัติขึ้นฮับ สร้าง PR หรือ commit/push ขึ้น GitHub
