# Poker Ledger V2.6.11 — Buy-in Details

## What changed
- The old "view history" control is now "Buy-in details".
- Dashboard: In Play, Total In, and Players, with separate initial-buy-in and
  rebuy counts below.
- By player: a compact table separates Initial, Rebuys, and Total amounts.
- Timeline: chronological connected markers with times, player names, amounts,
  and explicit Initial buy-in / Rebuy labels. Dates appear across multiple days.
- Main player list: the count column now shows additional rebuys only.
- Voided entries remain identifiable and are excluded from counts and totals.
- Poker-night artwork and existing cash-out corrections are retained.

## Update your app
1. Extract this ZIP.
2. Replace your existing index.html and sw.js with these two files.
3. Publish normally, then refresh/reopen on each device.
4. The home-screen footer reads V2.6.11.

The table image is embedded inside index.html. There is no image folder to
upload. Keep other existing site files and Firebase settings. No rules change.
This package has not been deployed automatically.

## Verification
JavaScript syntax and local display checks passed for split initial/rebuy
counts, custom amounts, voided entries, chronological labels, and empty history.
The existing local cash-out and settlement checks also passed. Live browser
and Firebase testing was not performed.
