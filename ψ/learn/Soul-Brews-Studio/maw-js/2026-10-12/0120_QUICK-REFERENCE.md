# maw-js Quick Reference — Windows / WSL2

> ศึกษาจาก repository `Soul-Brews-Studio/maw-js` ณ วันที่ 2026-10-12  
> ข้อสรุปทุกข้ออ้างอิงไฟล์ใน repository นี้เท่านั้น

## maw-js คืออะไร

`maw-js` คือ CLI สำหรับควบคุม AI agent หลายตัวและหลายเครื่อง: เปิด agent ในหน้าต่าง `tmux`, ส่งงาน, ดูหน้าจอ, ตรวจค่าใช้จ่าย และเชื่อม node เป็น federation จาก terminal เดียว ตัวระบบเขียนด้วย TypeScript และรันบน Bun รองรับ engine เช่น Claude Code, Codex, Aider และ OpenCode (`README.md:6-11`, `package.json:37`).

## สถานะบน Windows

| วิธีใช้งาน | สถานะที่ตรวจพบ |
|---|---|
| **WSL2 (Linux บน Windows)** | **น่าจะใช้ได้** เพราะคำสั่งติดตั้งเป็น Bash, runtime คือ Bun และงาน multi-agent ใช้ `tmux`; อย่างไรก็ตาม repository ไม่มีคู่มือ WSL2 หรือ CI บน Windows/WSL2 โดยเฉพาะ จึงเป็น **ข้ออนุมาน ไม่ใช่คำรับรองอย่างเป็นทางการ** |
| **Windows แบบ native (PowerShell/CMD)** | **ไม่มีวิธีติดตั้งหรือคู่มือที่ระบุไว้** ตัวติดตั้งคือ `install.sh`, เรียก Bash utilities และ core workflow พึ่ง `tmux` (`install.sh`, `CONTRIBUTING.md:13`) |
| **macOS/Linux** | เป็นสภาพแวดล้อมที่เอกสารและคำสั่งตัวอย่างใช้โดยตรง; contributor guide ระบุ Bun 1.3+, `tmux` สำหรับ multi-agent และ `ssh` บน Linux สำหรับ federation (`CONTRIBUTING.md:13`) |

ดังนั้น สำหรับเครื่อง Windows ให้เริ่มใน **WSL2** และเก็บ repo/config ไว้ใน filesystem ของ WSL เพื่อให้ shell, path และ `tmux` เป็นแบบ Linux สม่ำเสมอ ประโยคหลังนี้เป็นคำแนะนำเชิงอนุมานจาก dependency ไม่ได้ระบุไว้ใน repository.

## WSL2 readiness checklist

รายการที่ยืนยันจากไฟล์โครงการ:

- [ ] มี Bash: installer เป็น `#!/bin/bash` และ test/build scripts หลายรายการเรียก `bash` (`install.sh:1`, `package.json:17-35`).
- [ ] ติดตั้ง **Bun 1.3+** (`README.md` badge, `CONTRIBUTING.md:13`). หากยังไม่มี installer จะเรียก `curl -fsSL https://bun.sh/install | bash` (`install.sh:107-111`).
- [ ] ติดตั้ง **tmux** หากต้องการ wake/ควบคุม agent หลายตัว (`CONTRIBUTING.md:13`, `README.md:8`).
- [ ] มี AI engine ที่ต้องการใช้บน `PATH` เช่น Claude Code, Codex, Aider หรือ OpenCode (`README.md:10-11`).
- [ ] มี `curl` สำหรับ one-line installer (`README.md:16`).
- [ ] มี `git`; ถ้าจะใช้รูปแบบ clone/wake จาก repo ให้มี `ghq` ด้วย (`README.md:24`, `README.md:109`).
- [ ] หากใช้ federation บน Linux ให้ `ssh` อยู่บน `PATH` (`CONTRIBUTING.md:13`).
- [ ] หากใช้ UI installer แบบแนะนำ ให้ login `gh` ก่อน (`README.md:58-63`).
- [ ] หากให้ server ทำงานต่อเนื่อง อาจใช้ PM2; เอกสาร federation แนะนำ `pm2 start "maw serve" --name maw-server` และ `pm2 save` (`docs/federation/getting-started.md:13-20`).

