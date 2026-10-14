# Verification Log: Homepage Fits One Laptop Screen

**Feature**: [spec.md](spec.md) · **Guide**: [quickstart.md](quickstart.md) · **Started**: 2026-10-14

**Method**: The page was served by `python3 -m http.server` and measured in headless Chromium
(Playwright) at each viewport, by running the quickstart's measurement snippet unchanged. Screenshots
were captured at the same sizes and inspected by eye. The member view was produced by injecting
`window.GBR_USER = { loggedIn: true }` before the page scripts. That is equivalent to the DevTools
local override in the quickstart, and the backend's own mechanism. Browser zoom at 125% was emulated
with the CSS viewport it produces, 1093×488 for a 1366×768 screen. Screenshots and the harness live
outside the repository and are not committed.

## Result: all checks pass (2026-10-14)

All 27 tasks complete. Guest and member homepages fit every laptop viewport from 1366×610 up,
measured at 8 laptop sizes. The stacked layout below 992px is pixel-identical to the approved page.
The other 21 pages are pixel-identical too. There is no sideways scrolling and there are 0 console
errors at 17 viewports in both views. Three adjustments were made during implementation, each
recorded below:

1. The snippet's prompt-overflow check was corrected (US1, T013).
2. The map prompt's padding and the chat icon's line-height were tuned (US1, T013).
3. The map area's floor was raised from 280px to 288px (US3, T023).

## Baseline

Approved files, before any change. Guest view unless stated.

| Viewport | pageHeight | strip | tiles | photo | Console errors |
|---|---|---|---|---|---|
| 390×664 | 2182 | 272 | 614 | 389 | 0 |
| 768×900 | 2371 | 106 | 600 | 718 | 0 |
| 1366×610 | 1258 | 90 | 200 | 454 | 0 |
| 1920×953 | 1318 | 90 | 200 | 532 | 0 |
| 1366×610, **member** | 2058 | 90 | 200 | 454 | 0 |

The member baseline confirms the defect from research R9: `guestPromptsShown: true` **and**
`memberViewShown: true`. The chat's message field is off-screen (`chatInputOnScreen: false`).

### Phase 2 check (T006) — PASS

After T003–T005 (hooks added, inline sizing moved to `style.css`), every Baseline row was re-measured.
At all four guest viewports and the member view, `pageHeight`, `mainBottom`, and every `heights`
value are **identical**. A pixel diff of the full-page screenshots against the Baseline shows
**0 changed pixels** in all five. There are 0 console errors.

## US1

### T013 tuning — final values, and two deviations from the task text

The first measurement after T007–T012 matched the prototype: `lockedChatOverflow: 5` at 1366×610.
Cutting the prompt's vertical padding from 8px to 4px did **not** change that figure, which exposed a
flaw in the quickstart snippet. Both guest prompts centre their content (`justify-content: center`),
so overflow spills out of the **top and bottom** equally, and `scrollHeight − clientHeight` only sees
the bottom. The snippet was corrected in `quickstart.md`. It now reports `mapPromptOverflow` and
`lockedChatOverflow` as content past either edge of the prompt's padding box. Re-measured with it:

| Viewport | Map prompt | Chat prompt |
|---|---|---|
| 1366×610 | 9px over each edge | 9px over each edge |
| 1024×660 | 8px over each edge | 0 |
| all other laptop sizes | 0 | 0 |

The fix needed two changes **outside** T013's stated scope ("only `#homeChatLocked` padding and its
`h3`/`p` margins"):

1. **`#mapLocked` padding 24px → `8px 24px`** in the fitted layout. The map prompt was not known to
   be tight until the snippet was corrected.
2. **`line-height: 1` on the chat prompt's icon.** At 1.75rem the icon's line box was 42px for a
   28px glyph. This changes no type size.

Final fitted-layout values: `#mapLocked { padding: 8px 24px }`. `#homeChatLocked { padding: 4px 12px }`,
icon `font-size: 1.75rem; line-height: 1`, `h3` margins `0` / `4px`, `p` margin-bottom `4px`. All
spacing values are Bootstrap spacing steps. Spare room at the tightest size (1366×610): map prompt
14px, chat prompt 5px.

### T015 — quickstart Phase B (guest) — PASS

