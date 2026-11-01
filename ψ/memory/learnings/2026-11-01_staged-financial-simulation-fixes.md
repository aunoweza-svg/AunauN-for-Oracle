---
pattern: "Reproduce state bugs, stage and hash-check fixes, and rerun browser and installed-target tests while distinguishing fixtures from live data"
date: 2026-11-01
source: "rrr: AunauN-for-Oracle"
concepts: [regression, financial-simulation, browser-testing, localStorage, staging]
---

# Repairing simulation state safely

When a journal and account state must change together, a failed write must not leave a partial balance update that a retry applies twice. Preserve unreadable source data, guard actions during asynchronous loads, and define what happens to open positions before replacing a run.

Reproduce defects before editing, test a staged copy, preserve the original, verify the destination has not changed, then test the installed files. Browser fixtures make edge cases repeatable, but do not prove live market integration, browser CORS or complete visual acceptance.
