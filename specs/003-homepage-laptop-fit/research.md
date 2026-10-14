# Research: Homepage Fits One Laptop Screen

**Feature**: [spec.md](spec.md) · **Plan**: [plan.md](plan.md) · **Date**: 2026-10-14

Every decision below was checked by measurement, not reasoning alone. The approved `index.html` was
served locally and measured in headless Chromium at each listed viewport; candidate layouts were
applied in memory, without editing any file, and measured the same way. The figures quoted are
those measurements.

## R1. Target viewport

**Decision**: Design to a **1366×610** CSS-pixel viewport, and verify at 1280×690, 1366×641,
1440×789, 1536×737, and 1920×953.

**Rationale**: The owner chose "1366×768 and up". A 1366×768 screen loses height to the operating
system taskbar (40–48px), the browser's tabs and address bar (about 85px), and a bookmarks bar when
shown (about 28px). That leaves 607–643px; 610 covers the worst common case. The other sizes are the
usual laptop and desktop screens after the same deductions:

| Screen | Typical device | Viewport used |
|---|---|---|
| 1366×768 | Budget and older laptops | 1366×610 (with bookmarks bar), 1366×641 (without) |
| 1280×800 | Older 13-inch laptops | 1280×690 |
| 1536×864 | 15.6-inch 1080p laptop at the default 125% Windows scaling | 1536×737 |
| 1440×900 | 13-inch MacBook Air | 1440×789 |
| 1920×1080 | Desktop monitor at 100% | 1920×953 |

**Alternatives considered**: 1366×641 alone (fails for anyone with a bookmarks bar); 1536×737 as the
floor (rejected by the owner).

## R2. Where the fitted layout applies

**Decision**: From **992px wide** upward — Bootstrap's `lg` breakpoint — with no minimum-height
condition. Below 992px the page is left exactly as it is.

**Rationale**: 992px is where the homepage's tiles and its map/sidebar row already switch from
stacked to side-by-side (`col-lg-4`, `col-lg-8`). Fitting a stacked page into one screen is
impossible and was not requested. Short windows at 992px and up are handled by a minimum height
(R4) rather than by switching layouts, so there is a single fitted layout instead of two.

**Alternatives considered**: An extra `min-height` media condition that falls back to today's
layout on short windows. That would show the 800px map box at exactly the sizes least able to hold
it.

## R3. How the map-and-sidebar area takes the remaining height

**Decision**: Wrap the header, the tiles section, and the map section in one new element,
`.home-screen`, laid out as a flex column with `min-height: 100vh` (then `100dvh` where supported).
The map section, `.home-main`, takes `flex: 1 0 288px; min-height: 288px; position: relative`. Its
inner `.container` is pinned to its edges (`position: absolute; inset: 0`). The row and columns
inside then take `height: 100%`.

**Rationale**: The outer flex column hands the map section exactly the height left after the
header and tiles, at any viewport and with any wrapping of the tiles' text. Pinning the inner
container gives every element inside a height the browser can resolve. Without the pin, measured
heights did not resolve: in a 288px section the map rendered at 638px and the photo at 300px, and
the page overflowed by 350px. With it, every size fits to the pixel.

| Approach | Result at 1366×610 (guest) | Why rejected or chosen |
|---|---|---|
| Fixed `height: 100dvh` wrapper | Fits | When the window is too short, content overflows the wrapper and covers the footer |
| `height: calc(100dvh − N px)` | Fits at one width | The tiles are 162px at 1366 but 210px at 1024, so no single `N` works |
| JavaScript measuring heights on load and resize | Not built | A visible jump on load, and script doing a stylesheet's job |
| CSS Grid rows on the wrapper | Works | Adds a second layout system beside Bootstrap's flex grid, which Principle IV forbids |
| `min-height` wrapper with stretched flex children | **Overflows by 350px** | Inner heights do not resolve: the map is 638px in a 288px section |
| **`min-height` wrapper + pinned inner container** | **Fits; page = screen + footer** | Chosen |

