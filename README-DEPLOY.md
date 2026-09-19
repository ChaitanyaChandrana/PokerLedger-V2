# Poker Ledger V2.6.19 — Most Buy-ins First

The player ledger now sorts by completed buy-in count, highest first. Counts include
the initial buy-in and exclude pending or voided entries. Equal counts retain their
existing order. The list reorders as approved buy-ins arrive.

Split initial/rebuy bars, the newest-first timeline, blended poker photo, and
cash-out/settlement controls are retained.

## Deploy
1. Replace your existing index.html and sw.js with these files.
2. Publish normally, then refresh/reopen the app.
3. Confirm V2.6.19 in the home-screen footer.

Keep all other site files and Firebase settings. Local screen-state checks passed
for descending order, equal counts, void/pending exclusion, live reordering, and
preservation of stored player order. Not deployed automatically.
