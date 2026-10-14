# Feature Specification: Admin Content Management

**Feature Branch**: `002-admin-content-cms`

**Created**: 2026-08-24

**Status**: Draft — clarified 2026-08-24, ready for planning

**Input**: User description: "i want a cms system for this design in which i can change images and text this cms has a seprate page from where an admin can change the images and text of the website safely"

## Overview

Today, changing a headline or swapping an image on the GBR site requires editing page files
by hand. The site owner wants to do it themselves, from a single admin screen, without
touching files and without any risk of breaking the site.

This feature delivers a content management capability with four properties, in the owner's
own words — **a separate page**, **an admin who is the only one who can use it**, **images
and text they can change**, and **safely**.

"Safely" is read here as three distinct promises, all of which this spec requires:

1. **Only the admin can change anything.** Content editing is behind a sign-in, and a
   visitor can never reach it or alter what they see.
2. **A content change cannot break the design.** The admin can change words and pictures,
   never colours, fonts, spacing, or layout. This follows directly from the project
   constitution, which forbids new design and requires the design to stay identical across
   pages.
3. **A mistake is recoverable.** The admin can see a change before it goes live and undo it
   afterwards, so no edit is a one-way door.

**Scale of the content involved.** The site has 22 live pages, split evenly: 11 public
pages any visitor can reach, and 11 application screens behind sign-in. Editable text is
limited to the 11 public pages (see Clarifications), which contain:

- **105 paragraphs, 65 headings, and 21 image placements**, against 337 paragraphs and 95
  headings site-wide. The scope decision removes roughly two thirds of the text.
- Site-wide, all 38 image placements resolve to only **4 distinct image files**. The logo
  alone accounts for 23 of them and one sidebar image for 11. This matters: the admin must be
  able to replace "the logo" once and have every placement follow, rather than hunting for 23
  separate edits.
- **Managed images are site-wide even though editable text is not.** The logo appears in the
  shared navigation on all 22 pages. Replacing it must update all of them — a new logo on the
  public pages and the old one on the registration screen would be a worse outcome than not
  offering the feature.

### Boundary: what this repository can deliver

This repository is the frontend only. The project constitution places authentication, content
storage, image storage, and publishing on the separate Laravel backend owned by another
developer. That is not a limitation this spec works around — it is how the work splits:

- **In this repository**: the admin screen itself, the marking of which content on which page
  is editable, the naming of every editable piece, the guardrails that stop a change from
  breaking the design, and the way pages display managed content.
- **In the Laravel backend**: verifying the admin's sign-in, storing the content and the
  uploaded images, keeping history for undo, and serving the content to the site.

The two halves meet at a written content contract, which this feature must produce. The
backend work is a dependency, not part of this feature's deliverable.

## Clarifications

### Session 2026-08-24

- **Q: Which content is editable?** → **A: The 11 public marketing pages only.** `index`,
  `about`, `companies`, `company`, `company_startup`, `Expert`, `investor`, `how_gbr_works`,
  `faq`, `policies`, `contactus`. The 11 signed-in application screens — `login`, `register`,
  `register_confirmation`, `payment`, `dashboard`, `member_home`, `messaging`, `videochat`,
  and the three `search_*` pages — keep fixed text. This keeps the admin away from the pages
  that sit closest to the Laravel form contract, where `register.html` alone carries 36 inputs.
- **Q: Can the admin change page structure?** → **A: Edit in place only.** The admin changes
  words and pictures that already exist. No adding, removing, reordering, or creating pages.
  This is the only option that fully guarantees the design cannot break, because the layout
  stays fixed by the page itself.
- **Q: How soon must a published change reach visitors?** → **A: Immediately, on the next
  page load.** Pages retrieve their managed content when they load. This is what makes
  publishing and undo feel real to the owner, and it is a meaningful change to how these
  currently-static pages behave — which the plan must address directly.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The admin signs in and changes text (Priority: P1)

