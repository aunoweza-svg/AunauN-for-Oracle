---
pattern: When live verification is unavailable, date the documentation snapshot and separate it explicitly from current claims.
date: 2026-10-11
source: "rrr: AunauN-for-Oracle"
concepts: [verification, provenance, graceful-degradation, documentation]
---

# Distinguish documented snapshots from live facts

Tool failure does not make supplied documentation unusable, but it changes what can be claimed. Preserve usefulness by stating which checks failed, attaching the documentation date to volatile figures, and avoiding words such as "current" or "latest" until an authoritative source is reachable.

This pattern transfers to project statistics, dependency versions, service status, pricing, organizational counts, and any other fact likely to change over time.
