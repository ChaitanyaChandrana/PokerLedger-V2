# Poker Ledger V2.6.6 — Blank-screen fix

This is a critical UI/runtime hotfix.

## Root cause
V2.6.5 referenced the JavaScript variable `phase` before `phase` had been
initialized inside the React component. That throws a `ReferenceError` during
rendering, so React never paints the app and the page appears completely white.

## Fix
`phase` is now initialized before any settlement calculations use it.

No Firebase / Firestore rules change is required.

## Deploy
1. Replace GitHub `index.html`.
2. Replace GitHub `sw.js`.
3. Commit to `main`.
4. Wait for GitHub Pages to finish deploying.
5. Fully close all Poker Ledger tabs.
6. Reopen the site, preferably once with `?v=266` appended to the URL.
7. Confirm the home screen says `V2.6.6 · blank-screen fix`.

If an installed PWA still shows white, remove the installed Poker Ledger app
once and reopen from the GitHub Pages URL so the new service worker can take over.
