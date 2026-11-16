# TV-DIRECT-20261116 — TradingView outside, Trading Lab for practice

Implemented and verified locally by AXIOM Oracle per AunauN's choice. This supersedes the native market display from JOURNAL-MARKET-20261116; its prior code and evidence remain preserved. PRISM was notified before edits to avoid concurrent target work. Scoped backup: `baseline/` and `baseline-hashes.json` (21 prior files). Changed/new files and installed checksums: `changes.json`, `installed-hashes.json`; final status `acceptance.json`.

## Result

Market page opens the selected symbol directly on TradingView, with initial generic interval15m. It presents the exact CDC/MSO names and first-use instructions. Both exact user Pine scripts are served under `dist/pine/`, with clipboard buttons and download fallback. These copies match the retained `source/` originals exactly, including notices. The user adds each as a separate indicator in Pine Editor or finds the desired published indicator, then saves a personal TradingView layout. The generic chart link does not install indicators automatically.

Optional saved-layout URL is validated as HTTPS on a TradingView hostname and `/chart/<id>/` path, with no credentials/port; query/fragment stripped. Preference key `axiom_tv_layout_v1` is isolated from journal/snapshot/backup/legacy keys. Saved layout opens its own original instrument/timeframe. Browser preference does not log in, synchronize accounts, or install scripts on TradingView. The UI explains the one-time manual setup and account-dependent indicator limits.

The market page no longer mounts native market charts, embeds the widget or starts its Binance polling. Historical `market-view.js` remains inactive. Replay, journal rendering, account model, indicator engines, original Pine sources, hosting metadata and existing records were not changed. No credentials or real user browser data accessed. No publication or account action performed.

## Verification

- `node --test trading-lab/tests/regression.cjs trading-lab/tests/indicators.cjs trading-lab/tests/journal-market.cjs`: all3 file suites pass. Existing market validator is retained only as a regression for the inactive historical module.
- `node --check trading-lab/dist/tradingview-launcher.js`: pass.
- Expanded installed Chromium suite: **16 groups, errors=[]**, actual chart4.2.3 with synthetic OHLC/mock services and isolated browser storage. `browser/results.json` plus screenshots contain evidence. Includes no market provider request at startup, exact external symbol links, no native/widget DOM, hostile/incorrect layout URL rejection, saved URL normalization/reload/clear, exact Pine clipboard contents and downloadable bytes, forced clipboard-denial download fallback, and byte-for-byte replay snapshot preservation through launcher actions. Prior account/import/storage/conflict/recovery/replay/indicator/journal and desktop/mobile checks pass.
- Inspected mobile screenshot for readable Thai/containment. Clipboard-denial message in the test screenshot is the intentionally exercised fallback, not an observed normal-use failure.
- Existing `http://localhost:8000/` responded and served the updated launcher HTML; confirmed new module and absent native-market section. No server replacement or browser-data clearing.
- Account model, journal renderer, indicator engine/view and9 original/source files verified unchanged against baseline; original Pine/download copies equal. All prior files preserved and hosting metadata hash unchanged.

No login or manual indicator configuration on TradingView was performed. The user must complete the first-use setup on their own account or supply an already configured layout URL. Link navigation and setup affordances are delivered; external TradingView indicator execution/parity was not tested.

Refresh the existing Trading Lab origin, choose **ภาพตลาด → เปิด…บน TradingView**, add the scripts once, then save the layout link using **บันทึกลิงก์ layout**. Later use **เปิด layout ของฉัน**. Practice/journal continue in Trading Lab.
