---
name: herdr
description: Inspect or control Herdr panes, tabs, workspaces and agents when Herdr is named or the user asks to interact with a running Oracle. Requires inherited HERDR_ENV=1; companion skills cover identity, neighbors, reading, messaging and structure.
---

# Herdr — Codex / AunauN

Check inherited `HERDR_ENV=1` first. If missing stop Herdr control and report the executor is outside Herdr. Never set markers/socket variables to impersonate a pane. Socket permission denial is separate: request host approval for that operation, not a sandbox bypass.

Read `herdr --help` and `herdr --skill` for the installed version unless already read this session. Installed help is authoritative; workshop examples describe another installation. Do not launch bare herdr for discovery. Check help before unfamiliar mutations.

Use [scripts/herdr_inspect.py](scripts/herdr_inspect.py) for read-only normalized context: `whoami`, `neighbors`, `structure`, `resolve`. Invoke Python 3 at the actual script path. It uses caller mapping, not UI focus, and prints selected metadata only. Escalate real permission failures normally.

Live basics: `herdr pane current --current`, `herdr pane list`, `herdr agent list`. Use returned IDs, never sidebar order or copied examples. Distinguish Herdr pane/session from Codex conversation. Titles alone are insufficient; verify cwd/repository and available conversation metadata or terminal content. idle/done signals do not prove task completion or absence of an unfamiliar dialog.

Read-only inspection stays within requested scope. Messaging requires the user's task. Create/move/close/start/rename only when requested; this skill does not authorize helpers or a team. Preserve focus with --no-focus where supported and re-discover IDs after topology changes. Do not answer another agent's approval/trust dialog, close unrelated panes, stop the server or add --group to bypass a guard.

Remote work uses a discovered saved machine and the same --machine selector throughout, without another session selector. If no verified target/transport exists, say so. A file handoff is not a delivered message.
