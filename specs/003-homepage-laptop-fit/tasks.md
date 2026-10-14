---

description: "Task list for feature 003 — Homepage Fits One Laptop Screen"
---

# Tasks: Homepage Fits One Laptop Screen

**Input**: Design documents from `/specs/003-homepage-laptop-fit/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/home-layout-contract.md](contracts/home-layout-contract.md),
[quickstart.md](quickstart.md)

**Tests**: No automated tests. The spec does not request them, and Principle III forbids a test
runner. Principle V makes **browser verification mandatory**, so every story ends with a
verification task that runs a phase of [quickstart.md](quickstart.md) and records the result.

**Organization**: Tasks are grouped by user story so each can be implemented and verified on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different file, no dependency on an incomplete task)
- **[Story]**: US1 = guest view fits · US2 = member view fits · US3 = other devices unchanged

## Path Conventions

Static site, flat repository root. Only two source files change: `index.html` and
`assets/css/style.css`. Results are logged in `specs/003-homepage-laptop-fit/verification.md`.

**Line numbers** below refer to the files **before any task runs** (approved baseline). Earlier tasks
shift them, so always locate an element by the quoted markup or ID, not by line number alone.

**Rule values**: Use exactly the values given. Every spacing value is a step of Bootstrap's spacing
scale (0, 4px, 8px, 16px, 24px), and the only size introduced is `1.75rem` (Bootstrap's `.fs-3`).
No colour value may be added anywhere (FR-016).

---

## Phase 1: Setup

**Purpose**: A local server and a recorded baseline, so later steps can prove what changed and what
did not.

- [X] T001 From the repository root run `python3 -m http.server 8080` and confirm `http://localhost:8080/index.html` loads with the navbar and footer present. Use this URL for every later browser check; do not open the page as `file://`.
- [X] T002 Create `specs/003-homepage-laptop-fit/verification.md` with headings `## Baseline`, `## US1`, `## US2`, `## US3`, `## Invariants`, and `## Handover`. Then run the quickstart's measurement snippet (copy it from the "Measurement snippet" block in `specs/003-homepage-laptop-fit/quickstart.md`) in Chrome DevTools at **390×664, 768×900, 1366×610, and 1920×953**, guest view. Record `pageHeight` and `heights` for each under `## Baseline`. Expected: 2182, 2371, 1258, and 1318px respectively. Save a full-page screenshot of each outside the repository for later comparison.

**Checkpoint**: Baseline recorded. Nothing in the site has changed yet.

---

## Phase 2: Foundational (no visible change)

**Purpose**: Give the homepage class hooks, and move its inline sizing into the shared stylesheet with
identical values (contract §1–§2, research R12). Every user story's rules depend on this. **The page
must look and measure exactly as before when this phase ends.**

**⚠️ CRITICAL**: No user-story work can begin until T006 passes.

- [X] T003 In `index.html`, add the four layout hooks (contract §1):
  - Insert `<div class="home-screen">` on its own line immediately before `<header class="bg-light">` (line 25).
  - Insert the matching `</div>` immediately after the second `</section>` (line 184), so `<div id="footer-placeholder"></div>` stays **outside** the wrapper.
  - Change the first `<section class="bg-light">` (line 42, the three tiles) to `<section class="bg-light home-hero">`.
  - Change the second `<section>` (line 59, the map row) to `<section class="home-main">`.
  - Change the `<div class="col-lg-12">` that wraps the `sidebar_image.jpg` image (line 151) to `<div class="col-lg-12 home-photo">`.
  - Re-indent nothing else.
- [X] T004 In `index.html`, remove only these inline sizing declarations, leaving every colour, border, background, and radius declaration in place (contract §2):
  - From each of the three tile `<div class="col-lg-4 …">` elements (lines 45, 48, 52), remove the `min-height` declaration (spelled `min-height: 200px;` or `min-height:200px;`).
  - From `<div id="mapLocked" …>` (line 75), remove `height:800px;` and `padding:24px;`.
  - From the sidebar `<img … src="assets/img/sidebar_image.jpg" …>` (line 151), remove `height:300px;` so its style reads `style="margin:0px;"`.
  - From `<div id="homeChatLocked" …>` (line 158), remove `padding:28px;`, `min-height:320px;`, and `margin-top:8px;`.
