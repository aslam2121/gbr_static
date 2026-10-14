# Feature Specification: Homepage Fits One Laptop Screen

**Feature Branch**: `003-homepage-laptop-fit`

**Created**: 2026-10-14

**Status**: Implemented — verified 2026-10-14

**Input**: User description: "home page section are too big for their data make them so that they can fit in standard laptop screen so that hoempage view can be done without scrolling also without breaking responsiveness for other devices"

## Overview

The homepage's sections are sized far beyond what they hold. On a standard 1366×768 laptop the
browser shows about 610px of page, but the approved homepage is 1258px tall, so a visitor must
scroll almost two screens to see it all. Measured on the approved baseline (2026-10-14):

| Section | Height today | What it holds |
|---|---|---|
| Navigation bar (shared, all pages) | 94px | Logo and seven links |
| Welcome and sign-in strip | 90px | One line of text and one row of fields |
| Three introduction tiles | 200px | A heading, two lines of text, one button |
| Map-and-sidebar area | 800px | A sign-in prompt in an 800px box; a 454px photo; a chat prompt |
| Footer (shared, all pages) | 74px | One row of links |

The 800px map box alone is taller than the whole visible screen. For signed-in members it is
worse: a defect keeps the guest sign-in prompts on screen **beside** the real map and chat, so
the signed-in page measures 2058px.

This feature resizes the homepage's sections to fit their content, so that everything above the
footer is visible on one laptop screen, while phones and tablets keep today's layout.

## Clarifications

### Session 2026-10-14

- Q: Which laptop screen should the homepage fit without scrolling? → A: 1366×768 and up. Larger screens give the map area more height automatically.
- Q: Must the footer also be visible without scrolling? → A: No. All content sections fit; only the footer may sit just below the screen.
- Q: How should the sidebar photo shrink? → A: Crop it to a full-width banner.
- Follow-up (measured after the answer above): the photo is square, with the GBR logo in its top 20% and the printed slogan between 23% and 49% of its height. On 1366×768-class screens the banner has room for one of the two, not both. Because the logo already appears in the navigation bar and the first tile, the banner shows the **slogan** there, and shows logo and slogan together on screens tall enough for both.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A visitor sees the whole homepage on a laptop (Priority: P1)

A visitor opens the GBR homepage on an ordinary laptop. Without scrolling they see the navigation,
the welcome and sign-in strip, the three introduction tiles, the map panel with its sign-in prompt,
the sidebar photo, and the live-chat prompt — every word and every button, nothing cut off.

**Why this priority**: This is the request. A first-time visitor forms an impression from one
screen; today that screen shows little more than an empty dashed box.

**Independent Test**: Open the homepage at a 1366×610 browser viewport as a guest and confirm the
bottom of the map-and-sidebar area is at or above the bottom of the screen, with every element of
every section fully visible.

**Acceptance Scenarios**:

1. **Given** a guest on a 1366×768 laptop with a maximised browser, **When** the homepage loads,
   **Then** every content section is fully visible without scrolling, and only the footer lies
   below the screen.
2. **Given** the same laptop, **When** the visitor looks at the sidebar photo, **Then** it appears
   as a full-width banner showing the complete printed slogan, with no line of text cut through.
3. **Given** the same laptop, **When** the visitor looks at the live-chat prompt, **Then** its icon,
   heading, explanation, and both buttons are all visible.
4. **Given** a larger laptop or desktop screen, **When** the homepage loads, **Then** the content
   sections still fill exactly the screen height, and the extra height goes to the map area.

---

### User Story 2 - A signed-in member sees the map and chat on one screen (Priority: P2)

A signed-in member opens the homepage. They see the interactive world map and their live chat —
and only those, not the guest sign-in prompts — on one laptop screen. Chat messages scroll inside
the chat box, and the message field is always visible.

**Why this priority**: Members are the people who use the map and chat. The signed-in view only
goes live once the backend developer signs members in, which is why it follows the guest view.

**Independent Test**: Open the homepage at 1366×610 with the member flag set, and confirm the
guest prompts are absent, the map and chat are fully visible, and the chat's message field is on
screen.

**Acceptance Scenarios**:

