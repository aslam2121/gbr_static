# Contract: Homepage Layout Hooks

**Feature**: [../spec.md](../spec.md) · **Date**: 2026-10-14

This is the interface between `index.html` and the shared stylesheet for this feature, plus what
stays fixed for the backend developer. Anything listed under **Invariants** must still hold after
implementation; the quickstart checks each one.

## 1. Markup hooks added to `index.html`

| Hook | Kind | On | Purpose |
|---|---|---|---|
| `.home-screen` | New wrapper `<div>` | Around `<header>`, the tiles `<section>`, and the map `<section>` | The flex column that fills the viewport |
| `.home-hero` | Class added | The tiles `<section>` | Scopes the tile compaction |
| `.home-main` | Class added | The map `<section>` | The region that takes the remaining height |
| `.home-photo` | Class added | The `<div>` already wrapping the sidebar `<img>` | The banner crop |

These are **layout hooks, not components**. They carry sizes and arrangement only — no colour,
border, shadow, or type. They exist because the homepage has no class hooks today; its sections are
styled inline (Principle IV design gate: necessity stated).

Existing IDs reused unchanged: `#mapLocked`, `#mapContent`, `#map`, `#homeChatLocked`,
`#homeChatContent`.

## 2. Inline sizing moved to the stylesheet

Moved with identical values, so that stacked mode is unchanged (research R12):

| Element | Removed from markup | Now in `style.css` |
|---|---|---|
| Each of the 3 tiles | `min-height: 200px` | `.home-hero .row > div { min-height: 200px; }` |
| `#mapLocked` | `height: 800px; padding: 24px` | `#mapLocked { height: 800px; padding: 24px; }` |
| Sidebar `<img>` | `height: 300px` (no effect; overridden by `.h-100`) | — |
| `#homeChatLocked` | `padding: 28px; min-height: 320px; margin-top: 8px` | `#homeChatLocked { … }`, same values |
| `#mapContent`, `#homeChatContent` | `style="display:none"` | class `d-none` in markup |

Inline **colour, border, and background** values stay inline. They belong to feature 001's deferred
palette work.

## 3. Stylesheet rules

All in a new section of `assets/css/style.css` titled **Home page — fit one laptop screen**, placed
directly after the existing **Map** section.

| Media condition | Rules |
|---|---|
| *(none — all widths)* | The sizing values moved from inline (§2) |
| `(min-width: 992px)` | `.home-screen` flex column, min-height `100vh` then `100dvh` · welcome label beside the fields · tile compaction · `.home-main` `flex: 1 0 288px; min-height: 288px; position: relative` · inner `.container` pinned (`position: absolute; inset: 0`) · row and columns `height: 100%` · `#mapLocked`, `#mapContent`, `#map` `height: 100%` · sidebar flex column · `.home-photo` `aspect-ratio: 10 / 3`, image `object-fit: cover; object-position: center 30%` · chat panel fills the remainder · member chat body scrolls |
| `(min-width: 992px) and (min-height: 760px)` | `.home-photo` `aspect-ratio: 2 / 1`, image `object-position: top` |

The existing `@media (max-width: 991.98px)` and `(max-width: 575.98px)` rules for
`#map, #mapLocked` stay as they are and continue to govern stacked mode.

## 4. View-state script

The inline script that reveals the live chat, and the map's initialisation script, change from
setting `element.style.display` to toggling the `d-none` class:

| State | `#mapLocked` | `#mapContent` | `#homeChatLocked` | `#homeChatContent` |
|---|---|---|---|---|
| Guest | visible | `d-none` | visible | `d-none` |
| Member | `d-none` | visible | `d-none` | visible |

## 5. Invariants

1. **Backend contract unchanged.** The page still reads `window.GBR_USER` and still treats
   `{ loggedIn: true }` as a member. The backend developer changes nothing. The developer's comment
   block in `index.html` stays accurate and is not edited.
2. **No form field changes.** `git diff -U0 -- index.html | grep -E '^[-+].*\bname="'` returns
   nothing.
3. **No link or button destination changes.** The set of `href` values on the page is identical
   before and after.
4. **No new design tokens.** The diff introduces no colour value, typeface, or `font-size` other
   than `1.75rem` (Bootstrap's existing `.fs-3` step) for the chat icon.
5. **Shared components untouched.** No rule in this feature's stylesheet section matches
   `.gbr-navbar`, `.gbr-footer`, `.gbr-accent-rule`, or any element outside the homepage hooks
   above. `.chat-card`, `.chat-body`, and `.chat-input` are sized only under `#homeChatContent`.
6. **Other pages unchanged.** No other page contains `.home-screen`, `.home-hero`, `.home-main`,
   `.home-photo`, `#mapLocked`, or `#homeChatLocked`, so the new rules cannot reach them. The
   quickstart confirms this with a search.

## 6. Handover

The backend developer receives the updated `index.html` and `assets/css/style.css` as part of the
full file set (feature 001 FR-022). The handover note should list both files, the four new hooks,
and invariant 1 — that the member flag is unchanged. If the developer has copied the homepage's
markup into a Laravel template, they must carry over the `.home-screen` wrapper and the four hooks,
or the fitted layout will not apply there.
