# Implementation Plan: Homepage Fits One Laptop Screen

**Branch**: `003-homepage-laptop-fit` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-homepage-laptop-fit/spec.md`

## Summary

The approved homepage is 1258px tall on a 1366×768 laptop that shows about 610px. The fixed 800px
map box alone is taller than the screen. For members it is 2058px, because the guest prompts are
never hidden. This plan makes everything above the footer fit exactly one laptop screen from 992px
wide upward, and leaves phones and upright tablets as they are.

The approach is pure CSS plus a small markup change, proven in a headless-browser prototype at
nine viewports before this plan was written (research R3):

1. **A screen-filling column.** A new `.home-screen` wrapper around the header, tiles, and map
   section becomes a flex column at least as tall as the viewport. The map section takes whatever
   height remains, with a 288px floor, after which the page scrolls.
2. **Shorter strips.** The welcome label moves beside the sign-in fields (90→66px). The tiles drop
   their 200px floor and tighten their spacing (200→162px). Only existing spacing steps are used.
3. **A width-based photo banner.** The square photo is cropped to 10:3 to show the printed slogan,
   or to 2:1 to show logo and slogan on screens at least 760px tall. The crop is tied to the column's
   width, so it never cuts a line of text.
4. **A defect fix.** The member view toggles Bootstrap's `d-none` class instead of inline `display`,
   which the prompts' `d-flex !important` was overriding. The backend's `window.GBR_USER` flag is
   unchanged.

Result at the target: content screen 610px (= viewport), page 684px (screen + footer).

## Technical Context

**Language/Version**: HTML5, CSS3, plain browser JavaScript (ES5-style inline scripts, matching the
page)

**Primary Dependencies**: Bootstrap 5.3.6 (local copy and CDN), Bootstrap Icons 1.11.3, Leaflet
(unpkg), all already loaded by `index.html`. No new dependency.

**Storage**: N/A

**Testing**: Manual browser verification per Principle V, at the viewports in
[research.md](research.md) R1, using the DevTools console snippet in [quickstart.md](quickstart.md).
No test runner is added (Principle III).

**Target Platform**: Current Chrome, Edge, Firefox, and Safari. Fitted layout at ≥992px wide;
`100dvh` with a `100vh` fallback for older engines.

**Project Type**: Static multi-page website, frontend only. The Laravel backend is external.

**Performance Goals**: No layout computed by JavaScript, and no visible jump on load: the layout is
final at first paint.

**Constraints**:
- Shared navbar (94px) and footer (74px) untouched.
- No new colour, typeface, or type size; spacing from Bootstrap's existing scale only.
- Inline colour styles left in place for feature 001.
- Stacked layout below 992px unchanged to within 2px.

**Scale/Scope**: One page (`index.html`: one wrapper element, three classes, four inline sizing
values moved, one script corrected). One new section in `assets/css/style.css`, about 40 rules.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| I. Frontend-Only Scope | **PASS** | Markup, styles, and an inline script only. No server code. The member flag is consumed exactly as before. |
| II. Contract-First Backend Integration | **PASS** | No form field, `name`, endpoint, or flag changes (contract §5 invariants 1–2). No root-level contract note is owed; the change is listed in feature 001's handover note (contract §6). |
| III. Static, Build-Free Pages | **PASS** | No build step, package, or framework. The research prototype ran outside the repository and is not committed. |
| IV. Existing Design Language Only | **PASS** | No colour, typeface, or type scale added. 4px and 8px are Bootstrap spacing steps; 1.75rem is Bootstrap's `.fs-3` size. Layout uses Bootstrap's grid plus flexbox, the primitive the grid itself is built on; CSS Grid was considered and rejected for this reason (R3). Navbar and footer untouched. Shared chat widget sized, not restyled (R10). New classes are layout hooks, added to `style.css` with their necessity stated (contract §1). |
| V. Browser-Verified Delivery | **PASS (planned)** | [quickstart.md](quickstart.md) Phases A–E: two widths and more, guest and member, the "switch back" path (window resize), console errors, link and field invariants. |

**Design gate** — existing pieces reused: Bootstrap 5 grid (`row`, `col-lg-4`, `col-lg-8`),
utilities (`d-none`, `d-flex`, `h-100`, `object-fit-cover`), the spacing scale, the `.fs-3` size, the
`.chat-card` family, the `#map`/`#mapLocked` rules and their breakpoints, and the 1600px content
cap. Nothing is added to the Design Token Reference.

