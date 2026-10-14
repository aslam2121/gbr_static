# Data Model: Homepage Fits One Laptop Screen

**Feature**: [spec.md](spec.md) · **Date**: 2026-10-14

This feature stores no data. Its "entities" are the homepage's layout regions, the sizing rule each
one follows, and the guest/member view state that decides which regions show. The model below is
what the layout contract ([contracts/home-layout-contract.md](contracts/home-layout-contract.md))
and the verification guide ([quickstart.md](quickstart.md)) test against.

## Layout modes

| Mode | When | Behaviour |
|---|---|---|
| **Stacked** | Viewport under 992px wide | Today's layout, unchanged. Regions stack; the page scrolls. |
| **Fitted** | Viewport 992px wide or more | The content screen fills the viewport; the footer sits below it. |
| **Fitted, tall** | Fitted, and viewport 760px tall or more | As Fitted, but the photo banner shows the logo and the slogan. |

Short windows (fitted mode, but too short for every region) are not a separate mode. The
map-and-sidebar area holds at its 288px minimum, and the page scrolls.

## Regions

| Region | Element | Stacked mode | Fitted mode |
|---|---|---|---|
| **Content screen** | `.home-screen` (new wrapper) | Plain block; no effect | Flex column, at least the viewport's height |
| Navigation bar | `<nav>` from `custom.js` + 8px rule | 75px — unchanged | 94px — unchanged (shared, all pages) |
| Welcome and sign-in strip | `<header>` minus the navbar | Unchanged | One line: label beside fields; 66px |
| Introduction tiles | `.home-hero` section, 3 tiles | Each at least 200px — unchanged | Content height, 8px padding; ~162px |
| **Map-and-sidebar area** | `.home-main` section | Unchanged | Takes the remaining height; at least 288px |
| ↳ Map panel | `#mapLocked` (guest) / `#mapContent` > `#map` (member) | 800 / 420 / 320px by width — unchanged | 100% of the area's height |
| ↳ Sidebar | `.home-main .col-lg-4` | Unchanged | Flex column: banner, then chat |
| ↳↳ Photo banner | `.home-photo` (new wrapper) > `img` | Unchanged | Width-based crop: 10:3 slogan, or 2:1 logo and slogan when tall |
| ↳↳ Chat panel | `#homeChatLocked` (guest) / `#homeChatContent` (member) | 320px minimum, 28px padding — unchanged | Fills the sidebar below the banner |
| Footer | `<footer class="gbr-footer">` | Unchanged | 74px — unchanged; sits below the screen |

## Height budget at the target (1366×610, fitted mode)

| Region | Before | After |
|---|---|---|
| Navigation bar | 94 | 94 |
| Welcome and sign-in strip | 90 | 66 |
| Introduction tiles | 200 | 162 |
| Map-and-sidebar area | 800 | **288** (the remainder) |
| ↳ Photo banner (10:3 of a 447px column) | 454 | 134–137 |
| ↳ Chat panel | 320 | ~143 (the remainder, after an 8px gap) |
| **Content screen total** | **1184** | **610** — exactly the viewport |
| Footer (below the screen) | 74 | 74 |
| **Page height** | **1258** | **684** |

## View state

| State | Set by | Map panel shows | Chat panel shows |
|---|---|---|---|
| **Guest** (default) | `window.GBR_USER` absent, or `loggedIn: false` | `#mapLocked` | `#homeChatLocked` |
| **Member** | Backend sets `window.GBR_USER = { loggedIn: true }` before page scripts | `#mapContent` (Leaflet map) | `#homeChatContent` (chat card) |

The state is decided once, on load. There are no transitions within a page view: signing in or out
is a new page load from the backend.

**Validation rules**

- Exactly one of `#mapLocked` / `#mapContent` is visible, and exactly one of `#homeChatLocked` /
  `#homeChatContent` (FR-009). Today both of each pair show for members; see research R9.
- Visibility is controlled only by the `d-none` class, never by an inline `display` value, because
  the prompts' `d-flex` class overrides inline display (research R9).
- The map is created only after `#mapContent` is visible, so Leaflet measures a non-zero container
  (research R11).