- [X] T005 In `assets/css/style.css`, immediately after the line `/* End Map */` (line 54), add a new section holding the moved values, applied at all widths:
  ```css
  /* ===== Home page — fit one laptop screen (feature 003) =====
     Stacked layout (< 992px) keeps the values below, moved unchanged from inline styles.
     The fitted layout (>= 992px) follows in the media blocks. */
  .home-hero .row > div { min-height: 200px; }
  #mapLocked { height: 800px; padding: 24px; }
  #homeChatLocked { padding: 28px; min-height: 320px; margin-top: 8px; }
  /* ===== End Home page ===== */
  ```
  The existing `#map, #mapLocked { height: … !important; }` rules at under 992px stay as they are.
- [X] T006 Re-run the measurement snippet at the four Baseline viewports and compare with `## Baseline` in `specs/003-homepage-laptop-fit/verification.md`. Every `pageHeight` and `heights` value must match **exactly**, and full-page screenshots must look identical. Record the comparison under `## Baseline` as "Phase 2 check". If anything differs, fix T003–T005 before continuing.

**Checkpoint**: Hooks in place, inline sizing in the stylesheet, zero visible change.

---

## Phase 3: User Story 1 — A visitor sees the whole homepage on a laptop (Priority: P1) 🎯 MVP

**Goal**: For a guest, everything above the footer fits a 1366×610 viewport and larger
(FR-001–FR-008).

**Independent Test**: At 1366×610, guest view, the snippet reports `fits: true`, `pageHeight ≤ 684`,
and `lockedChatOverflow: 0`. The photo banner shows the full slogan, and every element of every
section is visible.

All tasks in this phase edit the same section of `assets/css/style.css`, so they run in order. Put
every rule **inside the new section from T005, before `/* ===== End Home page ===== */`**.

- [X] T007 [US1] In `assets/css/style.css`, open the fitted-layout block and make the wrapper a screen-filling column:
  ```css
  @media (min-width: 992px) {
    .home-screen { display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }
  }
  ```
  All later US1 and US2 rules go **inside this same `@media (min-width: 992px)` block**.
- [X] T008 [US1] In the `@media (min-width: 992px)` block of `assets/css/style.css`, put "Welcome to GBR" on the same line as the sign-in fields (research R5):
  ```css
  .home-screen > header > .container .col { display: flex; align-items: center; gap: 16px; padding-block: 8px; }
  .home-screen > header > .container .col > p { margin: 0 !important; white-space: nowrap; flex: 0 0 auto; }
  .home-screen > header > .container .col > form { flex: 1 1 auto; }
  ```
  The `!important` overrides Bootstrap's `.m-2`, which is itself `!important`. Check at 1024×660 and 1366×610 that the label, both fields, "Remember me", "Forgot Password?", and both buttons sit on one line, and the strip measures about 66px.
- [X] T009 [US1] In the `@media (min-width: 992px)` block of `assets/css/style.css`, shorten the three tiles to their content (research R6):
  ```css
  .home-hero .row > div { min-height: 0; padding-block: 8px; }
  .home-hero .row > div p { margin-bottom: 4px; }
  .home-hero .mt-xl-4 { margin-top: 4px !important; }
  .home-hero img { height: 56px; }
  ```
  Expected tile row: about 162px at 1366 wide and 210px at 1024 wide. All headings, text, the logo, and the "Yes I want to Join" button stay visible.
- [X] T010 [US1] In the `@media (min-width: 992px)` block of `assets/css/style.css`, make the map row take the remaining height, with a 288px floor (research R3, R4; planned as 280px, raised during T023):
  ```css
  .home-main { flex: 1 0 288px; min-height: 288px; position: relative; }
  .home-main > .container { position: absolute; inset: 0; }
  .home-main > .container > .row { height: 100%; }
  .home-main > .container > .row > div { height: 100%; }
  #mapLocked { height: 100%; }
  ```
  `position: absolute; inset: 0` on the inner container is required. Without it, measurement showed the map at 638px in a 288px section (research R3).
