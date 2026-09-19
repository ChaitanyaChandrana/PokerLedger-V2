# Poker Ledger V2.6.15 — Buy-in Bars

## What changed
- One horizontal gold bar and exact count per player replaces the initial/rebuy
  boxes and +N overflow display, in both the main ledger and By player view.
- Bars measure completed buy-in count, including the initial buy-in. All players
  share a 0–10 scale; it expands together if anyone exceeds ten buy-ins.
- No rebuys or the exact rebuy count appears under each bar. Custom amounts and
  pending requests remain marked; pending and voided entries do not fill the bar.
- Exact money totals remain beside the bars, with individual amounts in history.
- Details still opens to the newest-first timeline, with a By player toggle and
  table totals and player count below.

## Deploy
1. Extract this ZIP and replace your existing index.html and sw.js.
2. Publish normally, then refresh/reopen the app on each device.
3. Confirm V2.6.15 on the home-screen footer.

The welcome image is embedded in index.html. Keep all other site files and Firebase
settings. No database rules change. This package has not been deployed automatically.

## Verification
JavaScript syntax and local screen-state simulations passed for proportional bar
lengths at 0, 1, 2, 4, and 10 buy-ins, shared scale beyond 10, rebuy labels, custom
amounts, pending requests, void exclusion, timeline ordering, and view toggling.
Cash-out correction and settlement simulations passed, including concurrent updates
and approval handling. Browser visual verification and live Firebase testing were
not performed.
