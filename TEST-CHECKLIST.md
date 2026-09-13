# V2.6 quick test

Use host, co-host, and player phones.

## Rebuy
1. Player requests standard rebuy.
2. Host sees live request and scans it.
3. Player's QR should automatically disappear after approval.
4. Player should briefly see **✓ Rebuy approved**.
5. Player row should change from e.g. `1× / $40` to `2× / $80`.
6. Tap Buy-ins -> verify both **By Player** and **Timeline**.

## End game / cash-out
1. Host taps **End Game & Collect Cash-outs**.
2. Player, co-host, and host should each see their own **Your cash-out** card.
3. Each enters their own amount.
4. Player/co-host submission should appear in the host's **Cash-outs to approve** queue.
5. Host submission should appear on the co-host's approval queue.
6. Approve each amount.
7. Requesting phones should change to **✓ Cash-out confirmed**.
8. No "table short" warning should appear until all final amounts are confirmed.
9. Once all are confirmed, the app should either show **TABLE BALANCED** or the true discrepancy.

## Guest
1. Add one Guest Without Phone.
2. End game.
3. Host should see the guest under **Guest cash-outs** and record the final amount.

## Quiet normal-play screen
1. Join as a non-host/co-host.
2. During active play there should be no fixed bottom message saying to wait for the host.
