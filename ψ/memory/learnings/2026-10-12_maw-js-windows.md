---
pattern: "Learned maw-js: WSL2 is the practical Windows runtime; native Windows requires a new executor and session backend"
date: 2026-10-12
source: "learn: Soul-Brews-Studio/maw-js"
concepts: ["learn", "maw-js", "windows", "wsl2", "tmux", "bun", "multi-agent"]
---

# Learned maw-js for Windows

`maw-js` แยก control plane ที่ค่อนข้าง portable ออกจาก local execution plane ที่ผูกกับ `bash`, `tmux`, Unix PATH และเครื่องมืออย่าง `stty`, `script`, `tail` และ `cat` ดังนั้นเส้นทางใช้งานบน Windows ที่สอดคล้องกับโค้ดปัจจุบันที่สุดคือ WSL2

การทำ Windows-native port ไม่ใช่เพียงเปลี่ยน installer แต่ต้องมี platform-aware local executor, backend สำหรับ ConPTY/session/pane, ปรับ transport selection และตรวจ POSIX shell/path assumptions ทั่วทั้งคำสั่งและ plugins
