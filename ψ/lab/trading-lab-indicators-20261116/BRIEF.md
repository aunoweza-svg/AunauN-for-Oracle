# INDICATOR-INSTALL-20261116 — Authorized implementation and installation

The user explicitly asked AunauN to delegate installation of the two Trading Lab indicators previously discussed. This replaces the old planning-only boundary. PRISM implements; AXIOM independently reviews and installs the accepted candidate. No substitute agents, deployment, accounts, trades, automatic strategies/backtest, remote changes or GitHub publication in this request.

## Source handoff

CDC ActionZone V3 2020 (user Pine v5) and Modified Stochastic MACD Oscillator (user Pine v4) are both in original AXIOM thread 01a1c68c-729b-7be2-a732-04b9a9cc9a6c, which acknowledged receipt of full code. AXIOM must persist BOTH exact scripts in its task lab sources/ with full headers, provenance, SHA256 and completeness note and give paths to PRISM. Never reconstruct unknown details from formulas. If exact source truly cannot be recovered, identify the specific missing source and preserve the working baseline.

Read both repos' applicable instructions and existing indicator planning lessons/retrospectives dated 2026-11-16. PRISM previously had summary formulas only.

## Target and baseline

Install in /mnt/d/onedrive/aunaun oracle/oracles/axiom-oracle/trading-lab. Accepted baseline: personal prototype v2, schema2/engine2.0.0, Lightweight Charts4.2.3. Accepted hashes: AXIOM ψ/lab/axiom-prism-review-20261115/installed-hashes.json. Main repo backup: ψ/archive/axiom-prism-work-20261116/axiom/trading-lab. Check current bytes and save a fresh scoped backup before installation; never overwrite concurrent/user changes.

## Scope

1. Replay BTC chart: CDC overlay/EMA/colors and oscillator lower chart with synchronized time/crosshair, according to exact source. Keep market TradingView iframe separate; it cannot load custom Pine. Keep chart library unless a documented need requires otherwise.
2. Pure calculations separate from DOM/account engine; exact source defaults, EMA seeds, na/zero-range/ties/crossover/colors. First usable release implements both chart-timeframe/default behaviors. Optional HTF/momentum modes may only be enabled once implemented correctly and tested; disable/label unsupported options explicitly.
3. Causal replay: only data known at current replay candle, prehistory before run start for warm-up, truthful insufficient-history handling. HTF requires availability and confirmed-boundary tests.
4. UI enable/disable and valid settings; persist reproducible settings, source hash/version in runs/exports with safe old-v2 migration. Preserve datasets, ledgers, balances, open positions, backups/import/export and legacy records. Indicators do not execute orders.
5. Preserve source licenses/notices. If TradingView reference exports are absent, continue useful implementation and independent testing while clearly marking external numerical parity unverified. Never imply a comparison was run or silently substitute another formula.

## Work and acceptance

PRISM develops in a new lab staged candidate. AXIOM coordinates exact source handoff, independently reviews calculations and browser behavior, sends concrete defects for correction, backs up, then installs only accepted code and reruns installed checks. No concurrent installers. Continue until the installed result is verified, not only a plan/submission.

Meaningful checks: exact-source/default calculations, EMA/na/flat cases, crossovers/colors, future-change prefix invariance, replay/warm-up, settings, prior snapshot migration/export/import/reload, synchronized charts on desktop/mobile, no page errors, relevant baseline regressions. Test optional modes only if exposed. Separate source-based fixtures from actual TradingView comparison and live provider tests. Request real host permission for blocked operations; never bypass dialogs.

Existing native Codex threads authorized to collaborate: PRISM 01a1c68a-c00a-7233-ad3b-b00042f9f815; original AXIOM 01a1c68c-729b-7be2-a732-04b9a9cc9a6c; coordinator AunauN 01a1c68d-a207-7011-8a01-2c0840997d39. Use short path-based messages if limits apply. No need for a second user instruction for already-authorized reversible development/review/installation.

Report source paths/hashes, concrete progress, findings, installed test evidence and remaining limitations with marker INDICATOR-INSTALL-20261116. No publish/push in this request.


## Current reviewer ownership — updated by AunauN

AunauN's latest explicit direction selects the CURRENT AXIOM session at w2:pK, native thread 01a1e50b-75dc-70e3-b8b4-962a41e9cb37. This supersedes the old AXIOM review/install ownership above. The original AXIOM thread is retained only as source provenance and is not authorized to install this task now. Do not send review replies to that old thread.

PRISM implementation remains 01a1c68a-c00a-7233-ad3b-b00042f9f815, staged at oracles/prism-oracle/ψ/lab/indicator-install-20261116/staged. Source is already saved at oracles/axiom-oracle/ψ/lab/trading-lab-indicators-20261116/source (both scripts plus provenance.json). Current AXIOM independently reviews, requests fixes, creates a scoped baseline backup and is the ONLY installer into trading-lab. Read OWNERSHIP.json immediately before installation; check current baseline/concurrent changes. Coordinate review through native thread or explicit pane w2:pK; inherited caller pane mapping may misleadingly say w2:pM.