- [X] T011 [US1] In the `@media (min-width: 992px)` block of `assets/css/style.css`, turn the sidebar into a column and crop the photo to a slogan banner by width (research R7):
  ```css
  .home-main .col-lg-4 { display: flex; flex-direction: column; }
  .home-photo { flex: 0 0 auto; aspect-ratio: 10 / 3; overflow: hidden; }
  .home-photo img { object-position: center 30%; }
  ```
  The image keeps its existing `object-fit-cover w-100 h-100` classes. Check at 1366×610 that the banner shows all three slogan lines ("Meet the busi- / ness personnels / virtually"), no part of the GBR logo, and no line cut through.
- [X] T012 [US1] In the `@media (min-width: 992px)` block of `assets/css/style.css`, let the guest chat prompt fill the space below the banner and tighten it (research R8):
  ```css
  #homeChatLocked { flex: 1 1 auto; min-height: 0; padding: 8px 12px; }
  #homeChatLocked .bi { font-size: 1.75rem !important; }
  #homeChatLocked h3 { margin-top: 4px !important; margin-bottom: 4px !important; }
  #homeChatLocked p { margin-bottom: 8px !important; }
  ```
  The `!important` flags override the icon's inline `font-size:40px` and Bootstrap's `.mt-3`, `.mb-2`, and `.mb-3` utilities, which are themselves `!important`. Keep the 8px `margin-top` from T005, the gap between banner and prompt.
- [X] T013 [US1] Tune the guest chat prompt in `assets/css/style.css` until the snippet reports `lockedChatOverflow: 0` at **1366×610 and 1024×660**; the prototype was 5px over (research R8). Adjust only `#homeChatLocked` padding and its `h3`/`p` margins inside the `@media (min-width: 992px)` block, using only 0, 4px, or 8px. Change nothing else. Record the final values under `## US1` in `specs/003-homepage-laptop-fit/verification.md`.
  *Done with two recorded deviations: the snippet's overflow check missed top-edge clipping and was corrected in `quickstart.md`; the corrected check also required `#mapLocked` padding `8px 24px` and `line-height: 1` on the chat icon. See verification.md § US1.*
- [X] T014 [US1] In `assets/css/style.css`, add a second media block **after** the `@media (min-width: 992px)` block and before `/* ===== End Home page ===== */`, so that tall screens show logo and slogan (research R7):
  ```css
  @media (min-width: 992px) and (min-height: 760px) {
    .home-photo { aspect-ratio: 2 / 1; }
    .home-photo img { object-position: top; }
  }
  ```
  Check at 1440×789 and 1920×953 that the banner shows the GBR logo and all three slogan lines. At 1536×737 it should still show the slogan only.
- [X] T015 [US1] Run **quickstart Phase B** (guest view at 1366×610, 1366×641, 1280×690, 1536×737, 1440×789, 1920×953, 1024×660). Every row must match the Phase B table: `fits: true`, `pageHeight` within its limit, `lockedChatOverflow: 0`, the banner check, `sidewaysScroll: false`, and every element visible. Record each row's result, with what was seen if it fails, under `## US1` in `specs/003-homepage-laptop-fit/verification.md`.

**Checkpoint**: The guest homepage fits every laptop size. This is the MVP; it can ship on its own,
because guests are the only visitors until the backend signs members in.

---

## Phase 4: User Story 2 — A signed-in member sees the map and chat on one screen (Priority: P2)

**Goal**: Members see only the map and chat — no guest prompts — on one screen, with the chat's
messages scrolling inside the box (FR-009–FR-011).

**Independent Test**: With a DevTools local override setting `window.GBR_USER = { loggedIn: true }`,
at 1366×610 the snippet reports `guestPromptsShown: false`, `memberViewShown: true`, `fits: true`,
and `chatInputOnScreen: true`.

T016–T018 edit `index.html` and can start as soon as Phase 2 is done, in parallel with Phase 3,
which edits only `assets/css/style.css`. T019 edits the stylesheet, so it runs after T014.