สิ่งที่ **ไม่พบ** ใน repository: เวอร์ชัน Ubuntu/WSL ที่รับรอง, ขั้นตอนเปิด WSL2, package-manager commands สำหรับติดตั้ง `tmux`/`ghq`/`ssh`, และผลทดสอบ native Windows.

## การติดตั้ง

### วิธีสั้นที่สุดใน WSL2

```bash
curl -fsSL https://raw.githubusercontent.com/Soul-Brews-Studio/maw-js/main/install.sh | bash
```

หรือใช้ Bun โดยตรง:

```bash
bun add -g github:Soul-Brews-Studio/maw-js
```

ติดตั้งจาก source:

```bash
ghq get Soul-Brews-Studio/maw-js
cd "$(ghq root)/github.com/Soul-Brews-Studio/maw-js"
bun install
bun link
```

ทั้งสามรูปแบบมาจาก `README.md:14-25`. ตัว installer ติดตั้ง executable ไว้ใน `~/.bun/bin/maw`; ถ้าคำสั่งยังหาไม่พบ ให้เพิ่ม directory นี้ใน `PATH` (`install.sh:168-176`).

ตรวจหลังติดตั้ง:

```bash
maw --version
maw --help
```

## เริ่มใช้งาน

```bash
# เปิด API server ที่ port 3456
maw serve

# ดู session ล่าสุด
maw ls --recent 5

# ปลุก oracle ใน tmux แบบแบ่งหน้าจอ
maw wake neo --split

# ส่งข้อความ
maw hey neo "what are you working on?"

# ดูหน้าจอ agent
maw peek neo

# หยุดอย่างนุ่มนวล
maw sleep neo
```

คำสั่ง quick start เหล่านี้อยู่ใน `README.md:42-48` และ CLI reference ที่ `README.md:154-180`.

ปลุกจาก GitHub repository ได้โดยตรง:

```bash
maw wake org/repo
maw wake https://github.com/org/repo
maw wake org/repo --issue 5
```

`maw wake` จะใช้ `ghq` ใน flow นี้ (`README.md:107-112`).

## ฟีเจอร์หลัก

- **Agent lifecycle:** `wake`, `peek`, `hey`, `sleep`, `done`, snapshot และ restore (`README.md:154-180`, `README.md:227-235`).
- **หลาย engine:** Claude Code, Codex, Aider และ OpenCode (`README.md:10-11`).
- **Team workspace:** charter YAML กำหนดสมาชิก, engine, worktree และ prompt; worker แยก Git worktree (`README.md:205-224`).
- **Federation:** ติดต่อ node อื่น, sync agent registry, health check และส่งข้อความที่ลงลายเซ็น HMAC-SHA256 (`README.md:122-142`, `docs/federation/getting-started.md`).
- **Web UI:** backend ไม่รวม React frontend โดยอัตโนมัติ; ติดตั้งแยกด้วย `maw ui install` จาก `maw-ui` release (`README.md:53-88`).
- **Plugin system:** list/install/enable plugin และให้ plugin เปิด service/UI ของตัวเอง (`README.md:182-202`).

## Configuration

ไฟล์ user config ที่เอกสาร federation ระบุคือ:

```text
~/.config/maw/maw.config.json
```

ตัวอย่างขั้นต่ำสำหรับ node เดียว:

```json
{
  "host": "local",
  "port": 3456,
  "node": "aunaun-wsl",
  "oracle": "aunaun",
  "commands": {
    "default": "codex"
  },
  "sessions": {}
}
```

`host`, `port`, `env`, `commands`, `sessions`, `node`, `oracle` และ engine-related fields อยู่ใน `src/config/types.ts`; ตัวอย่าง mapping ของ Claude/Codex ดูได้ใน `maw.config.example.json`. คำสั่งจริงของ engine ต้องตรงกับ CLI ที่ติดตั้งใน WSL ของผู้ใช้.

สำหรับ federation:

