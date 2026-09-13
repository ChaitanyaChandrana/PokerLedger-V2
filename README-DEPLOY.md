# Poker Ledger V2.6.7 — Host End Game

UI-only fix. No Firestore rules change is required.

## Fixed
The host's own cash-out status no longer replaces the host's table controls.

During an active game, the host ALWAYS retains:

**End Game & Settle**

regardless of whether the host's own cash-out is:
- not submitted,
- waiting for co-host approval, or
- already confirmed.

The host's personal cash-out status appears above the End Game button.

After tapping **End Game & Settle**, the game moves to the normal settling screen where:
- players can submit their own cash-outs,
- host can complete missing non-host cash-outs,
- host/co-host approvals are resolved,
- table reconciliation is shown,
- and the host can finalize/show the settlement.

## Deploy
1. Replace GitHub `index.html`.
2. Replace GitHub `sw.js`.
3. Commit to `main`.
4. No Firebase rules change.
5. Fully close and reopen the site.
6. Confirm it says `V2.6.7 · host end-game`.
