# Feature Specification: Design Consistency Cleanup

**Feature Branch**: `001-design-consistency-cleanup`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "update to use all existing colors, font, design, structure — no new invention in design; design should remain the same across all pages"

## Overview

The GBR site is built from 22 hand-authored pages that share one intended design language.
Over time, presentation rules have been copied into individual pages rather than shared,
and colours outside the approved palette have entered several pages. Today the copies
mostly still agree with each other, so the site does not look broken — but every future
edit has to be repeated in up to eight places, and any missed copy becomes a visible
inconsistency between pages.

This feature removes that duplication without changing how any page looks, because the client
has approved the pages' current appearance. Pulling every page onto the single approved
palette and typeface recorded in the project constitution's Design Token Reference is a
visible change, so it is proposed but held back until the client approves it (User Story 3,
FR-007a). It changes how the design is defined, not what the design is.

**Current state, measured across the 22 live pages:**

- The page shell is already consistent: all 22 pages load the shared stylesheet, the shared
  typeface, and the shared navigation and footer. This part needs no work.
- Presentation rules for the same components are re-declared inside individual pages: the
  right-hand rail on 8 pages, the hero card and the chat panel on 7 pages each, the styled
  dropdown on 6, the greeting strip and sign-out control on 5, and the search result header
  on 4. Several of these already exist in the shared stylesheet and are being shadowed by
  the page-level copies.
- Nine pages re-declare the same named design values (brand colour, secondary colour,
  light grey, card shadow, typeface stack) in their own page-level block. The typeface stack
  appears in three different spellings, one of which drops a fallback the other two include.
- One page (`search_company.html`) defines a private parallel design system of roughly 29
  named values — a spacing scale, a font-weight scale, and semantic colour roles — that
  exists on no other page.
- 55 distinct colours outside the approved palette appear across 13 pages and the shared
  stylesheet. These include a near-duplicate of the brand blue that differs from it only
  slightly, and two blues from an unrelated colour family.

## Clarifications

### Session 2026-08-24

- Q: Should the typeface change on 14 pages stand, or be scoped back? → A: Keep it — all 22 pages render in Poppins. *(Superseded 2026-10-14: deferred until the client approves it.)*
- Q: What should happen to the four in-use colours that aren't in the approved palette? → A: Adopt all four into the palette via constitution amendment.
- Q: How should the .gbr-select name collision be resolved? → A: Rename the search-panel version; the form control keeps .gbr-select.
- Q: What should happen to the 14 rules left duplicated to avoid restyling other pages? → A: Accept as-is, documented as a reasoned exception.

### Session 2026-10-14

