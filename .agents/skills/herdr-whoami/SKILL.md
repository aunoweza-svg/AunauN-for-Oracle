---
name: herdr-whoami
description: Identify this Herdr caller's pane, workspace, repository, branch and Codex conversation ID. Use for where this agent runs; herdr-structure covers the whole team.
---

# Herdr whoami

Follow [herdr](../herdr/SKILL.md). Run `../herdr/scripts/herdr_inspect.py whoami` relative to this skill's actual directory, or query `herdr pane current --current` and Git at its verified cwd.

Report resolved caller, tab/workspace, runtime, cwd, repository/branch and conversation ID. Missing fields remain unknown. Do not infer identity from UI focus or newest transcript. Resolve stale HERDR_PANE_ID with pane current --current. Shell cwd and pane cwd can differ. Do not inspect credentials.
