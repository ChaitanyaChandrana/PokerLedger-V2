# Poker Ledger V2.6 — Cleaner Table Flow

This version focuses on a more natural home-poker experience.

## Cash-out flow
When the host ends the game:
- Every authenticated player gets a prominent **Your cash-out** card.
- Each player enters their own final chip value and taps **Submit for Approval**.
- Normal players and the co-host are approved by the host.
- The host is approved by the co-host.
- A submitted player sees **Cash-out submitted — waiting for ...**
- After approval they see **✓ Cash-out confirmed**.
- No QR is required for cash-out.
- Guests/no-phone players are entered by the host in a separate **Guest cash-outs** section.
- The old non-host footer saying "Waiting for the host..." is removed.

The table discrepancy warning is hidden until every final amount has actually been confirmed, so partial cash-outs do not create a misleading "table short" warning.

## Buy-ins / rebuys
Player rows now show a compact visual badge such as **3×** next to the total amount in play.

Tap the top **Buy-ins** card to open two views:
- **By Player** — number of active buy-ins, total amount, and times.
- **Timeline** — chronological initial buy-ins and rebuys, including visible VOID records.

## Rebuy-request fix
After the host/co-host scans and approves a rebuy:
- The player's QR modal closes automatically.
- The player sees a temporary **✓ Rebuy approved · +$40 added** confirmation.
- They will no longer be left staring at a stale **Cancel Rebuy** action after approval.

Pending rebuy and cash-out requests for the same player are mutually exclusive, which avoids contradictory table state.

## Deploy
This is a V2.6 protocol update, so BOTH the app and Firestore rules must be updated.

1. Replace GitHub `index.html`.
2. Replace GitHub `sw.js`.
3. Commit to `main`.
4. Firebase -> **pokerledger-v2** -> Firestore Database -> Rules.
5. Replace the rules with `firestore.rules` from this package.
6. Click **Publish**.
7. Fully close and reopen Poker Ledger.
8. Confirm the home screen says **V2.6 · cleaner table flow**.
9. Create a NEW V2.6 test game.

Older V2.5 clients are intentionally prevented from writing to V2.6 games.
