# Investment & Finance Skills

ติดตั้ง 26 สกิลจาก fork ของผู้ใช้ เมื่อ 2026-10-15

- Source: https://github.com/aunoweza-svg/finance-skills
- Commit: `cedadc4b9f0f25c072576331a151863c8632a2d6`
- ตำแหน่งติดตั้ง: `C:/Users/aunow/.codex/skills`
- ตรวจครบ 99 ไฟล์ รวมเนื้อหาและ inventory; ยกเว้นการเปลี่ยนชื่อ frontmatter ที่บันทึกด้านล่าง ทุกไฟล์ตรงกับ Git blob ต้นทาง
- [Installation manifest และ SHA256](installation.json)

## วิธีใช้และสถานะ

เริ่มจากโจทย์จริง เช่น ประเมินมูลค่าบริษัทด้วย company-valuation, วิเคราะห์งบด้วย earnings-recap, ตรวจแนวโน้มด้วย sepa-strategy หรืออ่านข้อมูล Hyperliquid ด้วย hyperliquid-reader

การติดตั้งรอบนี้เพิ่ม SKILL.md และไฟล์อ้างอิง ไม่ได้ติดตั้ง ai-hedge-fund, external MCP, opencli, yfinance dependencies หรือเชื่อมบัญชี/API การพร้อมใช้ข้อมูลจริงต้องตรวจ runtime และ provider เฉพาะโจทย์ก่อน ไม่ใส่ credentials ในเอกสารหรือ chat

สกิลต้นทาง skill-creator ใช้ชื่อ finance-skill-creator ทั้งโฟลเดอร์และ frontmatter เพื่อไม่ชนกับสกิลระบบ Codex ซึ่งคงเดิม การปรับชื่อนี้เป็นความต่างจาก source เพียงรายการเดียว

generative-ui มีคำสั่งสำหรับ Claude show_widget ซึ่งอาจต้องปรับ renderer ตาม host ก่อนใช้จริง จัดประเภทเป็น instructions ที่ติดตั้งแล้ว ไม่ใช่การรับรองเครื่องมือทั้งหมด

ก่อนใช้ผลวิเคราะห์ลงทุน ให้ตรวจวันเวลา แหล่งข้อมูล สมมติฐาน และข้อจำกัดของวิธีวิเคราะห์ แยกผลคำนวณออกจากการคาดการณ์ ไม่มีการส่งคำสั่งซื้อขายจากการติดตั้งนี้

## แหล่งข้อมูลตลาด — 6

- [finance-sentiment](C:/Users/aunow/.codex/skills/finance-sentiment/SKILL.md)
- [fintel-data](C:/Users/aunow/.codex/skills/fintel-data/SKILL.md)
- [hormuz-strait](C:/Users/aunow/.codex/skills/hormuz-strait/SKILL.md)
- [hyperliquid-reader](C:/Users/aunow/.codex/skills/hyperliquid-reader/SKILL.md)
- [tradingview-mcp](C:/Users/aunow/.codex/skills/tradingview-mcp/SKILL.md)
- [tradingview-reader](C:/Users/aunow/.codex/skills/tradingview-reader/SKILL.md)

## วิเคราะห์ตลาดและหุ้น — 11

- [company-valuation](C:/Users/aunow/.codex/skills/company-valuation/SKILL.md)
- [earnings-preview](C:/Users/aunow/.codex/skills/earnings-preview/SKILL.md)
- [earnings-recap](C:/Users/aunow/.codex/skills/earnings-recap/SKILL.md)
- [estimate-analysis](C:/Users/aunow/.codex/skills/estimate-analysis/SKILL.md)
- [etf-premium](C:/Users/aunow/.codex/skills/etf-premium/SKILL.md)
- [options-payoff](C:/Users/aunow/.codex/skills/options-payoff/SKILL.md)
- [saas-valuation-compression](C:/Users/aunow/.codex/skills/saas-valuation-compression/SKILL.md)
- [sepa-strategy](C:/Users/aunow/.codex/skills/sepa-strategy/SKILL.md)
- [stock-correlation](C:/Users/aunow/.codex/skills/stock-correlation/SKILL.md)
- [stock-liquidity](C:/Users/aunow/.codex/skills/stock-liquidity/SKILL.md)
- [yfinance-data](C:/Users/aunow/.codex/skills/yfinance-data/SKILL.md)

## จัดการสกิล — 1

- [finance-skill-creator](C:/Users/aunow/.codex/skills/finance-skill-creator/SKILL.md)

## อ่านข่าวและชุมชน — 6

- [discord-reader](C:/Users/aunow/.codex/skills/discord-reader/SKILL.md)
- [linkedin-reader](C:/Users/aunow/.codex/skills/linkedin-reader/SKILL.md)
- [opencli-reader](C:/Users/aunow/.codex/skills/opencli-reader/SKILL.md)
- [telegram-reader](C:/Users/aunow/.codex/skills/telegram-reader/SKILL.md)
- [twitter-reader](C:/Users/aunow/.codex/skills/twitter-reader/SKILL.md)
- [yc-reader](C:/Users/aunow/.codex/skills/yc-reader/SKILL.md)

## วิเคราะห์ Startup — 1

- [startup-analysis](C:/Users/aunow/.codex/skills/startup-analysis/SKILL.md)

## แสดงผล — 1

- [generative-ui](C:/Users/aunow/.codex/skills/generative-ui/SKILL.md)
