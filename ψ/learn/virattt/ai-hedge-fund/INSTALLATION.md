# AI Hedge Fund — installation

ติดตั้งเมื่อ 2026-10-15 จาก https://github.com/virattt/ai-hedge-fund

- Source commit: `78b779c1389e2d1452dc29606d2c4126d859b964`
- Installed package: `aihf 2.5.0`
- Runtime: managed CPython 3.12.15; uv portable 0.13.1
- Source: `.learn-sources/virattt/ai-hedge-fund`
- Isolated environment: `.learn-sources/environments/ai-hedge-fund`
- [Installed versions and verification record](installation.json)

ติดตั้งด้วย uv จาก source checkout และ dependency constraints ของ pyproject.toml ไม่ใช่ Poetry lock sync เก็บรายการรุ่นจริงไว้ใน manifest เพื่อช่วยตรวจเมื่อย้ายเครื่อง Environment และ runtime อยู่ใน Git-ignored directories ไม่ได้ย้ายตามเอกสารใน repo โดยอัตโนมัติ

## เปิดใช้งาน

จาก PowerShell ใน workspace:

```powershell
.\aihf.cmd
```

เปิด terminal app เพื่อเลือก Paper Trading หรือ Backtesting ใช้ `Ctrl+C` เพื่อออก ดูคำสั่งอื่นได้ด้วย:

```powershell
.\aihf.cmd --help
.\aihf.cmd backtest --help
.\aihf.cmd paper list
```

`aihf.cmd` เรียก executable ใน environment โดยใช้ path สัมพันธ์กับ workspace ไม่ต้องเพิ่ม global PATH การย้ายทั้ง workspace อาจทำให้ Python virtual environment ใช้ไม่ได้ ต้องสร้าง environment และติดตั้งใหม่

## ข้อมูลผู้ใช้และ API keys

แอปใช้ `C:/Users/aunow/.hedge-fund/` สำหรับ mandates, paper portfolios, ledger, research และ cache; CLI startup สร้าง `mandates/example.yaml` แล้ว ไม่ได้สร้างพอร์ตหรือเรียกใช้งานเงินจริง

การใช้ข้อมูลตลาดจริงต้องมี Financial Datasets API key และงาน LLM investor agents ต้องมี key ของ model provider ที่เลือก งานติดตั้งนี้ไม่ได้ตั้งหรือทดสอบ keys เหล่านั้น ใช้หน้าจอตั้งค่าของแอปเก็บค่าไว้ใน `~/.hedge-fund/.env` บนเครื่อง ไม่ส่ง keys ใน chat และไม่ commit ไฟล์ credentials

- Financial Datasets: https://financialdatasets.ai
- การเชื่อม provider และทดสอบจริงอาจมีค่าใช้จ่ายตามบริการที่เลือก

## ตรวจแล้ว

- `aihf --help`: exit 0
- `aihf paper list`: exit 0, ไม่มีพอร์ตที่สร้างโดยรอบติดตั้ง
- `uv pip check`: 93 packages compatible
- Risk arithmetic: น้ำหนักจำลอง 0.8 ถูกจำกัดเหลือ 0.25 ตาม max_position_pct
- Installed Textual app: headless Home → Paper → Home navigation ผ่าน โดยใช้ workspace smoke directory และปิด HTTP ผ่าน requests
- ไม่ได้เรียก market/model API, ไม่ได้รัน backtest จากข้อมูลจริง และไม่ได้ประเมินผลตอบแทน

โค้ด SimBroker ใน commit นี้ยังไม่จำลอง slippage/ค่าซื้อขายและ margin ตาม docstring ของต้นทาง จึงต้องพิจารณาข้อจำกัดนี้เมื่อตีความผลจำลองในอนาคต