| Viewport | fits | pageHeight (limit) | mapPromptOverflow | lockedChatOverflow | Banner (photo height) | Sideways scroll | Console errors |
|---|---|---|---|---|---|---|---|
| 1366×610 | true | 684 (≤ 684) | 0 | 0 | full slogan, no logo (137px) | no | 0 |
| 1366×641 | true | 715 (≤ 715) | 0 | 0 | full slogan (137px) | no | 0 |
| 1280×690 | true | 764 (≤ 764) | 0 | 0 | full slogan (128px) | no | 0 |
| 1536×737 | true | 811 (≤ 811) | 0 | 0 | full slogan (154px) | no | 0 |
| 1440×789 | true | 863 (≤ 863) | 0 | 0 | **logo and full slogan** (240px) | no | 0 |
| 1920×953 | true | 1027 (≤ 1027) | 0 | 0 | **logo and full slogan** (267px) | no | 0 |
| 1024×660 | true | 734 (≤ 734) | 0 | 0 | full slogan (96px) | no | 0 |

Screenshots at 1366×610 and 1024×660 were inspected by eye:

- "Welcome to GBR", both fields, "Remember me", "Forgot Password?", and both buttons sit on one line.
- All three tiles show their heading, text, logo, and the "Yes I want to Join" button.
- The map prompt shows its lock, heading, three lines of text, and both buttons.
- The chat prompt shows its icon, heading, text, and both buttons.

The banner crops were captured at six sizes and compared: no line of the slogan or the logo is cut
at any of them. Only the footer lies below the screen. Strip 90 → 66px, tiles 200 → 162px
(210px at 1024 wide), as planned.

## US2

### T020 — guest regression check — PASS

1366×610 guest, after T016–T019: `guestPromptsShown: true`, `memberViewShown: false`, `fits: true`,
`pageHeight: 684`, 0 console errors. The guest view is unaffected.

### T020 — quickstart Phase C (member) — PASS

| Viewport | guestPromptsShown | memberViewShown | fits | chatInputOnScreen | pageHeight | Sideways scroll | Console errors |
|---|---|---|---|---|---|---|---|
| 1366×610 | **false** (was true) | true | true | true (was false) | 684 (was 2058) | no | 0 |
| 1536×737 | false | true | true | true | 811 | no | 0 |
| 1920×953 | false | true | true | true | 1027 | no | 0 |

- **Chat scrolls inside its box**: at 1366×610 the chat body holds 250px more content than it shows.
  A 60px mouse-wheel scroll over it moved the messages 60px. The page stayed at `scrollY` 0, and the
  message field stayed at 567–609px.
- **Map fills its panel and redraws on resize**: the Leaflet container matches its panel less its
  2px border at each size: 907×284 in a 911×288 panel at 1366×610. Resizing the window live to
  1920×953 gave 1063×627 in 1067×631, and to 1280×690 gave 849×364 in 853×368. All 258 country
  shapes were drawn, and the drawing layer always exceeded the container. Screenshots show no gap.
- **Observation, not a failure**: at 1366×610 the member chat's message area is about 60px tall,
  roughly one message at a time. FR-010 is met: the messages scroll and the field is visible. But
  it is tight on the smallest laptop, and worth reviewing with the owner once members can sign in.
  On 1536×737 and larger it shows several messages.

## US3

### T021 — scope review — PASS

The feature 003 section of `style.css` holds three all-width rules: the values moved from inline,
identical to before. Every other rule sits inside `@media (min-width: 992px)` or
`@media (min-width: 992px) and (min-height: 760px)`. Every selector is anchored on a homepage hook
(`.home-screen`, `.home-hero`, `.home-main`, `.home-photo`) or a homepage-only ID (`#mapLocked`,
`#mapContent`, `#map`, `#homeChatLocked`, `#homeChatContent`). A search of all live pages confirmed
those IDs exist only in `index.html`.

### T022 — quickstart Phase D step 1 — PASS

An untouched copy of the approved page (commit `7c5f8bd`, served separately) was compared with the
current page. Full-page screenshots were pixel-diffed, guest view:

| Viewport | Approved pageHeight | Current pageHeight | Pixel diff |
|---|---|---|---|
| 375×667 | 2167 | 2167 | 0 px changed |
| 390×664 | 2182 | 2182 | 0 px changed |
| 768×900 | 2371 | 2371 | 0 px changed |
| 820×1180 | 2321 | 2321 | 0 px changed |
| **991×700** (1px below the switch) | 2321 | 2321 | 0 px changed |

At **992×700** the fitted layout takes over: `fits: true`, page 774px, strip 66px, tiles 210px,
both prompts clean. The switch happens exactly at 992px.