1. **Given** a signed-in member, **When** the homepage loads, **Then** the guest map prompt and the
   guest chat prompt are not shown.
2. **Given** a signed-in member on a 1366×768 laptop, **When** the homepage loads, **Then** the map,
   photo banner, and chat box are fully visible without scrolling the page.
3. **Given** more chat messages than the box can show, **When** the member scrolls inside the chat,
   **Then** the messages scroll within the box while the page stays still and the message field
   stays visible.
4. **Given** a signed-in member resizes the window, **When** the map area changes size, **Then** the
   map redraws to fill its new area with no grey gaps.

---

### User Story 3 - Every other device keeps working (Priority: P3)

Phones and tablets held upright keep today's stacked homepage, which scrolls naturally. A short
browser window on a laptop scrolls rather than squashing the map and chat into slivers. No screen
size gains a sideways scroll.

**Why this priority**: The request explicitly forbids breaking other devices. It is third only
because the existing responsive layout already works; the job is to preserve it, not build it.

**Independent Test**: Measure the homepage on a phone (390×664) and an upright tablet (768×900)
before and after the change; the section heights must match.

**Acceptance Scenarios**:

1. **Given** a phone or an upright tablet, **When** the homepage loads, **Then** it looks and
   measures the same as before this feature.
2. **Given** a laptop browser window shorter than the fitted layout can handle, **When** the
   homepage loads, **Then** the map and chat keep a usable minimum height and the page scrolls.
3. **Given** any screen size, **When** the homepage loads, **Then** there is no sideways scrolling.

---

### Edge Cases

- **Browser zoom.** At 125% zoom a 1366×768 laptop behaves like a much smaller screen. The page
  must fall back to scrolling with usable minimum heights, not squash content.
- **Longer text later.** The tiles hold placeholder text that will be replaced, possibly through
  the planned content editor (feature 002). Longer text makes the tiles taller; the map area must
  absorb that down to its minimum height, after which the page scrolls.
- **Very tall screens.** On a tall monitor the map area grows to fill the screen. Nothing may
  stretch into empty space above the footer.
- **Width between tablet and laptop** (e.g., a 1024×768 tablet held sideways). These widths already
  use the side-by-side layout, so they get the fitted layout too when tall enough.
- **The photo banner at in-between heights.** The banner must never stop partway through a line
  of the printed slogan or partway through the logo.
- **Slow or failed map data.** The signed-in map fetches country outlines from an external source.
  If it is slow or fails, the map panel still holds its size; the layout must not depend on it.
- **Window resized after load.** The fitted layout follows the window without reloading.

## Requirements *(mandatory)*

### Functional Requirements

**Fitting the screen**

- **FR-001**: On a 1366×768 laptop — a 1366×610 browser viewport — and on every larger laptop or
  desktop screen, the navigation bar, the welcome and sign-in strip, the three introduction tiles,
  and the map-and-sidebar area MUST be fully visible without vertical scrolling.
- **FR-002**: The footer MAY sit below the visible area. No other part of the homepage may.
- **FR-003**: At laptop sizes, the welcome and sign-in strip and the introduction tiles MUST be
  only as tall as their content needs, with no fixed minimum height that adds empty space.
- **FR-004**: At laptop sizes, the map-and-sidebar area MUST take exactly the screen height left
  after the sections above it, so larger screens get a taller map instead of empty space.

**Sidebar photo**

- **FR-005**: The sidebar photo MUST appear as a full-width banner crop of the existing image.
- **FR-006**: Where the banner is too short to hold both the logo and the slogan printed in the
  image, it MUST show the complete slogan. Where it is tall enough for both, it MUST show both.
- **FR-007**: The banner MUST never end partway through a line of the slogan or through the logo.

**Live chat and map**

- **FR-008**: The guest live-chat prompt — icon, heading, explanation, and both buttons — MUST be
  fully visible at the target size.
- **FR-009**: For a signed-in member, the guest map prompt and guest chat prompt MUST NOT be shown;
  only the interactive map and the live chat appear.
- **FR-010**: For a signed-in member, the chat box MUST fit the sidebar height that remains below
  the photo banner; its messages MUST scroll inside the box, and its message field MUST remain
  visible.
