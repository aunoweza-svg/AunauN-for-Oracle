# maw-js Learning Index

## Source

- **Origin**: ./origin/
- **GitHub**: https://github.com/Soul-Brews-Studio/maw-js

## Explorations

### 2026-10-12 0120 (default)

- [[2026-10-12/0120_ARCHITECTURE|Architecture]]
- [[2026-10-12/0120_CODE-SNIPPETS|Code Snippets]]
- [[2026-10-12/0120_QUICK-REFERENCE|Quick Reference]]

**Key insights**: `maw-js` เป็น Bun/TypeScript control plane ที่ใช้ `tmux` และ Unix shell เป็น local execution plane โดยตรง จึงเหมาะกับ WSL2 มากกว่า Windows native ในปัจจุบัน การรองรับ Windows native ต้องเพิ่ม PowerShell/process executor, ConPTY/session backend และปรับ installer, shell quoting, PATH และ Unix utilities หลายส่วน