The site owner opens the admin page, signs in, finds the piece of text they want to change —
a headline, a paragraph, a button label — edits it, and saves. The website shows the new text
to visitors. Nobody who is not signed in can reach the admin page or change anything.

**Why this priority**: This is the core of the request and the smallest thing that delivers
real value. If only this ships, the owner can already maintain the site's words without a
developer. Everything else builds on it.

**Independent Test**: Sign in, change one headline, sign out, load the public page as a
visitor, and confirm the new headline appears. Then attempt to reach the admin page without
signing in and confirm it is refused.

**Acceptance Scenarios**:

1. **Given** an admin with valid credentials, **When** they sign in to the admin page,
   **Then** they see the list of content they are allowed to edit, organised by page.
2. **Given** a signed-in admin viewing an editable piece of text, **When** they change it and
   save, **Then** the change is stored and confirmed on screen.
3. **Given** a saved text change, **When** a visitor loads the affected page, **Then** they
   see the new text.
4. **Given** a person who is not signed in, **When** they open the admin page directly,
   **Then** they are refused and shown the sign-in prompt instead.
5. **Given** a signed-in admin, **When** their session expires or they sign out, **Then**
   further editing is refused until they sign in again.
6. **Given** an admin editing a piece of text, **When** they leave it empty and save,
   **Then** they are warned rather than silently publishing an empty heading.

---

### User Story 2 - The admin replaces an image (Priority: P2)

The site owner wants a new logo, or a new sidebar photo. They open the admin page, find the
named image, upload a replacement, and every place on the site that uses that image shows the
new one.

**Why this priority**: Images are half the stated request, and the logo appears in 23 places —
this is precisely the change that is painful to do by hand today. It is second only because
text editing is the simpler foundation and can ship first.

**Independent Test**: Replace the logo through the admin page, then load three different
public pages and confirm all three show the new logo.

**Acceptance Scenarios**:

1. **Given** a signed-in admin, **When** they open the image section, **Then** they see each
   managed image by a meaningful name, with a preview and a list of where it is used.
2. **Given** an image used in many places, **When** the admin replaces it once, **Then**
   every placement shows the new image without further edits.
3. **Given** an admin uploading a replacement, **When** the file is not a supported image
   type or is too large, **Then** it is refused with a clear reason and the existing image is
   untouched.
4. **Given** a replacement image with very different proportions from the original, **When**
   the admin uploads it, **Then** they are warned before it goes live, because it may not sit
   correctly in the layout.
5. **Given** any managed image, **When** the admin views it, **Then** they can edit its
   descriptive text for screen readers alongside it.

---

### User Story 3 - The admin previews, publishes, and can undo (Priority: P3)

Before anything reaches visitors, the site owner can see exactly how it will look. After it
goes live, if it was wrong, they can put it back the way it was.

**Why this priority**: This is what makes the whole feature genuinely "safe" rather than
merely restricted. It is third because P1 and P2 deliver value on their own, but the owner
should not be trusted with live content for long without it.

**Independent Test**: Make a change, preview it, confirm visitors still see the old version,
publish, confirm visitors see the new version, then revert and confirm the old version
returns.

**Acceptance Scenarios**:

1. **Given** an unpublished change, **When** the admin previews it, **Then** they see the
   real page with the change applied, and visitors still see the previous version.
2. **Given** a previewed change, **When** the admin publishes it, **Then** visitors see it
   and the previous version is retained in history.
3. **Given** a published change the admin regrets, **When** they revert it, **Then** the
   previous version is restored and visitors see it.
4. **Given** any published change, **When** the admin views its history, **Then** they can
   see what changed, when, and who changed it.
5. **Given** an admin who edits several pieces, **When** they publish, **Then** it is clear
   whether they are publishing one change or all pending changes.

---

### User Story 4 - Content changes cannot break the design (Priority: P4)

Whatever the admin types or uploads, the site keeps its design. Fonts, colours, spacing, and
layout are not theirs to change, and no amount of pasted content can alter them.