- [X] T016 [P] [US2] In `index.html`, replace the inline `style="display:none;"` on `<div id="mapContent" …>` (line 71) and on `<div id="homeChatContent" …>` (line 169) with `class="d-none"`. Each element ends up with no `style` attribute. This is the root fix of research R9: Bootstrap's `.d-flex` is `display:flex !important`, so inline `display` writes never hid the guest prompts.
- [X] T017 [US2] In `index.html`'s map script, replace the two lines (lines 90–91)
  `document.getElementById("mapContent").style.display = "block";` and
  `document.getElementById("mapLocked").style.display = "none";` with
  `document.getElementById("mapContent").classList.remove("d-none");` and
  `document.getElementById("mapLocked").classList.add("d-none");`.
  Keep them **before** `var map = L.map(…)`, so Leaflet measures a visible container (research R11). Change nothing else in that script.
- [X] T018 [US2] In `index.html`'s live-chat reveal script near the end of `<body>` (lines 212–213), replace the two `style.display` lines with
  `document.getElementById("homeChatContent").classList.toggle("d-none", !allowed);` and
  `document.getElementById("homeChatLocked").classList.toggle("d-none", allowed);`.
  Do not edit the backend-developer comment block above it; it stays accurate (contract §5, invariant 1).
- [X] T019 [US2] In `assets/css/style.css`, inside the `@media (min-width: 992px)` block, make the map and the member chat fill their space (research R10–R11):
  ```css
  #mapContent, #map { height: 100%; }
  #homeChatContent { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; margin-top: 8px; }
  #homeChatContent .chat-card { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
  #homeChatContent .chat-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
  ```
  `.d-none` (`display:none !important`) still hides `#homeChatContent` for guests despite `display: flex` here. Do not add rules for `.chat-card`, `.chat-body`, or `.chat-input` outside `#homeChatContent`: the shared widget's appearance must not change (contract §5, invariant 5).
- [X] T020 [US2] Confirm the guest view is unaffected by T016–T019: rerun the snippet at 1366×610 as a guest, expecting `guestPromptsShown: true`, `memberViewShown: false`, and `fits: true`. Then run **quickstart Phase C** with the local override at 1366×610, 1536×737, and 1920×953: no guest prompts, `fits` and `chatInputOnScreen` true, chat scrolls inside its box while the page stays still, and the map fills its panel and redraws when the window is resized. Record the results under `## US2` in `specs/003-homepage-laptop-fit/verification.md`.

**Checkpoint**: Guest and member views both fit and both work.

---

## Phase 5: User Story 3 — Every other device keeps working (Priority: P3)

**Goal**: Phones and upright tablets are unchanged; short windows scroll instead of squashing; no
size scrolls sideways (FR-012–FR-014).

**Independent Test**: At 390×664 and 768×900, `pageHeight` and `heights` match the Baseline within
2px.

The work here is mostly confirming that Phases 2–4 kept the stacked layout untouched; there is
little to build.

- [X] T021 [US3] Review the feature 003 section of `assets/css/style.css`. Every rule after the three all-width defaults from T005 must sit inside `@media (min-width: 992px)` or `@media (min-width: 992px) and (min-height: 760px)`. No selector may reach outside the homepage hooks (`.home-screen`, `.home-hero`, `.home-main`, `.home-photo`) and the homepage IDs (`#mapLocked`, `#mapContent`, `#map`, `#homeChatLocked`, `#homeChatContent`). Fix any rule that does.
- [X] T022 [US3] Run **quickstart Phase D step 1**: at 390×664 and 768×900, guest view, compare `pageHeight` and `heights` with `## Baseline` (must match within 2px), and compare against the Baseline screenshots. Also check **991×700** (stacked, as before) against **992×700** (fitted) to confirm the switch happens exactly at 992px. Record under `## US3` in `specs/003-homepage-laptop-fit/verification.md`.
- [X] T023 [US3] Run **quickstart Phase D steps 2–3**: at 1366×500, and at 1366×768 with browser zoom 125%, the map area is 288px tall, the page scrolls, all content is readable, and nothing overlaps the footer. Confirm `sidewaysScroll: false` at every size checked in T015, T020, T022, and here. Record under `## US3` in `specs/003-homepage-laptop-fit/verification.md`.

