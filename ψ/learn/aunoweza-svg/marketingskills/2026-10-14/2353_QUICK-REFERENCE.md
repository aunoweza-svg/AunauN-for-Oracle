# marketingskills — คู่มืออ้างอิง

ศึกษา fork `aunoweza-svg/marketingskills` ณ commit `c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467` วันที่ 2026-10-14 โดยอ่านไฟล์เท่านั้น ไม่ติดตั้งสกิลหรือเชื่อมบัญชี

## คืออะไร

เป็นคลัง **Agent Skills**: ไฟล์ Markdown ที่ให้ AI agent ใช้ความรู้และขั้นตอนการตลาด เช่น copywriting, SEO, CRO, ads และ analytics ไม่ใช่ agent อิสระที่รับงานเอง พบโฟลเดอร์สกิล 50 รายการ และ plugin manifest ระบุรุ่น 2.11.29; README และ metadata ยังอ้างผู้สร้าง Corey Haines และ upstream `coreyhaines31/marketingskills` แม้ checkout ที่ศึกษาคือ fork ของผู้ใช้ [README](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/README.md), [manifest](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/.claude-plugin/plugin.json), [skills](https://github.com/aunoweza-svg/marketingskills/tree/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills)

## วิธีติดตั้งจาก fork นี้

ตัวอย่างด้านล่าง **ปรับ owner จากคำสั่ง upstream ใน README เป็น `aunoweza-svg`** เพื่อเลือก fork ตามโจทย์ เป็นคำแนะนำจากเอกสาร ไม่ได้รันหรือยืนยันความเข้ากันได้กับ client บนเครื่องนี้

```bash
# ดูรายการก่อน
npx skills add aunoweza-svg/marketingskills --list

# เลือกเฉพาะสกิล
npx skills add aunoweza-svg/marketingskills --skill product-marketing copywriting cro analytics

# ทั้งคลัง
npx skills add aunoweza-svg/marketingskills
```

README ระบุว่า CLI ตรวจ agent และตำแหน่งติดตั้ง: universal agents ใช้ `.agents/skills/` ส่วน Claude Code ใช้ `.claude/skills/`; หากติดตั้งใน agent session และต้องการ Claude Code ให้ระบุ `-a claude-code` โดยตรง

ทางเลือก plugin ตาม README โดยเปลี่ยน owner เช่นเดียวกัน:

```bash
# Codex
codex plugin marketplace add aunoweza-svg/marketingskills
# จากนั้นเปิด /plugins ภายใน Codex และเลือก marketing-skills
```

สำหรับ interactive Claude Code ใช้ `/plugin marketplace add aunoweza-svg/marketingskills` แล้ว `/plugin install marketing-skills` ได้ตามวิธีใน README; เอกสารยังมี clone/copy, submodule, SkillKit และ Claude Web ZIP โดยลิงก์ Releases ของ ZIP ยังชี้ upstream จึงต้องตรวจแหล่ง artifact แยกก่อนใช้ [วิธีติดตั้งทั้งหมด](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/README.md#installation)

## กลุ่มงานที่มี

จัดกลุ่มเพื่อค้นหาใช้งาน โดยยึดรายการใน README ไม่ใช่รายชื่อครบทุกสกิล:

| งาน | สกิลตัวอย่าง |
|---|---|
| บริบทและแผน | `product-marketing`, `marketing-plan`, `customer-research`, `offers`, `pricing` |
| เนื้อหาและการสื่อสาร | `copywriting`, `copy-editing`, `content-strategy`, `emails`, `social`, `image`, `video` |
| SEO และการค้นพบ | `seo-audit`, `ai-seo`, `programmatic-seo`, `site-architecture`, `schema` |
| ปรับ conversion | `cro`, `signup`, `onboarding`, `popups`, `paywalls` |
| โฆษณาและการกระจาย | `ads`, `ad-creative`, `events`, `influencer-marketing`, `co-marketing` |
| วัดผลและทดลอง | `analytics`, `attribution`, `ab-testing` |
| ขายและเติบโต | `prospecting`, `cold-email`, `sales-enablement`, `revops`, `referrals`, `churn-prevention` |

[รายการและคำอธิบายสกิล](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/README.md#available-skills)

## เริ่มใช้งาน

เริ่มด้วย `product-marketing` เพื่อสร้าง `.agents/product-marketing.md` บันทึกสินค้า ลูกค้า และ positioning; สกิลอื่นอ่านบริบทนี้ก่อนทำงาน จากนั้นสั่งงาน เช่น “ช่วยเขียนหน้าแพ็กเกจ”, “ตรวจ SEO” หรือ “ออกแบบ A/B test” ตามหน้าที่สกิล [product-marketing](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills/product-marketing/SKILL.md)

`marketing-loops` ใช้ประกอบ workflow ที่ทำซ้ำ โดยกำหนด cadence, action condition, state, self-check และ stop condition; ยังต้องตั้ง scheduler และขอบเขตการทำงานใน environment จริง การติดตั้งสกิลไม่ได้ทำให้มีงานอัตโนมัติทันที [marketing-loops](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/skills/marketing-loops/SKILL.md)

## บัญชีและเครื่องมือเป็นอีกขั้นตอน

ติดตั้งสกิลเพิ่มคู่มือให้ agent แต่ **ไม่ได้เชื่อม GA4, Google Ads, Meta Ads หรือบัญชีอื่นโดยอัตโนมัติ** ต้องเลือก tool/account, ตั้ง OAuth หรือ API credentials ในเครื่อง, ตรวจ permissions และทดสอบการอ่านข้อมูลอย่างจำกัดตาม `tools/SETUP.md` โดยเก็บ secrets นอก chat; การแก้ campaign, ส่งข้อความ และเปลี่ยนงบเป็นการกระทำแยกจากขั้นตอนเชื่อมต่อ [SETUP](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/tools/SETUP.md)

## นำมาใช้กับ Tourism Marketing

**ข้อเสนอประยุกต์ต่อไปนี้เป็นการอนุมานจากหน้าที่สกิล ไม่ใช่ความสามารถเฉพาะอุตสาหกรรมหรือผลลัพธ์ที่รับประกัน**:

| โจทย์ท่องเที่ยว | สกิลที่นำมาปรับใช้ | ตัวอย่างงาน |
|---|---|---|
| เข้าใจนักท่องเที่ยวและข้อเสนอ | `customer-research`, `product-marketing`, `offers` | สังเคราะห์รีวิว/สัมภาษณ์ที่มีสิทธิ์ใช้ แล้วร่าง positioning ของทัวร์ |
| หน้าแพ็กเกจและการจอง | `copywriting`, `cro`, `ab-testing` | ร่างหน้าแพ็กเกจและแผนทดลอง CTA โดยตรวจ tracking และ sample size |
| เนื้อหาปลายทาง | `content-strategy`, `seo-audit`, `site-architecture` | วางหัวข้อและโครงสร้างหน้าแหล่งท่องเที่ยวจากข้อมูลจริง |
| แคมเปญตามฤดูกาล | `social`, `ads`, `ad-creative`, `influencer-marketing` | เตรียมโพสต์และ creative เพื่อให้คนตรวจ ก่อนเผยแพร่หรือใช้งบ |
| วัดเส้นทางสู่การจอง | `analytics`, `attribution` | วาง event/funnel และแผนอ่านรายงานจากบัญชีที่เชื่อมแล้ว |

เลือกสกิลจากโจทย์จริงและปรับภาษาจาก SaaS/B2B ให้ตรงบริการท่องเที่ยว โดยใช้ [คำอธิบายสกิลใน README](https://github.com/aunoweza-svg/marketingskills/blob/c7d7dfb6b460fc376b4b2204b78a9c9fd5ca6467/README.md#available-skills) เป็นฐาน