## R4. Minimum height of the map-and-sidebar area

**Decision**: **288px** (280px as first planned; raised during implementation).

**Rationale**: The guest map prompt (lock icon, heading, three lines of text, two buttons) needs
about 278px, so 280px was planned. During implementation, short windows wider than 1366px
(1680×560, 1920×560) showed the guest chat prompt's content reaching 2–3px into its padding at
280px, because the banner grows with column width. 288px — the main area's exact height at the
1366×610 target, so the target is unaffected — clears it at every width. At 1366×500, standing in
for browser zoom or a short window, the section holds at 288px and the page scrolls 74px (footer
included), which meets FR-013.

## R5. Making the welcome and sign-in strip shorter

**Decision**: From 992px up, put "Welcome to GBR" on the same line as the sign-in fields, and set
the strip's vertical padding to 8px. Strip height goes from **90px to 66px**.

**Rationale**: The strip spends a whole line on two words. The fields, buttons, and their sizes are
unchanged; only the label moves beside them. 8px is an existing step on Bootstrap's spacing scale
(`.py-2`). At 992px the label, both fields, "Remember me", "Forgot password?", and both buttons still
fit on one line (measured at 1024px).

## R6. Making the introduction tiles shorter

**Decision**: From 992px up, remove the tiles' 200px minimum height, set their vertical padding to
8px and their paragraph spacing to 4px, and draw the first tile's logo at 56px instead of 86px.
Tiles go from **200px to 162px** (210px at 1024 wide, where the text wraps more). Below 992px the
200px minimum stays.

**Rationale**: The 200px floor exists only to make three short tiles look equal; the tallest tile's
content needs 162px. 4px and 8px are existing Bootstrap spacing steps (`.mb-1`, `.py-2`). The
logo's size is an image size, not a type size. No text size changes.

## R7. Cropping the sidebar photo

**Decision**: Show the photo inside a new wrapper, `.home-photo`, that crops it to a banner whose
height follows the column's **width**:

- **Below 760px tall**: banner `aspect-ratio: 10 / 3`, image `object-position: center 30%` →
  shows the **slogan**.
- **760px tall and up**: banner `aspect-ratio: 2 / 1`, image `object-position: top` → shows the
  **logo and the slogan**.

**Rationale**: The image file is 295×294 — square — although the markup declares 442×294. Measured
in the file, the logo occupies 4–20% of its height and the slogan 23–49%. Because the image always
spans the full column width, both regions sit at fixed fractions of the column's width:

- A 10:3 banner is 30% as tall as it is wide. With the image positioned at 30%, it shows 21–51% of
  the image: the whole slogan, none of the logo.
- A 2:1 banner shows the top 50%: logo and whole slogan.

Tying the banner to the main area's height instead was tried first. It cut the slogan through
mid-line at some widths — for example 1536×790, where a 240px banner is shorter than the slogan's
250px — because the image scales with width, not height. The width-based crop was checked
visually at 1024, 1366, 1536, and 1920 wide and never cuts a line (FR-007).

The 760px threshold is where the 2:1 banner plus the chat prompt first fit beneath the fixed
sections at every width up to the 1600px content cap. The worst case needs 747px.

**Alternatives considered**: `object-fit: contain` (the whole photo, small and letterboxed; the
owner chose the banner instead). Showing logo and slogan at 1366×768 (does not fit there; the owner
was told so, and the spec records it).

## R8. Making the guest chat prompt shorter

**Decision**: From 992px up, the prompt fills the space below the banner (`flex: 1 1 auto`) instead
of holding a 320px minimum. Its padding is 8px 12px instead of 28px, and its icon is drawn at 1.75rem
(28px) instead of 40px.

