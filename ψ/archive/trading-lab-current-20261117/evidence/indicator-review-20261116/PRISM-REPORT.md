# INDICATOR-INSTALL-20261116 — PRISM candidate

Implementer PRISM Oracle (AI). Reviewer and sole installer: current AXIOM thread `01a1e50b-75dc-70e3-b8b4-962a41e9cb37` / w2:pK. Ownership per parent lab `ψ/lab/trading-lab-indicators-20261116/OWNERSHIP.json`. No substitute agents, deployment, accounts, real trades, automatic strategy/backtest, remote changes or Git push.

Root: `/mnt/d/onedrive/aunaun oracle/oracles/prism-oracle/ψ/lab/indicator-install-20261116/`
Target: `/mnt/d/onedrive/aunaun oracle/oracles/axiom-oracle/trading-lab/`

## Scope and status

`staged/` is the reviewable candidate. `original/` preserves the installed accepted baseline copied before work. `manifest.json` records before/after SHA256 for each changed/new file; `freeze.json` is the explicit freeze declaration after local verification. No target files were written by PRISM. AXIOM must verify frozen hashes and unchanged target baseline, snapshot/back up, then install and run installed checks. A frozen candidate is not an installed/accepted result.

## Exact sources

Exact user texts handed off by AXIOM are retained in `staged/source/` with original headers and `provenance.json`. Original source location: AXIOM `ψ/lab/trading-lab-indicators-20261116/source/`.

- CDC ActionZone V3 2020, Pine v5: `17be67ca761b508386b40dec2bad4f19aec8dec9e1f561fbbf5f2428c73fd248`
- Modified Stochastic MACD Oscillator - Vitali Apirine, Pine v4: `baad49d91d4450cb511eaf5b93b6e4e97e59fc3e0ea1dd19ef7e5bb04cf9c97a`

CDC ©piriya33 MPL-2.0 notices preserved in original and separate `dist/cdc.js`, footer/license/source link and NOTICE. Supplied MSO has no explicit license header: no open-license inference or publication authorization. This is a private prototype installation. Unmodified Lightweight Charts attribution is retained.

## Implementation

- `dist/cdc.js`: pure chart-timeframe CDC calculations, price smoothing EMA before EMA fast/slow, all six zones plus exact Black tie/fallback, Pine v5 palette. First-green/red + barssince/null initialization + previous bullish/bearish produce signals; never substitute simple crossover. EMA seeded from first input; supported source selectors close/open/high/low/hl2/hlc3/ohlc4.
- `dist/mso.js`: pure MSO, exact rolling low/high, source formula evaluation order/scale10, zero-range fast/slow→0 while signal EMA continues. Both histogram schemes, nz(previous histogram) semantics, histogram momentum background, equality-inclusive crossover boundaries. Rolling extrema computed causally using monotonic queues.
- `dist/indicators.js`: version1.0.0 config/defaults/validator/source hashes and combined prefix calculations. CDC fixed timeframe and StochRSI momentum explicitly disabled and rejected on import. Initial source bootstrap values are calculated; warmup status reflects short available history without claiming convergence after period length.
- `dist/indicator-view.js`: v4.2.3 price overlay and oscillator chart, bidirectional logical-range/crosshair sync with loop guard; line series/histogram/circle and pane-boundary triangle signals. Native primitives provide CDC EMA fill/ribbon and MSO momentum background/zero band. Oscillator autoscale explicitly includes configured overbought/oversold levels so ±1 remain visible even on flat prices. Assist appears as summary text below graph rather than Pine floating label; no pixel parity claim.
- `dist/app.js`, `index.html`, `style.css`: configuration UI for new runs; independent current-run visibility toggles; active settings frozen; assist option actually hides/shows separate `#cdc-assist`. Source/parity/warmup limitations visible. All UI inputs validated. Loading a replacement dataset or empty snapshot clears old overlays so old indicator values cannot remain as a stale chart layer.
- `dist/model.js`: schema2/engine2.0.0 preserved with validated optional `run.indicators` extension. New run copies validated config/source hashes/version. Existing runs with no extension remain byte-for-byte unchanged, including open positions/account/legacy metadata; no synthetic historical context. Export/import/backup/reload use existing atomic snapshot and validate the extension. Derived arrays are not duplicated in snapshots; dataset/index/config/version reconstruct values.

