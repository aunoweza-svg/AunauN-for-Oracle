# JOURNAL-MARKET-20261116 — readable journal and BTC market indicators

Implementer PRISM Oracle (AI). Current AXIOM thread `01a1e50b-75dc-70e3-b8b4-962a41e9cb37` is independent reviewer and sole installer, acknowledged in this task. No deployment, Git push, account connectivity or real orders.

Root: `/mnt/d/onedrive/aunaun oracle/oracles/prism-oracle/ψ/lab/journal-market-20261116/`
Target: `/mnt/d/onedrive/aunaun oracle/oracles/axiom-oracle/trading-lab/`

## User-visible problem and fix

User confirmed the unreadable material was long code-like IDs, not broken Thai glyphs. Existing `renderRecords()` led with run UUID/dataset ID/technical context, followed by dense English gross/fee/net text. The net existed in saved trades but was buried in the presentation; no evidence of missing financial data or a wrong account formula was found. Original bytes retained in `original/`.

Journal now has Thai realized-profit/loss overview, per-run summaries and per-trade cards with prominent signed net USDT, closed count and total fees. Entry/exit, BTC size, Thai timestamps and reason remain available. UUID/dataset/hash moved into collapsed inspection details; unnamed runs use a human run number. Calculation breakdown is expandable. `net` is read as saved and fees are not deducted twice. Summary covers closed trades only, excludes open position fees/unrealized results and identifies separate starting capital per run. Legacy trades remain explicitly labeled with incomplete context.

The market page gains a native BTCUSDT public Binance USDⓈ-M chart with the already accepted CDC/MSO engines; custom Pine cannot be inserted into the hosted TradingView widget. Native chart starts with 500 confirmed15m candles, displays CDC overlay + MSO lower pane, source/closed-bar/receipt times, visibility toggles, manual update and60s polling only when market/BTC/browser tab is visible. No tick/live-unconfirmed candle claim. Time axis UTC, status labels Asia/Bangkok. Existing TradingView widget is a separately expandable alternative, loaded on expansion. Thai stocks retain the prior provider warning/external links and do not get a fabricated native feed.

## Scope and isolation

Changed presentation/controller/docs/tests only; account/schema and all indicator engine/view files (`model.js`, `cdc.js`, `mso.js`, `indicators.js`, `indicator-view.js`) are byte-identical to accepted baseline. No storage key/schema/formula changes and no actual user localStorage read/copied by these tests. Installation replaces code assets; existing user records require no migration or reset.

`journal-view.js` is read-only: it renders through textContent, preserving escaped reasons. `market-view.js` does not access localStorage/run/account variables; its transient market history/settings are separate from replay. It validates count/boundaries/closedTime/continuity/duplicates/OHLC, preserves last successful chart on errors with explicit stale timestamp, cancels pending requests on deactivation and ignores old responses. History retained in page memory grows from500 to10000 candles; beyond cap it resets to500 with a notice. Long gaps beyond available tail are rejected with a page-refresh instruction, never price-filled.

## Changed files

- `dist/journal-view.js` — new read-only journal summaries/cards/technical details
- `dist/market-view.js` — new isolated closed-candle BTC market controller
- `dist/app.js` — journal adapter, market mount and provider expansion/source labels
- `dist/index.html` — new native market chart/controls, collapsed provider alternative, journal wording/scripts
- `dist/style.css` — journal/market responsive layout and Thai font fallback chain
- `tests/journal-market.cjs` — new pure totals/market validation tests
- `tests/browser.cjs` — expanded existing suite and chart identity-based instrumentation
- `README.md` — behavior, data/refresh/storage boundaries and limitations

Exact before/after hashes in `manifest.json`. `original/` retains all installed baseline bytes; `staged/` is frozen when `freeze.json` declares FROZEN-F1. PRISM has not written target files. Current AXIOM must verify final manifest/unchanged baseline, take fresh scoped backup, snapshot accepted candidate, install only allowlisted files and rerun installed checks.

