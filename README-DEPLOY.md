# Poker Ledger V2.6.16 — Initial and Rebuy Bar

## What changed
- Each player has one continuous bar: slate for initial buy-ins, gold for rebuys.
- One number gives total completed buy-ins, including the initial buy-in.
- Removed repeated per-player No rebuys / N rebuys text. A small chart legend
  explains colors once. Screen readers retain the full breakdown.
- Shared 0–10 count scale expands together beyond ten. Custom amounts and pending
  requests remain marked, and voided/pending entries do not fill the bar.
- Details retains newest-first timeline, By player toggle, and totals below.

## Deploy
1. Extract and replace your existing index.html and sw.js.
2. Publish normally, then refresh/reopen the app.
3. Confirm V2.6.16 in the home-screen footer.

Keep all other site files and Firebase settings. No database rules change.
This package has not been deployed automatically.

## Verification
JavaScript syntax and local component checks passed for initial/rebuy segment
proportions, 0 through 12 buy-ins, removal of repeated labels, custom amounts,
pending requests, and void exclusion. Existing screen-state checks passed.
Browser visual verification and live Firebase testing were not performed.
