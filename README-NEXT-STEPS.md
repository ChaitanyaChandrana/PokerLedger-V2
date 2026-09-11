# Poker Ledger V2 — Ready Build

This build is already wired to the separate Firebase project:

- Project ID: `pokerledger-v2`
- Collection: `poker_games_v2`
- Authentication: Firebase Anonymous Authentication
- Rebuy verification: one-time QR + designated verifier

## Do these Firebase steps before deployment

### 1. Enable Anonymous Authentication
Firebase Console -> PokerLedger-V2 -> Authentication -> Sign-in method -> Anonymous -> Enable -> Save.

Leave automatic anonymous-user cleanup OFF while testing.

### 2. Create Firestore
Firebase Console -> Firestore Database -> Create database.

Production mode is fine because you will immediately publish the supplied rules.

### 3. Publish the supplied rules
Firebase Console -> Firestore Database -> Rules.
Replace the editor contents with `firestore.rules`, then Publish.

These rules are for the V2 Firebase project only. Do not paste them into the stable V1 Firebase project.

## Deploy
Deploy this whole folder to a separate HTTPS site (for example a new Netlify site).
The QR scanner needs HTTPS and camera permission.

Files:
- `index.html`
- `firestore.rules` (Firebase console only; it does not need to be publicly served)
- `manifest.json`
- `sw.js`

You may deploy index.html, manifest.json, and sw.js. Keeping firestore.rules in the deploy folder is harmless but unnecessary; remove it from the public site if preferred.

## Important first test
Use 3 devices/browsers:
1. Host creates game.
2. Second player joins and host makes them co-host.
3. Third player joins and requests a rebuy.
4. Third player's phone should show a short-lived QR.
5. Co-host taps Scan QR, scans it, sees player + amount, then approves.
6. Scan the same QR again; it must not work.
7. Make the co-host request a rebuy; the host must be the verifier.
8. Test cash-out verification and final table reconciliation.

## Build-specific hardening
This ready build includes an additional request-to-ledger binding used by the Firestore rules (`lastVerifiedRequestId`). This prevents a co-host ledger update from being accepted unless it is tied to the request being approved in the same transaction.
