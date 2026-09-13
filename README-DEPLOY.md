# Poker Ledger V2.6.8 — Refresh Recovery

Critical reliability/UI hotfix. No Firestore rules change is required.

## Refresh/reopen fix
The game code is now kept in the page URL:

`...?code=ABCDEFG`

On startup the app fetches that game and uses the current Firebase anonymous UID
against the game's server-side `members` map to recover the exact player/host seat.

This is stronger than relying on localStorage alone.

The app also:
- saves role data in both localStorage and sessionStorage,
- repairs a stale local `playerId` from the Firestore UID mapping,
- never automatically creates a replacement game during recovery,
- removes the `?code=` only when the user intentionally chooses Leave.

## Settlement balance visibility
During end-game counting:
- before all counts are in: `4/6 cash-outs recorded · $... counted so far`
- if totals mismatch: clear short/over warning
- when exact: `✓ ALL BALANCED — $X bought in = $X cashed out`
- after host shows settlement: every device sees `✓ Table Balanced` and the payment instructions.

## Important limitation
If a user closes ALL Incognito/Private windows, the browser intentionally destroys
its anonymous Firebase identity. No refresh-only solution can preserve that identity.
For normal tabs/PWA and ordinary refreshes, V2.6.8 should recover automatically.
If the host loses their identity entirely, use the co-host takeover flow.

## Deploy
1. Replace GitHub `index.html`.
2. Replace GitHub `sw.js`.
3. Commit to `main`.
4. No Firebase Rules change.
5. Fully close/reopen Poker Ledger.
6. Confirm `V2.6.8 · refresh recovery`.
7. Create a test game, refresh host/player/co-host several times, and verify they
   always return to the same game.
