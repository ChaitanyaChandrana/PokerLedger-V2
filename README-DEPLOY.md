# Poker Ledger V2.6.13 — Minimal Table View

## What changed
- The game screen leads with the player ledger: Initial, Rebuys, and Total.
- Removed the large photo/greeting banner from active games. The photograph remains
  on welcome, host, and join screens.
- Table stats and history are collapsed under Table details & timeline below players.
- Rebuy and Cash Out are the primary footer actions. The host retains End Game & Settle.
- Add guest is under More. Player corrections and individual history open by tapping
  a player's name; settlement-mode corrections remain visible.
- Charcoal surfaces, restrained gold, compact rows, and newest-first history retained.

## Deploy
1. Extract this ZIP and replace your existing index.html and sw.js.
2. Publish normally, then refresh/reopen the app on each device.
3. Confirm V2.6.13 on the home-screen footer.

The image is embedded in index.html. Keep all other site files and Firebase settings.
No database rules change. This package has not been deployed automatically.

## Verification
JavaScript syntax, local screen-state checks, and cash-out/settlement simulations
passed. Verified disclosure toggling, guest form access, correction access, retained
host end-game control, and prevention of a duplicate pending rebuy through the footer.
Browser visual verification and live Firebase testing were not performed.