**Why this priority**: The project constitution requires the design to remain identical
across all pages and forbids new design. A content tool that lets an owner paste styled text
from a word processor would defeat that within a week. It is P4 only because it is a property
of the other three stories rather than a screen of its own — but it is not optional.

**Independent Test**: Paste content copied from a word processor into an editable field,
publish it, and confirm the published page uses the site's own fonts, colours, and spacing
with no imported styling.

**Acceptance Scenarios**:

1. **Given** an admin pasting text carrying its own fonts and colours, **When** it is saved,
   **Then** the styling is discarded and only the words are kept.
2. **Given** an admin attempting to enter layout or styling instructions in a text field,
   **When** it is saved, **Then** those instructions are neutralised and shown as plain text
   or refused.
3. **Given** an editable heading, **When** the admin enters text far longer than the original,
   **Then** they are warned that it may not fit before it goes live.
4. **Given** any published content change, **When** the affected page is compared against the
   site's other pages, **Then** its fonts, colours, spacing, and component appearance are
   unchanged.
5. **Given** an admin using the tool, **When** they look for a way to change a colour, font,
   or layout, **Then** no such control exists.

---

### Edge Cases

- **Two people editing at once.** If a second admin exists and both edit the same piece, the
  later save must not silently discard the earlier one — the conflict must be surfaced.
- **The backend is unreachable.** If stored content cannot be retrieved when a visitor loads a
  page, the page must still render with its current built-in content rather than showing gaps
  or an error.
- **An image is deleted or missing.** A placement whose image has gone must fall back to
  something sensible rather than a broken picture.
- **Legal and policy text.** The policies page is in scope and carries 22 headings of legal
  content, and the FAQ page 15. The admin can rewrite these freely. Whether that is desirable
  is a business decision for the owner, not a technical constraint — but the version history
  (FR-020) means any such edit is attributable and reversible.
- **Contact details.** The contact page's address, phone, and email are editable text like any
  other. A typo there is more costly than a typo in a headline, and the preview step is the
  only thing standing in the way.
- **The scope boundary is invisible to the admin.** Because application screens are excluded,
  an owner who wants to change a word on the registration form will not find it in the admin
  screen. They must be told why rather than left assuming the tool is broken.
- **Very long or very short content.** A one-word paragraph or a 500-word heading will look
  wrong. Guidance and warnings matter more than hard limits.
- **Non-English characters and symbols.** Content with accents, currency symbols, or quotation
  marks must survive editing and publishing unchanged.
- **An admin loses their session mid-edit.** Unsaved work should not vanish without warning.
- **Excluded files.** Archived, backup, and superseded pages are out of scope and must not
  appear in the admin page's list of editable content.

## Requirements *(mandatory)*

### Functional Requirements

**Access and safety**

- **FR-001**: The admin screen MUST be reachable only by a signed-in admin; everyone else MUST
  be refused.
- **FR-002**: The system MUST refuse every attempt to change content that does not come from a
  signed-in admin, regardless of how the attempt is made.
- **FR-003**: Admin sessions MUST expire after a period of inactivity and MUST be endable on
  demand by signing out.
- **FR-004**: Every content change MUST record who made it and when.
- **FR-005**: A visitor MUST never be able to alter what any other visitor sees.

**Editing text**

- **FR-006**: The admin MUST be able to view every editable piece of text, grouped by the page
  it appears on, and identified clearly enough to know which piece is which without guessing.
- **FR-007**: The admin MUST be able to change any editable piece of text and save it.
- **FR-008**: Editable text MUST be limited to words. The system MUST NOT accept fonts,
  colours, sizes, spacing, layout instructions, or embedded styling from any source, including
  pasted content.
- **FR-009**: The system MUST warn before saving content that is empty, or long enough to be
  likely to overflow its place in the design.
- **FR-010**: Editable text MUST be limited to the 11 public pages: `index`, `about`,
  `companies`, `company`, `company_startup`, `Expert`, `investor`, `how_gbr_works`, `faq`,
  `policies`, `contactus`.
