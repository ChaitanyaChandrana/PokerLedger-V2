# Poker Ledger V2 — play-today pilot checklist

Use this as a **beta/pilot tonight**, with V1 available as fallback.

Before players arrive:
1. Publish `firestore.rules` in the **pokerledger-v2** Firebase project only.
2. Enable Firebase Authentication → Anonymous.
3. Deploy this folder over HTTPS (Netlify is fine).
4. In Firebase Authentication settings, add the final Netlify/custom domain to Authorized domains if Firebase requires it.
5. Test on 3 separate phones/browsers:
   - Host creates a game.
   - Two players join.
   - Host assigns one joined player as co-host.
   - Normal player requests a buy-in → host scans QR → host approves → player taps “I received chips”.
   - Host requests a buy-in → co-host scans/approves → host taps “I received chips”.
   - Verify totals update only after chip acknowledgement.
   - Enter an intentionally wrong final count and confirm settlement is blocked.
   - Correct it and confirm settlement succeeds.

Operational rule tonight:
- A buy-in is not counted until the player taps **I received chips**.
- If a player forgets, it remains visibly pending and the game cannot move into settlement until it is resolved.
- Keep the V1 URL/package available as fallback.
