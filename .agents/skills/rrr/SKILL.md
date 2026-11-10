---
name: rrr
description: Write a retrospective, lessons and metrics when asked for /rrr, $rrr or a session retrospective. In AunauN-for-Oracle include task-scoped commit/push unless overridden. Discussing installation or testing rrr does not request publication of the real workspace.
---

# RRR — Codex / AunauN

Read applicable AGENTS.md and CLAUDE.md; resolve the active Git root and real ψ directory before writing. A nested Oracle repo is a separate target. Preserve the existing identity.

## Evidence and artifacts

Execute synchronously by default. `--fg` uses current context and Git only, without persisted transcripts. `--light` writes metadata, timeline, summary, lessons and metrics. `--fg`, `--bg`, `--combo` are mutually exclusive. For background modes detect real host capabilities and session attribution first; fall back explicitly to synchronous writing if unavailable. Do not launch hidden agents or assume Claude paths or models.

Use Asia/Bangkok time. Use only observed host/session metadata and attributable Git times. Commit times describe those commits; current time is a closing time, not proof of a start. Unknown start, duration and session ID stay `unknown`. Never interpolate idle gaps or manufacture mistakes.

Write a unique `ψ/memory/retrospectives/YYYY-MM/DD/HH.MM_<slug>.md` using [template.md](references/template.md). Add a transferable lesson under `ψ/memory/learnings/YYYY-MM-DD_<slug>.md` when justified. Append exactly one row to `ψ/memory/learnings/session-metrics.md`, preserving all other rows and line endings. Columns: `when | session | done | stuck | win | friction | error`. Review the last seven rows for recurring friction without opening an issue automatically.

## AunauN GitHub sync

In AunauN-for-Oracle read `ψ/memory/learnings/2026-10-26_rrr-auto-push-workflow.md`. The user's rule replaces upstream's no-staging default: save and check the retrospective, lesson, metrics and related task files, then commit and push in the same request. “rrr อย่างเดียว”, “ยังไม่ push” or narrower scope overrides this. A test explicitly targeting a scratch repo stays there; it does not authorize publishing the real repo.

Inspect status, existing staging, branch/upstream and both fetch/push URLs. Production destination is `aunoweza-svg/AunauN-for-Oracle`, normally `main`; never infer authorization for another destination. Fetch before committing; check ancestry and whether a push would include pre-existing local commits outside this task. Preserve history and report unresolved conflicts. Do not reveal credentials.

Choose an explicit allowlist and review content/diffs. Never stage all ψ or the repository. Stage only task hunks in shared files. For metrics use [stage-metrics-row.py](scripts/stage-metrics-row.py) with a file containing this invocation's exact row. It stages that row on top of the selected index while preserving the working file, and refuses an already-staged change to metrics.

Preserve unrelated staging. When other files are staged, create a temporary index initialized from HEAD, stage the allowlist there, inspect its diff, and commit with that index. Record the real index entries first. If task paths already contain staged changes, isolate those changes or stop rather than claiming them. After commit, reconcile only committed task entries in the real index to new HEAD with `git update-index --index-info`, after checking they have not changed concurrently. Preserve other entries and all working files; no broad reset.

Push the verified branch/destination without force. Read the remote branch SHA/history and verify the new commit is present before reporting sync success. Report saved, committed and remote-verified separately. Do not merge PRs or contact third parties. Use the host approval mechanism for blocked Git/network operations; don't ask again whether rrr should push. If blocked, keep artifacts and report the actual unfinished step.
