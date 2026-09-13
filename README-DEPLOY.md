# Poker Ledger V2.6.3 — End-game cash-out

UI-only update. No Firestore rules change is required.

## What changed
When the host ends the game, every authenticated player's bottom action area stays visible.

If the player has not submitted:
**Enter My Cash-out**

Tapping it opens the focused cash-out screen:
- Count your chips
- Enter final value
- Submit for Approval

If submitted:
**Cash-out submitted · $XX**
**Waiting for Host/Co-host approval**

If approved:
**✓ Cash-out confirmed · $XX**

The host sees the same personal cash-out status plus the normal Back / Calculate Settlement controls.

This means cash-out remains obvious both:
- when someone leaves midway, and
- when the whole table ends the game.

## Deploy
1. Replace GitHub `index.html`.
2. Replace GitHub `sw.js`.
3. Commit to `main`.
4. No Firebase rules change.
5. Fully close and reopen the site.
6. Confirm it says `V2.6.3 · end-game cash-out`.