- **FR-011**: The interactive map MUST fill its area and redraw to fit when the window is resized.

**Other devices**

- **FR-012**: Below the width at which the homepage switches to side-by-side columns (tablets held
  upright and phones), the layout and section heights MUST remain as they are today.
- **FR-013**: When a laptop window is too short for the fitted layout, the map-and-sidebar area
  MUST keep a usable minimum height and the page MUST scroll.
- **FR-014**: No screen size MAY produce sideways scrolling.

**Preservation**

- **FR-015**: The change MUST be limited to the homepage. The shared navigation bar, the shared
  footer, and every other page MUST look exactly as before.
- **FR-016**: The change MUST NOT introduce any colour, typeface, type size, or component that is
  not already in the constitution's Design Token Reference. Only sizes, spacing, and arrangement
  change.
- **FR-017**: The change MUST NOT alter any form field, link destination, button behaviour, or the
  way the backend tells the page a member is signed in.

### Key Entities

- **Content screen**: The navigation bar, welcome and sign-in strip, introduction tiles, and
  map-and-sidebar area together — everything that must fit on one screen.
- **Map-and-sidebar area**: The flexible region that takes whatever height remains. Holds the map
  panel on the left and the sidebar (photo banner above, chat below) on the right.
- **Photo banner**: The cropped view of the sidebar image. Its visible part — slogan, or logo and
  slogan — depends on its height.
- **View state**: Guest or signed-in member, set by the backend. Decides whether the prompts or
  the interactive map and chat are shown.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At a 1366×610 viewport, a guest needs 0px of scrolling to see every content section.
  Total page height falls from 1258px to at most 684px (one screen plus the footer).
- **SC-002**: The same holds, for both guests and signed-in members, at the other common laptop
  and desktop viewports: 1280×690, 1366×641, 1440×789, 1536×737, and 1920×953.
- **SC-003**: At every size in SC-001 and SC-002, 100% of the printed slogan is visible in the photo
  banner, and no line of the slogan or logo is cut through. On viewports at least 760px tall —
  such as 1440×789 and 1920×953 — the logo is visible too.
- **SC-004**: For signed-in members, 0 guest prompts are visible, and the chat message field is on
  screen without scrolling the page at every size in SC-001 and SC-002.
- **SC-005**: On a phone (390×664) and an upright tablet (768×900), every section's height matches
  its pre-change height to within 2px.
- **SC-006**: 0 sizes from SC-001, SC-002, and SC-005 show sideways scrolling or new browser
  console errors.
- **SC-007**: 0 new colours, typefaces, type sizes, or components are introduced, and 0 other pages
  change appearance.

## Assumptions

- **"Standard laptop" means a 1366×768 screen at 100% browser zoom**, with the browser maximised and
  the operating system's taskbar, the browser's tabs and address bar, and a bookmarks bar all
  showing. That leaves a viewport of about 1366×610, used as the target throughout.
- **The approved files are the starting point.** The homepage was approved by the client, and this
  is one of the changes the owner said those approved files need. Its visible changes are
  therefore requested, not drift — unlike feature 001, which must not change appearance.
- **The fitted layout applies where the homepage already sits in side-by-side columns** and the
  window is tall enough to hold it. Narrower screens keep the stacked layout of today.
- **The navigation bar and footer stay as they are.** Both are shared by every page, so shrinking
  them for the homepage would change all 22 pages. The fit is achieved inside the homepage.
- **The signed-in view is not live yet.** The backend developer reveals it by setting a member flag
  on the page. That flag and its meaning stay exactly as they are; only how the page reacts to it
  is corrected.
- **Placeholder text stays.** The tiles' placeholder wording is fitted as it is today; replacing it
  is not part of this feature.
- **Verification is manual**, per the constitution's Principle V, supported by a measurement step
  run in the browser at each listed size.

## Dependencies

- **Feature 001 (design consistency cleanup)**: Both features edit the shared stylesheet. This one
  also edits `index.html`, which carries no page-level style block, so the two do not overlap in
  substance. Whichever lands second must be checked against the other.
- **Backend developer**: Receives the updated homepage and shared stylesheet with the full file
  set, as feature 001 requires. The member flag they set is unchanged.
