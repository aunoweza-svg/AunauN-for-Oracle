---
pattern: Confirm the interaction surface and history requirements before designing agent navigation shortcuts.
date: 2026-11-01
source: 'rrr: AunauN-for-Oracle'
concepts: [codex-cli, skills, session-continuity, navigation]
---

# Oracle navigation and session continuity

A skill invocation, a background thread handoff, a separate terminal launcher, and a foreground session switch are different operations. First identify where the user is typing and which operation the host actually supports; verify a target session by its content, not its title alone. A launcher can map short names to `codex resume`, but its menu test does not establish that interactive resume works on the user's host.

A fresh conversation in an Oracle directory can consult saved files, but it does not automatically inherit the complete message history of an earlier conversation. Use the existing session when that history is important, and record meaningful work in the vault so a new session can recover file-based context.