```json
{
  "node": "aunaun-wsl",
  "oracle": "aunaun",
  "federationToken": "replace-with-a-shared-secret-at-least-16-chars",
  "namedPeers": [
    { "name": "other-node", "url": "http://other-host:3456" }
  ]
}
```

เอกสารกำหนด token อย่างน้อย 16 ตัวอักษรและต้องใช้ค่าเดียวกันระหว่าง peer (`docs/federation/getting-started.md:65-76`). อย่า commit token จริงลง Git.

ตรวจ path และ migration ของ config/state/data/cache:

```bash
maw doctor xdg
maw doctor xdg --json
maw doctor xdg --migrate --dry-run
```

ตั้ง `MAW_XDG=1` เพื่อ opt in สู่ XDG paths; ตัว resolver ยังรองรับ `MAW_HOME`, `MAW_CONFIG_DIR`, `MAW_DATA_DIR`, `MAW_STATE_DIR` และ `MAW_CACHE_DIR` (`README.md:90-103`, `src/core/xdg.ts`).

## UI และ federation แบบย่อ

```bash
maw ui install
maw ui status
maw serve
maw ui
```

UI เปิดผ่าน server ที่ `http://localhost:3456` ตาม quick start (`README.md:42-45`). หากเชื่อมหลายเครื่อง:

```bash
maw federation status
maw federation sync --dry-run
maw federation sync
maw federation --verify
```

รายละเอียด network, identity และ peer config อยู่ใน `docs/federation/getting-started.md`.

## พัฒนา/ทดสอบจาก source

```bash
bun install
bun run maw --help
bun run preflight
bun run test:all
bun run build
```

`bun run test:all` เป็น test gate ที่โครงการกำหนด; ไม่ควรแทนด้วย raw `bun test` เพราะมี test ที่ต้องแยก isolation (`CONTRIBUTING.md:5-15`, `CONTRIBUTING.md:30-44`). Build สร้าง `dist/maw` ด้วย target `bun` (`package.json:14`).

## ข้อควรระวังสำหรับผู้ใช้ Windows

1. อย่าใช้ PowerShell commands แทน Bash commands แบบตรงตัวโดยคาดว่าจะเทียบเท่า: repository ไม่ได้ให้ native-Windows workflow.
2. `maw` อาจรัน CLI บางส่วนได้ใน environment ที่มี Bun แต่ multi-agent workflow หลักพึ่ง `tmux`; จึงไม่ควรสรุปว่า native Windows รองรับจาก Bun เพียงอย่างเดียว.
3. ใช้ `maw wake --dry-run` ก่อนงานที่มีผลจริง และเริ่มจาก node เดียวก่อน federation (`README.md:164`, `README.md:227-235`).
4. โครงการระบุว่าอยู่สถานะ alpha และ interface เปลี่ยนบ่อย (`CONTRIBUTING.md:3`).

## เส้นทางแนะนำให้ “เหาะ” บนเครื่อง Windows

นี่คือ **ข้อเสนอเชิงอนุมาน** จาก dependency และคำสั่งที่ตรวจพบ:

1. เปิด WSL2 distribution แบบ Linux.
2. ติดตั้ง Bash environment, Bun 1.3+, `tmux`, `git`, `curl` และ AI engine ที่เลือก.
3. ติดตั้ง `maw-js` ด้วย `bun add -g github:Soul-Brews-Studio/maw-js`.
4. ทดสอบ `maw --version`, `maw --help`, แล้ว `maw serve`.
5. เริ่ม agent เดียวด้วย `maw wake ... --dry-run` ก่อน แล้วจึงใช้ `wake`, `peek`, `hey`.
6. เมื่อต้องการ dashboard ค่อยติดตั้ง `maw-ui`; เมื่อต้องการหลายเครื่องค่อยเพิ่ม token และ peers.

ขั้นตอนนี้สอดคล้องกับ toolchain ของ repository แต่ต้องทดสอบจริงบน WSL2 ของเครื่องเป้าหมาย เพราะ upstream ไม่มี WSL2-specific validation ที่พบในการสำรวจครั้งนี้.