**Checkpoint**: All three stories verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T024 Run **quickstart Phase E** commands from the repository root: no `name="` lines in the diff; `href` set unchanged; 4a: no new colour value; 4b: the only added font size is `1.75rem`; the hooks appear only in `index.html`. Paste each command's output under `## Invariants` in `specs/003-homepage-laptop-fit/verification.md`.
- [X] T025 [P] Open `about.html`, `company.html`, and `register.html` at 1366×610 and 390×664. Confirm the navbar and footer look exactly as before, and that the browser console shows no new errors on those pages or on `index.html` (guest and member). Record under `## Invariants` in `specs/003-homepage-laptop-fit/verification.md`.
- [X] T026 Under `## Handover` in `specs/003-homepage-laptop-fit/verification.md`, write the backend developer's entry for feature 001's handover note (contract §6). It must cover:
  - the files changed: `index.html` and `assets/css/style.css`;
  - the new wrapper `.home-screen` and the classes `home-hero`, `home-main`, and `home-photo`, which must be carried over if the homepage was copied into a Laravel template;
  - the guest/member elements now toggled by the `d-none` class;
  - that `window.GBR_USER = { loggedIn: true }` is unchanged.
- [X] T027 In `specs/003-homepage-laptop-fit/spec.md`, change `**Status**: Draft — clarified 2026-10-14, ready for tasks` to `**Status**: Implemented — verified <date>`, using the date verification finished. Do this only if T015, T020, T022, T023, T024, and T025 all passed. Otherwise leave the status, and list the failures at the top of `verification.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (T001–T002)** → **Phase 2 (T003–T006)** → user stories. T006 is the gate: no story work
  until the page is proven unchanged.
- **US1 (T007–T015)** and **US2's markup tasks (T016–T018)** can run in parallel after T006; they
  touch different files.
- **T019** (US2 stylesheet) runs after **T014**, because both edit the same media block.
- **US3 (T021–T023)** runs after US1 and US2, because it verifies their combined effect.
- **Polish (T024–T027)** runs last.

### User Story Dependencies

- **US1**: depends only on Phase 2. It is the MVP and ships alone.
- **US2**: depends on Phase 2. Its stylesheet task, T019, follows US1's T014 in the same block. Its
  markup fix, T016–T018, is independent and is worth landing even without the layout work, because it
  corrects a real defect.
- **US3**: verification of US1 and US2 together, plus a scope review (T021).

### Within Each Story

Rules are added in the order the page is laid out, top to bottom: wrapper → strip → tiles → map row →
sidebar → chat. Each task's local check is done before the next starts.

## Parallel Example

```text
After T006 passes, two streams can run at once:

Stream A (assets/css/style.css):  T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015
Stream B (index.html):            T016 → T017 → T018

Then:                             T019 → T020 → T021 → T022 → T023 → T024 (+ T025 [P]) → T026 → T027
```

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 + Phase 2. Prove zero visible change (T006).
2. Phase 3 (US1). Verify with T015.
3. **Stop and show the owner.** The guest homepage on a laptop is the whole visible request. Members
   cannot sign in until the backend developer wires login, so US2 does not block a release.

### Incremental Delivery

1. MVP as above.
2. Add US2, which fixes the member-view defect and fits the member layout, before the backend goes
   live with sign-in.
3. Run US3 and the Polish phase before handing the full file set to the backend developer
   (feature 001 FR-022).

## Notes

- Nothing is committed unless the owner asks (constitution: Commits).
- Feature 001 also edits `assets/css/style.css`. This feature's rules sit in their own section after
  `/* End Map */`. If 001 lands first, re-run T006 and T015; if this lands first, 001 re-runs its own
  checks.
- Do not edit inline **colours** on the homepage — that is feature 001's deferred palette work.
- Do not change `assets/js/custom.js`, the navbar, the footer, or any page other than `index.html`.
