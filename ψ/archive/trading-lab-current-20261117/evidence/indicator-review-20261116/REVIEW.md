# INDICATOR-INSTALL-20261116 — AXIOM independent review

Reviewer: AXIOM Oracle, current thread 01a1e50b-75dc-70e3-b8b4-962a41e9cb37 / actual pane w2:pK. Date: 2026-11-16.

Status: **FROZEN-F1 accepted, installed locally, and verified**. AunauN Oracle coordinates; PRISM implemented in its `ψ/lab/indicator-install-20261116/staged`. Current AXIOM installed after acceptance, per coordinator BRIEF.md and OWNERSHIP.json at parent `ψ/lab/trading-lab-indicators-20261116`. Earlier checkpoint evidence below is retained; see final acceptance at the end.

## Evidence

- Exact supplied Pine scripts/provenance: AXIOM `ψ/lab/trading-lab-indicators-20261116/source`. CDC SHA256 `17be67ca761b508386b40dec2bad4f19aec8dec9e1f561fbbf5f2428c73fd248`; MSO `baad49d91d4450cb511eaf5b93b6e4e97e59fc3e0ea1dd19ef7e5bb04cf9c97a`.
- `node review.cjs <staged/dist>` passes independent impulse EMA, equality/flat/zero-range, rolling extrema oracle, both histogram schemes, crossover boundaries, CDC unavailable initial state, all source selectors, prefix recomputation and future mutation, unsupported mode rejection.
- `node --test tests/model.cjs tests/regression.cjs tests/indicators.cjs` in PRISM staged: all 3 file suites pass. The file-level runner is reported as 3 suites, not an invented count of assertions.
- `browser.cjs` independently passes 10 groups with actual Lightweight Charts 4.2.3 and Chromium: saved settings, visible prefix, primitive rendering/no page errors, bidirectional ranges, actual pointer crosshair transport both directions, display toggles preserving snapshot, immutable active settings, reload, desktop/mobile containment, and legacy runs with absent indicator context. Evidence: `browser-pre-freeze/results.json` and screenshots.
- All 9 accepted baseline files still match `ψ/lab/axiom-prism-review-20261115/installed-hashes.json`. No production files changed by this review.
- `reviewed-prefreeze-hashes.json` identifies the staged bytes observed at this checkpoint; it is NOT a PRISM freeze declaration.

## Finding and correction

`cdc.assist` was saved/exposed without controlling assistive text. Sent actionable finding to PRISM via Herdr. PRISM added a separate `#cdc-assist`, respects enabled/assist/display flags, and added browser regression for the option. Fix observed in source; complete PRISM acceptance run awaits host approval in PRISM's pane at this checkpoint.

## Pre-freeze checkpoint (resolved by final acceptance below)

PRISM currently awaits approval to run its expanded Chromium suite; do not answer another agent's approval dialog. After its run and explicit freeze manifest: verify hashes, snapshot candidate, read OWNERSHIP.json again, check live baseline/concurrent changes, create fresh scoped backup, install only accepted application/source/test/docs files locally, and rerun installed checks. Preserve .openai metadata and user runtime data. No publication in this assignment.

## Limits

All market OHLC in these tests are synthetic and network services mocked. Screenshots have missing Thai glyphs because external fonts are blocked and this test browser lacks Thai fallback; layout checks do not establish Thai typography quality. External TradingView numerical parity is unverified; actual export with matching dataset/history/settings remains required. Fixed timeframe and CDC momentum modes are disabled. No live feed/provider check or profitability claim.

The CDC initial-state interpretation agrees with the supplied Pine and TradingView's [v5 functions FAQ](https://www.tradingview.com/pine-script-docs/v5/faq/functions/) (`barssince` is unavailable before the first occurrence) and [v5 operators documentation](https://www.tradingview.com/pine-script-docs/v5/language/operators/) (unavailable history references). This does not replace a Pine runtime comparison.

## Final acceptance — installed F1

PRISM's explicit FROZEN-F1 declaration was received and verified. Manifest SHA256 `3ae76914ff283bbf9303d7428e45a7bc03ce39c8a2e65c7543980bf01312fcf2`; report SHA256 `9267ff36830366e749c81a99a1c0f6ec0d084c5312c7ec0046a11149213c214b`. Copies: `PRISM-freeze.json`, `PRISM-manifest.json`, `PRISM-REPORT.md`. All 15 changed/new file hashes matched, including both exact Pine sources. Reviewed the final assist, chart clearing, configuration validation, oscillator markers and autoscale changes.

The accepted source snapshot is `accepted-candidate/`; installation selected 17 application/source/test/documentation files, including 2 unchanged baseline test files. It excluded hosting metadata and the original PRISM-BRIEF. `baseline-before-install/` and its hash manifest preserve 10 prior application/documentation/test files. Ownership and unchanged live baseline were checked immediately before the sole install. `install-reviewed.py` verifies backup/candidate/current baseline, copies assets before HTML, and verifies all selected files after installation. `installed-hashes.json` matches `accepted-candidate-hashes.json` exactly. Hosting metadata and pre-existing brief remain unchanged.

Verification against **installed `trading-lab/`**, all passing:

- `node --test tests/regression.cjs tests/indicators.cjs` from trading-lab: both file suites pass, exit0. Covers baseline model and new indicator assertions.
- `node ψ/lab/indicator-review-20261116/review.cjs trading-lab/dist`: independent mathematical/causality checks pass, exit0.
- `python3 ψ/lab/indicator-review-20261116/installed-browser-checks.py`: expanded Chromium suite 14 groups/errors=[] and independent suite 10 groups/errors=[], exit0. Full log files are `installed-browser-expanded.log` and `installed-browser-independent.log`. Machine-readable results/screenshots are in `browser-installed/` and `browser-independent-installed/`.

Post-install browser runs use actual chart4.2.3 and mocked synthetic OHLC. Fontconfig uses already-present Noto Sans Thai from Lumina's tools only for QA; inspected `browser-installed/indicators-mobile.png` has readable Thai and contained layout, including ±1 levels. This changes no app dependency. All owned browser/server processes close in finally.

Use the existing local Trading Lab origin, refresh, choose **ฝึกเทรด BTC → Indicators**, configure, then start a new run. Prior v2 runs retain absent context; start a new run to use indicators. No publication/push/account action was performed. External TradingView numerical parity and live-provider checks remain unverified; CDC fixed timeframe and StochRSI momentum stay disabled.