- **FR-010a**: The 11 signed-in application screens MUST NOT expose any editable text, and
  MUST NOT appear in the admin screen's list of editable content.

**Editing images**

- **FR-011**: The admin MUST be able to see every managed image by a meaningful name, with a
  preview and the list of places it appears.
- **FR-012**: Replacing a managed image once MUST update every place that image appears.
- **FR-013**: The system MUST refuse uploads that are not a supported image type or that
  exceed a stated size limit, stating the reason, and MUST leave the existing image in place.
- **FR-014**: The system MUST warn when a replacement image's proportions differ enough from
  the original to risk disturbing the layout.
- **FR-015**: The admin MUST be able to edit each image's descriptive text for screen readers.

**Structure**

- **FR-016**: The admin MUST be able to replace only content that already exists in place.
  The system MUST NOT allow adding, removing, or reordering headings, paragraphs, images,
  sections, or list entries, and MUST NOT allow creating or deleting pages.
- **FR-016a**: The set of editable pieces MUST be fixed by the pages themselves. Adding a new
  editable piece MUST require a change to the site, not an action in the admin screen.

**Preview, publish, and undo**

- **FR-017**: The admin MUST be able to preview a change on the real page before visitors see
  it.
- **FR-018**: A change MUST NOT reach visitors until the admin publishes it.
- **FR-019**: The admin MUST be able to restore any previous version of a piece of content.
- **FR-020**: The system MUST keep a history of published versions showing what changed, when,
  and by whom.
- **FR-021**: A published change MUST be visible to visitors on the next load of an affected
  page, with no deployment step and no further action by the owner.
- **FR-021a**: Managed content MUST be presented without a visible flash of previous content
  and without the page shifting as content arrives. A visitor MUST NOT see one version of a
  heading replaced by another in front of them.
- **FR-021b**: Retrieving managed content MUST NOT delay a page becoming readable to a degree
  a visitor would notice.

**Preserving the site**

- **FR-022**: Published content MUST NOT change any page's fonts, colours, spacing, layout, or
  component appearance.
- **FR-023**: Content editing MUST NOT change any form field's underlying name, any form's
  behaviour, or any link's destination.
- **FR-024**: Pages MUST continue to render correctly at mobile and desktop widths after any
  content change.
- **FR-025**: If managed content cannot be retrieved, pages MUST still render readable content
  rather than gaps or errors.
- **FR-026**: The feature MUST NOT introduce any colour, font, type size, spacing value, or
  component beyond those already approved in the project constitution — the admin screen
  included.

**Handover to the backend**

- **FR-027**: The feature MUST produce a written content contract naming every editable piece,
  every managed image, and what the backend is expected to store and return.
- **FR-028**: Every editable piece MUST have a stable name that does not change when the
  surrounding page is edited, so stored content is never orphaned.

**Scope**

- **FR-029**: Archived, backup, and superseded files MUST be excluded and MUST NOT appear as
  editable content.

### Key Entities

- **Editable content piece**: One heading, paragraph, or label that the admin can change.
  Has a stable name, the page it belongs to, its current published value, and its history.
- **Managed image**: One named picture the admin can replace, with its descriptive text, the
  list of placements that use it, and its history. Distinct from a placement — one image
  serves many placements.
- **Placement**: One spot on one page where a managed image appears. The logo has 23.
- **Draft change**: An edit that has been saved but not published. Visible to the admin in
  preview, invisible to visitors.
- **Published version**: A content value that visitors are currently seeing, with the record
  of who published it and when.
- **Admin**: The person permitted to edit. Identified, authenticated, and recorded against
  every change.
- **Content contract**: The written agreement between this frontend and the Laravel backend
  listing every name the two sides share.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The site owner can change a headline and see it live without opening a file,
  contacting a developer, or waiting for a release.
- **SC-002**: The owner can find and change any given piece of text in under 2 minutes,
  starting from the admin page.
- **SC-003**: Replacing the logo takes one action and updates all 23 of its placements.
- **SC-004**: 0 people who are not signed in can view the admin screen or change any content,
  verified by attempting direct access while signed out.
