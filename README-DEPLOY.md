# Poker Ledger V2.6.12 — Charcoal & Gold

## Changes
- Buy-in timeline shows newest entries at the top, with a Newest first label.
- Expanded player buy-in lists also show the newest entry first.
- Rebuy numbering retains its original sequence when the display is reversed.
- Charcoal and graphite panels replace the green interface, with muted gold accents.
- The game-screen poker photograph is approximately twice as tall, and the content
  area is wider on desktop. Mobile host/join screens also show more of the image.
- Initial buy-ins, rebuys, and totals remain separate; voided entries stay excluded.
- Cash-out correction, approval, and settlement behavior is unchanged.

## Deploy
1. Extract this ZIP and replace your existing index.html and sw.js.
2. Publish normally, then refresh/reopen the app on all devices.
3. Check the home-screen footer: V2.6.12.

The poker-table image is embedded in index.html; no image folder is needed.
Keep all other site files and Firebase settings. No database rules change.
This package is not automatically deployed.

## Verification
JavaScript syntax and local history checks passed for newest-first ordering,
rebuy numbering, totals, voided entries, and legacy buy-ins without an explicit
kind. Browser visual verification and live Firebase testing were not performed.
