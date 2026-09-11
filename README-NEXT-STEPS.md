# Poker Ledger V2.2 — Clean Approval Flow

This build keeps the two-step buy-in model but makes the next action impossible to miss.

## What changed
- Every player shows **Buy-ins = 1** immediately, even before the initial buy-in is approved.
- The dashboard now shows **In Play / Buy-ins / Players**.
- Rebuys are derived from `Buy-ins - Players` and shown on the summary line.
- Unapproved initial buy-ins show a large **ACTION NEEDED** card.
- The tiny confirmation tick was removed. Starting a buy-in now goes directly into the approval flow.
- Pending player action uses large buttons:
  - **Show QR to Host / Co-Host**
  - **Scan QR to Approve**
  - **✓ Confirm I Received X Chips**
- Player rows show `1 ✓`, `2 ✓`, etc. only when all of that player's buy-ins are fully completed.
- Removed the 20-minute buy-in reminder and the on-screen Recent Activity list to keep the live game screen cleaner. The audit events are still stored in Firestore.

## Deploy
For the current V2 GitHub Pages site, replace **index.html** in the root of `PokerLedger-V2` and commit to `main`.

The included `firestore.rules` are the same matching V2 two-step rules. If those rules are already published in the `pokerledger-v2` Firebase project, you do not need to change them for this UI update.

After GitHub Pages rebuilds, close/reopen the page on the phones (or hard refresh) so the old cached app is not used.

## Quick test
1. Create a fresh game.
2. Join from another phone.
3. The new player should immediately show **Buy-ins 1** and **$0 In**.
4. Their phone should show a large **Initial buy-in needs approval** card.
5. Tap **Send $40 for Approval**.
6. Player should see **Show QR to Host**.
7. Host sees **Scan QR to Approve**.
8. After host approval, player sees **✓ Confirm I Received ... Chips**.
9. Only after that final confirmation should the player's **In** amount become $40 and the row show **1 ✓**.