Settings apply to next new run only; visibility toggles change presentation without mutating run or ledger. Existing execution/fees, pending-load guards, atomic close/retry, Web Locks and recovery remain in place. Indicators never execute orders. Market iframe remains separate; Thai provider restrictions/external links unchanged.

## Verification evidence

- Baseline model: `model-tests.tap`, 10/10 pass; no new financial model assumed.
- New pure indicator tests: `indicator-tests.tap`, 11/11 pass. Exact source hash check, hand EMA/MSO values, CDC initial unavailable state/alternating signals/ties/palette, smoothing/source selection, flat/zero-range signal decay, both histogram schemes, crossover equality, future mutation and prefix recomputation, warmup/prehistory, unsupported/invalid input and old-v2 open-position preservation.
- Expanded real Chromium + actual Lightweight Charts4.2.3 suite: `browser/results.json`, 14 groups, errors=[] in final run. Existing storage/account/network/import/race/mobile guards retained plus saved/frozen settings/source metadata/assist/toggles/reload, actual chart primitive rendering, bidirectional logical ranges, configured ±1 levels inside oscillator, mobile containment and old-v2 open-position reload with absent context.
- `browser/indicators-desktop.png`, `browser/indicators-mobile.png` inspected. Test fonts/widget blocked, synthetic market prices only. Thai glyphs missing in this runtime; screenshots prove layout/rendering, not Thai typography or real-feed parity.
- AXIOM independently reported math fixtures/prefix checks and browser including real pointer crosshair/range synchronization both directions passing pre-freeze. Its evidence is in AXIOM `ψ/lab/indicator-review-20261116/REVIEW.md`, `review.cjs`, `browser.cjs`, `browser-pre-freeze/`. This report does not replace AXIOM's final frozen/installed review.
- JavaScript syntax checks pass; source hashes match exact handoff. No live provider or external TradingView exported numerical reference comparison was performed for this indicator extension.

Reproduce locally from staged: `node tests/regression.cjs`, `node tests/indicators.cjs`. Browser: `LD_LIBRARY_PATH=/tmp/axiom-browser-libs/root/usr/lib/x86_64-linux-gnu PLAYWRIGHT_MODULE=/tmp/axiom-browser-module.cjs AXIOM_CHART_BUNDLE=/tmp/axiom-lwc-4.2.3.js node tests/browser.cjs`. Browser opens temporary localhost listener, requires host permission in restricted sandbox, closes in finally. Runtime was prepared by AXIOM; not a dependency installed in target repo.

## Remaining limits

1. External TradingView numerical parity **unverified**; reference must match exact symbol/contract/OHLC/timestamps/inputs/history/seed. Source-based tests are not a TradingView runtime comparison.
2. CDC fixed timeframe and momentum StochRSI remain off/unsupported as permitted by brief. Validator rejects enabling them. Other source series from external indicators are unsupported.
3. EMA values depend on available dataset start. Bootstrap/short-history values shown truthfully with status, not asserted converged. Periods limited1..1000 (MSO slow/signal≥2).
4. Current script-to-UI differences: CDC assist uses summary instead of floating Pine label; library rendering/marker dimensions not pixel-identical. Formula/state/color palette and MSO scheme/background logic are source-based.
5. Existing simulator limits remain: linear same-close P&L/fee, no leverage/margin/liquidation/funding/slippage/execution engine, no automatic strategy/backtest, single browser/origin storage, external JSON backup required, hash is not a source signature.
6. Library remains4.2.3; market widget does not execute custom Pine. No public redistribution/deployment/push authorized here; MSO source license remains unspecified in supplied text.

## Handoff

After explicit freeze, current AXIOM alone verifies manifest/baseline, snapshots candidate, takes fresh target backup and installs accepted changed files including sources/docs/tests; preserve `.openai`, all unrelated files and actual browser runtime data. Run model/indicator/expanded browser plus independent checks against installed target. Report acceptance and installed hashes before declaring complete. PRISM will correct concrete review findings by making a new freeze if required.
