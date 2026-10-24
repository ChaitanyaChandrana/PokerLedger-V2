# Poker Ledger V2.6.40 — Host midgame cash-out

During an active game, the host can expand another player's row, select Record cash-out, enter the final amount and record it. Signed-in players and guests are supported; zero is valid. The game stays active and the action is recorded in the event history. Pending requests must be resolved first. The host's own cash-out still needs co-host approval.

Replace index.html and sw.js. No new Firebase rules are required with the V2.6.38 approved-host rules. Recovery/rendering tests and focused transaction-handler tests passed. Not deployed or verified on live devices.

# Poker Ledger V2.6.39 — Visible rebuy total

The main ledger heading shows the total number of completed rebuys to every player, including host and co-host. Initial buy-ins, pending requests and voided rebuys do not count. The number updates with the live game data. No extra timeline or list was added.

Replace index.html and sw.js, then refresh. No Firebase rules changes for this update. Retain the approved-host rules from V2.6.38.

# Poker Ledger V2.6.38 — Approved-host creation

This release restricts new game creation to the verified Google account **chandrana@gmail.com**. Players still join anonymously and do not need Google accounts. Existing games and player records do not require migration.

Before deploying the files:

1. In Firebase Console, open **Authentication → Sign-in method → Google**, enable it, choose the project support email, and save.
2. Confirm the production site domain is listed in **Authentication → Settings → Authorized domains**.
3. Publish the included **firestore.rules**. This is the server-side enforcement that blocks every other account from creating a game.
4. Replace **index.html** and **sw.js** in the existing deployment, then refresh/reopen every device once.

The Create Game button now opens Google sign-in when necessary. The browser checks the approved account for a clear message, while Firestore rules independently require the verified `chandrana@gmail.com` identity. All existing host, co-host, join, rebuy, cash-out, settlement, and recovery behavior is retained.

Files to deploy: **index.html**, **sw.js**, and **firestore.rules**.

Previous release notes follow.

# Poker Ledger V2.6.37 — Approvals visible while scrolling

Replace **index.html** and **sw.js** in your existing GitHub deployment. Refresh/reopen all devices once after deployment. No Firebase rules changes.

- A fixed gold approval alert remains at the top of the viewport even at the bottom of the table. Shows request count, oldest player's name, request type, amount and additional request count.
- Review scrolls to the approval queue and focuses it. Incoming requests briefly pulse without moving the host's scroll position. Reduced-motion settings are respected.
- Alert remains until all eligible requests are resolved; normal players never see it. Host requests appear for the assigned co-host only. Dialogs remain above the alert.
- The automatic live-sync recovery from V2.6.36 is included.

Validation: recovery and live-sync tests pass, including alert content, Review navigation, disappearance after resolution and host/co-host permissions. Browser visual testing could not run because this workspace has no browser executable. Not deployed to production.

# Poker Ledger V2.6.36 — Automatic live-sync recovery

Replace **index.html** and **sw.js** in the existing GitHub deployment. Keep the current Firebase project and Firestore rules. All devices should reopen/refresh once after deployment to load this fix; ongoing updates then recover automatically.

- Live listeners remain the immediate update path. Server-only backup checks for game state and pending approvals run every 5 seconds while visible and online; an initial check runs after 1 second.
- Returning to the foreground or reconnecting to the internet triggers a server check immediately. Listener failures keep retrying with a maximum 30-second delay instead of stopping after three attempts.
- QR approval confirmation also has a backup server check. Event history is reconciled only when the table revision changes or its stream is unhealthy; host-control checks run every 20 seconds.
- Late reads cannot overwrite a newer live update or update a departed seat. No new game, identity, ledger write, or buy-in is created by these checks.
- Backup checks add Firestore reads (game and pending-request query approximately 720 checks each per visible device-hour, plus host-control and any changed history/request confirmation). Hidden/offline pages do not poll.

Validation: `node tests/recovery.cjs` and `node tests/live-sync.cjs` pass. These simulate stalled streams, pending-request resolution, network failure/recovery, foreground resume, stale replies and listener cleanup. Live production multi-device testing and deployment have not been performed.

Previous release notes follow.

# Poker Ledger V2.6.35 — Simple joining

## New in V2.6.35
- Remembered players see their name prominently and Join the Table, with small Change name and Change code actions.
- Prefilled game codes are a compact row instead of an input; editing appears on demand. Optional mobile number is collapsed.
- Identity checks and automatic restoration of existing authenticated seats remain unchanged. Remembering a name does not grant access to another player's seat.
- Join editing, remembered-name and recovery checks passed. Replace index.html and sw.js; no additional rules changes from V2.6.32.

## New in V2.6.34
- Approvals are the first section on the game screen, above the welcome card: prominent count, player names, amounts, request type/time, and large individual Approve/Decline actions. Requests are ordered oldest first; duplicate action taps are blocked while saving.
- The compact gold queue heading stays visible while scrolling through requests. Duplicate approval panels are removed.
- Full settlement sharing/export controls are host-only. Co-hosts and players retain their own payment-request sharing.
- Optional payment-app link can be pasted into a personal request and shared with the exact amount. Only https links can be shared. No automatic app launch, payment execution or completion tracking is provided; Zelle payments remain in the payer's banking app.
- App checks passed for multiple request ordering, amounts, approval visibility, host-only sharing, payment-link messages and recovery. Live-device appearance/app opening were not verified.
- Replace index.html and sw.js. No additional rules changes if V2.6.32 rules are published.

