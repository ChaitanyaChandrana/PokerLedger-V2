# Poker Ledger V2.6.17 — Timeline and Table Photo

## What changed
- Removed the duplicate By player view and view-switch buttons from Buy-in details.
  Details now shows only the newest-first timeline, followed by table statistics.
- When details is closed, the embedded poker-table photo fills the space below
  the player list and details button. It disappears when details opens.
- The decorative photo grows into available vertical space and uses a smaller
  minimum height on short screens. Player information stays above the image.
- Existing split initial/rebuy bars and cash-out controls are retained.

## Deploy
1. Extract and replace your existing index.html and sw.js.
2. Publish normally, then refresh/reopen the app.
3. Confirm V2.6.17 in the home-screen footer.

The photo is embedded; no separate image file is needed. Keep all other site files
and Firebase settings. No database rules change. Not deployed automatically.

## Verification
JavaScript syntax and local screen-state checks passed for photo visibility when
collapsed, removal when expanded, removal of duplicate per-player view, latest-first
timeline, empty history, and retained host controls. Browser visual verification
and live Firebase testing were not performed.
