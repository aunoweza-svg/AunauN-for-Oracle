---
name: herdr-hey
description: Send the user's question to a verified running Oracle through Herdr and read its actual reply. Use ask PRISM, talk to Lumina or message an agent; does not create a substitute agent or merely inspect silently.
---

# Herdr hey

Follow [herdr](../herdr/SKILL.md). The user's request to talk authorizes that message. Resolve the real target from current metadata and exact repository using `../herdr/scripts/herdr_inspect.py resolve --repo <absolute-repo>` or a live ID; exclude the caller. Ambiguity requires choosing the intended instance; absence does not authorize starting a substitute.

Read terminal before sending. Do not overwrite/answer approval or question dialogs. If working, do not interrupt; a queued question may wait. Recheck identity before sending if topology/state changed.

Send a short single line with sender, question and useful reply marker through `herdr agent prompt <id> <text> --wait --timeout 45000`. Pass text as a safely quoted argument, never shell interpolation. Never send a prompt to a bare shell as an agent.

Read `herdr agent read <id> --source recent-unwrapped --lines 120`. Find a reply after this question attributable to the intended target. A submission acknowledgement, lifecycle change or old answer is insufficient. After timeout/stalled/blocked inspect read/get before retry; do not duplicate blindly. Report delivered/started/waiting/replied accurately, attribute the answer and transport, and preserve limitations.