**Scope gate** — no task creates server-side code.

## Project Structure

### Documentation (this feature)

```text
specs/003-homepage-laptop-fit/
├── spec.md              # Feature specification (clarified 2026-10-14)
├── plan.md              # This file
├── research.md          # Phase 0: 14 measured decisions
├── data-model.md        # Phase 1: layout regions, height budget, view state
├── quickstart.md        # Phase 1: verification guide (Phases A–E)
├── contracts/
│   └── home-layout-contract.md   # Markup hooks, moved inline values, rules, invariants
├── checklists/
│   └── requirements.md  # Spec quality checklist (16/16)
└── tasks.md             # Phase 2 output (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html               # wrapper + 3 classes, inline sizing removed, view-state script fixed
assets/css/style.css     # new "Home page — fit one laptop screen" section after "Map"
```

No other file changes. `assets/js/custom.js` (navbar and footer) is not touched.

**Structure Decision**: The repository is a flat set of static pages with one shared stylesheet.
The feature edits the one page it concerns and adds one scoped section to the shared stylesheet,
next to the homepage map rules that already live there (research R13).

## Implementation Outline

For `/speckit-tasks`. Order matters: step 1 makes the later visual checks trustworthy.

1. **Baseline.** Run quickstart Phase A on the untouched page and keep the numbers and screenshots.
2. **Fix the view state** (User Story 2 prerequisite). Swap the four `style.display` writes for
   `d-none` toggles. Give `#mapContent` and `#homeChatContent` the `d-none` class in place of
   `style="display:none"`. Show `#mapContent` before `L.map()` runs. Verify the member view shows
   no prompts, before any layout work.
3. **Move inline sizing to the stylesheet** with identical values (contract §2). Verify the stacked
   layout and the desktop layout are pixel-identical to the baseline: this step must change nothing
   visible.
4. **Add the markup hooks** (contract §1): the `.home-screen` wrapper and the three classes. Still
   no visible change.
5. **Add the fitted-layout rules** under `(min-width: 992px)` (contract §3): wrapper column, strip,
   tiles, main region with pinned container, map panel, sidebar column, banner, chat panel, member
   chat scrolling.
6. **Add the tall-screen banner rule** under `(min-height: 760px)`.
7. **Tune the guest chat prompt** until `lockedChatOverflow` is 0 at 1366×610 and 1024×660
   (research R8: the prototype was 5px over).
8. **Verify**: quickstart Phases B–E, and record the results.

## Risks

| Risk | Mitigation |
|---|---|
| Longer tile text later (e.g. via the content editor, feature 002) pushes the map area below its floor | The floor is 288px, after which the page scrolls (FR-013). The spec's edge cases record this as accepted. |
| Feature 001 consolidation also edits `style.css` | Different sections. Index has no `<style>` block for 001 to move. Whichever lands second re-runs the other's checks. |
| The backend developer ported the homepage into a template | Contract §6: the handover note names the wrapper and hooks that must be carried over. |
| A browser without `dvh` support | The `100vh` declaration precedes `100dvh`. On desktop they are equal. |
| The map's world view at minimum zoom shows only a band of latitudes on short screens | Accepted. Pan and zoom work as today. Changing zoom limits is out of scope (R11). |

## Complexity Tracking

No constitution violations to justify. One technique needs a note: the map section's inner
container is absolutely positioned within it (R3). This is a positioning detail, not a new layout
system. It was chosen over CSS Grid because Grid would add a second layout system beside Bootstrap's
flex grid. It was chosen over a plain flex chain because measurement showed the flex chain does not
give the inner map and photo a resolvable height.

## Post-Design Constitution Re-check

Re-checked after writing [research.md](research.md), [data-model.md](data-model.md), the
[contract](contracts/home-layout-contract.md), and [quickstart.md](quickstart.md): **all five
principles still PASS**. The design adds no token (contract invariant 4) and reaches no other page
(invariant 6, verified: the targeted IDs exist only in `index.html`). It changes no backend contract
(invariant 1), and verification is fully specified (Principle V). No new open questions arose.