- Q: How should the `html/` folder (the backend developer's 18 June copy) be treated? → A: It is the approved main version. Its pages and `assets/` replaced those at the project root; the previous files, including this feature's in-progress work, were archived to `_archive/2026-10-14-before-approved-baseline/`.
- Q: Should the design cleanup still be applied to the approved files? → A: Only the invisible part — consolidate duplicated styles and design values with no visible change; colour and typeface corrections wait for client approval.
- Q: How should the cleaned-up files reach the backend developer? → A: As the full set — all live pages and `assets/` replace their copy — with a short note listing what changed, including the class rename.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One definition per component (Priority: P1)

A maintainer needs to change how a shared element looks — the chat panel, the hero card,
the right-hand rail, the greeting strip. Today they must find and edit up to eight separate
copies of that element's rules, spread across individual pages, and any copy they miss
silently drifts away from the rest. After this change, each shared element is defined once
in the shared stylesheet, so a single edit updates every page that uses it.

**Why this priority**: This is the largest source of future inconsistency and the most
expensive to live with. Eight copies of one component means eight chances to miss one. It
also delivers value on its own, before any colour or token work happens.

**Independent Test**: Pick one shared component, confirm it is declared in exactly one
place, change one property there, and confirm every page using that component reflects the
change with no page-level edits.

**Acceptance Scenarios**:

1. **Given** a shared component that is currently declared inside several individual pages,
   **When** the cleanup is applied, **Then** that component is declared once in the shared
   stylesheet and no page re-declares it.
2. **Given** the shared stylesheet already declares a component that a page also declares,
   **When** the cleanup is applied, **Then** the page-level copy is removed and the page
   renders identically to how it rendered before.
3. **Given** a maintainer changes one property of a shared component in the shared
   stylesheet, **When** every page using that component is opened, **Then** all of them show
   the change.
4. **Given** a page contains presentation rules that genuinely apply to that page only,
   **When** the cleanup is applied, **Then** those rules remain on the page and are not
   moved into the shared stylesheet.

---

### User Story 2 - One definition per design value (Priority: P2)

A maintainer needs to adjust a site-wide design value — the brand colour, the card shadow,
the typeface stack. Today nine pages each carry their own copy of these values, and the
typeface stack already exists in three different spellings. After this change, each named
design value is declared once, site-wide, and pages refer to it rather than restating it.

**Why this priority**: Duplicated values are what allow two pages to diverge without anyone
noticing. The three different typeface spellings show this has already begun. It is second
only to component duplication because there are fewer values than components, but it is a
prerequisite for trusting any colour work that follows.

**Independent Test**: Confirm each shared design value is declared in exactly one place,
change the brand colour there, and confirm every page picks it up.

**Acceptance Scenarios**:

1. **Given** a design value declared in multiple pages, **When** the cleanup is applied,
   **Then** it is declared once site-wide and no page re-declares it.
2. **Given** the typeface stack currently appears in three spellings, **When** the cleanup
   is applied, **Then** exactly one spelling exists and it retains every fallback present in
   the fullest current version.
3. **Given** a maintainer changes a shared design value in its single location, **When**
   every page is opened, **Then** all of them reflect the change.
4. **Given** the page that defines a private parallel set of design values, **When** the
   cleanup is applied, **Then** that page uses the site-wide values and its private set is
   removed, with its appearance unchanged.

---

### User Story 3 - Every colour drawn from the approved palette (Priority: P3 — deferred until client approval)

A visitor moving between pages should see one consistent brand. Today several pages use
colours outside the approved palette, including a blue that is almost — but not exactly —
the brand blue, and two blues from an unrelated colour family. After this change, every
colour on every page comes from the approved palette, so the brand reads as one brand.

**Why this priority**: This is the only part of the work a visitor can actually see, which
makes it valuable — but it is third because doing it before the duplication is removed would
mean applying each correction in up to eight places.

**Deferred**: Every correction in this story is visible, and the client has approved the
pages as they look today. Until the client approves the corrections, this feature only
proposes them: each off-palette colour is listed in the change record with its proposed
replacement (FR-011a), and no colour on any page is changed.

**Independent Test**: Scan every page for colours, and confirm each one appears in the
approved palette or in the documented exception list.

**Acceptance Scenarios**:

1. **Given** a page using a colour outside the approved palette, **When** the cleanup is
   applied, **Then** that colour is replaced by the closest approved colour.
2. **Given** the near-duplicate brand blue used on several pages, **When** the cleanup is
   applied, **Then** those pages use the actual brand blue.
3. **Given** the payment page displays third-party card-brand marks in their owners'
   official colours, **When** the cleanup is applied, **Then** those colours are retained and
   recorded as documented exceptions.
4. **Given** the cleanup is complete, **When** any page is scanned for colours, **Then**
   every colour found is either in the approved palette or on the exception list.

---

### Edge Cases

- **A page-level rule has no shared equivalent.** If a rule genuinely applies to one page
  only, it stays on that page. Only rules that are shared, or that shadow an existing shared
  rule, are consolidated.
- **Sharing a rule would restyle a page that never had it.** Some selectors match markup on
  pages that never declared them — `.section-title` matches `company.html`, and
  `.hero-row .row` would override Bootstrap's grid gutters on five pages. Such rules stay
  duplicated under FR-001a rather than causing a regression.
- **Two copies of the same component have quietly diverged.** Where copies disagree, the
  version in the shared stylesheet wins if one exists; otherwise the version used by the most
  pages wins. A page whose copy differed keeps its differing values locally, so its approved
  appearance does not change, and the divergence is recorded.
- **Third-party brand colours.** Card-network and payment-provider marks must display in
  their owners' official colours and cannot be replaced with palette colours. These are
  documented exceptions, not drift.
- **A colour sits between two approved colours.** Where no approved colour is clearly
  closest, the choice must be recorded rather than made silently, so it can be reviewed.
- **Colours expressed in other notations.** Semi-transparent colours and colours written in
  other notations must be reviewed too, not only the ones a simple search finds.
- **The richer private token set is genuinely useful.** The parallel spacing and weight
  scales on one page may be better than what exists site-wide. Adopting them site-wide would
  be new design, which the constitution forbids without an amendment, so this feature retires
  them; promoting them instead is a separate decision.
- **Legacy and excluded files.** Archived, backup, and superseded pages are out of scope and
  must not be cleaned up, migrated, or used as a source of design values.
- **The backend developer takes only some of the files.** A cleaned-up page relies on the
  shared stylesheet for rules it no longer carries itself, so it loses its styling beside an
  older stylesheet. This is why the handover is the complete set, never a subset (FR-022).
- **A page uses a shared component name for something different.** If a page reuses a shared
  name for an unrelated element, it must be renamed rather than merged into the shared
  component.

## Requirements *(mandatory)*

### Functional Requirements

**Component consolidation**

- **FR-001**: Every presentation rule for a component used on more than one page MUST be
  declared exactly once, in the shared stylesheet.
- **FR-001a**: A rule is exempt from FR-001 where sharing it would cause it to newly match
  markup on a page that never declared it. Such rules MUST stay local, and each MUST be listed
  in the change record with the page it would have affected. Preventing a regression takes
  precedence over removing a duplicate.
- **FR-002**: Page-level declarations that duplicate or shadow a shared component MUST be
  removed from the page.
- **FR-003**: Page-level declarations that apply to a single page only MUST remain on that
  page and MUST NOT be promoted to the shared stylesheet.
- **FR-004**: Where duplicate copies of a component disagree, the shared definition MUST
  follow a stated precedence rule, and any page whose copy differs MUST keep its differing
  values locally so its appearance does not change. Every such divergence MUST be recorded.
- **FR-004a**: Where one class name styles two unrelated elements, the name MUST be split.
  Specifically, the search-panel dropdown on `member_home`, `search_company`, `search_expert`,
  and `search_investor` MUST be renamed from `.gbr-select` to a distinct name, leaving
  `.gbr-select` to the form control on `register` and `payment`. Both MUST then be declared
  exactly once in the shared stylesheet.
- **FR-004b**: Renaming a class MUST NOT change any form field's `name` attribute, any form
  behaviour, or the element's appearance.

**Design value consolidation**

- **FR-005**: Every named design value used by more than one page MUST be declared exactly
  once, site-wide.
- **FR-006**: Pages MUST refer to shared design values rather than restating their literal
  values.
- **FR-007**: The typeface stack MUST exist in exactly one form site-wide and MUST retain
  every fallback present in the fullest version currently in use.
- **FR-007a**: Each page MUST keep the typeface it renders today: 8 pages render body text in
  Poppins and 14 fall through to the bundled theme's system font stack. Applying Poppins to all
  22 pages is a visible change and is deferred until the client approves it; FR-007
  consolidates how the stack is defined, not which pages use it.
- **FR-008**: The private parallel set of design values on `search_company.html` MUST be
  removed, with that page mapped onto the site-wide values and its appearance preserved.

**Palette conformance**

- **FR-009**: Every colour on every in-scope page MUST come from the approved palette
  recorded in the constitution's Design Token Reference, or from the documented exception
  list.
- **FR-010**: Colours outside the approved palette MUST be replaced with the closest
  approved colour; where "closest" is not obvious, the choice MUST be recorded for review.
- **FR-011**: Near-duplicates of approved colours MUST be replaced with the approved colour
  they approximate.
- **FR-011a**: FR-009 to FR-011 MUST NOT be applied until the client approves the
  corrections. Until then, each off-palette colour they would replace MUST be listed in the
  change record with its proposed replacement and the pages it appears on.
- **FR-012**: Third-party brand colours required to display a third party's mark correctly
  MUST be retained and recorded on the exception list, with the mark they belong to named.
- **FR-013**: The exception list MUST be written down where a future contributor will find
  it, and MUST NOT grow beyond third-party marks without an explicit decision.

**Preservation**

- **FR-014**: The cleanup MUST NOT change the appearance of any page. Colour corrections
  (FR-009 to FR-011) and the typeface unification (FR-007a) are exempt only once the client
  has approved them.
- **FR-015**: The cleanup MUST NOT change any form field name, form behaviour, link target,
  or interactive behaviour on any page.
- **FR-016**: The cleanup MUST NOT introduce any colour, typeface, type size, weight,
  spacing value, or component that does not already exist in the approved set.
- **FR-017**: Every in-scope page MUST continue to load the shared stylesheet, the shared
  typeface, the shared navigation, and the shared footer, in the established order.
- **FR-018**: Every page MUST continue to work at mobile and desktop widths, with no new
  browser console errors.

**Scope**

- **FR-019**: All 22 live pages MUST be in scope, including pages that carry no page-level
  style block but do carry off-palette colours.
- **FR-020**: Archived, backup, and superseded files MUST be excluded and left untouched.
- **FR-021**: Any approved colour or component that the cleanup finds is genuinely missing
  from the Design Token Reference MUST be reported for a constitution amendment rather than
  silently added.
- **FR-021a**: The four colours found in deliberate use but absent from the registry —
  `#e7f9fc` (sky surface), `#f9efe3` (cream surface), `#032a36` (darkest brand tone), and
  `#cce6ef` (navbar hover tint) — MUST be added to the constitution's Design Token Reference.
  They MUST NOT be replaced, and MUST NOT remain on the exception list once adopted.
- **FR-021b**: After FR-021a is applied, the exception list MUST contain only third-party
  brand marks.

**Handover**

- **FR-022**: When the cleanup is complete, the backend developer MUST receive every live page
  and the whole `assets/` folder as one replacement for their copy — never a subset.
- **FR-022a**: The handover MUST include a short note at the repository root listing every
  changed file and every renamed class — including the search-panel dropdown rename from
  FR-004a — and confirming that no form field name changed.

### Key Entities

- **Approved palette**: The set of colours permitted site-wide, recorded in the
  constitution's Design Token Reference. Membership is the test for FR-009.
- **Shared component**: A visual element used on more than one page, with exactly one
  definition after this feature. Identified by name and by the pages that use it.
- **Shared design value**: A named value (colour, shadow, typeface stack) referred to by
  pages rather than restated. Has exactly one definition after this feature.
- **Exception list**: The recorded set of colours permitted despite not being in the
  approved palette, each tied to the third-party mark that requires it.
- **Change record**: The list of every rule kept local under FR-001a or FR-004, and every
  proposed visible change — off-palette colour or typeface — awaiting client approval, with
  the pages each affects.
- **Handover note**: The root-level note sent to the backend developer with the full file
  set, listing changed files and renamed classes. Distinct from the change record, which is
  for this repository's maintainers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No component used on more than one page is defined in more than one place —
  the current maximum of 8 copies of a single component drops to 1.
- **SC-001a**: 0 class names style two unrelated elements; the search dropdown and the form
  control each have their own name and a single shared definition.
- **SC-001b**: Every rule exempted under FR-001a is listed in the change record with the page
  it would otherwise have restyled — currently 14 rules.
- **SC-002**: No shared design value is defined in more than one place — the current 9 pages
  carrying private copies drops to 0.
- **SC-003**: The typeface stack exists in exactly 1 spelling site-wide, down from 3.
- **SC-004**: Before client approval, all 55 distinct off-palette colours across 13 pages are
  listed in the change record with a proposed replacement, and 0 are changed. After approval,
  0 colours outside the approved palette remain on any page — excluding only the documented
  third-party marks, which are individually listed with the mark each belongs to.
- **SC-004a**: Once the constitution is amended per FR-021a, the exception list contains
  exactly 7 entries, all third-party brand marks, and 0 entries that are GBR's own colours.
- **SC-005**: Changing one shared component or one shared design value in its single
  location updates every page that uses it, verified on at least 3 pages per change.
- **SC-006**: Every one of the 22 pages renders with 0 visual differences from its approved
  appearance.
- **SC-006a**: The pages rendering body text in Poppins stay at 8 of 22 until the client
  approves FR-007a's deferred change; after approval, 22 of 22.
- **SC-007**: Every one of the 22 pages loads with no new browser console errors and renders
  correctly at both a mobile and a desktop width.
- **SC-008**: A maintainer can find where any given colour, typeface, or shared component is
  defined by looking in exactly one place.
- **SC-009**: 0 new colours, typefaces, type sizes, weights, spacing values, or components
  are introduced by this work.
- **SC-010**: After handover, 0 files differ between the backend developer's copy and this
  repository's live pages and `assets/`, and the handover note lists 100% of the changed files
  and renamed classes.

## Assumptions

- **The approved files are the baseline.** On 2026-10-14 the client-approved copy — identical
  to commit `7c5f8bd` of 18 June — became the main version of every page and of `assets/`.
  Every "before" comparison in this spec refers to those files. Changes this feature had
  already made to the earlier files are archived, with a re-applicable patch, in
  `_archive/2026-10-14-before-approved-baseline/` and are not part of the baseline. The
  approved `register.html` does not carry the Established/Startup company sub-type added on
  8 July.
- **This is a consolidation, not a redesign.** The intended outcome is that the site looks
  exactly the same afterwards. No layout, spacing, colour, typeface, or component appearance
  changes as part of this work unless the client approves it.
- **Visible corrections wait for the client.** Correcting off-palette colours — including
  the near-duplicate brand blue, which would be faintly visible — and applying Poppins to all
  22 pages would change pages the client has approved. This feature identifies and proposes
  them in the change record; they are applied only once the client approves them.
- **The Design Token Reference in the constitution is the authority** on what counts as
  approved. It was derived from the current codebase, so most existing colours already pass.
- **The private token set on `search_company.html` is retired, not promoted.** Adopting its
  spacing and weight scales site-wide would be new design, which Principle IV forbids without
  an amendment. If promoting it is preferred, that is a constitution amendment and a separate
  feature.
- **Third-party payment and card-brand colours are legitimate** and will be kept. They are
  required to display those marks correctly and cannot be substituted.
- **All 22 live pages are in scope**, including the 13 pages with no page-level style block,
  because off-palette colours appear there too.
- **Verification is manual**, per the constitution's Principle V — this project has no
  automated test suite, so every page is checked in a browser at two widths.
- **The backend contract is unaffected, but the backend developer's copy is not.** No form
  field name, submitted value, or backend contract changes. The Laravel developer works from
  the same approved files, though, and after the cleanup the pages depend on the new shared
  stylesheet, so they receive the complete file set and a handover note (FR-022, FR-022a).
- **The page shell needs no work.** All 22 pages already load the shared stylesheet,
  typeface, navigation, and footer consistently; that was verified before writing this spec.
