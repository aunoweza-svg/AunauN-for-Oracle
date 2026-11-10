---
name: herdr-peek
description: Read recent terminal output from a verified running Oracle or neighboring Herdr agent without messaging or interruption. Use to inspect activity; herdr-hey handles requests to talk or ask.
---

# Herdr peek

Follow [herdr](../herdr/SKILL.md). Resolve a live target by exact repository/cwd and available conversation identity, not title. Use `../herdr/scripts/herdr_inspect.py resolve --repo <absolute-repo>` or `resolve --target <live-pane-id>`. Without a target, survey geometric neighbors and proceed only when the requested neighbor is unique. Ask when multiple candidates remain.

Read `herdr agent read <id> --source recent-unwrapped --lines 80`. Report what the output shows and its recency limits. Old text is not proof work is active; missing output is not proof of inactivity. Do not prompt, focus, send scroll keys, interrupt, approve or restart the target. Do not reproduce sensitive terminal text.