**Rationale**: At 1366×610 the prompt has 143px. 1.75rem is the size of Bootstrap's own `.fs-3`
step, an existing size rather than a new one. **Open tuning item**: in the prototype the prompt
still overflowed by 5px at 1366×610 and 1024×660. The heading and text margins must absorb this
during implementation. The quickstart's measurement step checks it (`lockedChatOverflow` must be 0).

## R9. The signed-in view shows the guest prompts too (defect)

**Decision**: Hide and show the four gated elements by toggling Bootstrap's `d-none` class instead
of setting `element.style.display`. The two member-only elements start with `d-none` in the markup
instead of `style="display:none"`.

**Rationale**: Both guest prompts carry the `d-flex` class, which Bootstrap defines as
`display: flex !important`. A stylesheet rule marked `!important` beats a normal inline style, so
the page's `style.display = "none"` has no effect and the prompts stay visible. Measured: the
signed-in page was 2058px, with the map prompt below the map and the chat prompt above the chat.
`d-none` is itself `display: none !important`, so it wins.

**Backend contract unchanged**: the backend still sets `window.GBR_USER = { loggedIn: true }`
before the page scripts run. Nothing about that flag changes.

## R10. Fitting the signed-in chat

**Decision**: Scope three sizing rules to the homepage's chat (`#homeChatContent`): the wrapper and
`.chat-card` become flex columns, and `.chat-body` takes the remaining height with
`overflow-y: auto`.

**Rationale**: Measured at every laptop size, the message field ends 1px above the bottom of the
screen, and older messages scroll inside the box (FR-010). The shared chat widget's appearance is
untouched: the rules size it for this container only, as Principle IV allows. They do not restyle,
fork, or rename `.chat-card`, `.chat-body`, or `.chat-input`.

## R11. The interactive map

**Decision**: Leave the map's code alone apart from showing its container before it is created. Do
not change its zoom limits.

**Rationale**: Leaflet sizes itself from its container when created, and by default it redraws on
window resize (`trackResize`), which covers FR-011. With the `d-none` fix, the container is visible
and sized before `L.map()` runs. On a short screen the world view at the existing minimum zoom (2)
shows a band of latitudes rather than the whole globe; members can pan as today. Lowering the
minimum zoom would change map behaviour and was not requested.

## R12. Inline styles that block the layout

**Decision**: Move the homepage's inline **sizing** values into the shared stylesheet with the same
values, so that a media query can change them without `!important`. Leave inline **colour** values
where they are.

| Element | Inline today | Moves to stylesheet as |
|---|---|---|
| Three tiles | `min-height: 200px` | the same, for all widths; removed from 992px up |
| Guest map prompt | `height: 800px; padding: 24px` | the same; the existing below-992px rules still apply |
| Sidebar photo | `height: 300px` | removed — already overridden by the `.h-100` class, so it has no effect |
| Guest chat prompt | `padding: 28px; min-height: 320px; margin-top: 8px` | the same, below 992px |

**Rationale**: Inline styles beat stylesheet rules, so the fitted layout cannot change these values
without `!important`. Moving them with identical values keeps the layout below 992px unchanged,
which SC-005 checks. Inline colours belong to feature 001's deferred palette work and are not
touched here.

## R13. Where the new rules live

**Decision**: A new **"Home page — fit one laptop screen"** section in `assets/css/style.css`,
directly after the existing **Map** section.

**Rationale**: The homepage's map rules (`#map`, `#mapLocked`) already live in the shared
stylesheet, so this follows established practice. `index.html` has no page-level `<style>` block,
and feature 001 is removing such blocks, so adding one would work against it.

## R14. Verification

**Decision**: Manual checks in a browser at every listed size (Principle V), supported by a
measurement snippet pasted into the DevTools console (see [quickstart.md](quickstart.md)). The
headless measurement used for this research may be rerun on a developer machine, but nothing is
committed.

**Rationale**: Principle III forbids adding a package manifest or test runner. The console snippet
needs nothing installed.
