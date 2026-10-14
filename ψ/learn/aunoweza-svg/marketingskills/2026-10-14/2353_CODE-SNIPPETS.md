# Marketing Skills — ตัวอย่างเนื้อหาและโค้ดจริง

ศึกษา repository อิสระ `aunoweza-svg/marketingskills` ที่ commit `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467` โดยอ่านไฟล์เท่านั้น ไม่มีการติดตั้งหรือเรียก CLI

## 1. บริบทผลิตภัณฑ์ร่วมกัน

`product-marketing` กำหนดให้สร้าง `.agents/product-marketing.md` และอ่านข้อมูลเดิมก่อนเก็บข้อมูลใหม่ ส่วน `cro` อ่านไฟล์นี้ก่อนถามคำถาม จึงใช้ข้อมูลผลิตภัณฑ์ กลุ่มเป้าหมาย และ positioning ร่วมกันได้

ตัวอย่างส่วนหนึ่งของแม่แบบจริง:

```markdown
## Target Audience
**Target companies:**
**Decision-makers:**
**Primary use case:**
**Jobs to be done:**
-
**Use cases:**
-
```

แหล่งที่มา: [product-marketing/SKILL.md บรรทัด 147–154](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills/product-marketing/SKILL.md#L147-L154), [cro/SKILL.md บรรทัด 22–24](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills/cro/SKILL.md#L22-L24)

## 2. แปลงการตรวจหน้าเว็บเป็นรายการปรับปรุงและสมมติฐาน

`cro` เริ่มจากประเภทหน้า เป้าหมาย conversion และแหล่ง traffic แล้วประเมิน value proposition, headline, CTA, trust และ friction ก่อนแยกข้อเสนอที่ทำได้ทันทีออกจากแนวคิดที่ควรทดลอง

ตัวอย่างรูปแบบผลลัพธ์จริง:

```markdown
### Quick Wins (Implement Now)
Easy changes with likely immediate impact.

### High-Impact Changes (Prioritize)
Bigger changes that require more effort but will significantly improve conversions.

### Test Ideas
Hypotheses worth A/B testing rather than assuming.
```

นี่คือคำสั่งวิธีคิดสำหรับ agent ไม่ใช่โปรแกรมที่วิเคราะห์เว็บเอง หลักฐานในไฟล์ยังระบุให้ใช้ `ab-testing` สำหรับการออกแบบและวัดผลการทดลอง

แหล่งที่มา: [cro/SKILL.md บรรทัด 13–30](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills/cro/SKILL.md#L13-L30), [รูปแบบผลลัพธ์ บรรทัด 114–130](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills/cro/SKILL.md#L114-L130)

## 3. CLI สำหรับเรียก GA4 พร้อม preview request

มีโค้ด integration จริงใน `tools/clis/ga4.js`: อ่าน access token จาก environment, ส่ง HTTP ด้วย `fetch`, กำหนด timeout และมีทางแยก `--dry-run` ที่คืนรายละเอียด request พร้อมปิดค่า Authorization

```javascript
async function api(method, baseUrl, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${baseUrl}${path}`, headers: { Authorization: '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${baseUrl}${path}`, { signal: requestSignal(),
    method,
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
```

คำสั่ง `reports run` สร้าง date range, dimensions, metrics และ pagination ก่อน POST ไปยัง `properties/{id}:runReport` ข้อควรรู้จากการอ่านโค้ด: การตรวจ `GA4_ACCESS_TOKEN` อยู่ก่อน `main()` และไม่ได้ยกเว้น dry-run ของรายงาน จึงไม่ควรตีความว่า preview รายงานทำได้โดยไม่มี environment token

แหล่งที่มา: [ga4.js บรรทัด 4–33](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tools/clis/ga4.js#L4-L33), [ตรวจ token บรรทัด 82–86](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tools/clis/ga4.js#L82-L86), [รายงาน บรรทัด 100–131](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tools/clis/ga4.js#L100-L131)

## สิ่งที่นำไปใช้ต่อได้

- เตรียมบริบทธุรกิจท่องเที่ยวครั้งเดียว แล้วให้สกิลแต่ละด้านอ่านร่วมกัน
- ใช้ CRO สร้างข้อเสนอปรับหน้าแพ็กเกจท่องเที่ยว พร้อมสมมติฐานที่จะวัดผล
- เชื่อมข้อมูล analytics ผ่าน CLI เมื่อมีบัญชีและ credentials พร้อม ทั้งสามข้อเป็นแนวทางประยุกต์ ไม่ใช่ผลทดสอบการใช้งานใน session นี้
