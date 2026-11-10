---
name: herdr-neighbors
description: Read-only survey of geometric Herdr neighbors and current workspace panes, distinguishing agents from shells. Use to see who is around; does not message or create a buddy.
---

# Herdr neighbors

Follow [herdr](../herdr/SKILL.md). Run `../herdr/scripts/herdr_inspect.py neighbors` using its actual path. It resolves the caller, queries all four directions and lists current-workspace panes with agent-or-shell, status and cwd.

Separate geometric neighbors from other agents in the workspace. PRISM in another tab is not automatically the pane on the right. Missing neighbor_pane_id means no neighbor, not an error or a guessed target. Query failure means partial/failed evidence, not verified empty. Never send keys, start or rename anything for a survey.
