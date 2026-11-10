---
name: herdr-structure
description: Show a read-only tree of current Herdr workspaces, tabs, panes and agents, marking this caller. Use for team layout or who runs where; does not reorganize or move the team.
---

# Herdr structure

Follow [herdr](../herdr/SKILL.md). Run `../herdr/scripts/herdr_inspect.py structure` at its actual path. Group live records workspace → tab → pane and show caller, agent kind, status, cwd and available conversation ID. Keep empty shells visible.

Workspace label/worktree ownership can differ from pane cwd: show both rather than replacing one with the other. Agents across several tabs are not a one-tab room. Identify leads only from a relevant charter actually read; otherwise unknown. Avoid arbitrary process arguments/env. Other-session/machine inspection must be requested and use consistent selectors. Do not change layout or focus to draw it.