- **SC-005**: 0 content changes alter any page's fonts, colours, spacing, or layout, verified
  by comparing every affected page against its appearance before the change.
- **SC-006**: Pasting styled content from a word processor results in the site's own styling
  100% of the time, with 0 imported fonts or colours surviving.
- **SC-007**: The owner can undo any published change and return the site to its previous
  state in under 2 minutes.
- **SC-008**: 0 changes reach visitors before the owner publishes them, and a published
  change is visible on the next load of an affected page with no deployment step.
- **SC-008a**: 0 visitors see a heading or image visibly change in front of them while a page
  is loading, and 0 pages shift position as managed content arrives.
- **SC-009**: Every page still renders correctly at mobile and desktop widths, with no new
  browser console errors, after content has been changed.
- **SC-010**: When stored content is unavailable, 100% of pages still render readable content.
- **SC-011**: The owner can complete a full change — sign in, edit, preview, publish, verify —
  without written instructions, on their first attempt.
- **SC-012**: 0 new colours, fonts, type sizes, spacing values, or components are introduced
  by this feature, the admin screen included.
- **SC-013**: 0 pieces of text on the 11 application screens are editable, verified by
  confirming none appear in the admin screen and that no edit to them can be saved.
- **SC-014**: 0 ways exist for the admin to add, remove, or reorder any heading, paragraph,
  image, section, or page.

## Assumptions

- **The admin screen is a page in this site, but its security is the backend's.** The owner
  asked for "a separate page", so the screen is built here. It cannot protect itself — a
  static page can always be viewed. Real safety comes from the Laravel backend refusing to
  return editable content or accept changes without a valid signed-in admin. This is the only
  arrangement consistent with Principle I of the constitution.
- **One admin role, not a workflow.** The owner said "an admin". This assumes a single level
  of access, with no separate author, reviewer, or approver roles, and no multi-step approval.
- **Standard session-based sign-in** with a username and password is sufficient. Two-factor
  authentication, single sign-on, and password-reset flows are assumed to be the backend's
  existing concern, not new work here.
- **Text means words, not rich documents.** The admin gets plain text, possibly with minimal
  emphasis. They do not get a document editor, because a document editor is a design tool and
  Principle IV forbids the admin from changing the design.
- **Content edits are cosmetic only.** No editable piece is anything the backend depends on to
  process a form. Form field names and submitted values are outside the admin's reach entirely.
- **Existing page content is the starting point.** Every editable piece begins with exactly the
  words already on the page today, so publishing nothing changes nothing.
- **The owner will be told what is not editable.** Because the application screens are out of
  scope, the admin screen should say so rather than simply omitting them, or the owner will
  reasonably assume something is broken when they cannot find the registration form's wording.
- **Editable text is limited to public pages, but managed images are not.** The logo lives in
  the shared navigation on all 22 pages; replacing it updates all of them. Splitting image
  scope the way text scope is split would leave the site with two different logos.
- **Images are replaced, not created.** The admin swaps a picture for another picture. Cropping,
  resizing, filters, and image editing are out of scope.
- **The 4 existing image files define the initial managed set.** The logo, the two sidebar
  images, and the alternate logo. Additional managed images can be named later.
- **Verification is manual**, per Principle V — this project has no automated test suite.
- **The Laravel backend work is a dependency, not a deliverable here.** This feature is not
  finished from the owner's point of view until the backend half exists, and the plan must say
  so plainly rather than implying the frontend alone delivers a working CMS.
- **The design consistency cleanup (feature 001) is not a prerequisite**, but doing it first
  would reduce the number of places this feature has to touch.

## Dependencies

- **Laravel backend (external, another developer)**: admin authentication and session handling;
  storage of content values and their history; storage of uploaded images; serving published
  content to the site; enforcing that only an authenticated admin can read the editing
  interface or write changes.
- **Project constitution**: Principle I fixes the frontend/backend split, Principle IV fixes
  the design the admin may not change, and Principle V fixes how this is verified.
