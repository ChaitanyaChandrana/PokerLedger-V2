# Poker Ledger V2.6.23 — Remembered guest names

## New in V2.6.23
- After joining or hosting, your name is remembered on this browser. No Google account or login is needed.
- Next time, the join screen shows “Welcome back, [name]” and “Not you? Change name.” Creating a game also prefills the host name.
- You still tap Join before a new seat and initial buy-in are recorded. Names never grant access to another player's records.
- Leaving a table keeps the name. Changing it clears the saved preference until the next successful join. Private browsing, clearing site data or changing devices may require entering it again.
- Only the name is remembered by this feature; phone numbers are not saved as a browser preference.

If V2.6.22 is already deployed, replace only index.html and sw.js, then refresh. No new Firestore rule changes are needed for this feature. The complete package retains the V2.6.22 rules for installations upgrading from an older version.

## Earlier changes retained
- Tap **+ Rebuy** to request the usual amount. Custom amounts remain available in your player details. No scanning required. The host sees the amount and taps Approve after receiving payment.
- Any other authenticated player can approve the host's rebuy or cash-out. Nobody approves their own request. A player can have one pending request; concurrent approvals add one record.
- Optional QR shortcuts remain under the request's Options and More → Scan a rebuy QR.
- More → Hand over hosting lets the host select a player, who accepts on their own device. The outgoing host becomes a regular player.
- An assigned co-host can take over directly. Without one, a player can request hosting and needs two distinct other players to approve. The candidate and current host cannot vote. Proposals expire after ten minutes and cannot survive a host change.
- Buy-ins, cash-outs, members and pending requests stay intact during host changes. Approval authority follows the current host.
- Everyone viewing the table sees a brief saved-rebuy notice and gold row pulse after the server confirms the record. More → Rebuy sound enables a soft chip-click on that device. Sound defaults off; animations respect reduced-motion settings. Browser audio requires a user interaction. Refresh/reconnect does not replay earlier rebuys.
- Existing reconnection fixes, charts, newest-first history, sorting and cash-out corrections remain.

## Deploy the complete update
This package is prepared and tested locally, not published to the live app.

1. Between games, publish **firestore.rules** in Firebase Console → Firestore Database → Rules for the existing `pokerledger-v2` project. These rules are required for tap approvals and host recovery.
2. Replace **index.html** and **sw.js** together on the existing site. Keep its exact domain so browser identities continue to work.
3. Refresh/reopen on every device. Confirm **V2.6.23** in the home footer. Older open clients must refresh after the rules change; their old QR approval flow is no longer supported.
4. In a test table on separate devices, request/approve a player and host rebuy, enable sound, try a handover, and confirm the same totals and pending requests remain. Check the phone's audio/animation behavior before the next game.

Keep the HTML at the site root with sw.js alongside it. The rules and tests do not need to be served as web assets. No database migration or new game is required. APP_VERSION 2.6 and protocol 26 remain unchanged.

## Recovery boundaries
Reopen the original game link in the same browser/profile and device to resume the original seat. Buy-ins are tied to the authenticated browser UID, not a name or phone-number match. Clearing browser data or switching profiles can lose that identity; this update does not implement identity recovery across devices.

Without a co-host, takeover requires the candidate plus two other eligible voters (excluding the original host). If there are fewer eligible voters, the original host must reconnect. Disconnection does not automatically appoint a new host.

## Verification
Guest-name prefill, explicit join, change-name behavior, identity isolation, persistence after leaving, and unavailable-storage handling passed the app tests.

Passed mocked app/reconnection tests and Firestore emulator tests, including actual app transaction handlers:
- Existing-seat resume, delayed authentication, locked/settling/settled tables, failed listeners, foreground recovery and identity-change protection.
- Server-only saved notifications, no repeat on refresh, row highlighting, and approval/handover control rendering.
- Request uniqueness, no self-approval, no approval of unrelated players, immutable existing buy-in entries during approval, atomic request/ledger writes and concurrent approval races.
- Host approval by another member, accepted handover, two-vote recovery, duplicate/ineligible votes, expired proposals and co-host takeover.
- Ledger/pending-request preservation, outgoing-host permissions, stale request protection, and insufficient-voter recovery.

Run `node tests/recovery.cjs` without dependencies. For emulator tests, install Firebase 10.13.2, @firebase/rules-unit-testing 3.0.4 and firebase-tools 13.35.1 in a temporary dependency directory; set NODE_PATH to its node_modules. Use Java 17 and run firebase emulators:exec with project `demo-poker`, Firestore port 8088 and rules from this directory, invoking `node tests/workflows.cjs`. The tests explicitly load this rules file and never use production data.

Real-device visual/audio and live Firebase deployment checks were not performed.
