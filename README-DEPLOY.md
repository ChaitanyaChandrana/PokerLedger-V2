# Poker Ledger V2.6.9 — Cash-out Corrections

Approved cash-outs can now be corrected while the game is active or counting
final chips. Existing games and refresh recovery remain compatible (protocol 26).

## Use
- Your cash-out: click **Change amount**, enter the correction, then submit for
  approval. The host approves players; the co-host approves the host.
- Host: click **Edit cash-out** under another player's row, change the amount
  inline, and Save. The co-host has the same control for the host's cash-out.
- A pending correction shows as pending and blocks settlement. Rejection or
  cancellation keeps the previous approved amount.
- A verifier's direct correction updates totals immediately and records the
  previous and new amounts in the audit trail.
- Once finalized, use the existing host **Edit** settlement action before making
  further corrections. Stale editors cannot change a finalized table or overwrite
  an amount changed on another device.

## Deploy
1. Replace index.html and sw.js in your existing hosting/repository.
2. Publish using your normal deployment workflow.
3. Close and reopen/refresh the app on every device.
4. The home screen version reads: V2.6.9 · cash-out corrections.

No rules change is needed with the saved V2.6 Firestore rules, which already
permit host/co-host cash-out corrections and revised approval requests.
Keep your existing Firebase configuration and other site files.

## Verification
Local simulated React/Firestore checks passed for:
- The screenshot's $200 bought in / $199 cashed out, corrected to $200.
- Settlement calculation after correction.
- Host and co-host correction permissions.
- Revised personal cash-out approval and rejection.
- Invalid amounts and zero-dollar cash-outs.
- Changed amounts and finalized state on another device.
- Correction controls in active and settling phases.

These are local checks; no live game data was changed and this package has not
been deployed by this update.