## New in V2.6.33
- Recognized returning players and hosts see a prominent Welcome back card with their actual seat name and confirmation that existing buy-ins and records remain. Dismiss with Got it.
- Works for saved-session restoration, game links and rejoining an existing authenticated seat. Remembered-name greeting on the join form is also larger.
- Host/player restoration and dismissal checks passed. No live-device visual verification performed.
- Replace index.html and sw.js, then refresh. No additional rules changes if V2.6.32 rules are already published.

## New in V2.6.32
- Request money is a prominent gold button on incoming transfers. Expanded settlement details use smaller type.
- Share payouts and Share settlement/export controls appear only for host and co-host. Players retain their personal payment-request sharing.
- Only the currently assigned co-host can approve or reject host buy-in and cash-out requests. Enforced in both the app and Firestore rules; ordinary-player requests still require the host.
- Assign a co-host under More before requesting host approval. Existing pending requests use the current roles.
- REQUIRED: publish the included firestore.rules in Firebase Console → Firestore Database → Rules. Replace index.html and sw.js and refresh all devices.
- App recovery/rendering tests and Firebase emulator authorization/workflow tests passed. No live-device visual verification or production deployment performed.

## New in V2.6.31
- Smaller settled-payment names (16px) and amounts (20px), preserving highlighted personal transfers.
- Recipients can tap Request beside an incoming transfer, enter optional Zelle or other payment details, preview the exact message, and share or copy it to the payer.
- Payment details stay in memory for this session; they are not stored in Firebase. Requests are plain text, not a banking integration or payment confirmation.
- Replace index.html and sw.js. No Firebase rules changes needed.

## New in V2.6.30
- A compact Won / lost list shows every player’s net result directly below payouts, ordered from highest win to largest loss. Buy-in details stay collapsed.
- Your own transfers appear first, highlighted in restrained gold and labelled You pay or You receive. Everyone still sees every transfer.
- Host/player rendering and recovery checks passed. No live-device visual verification performed.
- Replace index.html and sw.js, then refresh. No new Firebase rules required.

## New in V2.6.29
- Final screen opens with Who pays whom, large payer/recipient names and amounts, Share payouts and View details.
- Buy-ins, cash-outs, net tally, timeline, totals and export text are hidden by default. View details reveals them without changing any records.
- Removed the duplicate personal payment summary and totals banner. Everyone still sees every transfer.
- App checks passed for both host and player visibility and details disclosure. No live-device visual verification performed.
- Replace index.html and sw.js, then refresh. No new Firebase rules required.

## New in V2.6.28
- Final tally shows every player's net winnings or loss, labelled Won, Lost or Even. Positive values use restrained gold; no green lettering.
- Players are sorted from highest net win to largest loss after settlement. During play, sorting remains by buy-in count.
- Total in and cash-out remain beside each result, and the shared Who pays whom list remains visible to everyone.
- Replace index.html and sw.js and refresh. No new Firebase rules are required.

## New in V2.6.27
- Every player sees the shared final settlement as soon as the host calculates payments: full payer name, full recipient name and amount for every transfer.
- A personal summary shows total to pay or receive. The complete list includes other players’ transfers as well.
- Results show every player's cash-out, total bought in and net result. The decorative photo is omitted on the final screen.
- The list states amounts owed; it does not mark bank/cash payments as completed or add payment tracking.
- Host/player rendering, automatic settlement updates and refresh/reconnect persistence checks passed. No live-device visual verification was performed.
- Replace index.html and sw.js, then refresh. No new Firebase rules required if V2.6.22 rules are installed.

## New in V2.6.26
- End Game & Settle is now a full-width outlined gold button with 18px semibold text and a 56px minimum tap area. It remains available to the host after cash-out.
- Replace index.html and sw.js, then refresh. No new Firebase rules are needed.

## New in V2.6.25
- Neutral cash-out and settlement text/cards replace bright green lettering, tinted panels and success glow.
- Clear action labels: Cash-out approved, Awaiting approval, Totals match, Calculate payments and Resume play.
- Phase-specific headings identify Cash-outs and Results. Payment breakdown states what is owed without implying transfers were already paid.
- Removed the repeated personal cash-out panel from the settlement footer; the amount and edit action remain in the main card. Host settlement controls remain available.
- Rendering and existing recovery checks passed. Live-device visual inspection was not performed.
- Replace index.html and sw.js, then refresh. No further Firebase rule changes are needed if V2.6.22 rules are already installed.

## New in V2.6.24
- Larger modern Inter typography: 18px player names, larger amounts and 21px buy-in counts, with clearer secondary text and taller rows.
- Removed repeated player counts, instructional labels and row dividers. Table lock and co-host management remain available in More. Existing pending approvals and errors remain visible.
- Quieter decorative image and a shorter Activity & totals control keep attention on the ledger.
- Sound on/off is accessible beside Buy-ins as well as in More. It remains optional and plays only for server-confirmed rebuys, not a pending request or old records on refresh. The gold row pulse remains enabled.
- Existing app/reconnection/remember-name tests passed. No live deployment or real-device visual/audio verification was performed for this update.

If V2.6.22 or V2.6.23 is already installed with its rules, replace index.html and sw.js and refresh. No new Firebase rules are needed.

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
3. Refresh/reopen on every device. Confirm **V2.6.29** in the home footer. Older open clients must refresh after the rules change; their old QR approval flow is no longer supported.
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