**Member view on phone and tablet** differs from the approved page by design. The pages are 648px
(390×664) and 748px (768×900) shorter. Those are exactly the heights of the two guest prompts the
defect used to leave visible: 320 + 328 and 420 + 328. `guestPromptsShown` is now false. FR-009
applies at every width, so this is the fix, not a regression.

### T023 — quickstart Phase D steps 2–3 — PASS, after one adjustment

**Adjustment: floor raised from 280px to 288px.** At the planned 280px floor, short windows wider
than 1366px showed the guest chat prompt's content reaching 2–3px into its 4px padding: 1366×500 by
2px, and 1680×560, 1920×560, and 1920×600 by 3px. It stayed inside its border, but with no spare
room, because the banner grows with column width. 288px is the main area's exact height at the
1366×610 target, so the target is unaffected (re-measured: still `fits: true`, page 684px, both
prompts 0). research.md R4, plan.md, data-model.md, the contract, quickstart.md, and tasks.md were
updated to 288px.

After the change:

| Viewport | Main area | Page scrolls | Overlaps footer | Map prompt | Chat prompt |
|---|---|---|---|---|---|
| 1366×500 | 288 | yes (684px) | no | 0 | 0 |
| 1093×488 (1366×768 at **125% zoom**) | 288 | yes (732px) | no | 0 | 0 |
| 1680×560 | 288 | yes | no | 0 | 0 |
| 1920×560 | 288 | yes | no | 0 | 0 |
| 1920×600 | 288 | yes | no | 0 | 0 |

"Overlaps footer" compares the lowest edge of every element in the map area with the footer's top.
They are equal (no overlap) at every size.

**Sideways scrolling and console errors — full sweep.** 17 viewports, guest and member: 375×667,
390×664, 768×900, 820×1180, 991×700, 992×700, 1024×660, 1093×488, 1280×690, 1366×500, 1366×610,
1366×641, 1440×789, 1536×737, 1680×560, 1920×560, 1920×953. Results:

- Sideways scroll at **none**. Console errors at **none**.
- All 8 laptop sizes (≥992 wide, ≥610 tall) fit in both views. The guest prompts are clean, the
  member chat field is on screen, and the guest prompts are hidden for members at all 17 sizes.

## Invariants

### T024 — quickstart Phase E — PASS

Commands run from the repository root, exactly as written in `quickstart.md`:

| Check | Output | Result |
|---|---|---|
| 1–2. `name="` lines in the `index.html` diff | *(none)* | PASS — no form field touched |
| 3. `href` set, `HEAD` vs current | *(none)*, exit 0 | PASS — identical link targets |
| 4a. colour values not present before | *(none)* | PASS — no new colour |
| 4b. font sizes added | `font-size: 1.75rem !important` | PASS — the one allowed size (Bootstrap `.fs-3`) |
| 6. pages carrying the new hooks | `index.html` | PASS |

`git status` lists `index.html` and `assets/css/style.css` for this feature. `register.html` is also
listed; that comes from adopting the approved baseline (2026-10-14), not from this feature.

### T025 — other pages and console — PASS

`about.html`, `company.html`, and `register.html` were pixel-diffed against the approved copy at
1366×610 and 390×664: **0 px changed** at both sizes, navbar and footer included, with 0 console
errors. To back SC-007, the check was extended to **all 21 live pages other than `index.html`** at
1366×610: **0 pages changed**. `index.html` shows 0 console errors in guest and member views at all
17 sizes (US3 sweep).

## Handover

**Entry for feature 001's backend handover note (contract §6).**

> **Homepage fits one laptop screen (feature 003)**
>
> - **Files changed**: `index.html`, `assets/css/style.css`. Replace both; do not take one without
>   the other.
> - **New markup hooks** in `index.html`: a wrapper `<div class="home-screen">` around the header,
>   the tiles section, and the map section (the footer placeholder stays outside it). Also the
>   classes `home-hero` (tiles `<section>`), `home-main` (map `<section>`), and `home-photo` (the
>   `<div>` around the sidebar image). If the homepage has been copied into a Laravel template, carry
>   these four over, or the laptop layout will not apply there.
> - **Guest/member switching** now uses Bootstrap's `d-none` class instead of inline `display`.
>   `#mapContent` and `#homeChatContent` start with `class="d-none"`, and the page scripts toggle
>   `d-none` on them and on `#mapLocked` and `#homeChatLocked`. This fixes a defect where members
>   saw the guest sign-in prompts as well as the map and chat.
> - **Unchanged**: set `window.GBR_USER = { loggedIn: true }` before the page scripts, exactly as
>   before. No form field names, link targets, or endpoints changed.