## Verification

- `journal-market-tests.tap`: 4/4 tests pass. Closed net/fee totals, empty/mixed/legacy arithmetic, 500 confirmed-bar validation, missing/duplicate/future-close/malformed/inverted-price rejection.
- Pure test initially used strict IEEE754 equality for `.21` fees and failed on `.21000000000000002`; corrected assertion to tolerance, not ledger arithmetic or rounding.
- `model-tests.tap`: existing10/10 pass. `indicator-tests.tap`: existing11/11 pass. No new formulas.
- Final `browser/results.json`: expanded16 groups pass, errors=[]; actual Chromium/chart4.2.3, synthetic OHLC and blocked external fonts/widget. Includes prior account/storage/import/race/migration/settings/resize coverage, visible Thai positive/negative net and closed raw-ID details, market rendering/stale failure/toggles/mobile, exact raw replay snapshot isolation. QA uses existing Thai fontconfig fallback; `journal-mobile.png` and `market-indicators-mobile.png` inspected and readable, contained layout.
- AXIOM independently reported9 pre-freeze browser groups passing: P&L visibility, collapsed IDs/escaped reason, market HTTP/gap/duplicate stale preservation, toggles/SET, polling/tab visibility, storage isolation and mobile. Script and evidence owned by AXIOM at `ψ/lab/journal-market-review-20261116/browser.cjs` and `/tmp/axiom-journal-market-browser`. This report is not its final installed acceptance.
- Real-network probe: `live/results.json`, Chromium Binance HTTP200,500 validated closed15m candles rendered; checkedAt2026-11-16T16:38:10.162Z, last closed16Nov23:30 Asia/Bangkok. Fresh-context replay storage remained null, page errors=[]. `live/market-desktop.png` and `live/market-mobile.png`. Probe predates final copy/grid/provider-expansion polish; fetch/indicator calculations unchanged. No tick-price or second-feed parity claim.
- Syntax checks pass. Account/schema/indicator code identity with `original/` explicitly verified.

Reproduce: `node tests/regression.cjs`, `node tests/indicators.cjs`, `node tests/journal-market.cjs`. Expanded browser uses prepared runtime:

```sh
FONTCONFIG_FILE=/tmp/axiom-indicator-fonts.conf LD_LIBRARY_PATH=/tmp/axiom-browser-libs/root/usr/lib/x86_64-linux-gnu PLAYWRIGHT_MODULE=/tmp/axiom-browser-module.cjs AXIOM_CHART_BUNDLE=/tmp/axiom-lwc-4.2.3.js node tests/browser.cjs
```

## Remaining limits

- Market native indicators are BTC only,15m confirmed candles; defaults CDC close/1/12/26 and MSO45/12/26/9. Market toggles are visibility, not new replay inputs; configured replay settings remain frozen in each run.
- No injected custom Pine into TradingView iframe. External TradingView numerical parity remains unverified. Dataset start/prehistory/feed can differ; CDC HTF/momentum remain disabled.
- Market can show dates after a replay session, like the pre-existing market widget; no blind-research claim. Market data does not enter replay calculations or account/journal.
- Native auto update pauses outside visible BTC market view; fetch/region/CDN availability varies. On errors visible chart is explicitly old data. Time axis UTC/status times Thai.
- Separate starting capitals across runs; journal aggregate realized P&L is an exercise summary, not a combined portfolio return. Raw numeric values in export/ledger unchanged, formatting rounds display to max8 decimals.
- Existing personal-prototype assumptions/storage/quota/backup/financial-model limits unchanged. No actual user journal was exported or overwritten; tests use a fresh browser context with synthetic records.

## Acceptance handoff

User should refresh the same `http://localhost:8000` origin after installation; no browser-data clearing. Journal entries display the new layout from existing records. Market → BTC automatically loads its native indicator chart. AXIOM alone installs after frozen review, verifies baseline/source/hosting metadata and tests final target. No completion claim until installed acceptance arrives.
