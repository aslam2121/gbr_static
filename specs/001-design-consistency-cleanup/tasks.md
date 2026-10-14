---
description: "Task list for Design Consistency Cleanup"
---

# Tasks: Design Consistency Cleanup

**Input**: Design documents from `/specs/001-design-consistency-cleanup/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: No automated test tasks. This project has no test suite by design — Principle V makes
manual browser verification the verification method, and research R5 records why automating it
would breach Principle III. Verification tasks below are manual and are first-class, not optional.

**Organization**: Grouped by user story. **US1–US3 were largely implemented before this task list
existed** — completed work is checked off so the remaining scope is visible rather than hidden.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3 from spec.md
- **[x]**: Already complete — see [change-record.md](./change-record.md)

## Path Conventions

Static multi-page site, frontend only. Pages are `.html` at the repository root; the shared
stylesheet is `assets/css/style.css`. No `src/`, no build output.

---

## Phase 1: Setup

**Purpose**: Get a serving environment and confirm the tree is clean before looking at anything.

- [ ] T001 Start a static server from the repository root with `python3 -m http.server 8080` and confirm `http://localhost:8080/index.html` loads (do not verify via `file://` — `assets/js/custom.js` injects the navbar)
- [ ] T002 [P] Re-run the palette conformance check from `specs/001-design-consistency-cleanup/quickstart.md` and confirm 0 off-registry colours across all 22 pages and `assets/css/style.css`
- [ ] T003 [P] Re-run the token/typeface checks from `specs/001-design-consistency-cleanup/quickstart.md` and confirm `PASS: no page tokens` plus exactly one `--font-sans` line (both must exclude `_template.html` and `registration_old.html`)
- [ ] T004 [P] Confirm no form field names moved: `git diff -U0 -- '*.html' | grep -E '^[-+].*\bname="' | grep -v '^[-+][-+]'` returns empty

**Checkpoint**: Tree is mechanically clean and serving. Nothing has been looked at yet.

---

## Phase 2: Foundational — Verification Gate (BLOCKING)

**Purpose**: Close the failing Principle V gate on work already applied. **No task in Phase 3 or
later may start until this phase passes.** Procedure and per-page detail:
[quickstart.md](./quickstart.md) Phase A.

**Why blocking**: 14 pages changed typeface and none have been opened. Layering the `.gbr-select`
rename on top of unverified change would make any regression impossible to attribute.

### Verification progress — 2026-08-25

**13 of 22 pages verified and passing** at desktop and mobile widths, reported by the site owner.
All pages reachable from the navbar or footer are confirmed working, including mobile layout.

**9 pages remain unverified because nothing links to them.** They are orphaned — no navbar entry,
no footer entry, and no inbound link from any other page. Confirmed to be **pre-existing**: the
cleanup changed zero `href` values, and `git grep` against `HEAD` shows the same 9 pages had no
inbound links before any of this work started.

These are the signed-in application screens plus `companies.html`. They are unreachable because
there is no working sign-in yet — the Laravel backend that would route a member to them does not
exist. This is expected for a frontend-only repository, not a defect.

**Reach them by typing the URL directly**, e.g. `http://localhost:8080/dashboard.html`.
The full list is in the task descriptions below.

### The 14 typeface pages — highest priority

Each: open at desktop (≥1200px) and mobile (≤576px) width, check the console, and look for text
that now wraps differently, headings that no longer fit, and buttons whose labels overflow.

- [x] T005 [P] Verify `index.html` at both widths — also confirm the Leaflet map marker and polygon now read as brand `#0083ae`/`#0a8cb7`
- [x] T006 [P] Verify `about.html` at both widths
- [ ] T007 [P] Verify `companies.html` at both widths — check the sky/cream hero tiles — **orphaned, open directly**: `http://localhost:8080/companies.html`
- [x] T008 [P] Verify `contactus.html` at both widths
- [ ] T009 [P] Verify `dashboard.html` at both widths — confirm the coloured card is brand `#0083ae`, not the old `#0582ad` — **orphaned, open directly**: `http://localhost:8080/dashboard.html`
- [x] T010 [P] Verify `Expert.html` at both widths
- [x] T011 [P] Verify `faq.html` at both widths — 15 headings, most typeface-sensitive page
- [x] T012 [P] Verify `how_gbr_works.html` at both widths
- [x] T013 [P] Verify `investor.html` at both widths
- [x] T014 [P] Verify `login.html` at both widths
- [x] T015 [P] Verify `messaging.html` at both widths — confirm the outgoing chat bubble is brand `#0083ae`
- [x] T016 [P] Verify `policies.html` at both widths — 22 headings of legal text, worst case for reflow
- [x] T017 [P] Verify `videochat.html` at both widths
- [x] T018 [P] Verify `company.html` at both widths — changed typeface **and** lost 116 lines of page CSS; check section titles, map, and detail fields
- [ ] T019 On any one of the above, confirm in DevTools that `getComputedStyle(document.body).fontFamily` starts with Poppins **and** that a `Poppins-*.woff2` request succeeded in the Network tab — a 404 means the page is silently falling back and every check above is invalid

### The heavily-edited pages

- [ ] T020 [P] Verify `search_company.html` (437 → 26 lines of page CSS) — search panel, results list, right rail, Established/Startup toggle — **orphaned, open directly**: `http://localhost:8080/search_company.html`
- [x] T021 [P] Verify `register.html` (165 → 90) — all 4 steps, progress bar, conditional startup fields, upload rows
- [ ] T022 [P] Verify `payment.html` (130 → 48) — form grid, right rail, and confirm the Visa/Mastercard/Amex/PayPal marks still show their **own** brand colours — **orphaned, open directly**: `http://localhost:8080/payment.html`
- [ ] T023 [P] Verify `member_home.html` (89 → 21) — greeting strip, search panel, contacts list, chat card — **orphaned, open directly**: `http://localhost:8080/member_home.html`
- [ ] T024 [P] Verify `register_confirmation.html` (92 → 18) — hero cards, pin block — **orphaned, open directly**: `http://localhost:8080/register_confirmation.html`
- [ ] T025 [P] Verify `company_startup.html` (77 → 35) — fundraising widget, progress bar, member rating spacing — **orphaned, open directly**: `http://localhost:8080/company_startup.html`
- [ ] T026 [P] Verify `search_expert.html` (78 → 18) — detail field grids, get-in-touch row — **orphaned, open directly**: `http://localhost:8080/search_expert.html`
- [ ] T027 [P] Verify `search_investor.html` (78 → 17) — detail field grids, get-in-touch row — **orphaned, open directly**: `http://localhost:8080/search_investor.html`

### Cross-page consistency

- [ ] T028 Open `index.html`, `about.html`, and `company.html` side by side and confirm body text, headings, buttons, and footer are indistinguishable in font, size, and colour (SC-008)
- [ ] T029 Record every discrepancy found in T005–T028 in `specs/001-design-consistency-cleanup/change-record.md` § 7, noting for each whether this feature caused it or it pre-existed (compare with `git stash` if unsure)

**Checkpoint — Phase 2 exit criteria (all must hold):**

- [ ] T030 Confirm all 22 pages opened at both widths, 0 new console errors, 0 pages scrolling horizontally, all 14 typeface pages rendering Poppins without broken wrapping, 3 brand-blue corrections matching the navbar accent, and payment card marks unchanged — then mark SC-007 and SC-009 satisfied in `specs/001-design-consistency-cleanup/spec.md`

---

## Phase 3: User Story 1 — One definition per component (P1)

**Goal**: Every shared component declared exactly once, with no class name serving two unrelated
elements.

**Independent test**: Pick one shared component, confirm it is declared in exactly one place,
change one property there, and confirm every page using it reflects the change.

**Status**: Consolidation complete. The `.gbr-select` split (FR-004a/FR-004b) is the remainder.

### Completed

- [x] T031 [US1] Consolidate 91 shared rules into `assets/css/style.css`, using declaration intersection so no page gains or loses a declaration
- [x] T032 [US1] Strip consolidated rules from all 9 page `<style>` blocks, leaving only genuine per-page deltas (2,674 → 877 declarations)
- [x] T033 [US1] Withhold 14 rules from sharing that would newly match markup on pages that never declared them, and record each in `specs/001-design-consistency-cleanup/change-record.md` § 6 (FR-001a)

### Remaining — the `.gbr-select` split

Contract: [contracts/css-class-contract.md](./contracts/css-class-contract.md) § 3.
Rationale: [research.md](./research.md) R1–R4.

> **Hazard (research R3)**: `assets/css/style.css` currently holds
> `.gbr-select { -webkit-appearance: none; appearance: none; }`, which applies to all six pages.
> The renamed elements stop matching it immediately. T038 must carry both declarations or the
> four search pages regain the browser's native dropdown chrome. Nothing mechanical catches this.

- [ ] T034 [P] [US1] In `member_home.html`, rename all 8 occurrences of `class="gbr-select"` to `class="search-select"` and delete the page-level `.gbr-select` rule from its `<style>` block
- [ ] T035 [P] [US1] In `search_company.html`, rename all 8 occurrences of `class="gbr-select"` to `class="search-select"` and delete the page-level `.gbr-select` rule from its `<style>` block
- [ ] T036 [P] [US1] In `search_expert.html`, rename all 4 occurrences of `class="gbr-select"` to `class="search-select"` and delete the page-level `.gbr-select` rule from its `<style>` block
- [ ] T037 [P] [US1] In `search_investor.html`, rename all 4 occurrences of `class="gbr-select"` to `class="search-select"` and delete the page-level `.gbr-select` rule from its `<style>` block
- [ ] T038 [US1] Add a single `.search-select` rule to `assets/css/style.css` in the Search panel section, carrying the full declaration set from `contracts/css-class-contract.md` § 3 **including `-webkit-appearance: none` and `appearance: none`**
- [ ] T039 [US1] Leave `register.html` and `payment.html` untouched; confirm their 5 and 3 `.gbr-select` elements still match the form-control rule and that `.gbr-input`/`.gbr-textarea` pairing is intact

### Verify the split (Phase C)

- [ ] T040 [US1] Run the mechanical checks from `specs/001-design-consistency-cleanup/quickstart.md` Phase B: 8/8/4/4 `search-select` elements, 5/3 `gbr-select` elements, 0 `gbr-select` on the four search pages, exactly 1 `.search-select` rule in `assets/css/style.css`, and 2 `appearance: none` declarations within it
- [ ] T041 [US1] Confirm no form field names moved: `git diff -U0 -- '*.html' | grep -E '^[-+].*\bname="' | grep -v '^[-+][-+]'` returns empty (FR-004b, FR-023)
- [ ] T042 [P] [US1] In a browser, verify `member_home.html` — every dropdown shows **one** custom arrow with no native arrow behind it, heights align with their row, dropdowns still open
- [ ] T043 [P] [US1] In a browser, verify `search_company.html` — same dropdown checks, plus the search panel grid has not reflowed
- [ ] T044 [P] [US1] In a browser, verify `search_expert.html` — same dropdown checks
- [ ] T045 [P] [US1] In a browser, verify `search_investor.html` — same dropdown checks

**Checkpoint**: US1 complete. One name, one element, one definition. SC-001a satisfied.

---

## Phase 4: User Story 2 — One definition per design value (P2)

**Goal**: Each named design value declared once, site-wide.

**Independent test**: Confirm each value is declared in exactly one place, change the brand
colour there, and confirm every page picks it up.

**Status**: Complete.

- [x] T046 [US2] Add the 8-token `:root` block to `assets/css/style.css` (`--gbr-primary`, `--gbr-primary-700`, `--gbr-secondary`, `--gbr-secondary-dark`, `--gbr-light-gray`, `--font-sans`, `--shadow-card`, `--gbr-max-width`)
- [x] T047 [US2] Delete private `:root` blocks from all 9 pages that carried them (9 → 0)
- [x] T048 [US2] Unify the typeface stack to `'Poppins', system-ui, -apple-system, sans-serif`, retaining every fallback from the fullest version (3 spellings → 1, FR-007)
- [x] T049 [US2] Delete the 29-token parallel system from `search_company.html`, having confirmed 22 of its tokens had zero `var()` references anywhere (FR-008)
- [x] T050 [US2] Apply `body { font-family: var(--font-sans) }` site-wide so all 22 pages render Poppins, up from 8 (FR-007a)

**Checkpoint**: US2 complete. Verified by T003 and by T005–T019 in Phase 2.

---

## Phase 5: User Story 3 — Every colour from the approved palette (P3)

**Goal**: Every colour on every page drawn from the approved palette or the documented exception
list.

**Independent test**: Scan every page for colours; each must appear in the registry or the
exception list.

**Status**: Complete.

- [x] T051 [US3] Replace 36 off-palette colour occurrences across 13 files with their nearest approved equivalents, per the mapping table in `specs/001-design-consistency-cleanup/change-record.md` § 3.4 (FR-010)
- [x] T052 [US3] Correct the near-duplicate brand blue `#0582ad` → `#0083ae` on `dashboard.html`, `index.html`, `messaging.html`, and the Material blues `#1e88e5`/`#42a5f5` → brand blues on `index.html` (FR-011)
- [x] T053 [US3] Record the 7 third-party card-brand colours on `payment.html` as the exception list, each named to its mark (FR-012, FR-013)
- [x] T054 [US3] Report `#e7f9fc`, `#f9efe3`, `#032a36`, `#cce6ef` for constitution amendment rather than replacing them (FR-021)
- [x] T055 [US3] Adopt all four into `.specify/memory/constitution.md` § Design Token Reference in v1.2.0 (FR-021a), leaving the exception list holding only third-party marks (FR-021b)

**Checkpoint**: US3 complete. 0 off-registry colours; registry holds 43. Verified by T002.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T056 [P] Correct the stale line in `specs/001-design-consistency-cleanup/change-record.md` that says FR-021a is "not yet implemented" — it was completed in constitution v1.2.0
- [ ] T057 [P] Update `.specify/memory/constitution.md` § Design Token Reference: add `.search-select` to the Search panel group and remove the note marking `.gbr-select` as pending a split (depends on T038)
- [ ] T058 [P] Append the `.gbr-select` split to `specs/001-design-consistency-cleanup/change-record.md` § 3 as an intended change, listing the 4 pages and 24 elements
- [ ] T059 Re-run the full effective-style comparison across `member_home.html`, `search_company.html`, `search_expert.html`, `search_investor.html` against `assets/css/style.css` to confirm 0 properties lost and 0 unintended value changes after the rename
- [ ] T060 Confirm every checkbox in `specs/001-design-consistency-cleanup/checklists/requirements.md` still passes against the final state of the spec

---

## Dependencies

```text
Phase 1 (Setup: T001–T004)
        │
        ▼
Phase 2 (Verification Gate: T005–T030)   ◄── BLOCKING. Nothing below starts until T030 passes.
        │
        ▼
Phase 3 (US1 remainder: T034–T045)
        │   T034–T037 parallel  ──►  T038  ──►  T039  ──►  T040, T041  ──►  T042–T045 parallel
        ▼
Phase 6 (Polish: T056–T060)

Phase 4 (US2) ── complete
Phase 5 (US3) ── complete
```

**Story independence**: US2 and US3 are done and independently verified. US1's remaining work
touches only the four search pages and the shared stylesheet, so it cannot affect them.

**Critical ordering within Phase 3**: T038 must land before T042–T045 have any meaning, and
T034–T037 must not be verified in a browser until T038 exists — between those points the four
pages are deliberately broken (renamed elements matching no rule).

## Parallel Execution Opportunities

| Group | Tasks | Why safe |
|---|---|---|
| Setup checks | T002, T003, T004 | Read-only, different checks |
| Typeface verification | T005–T018 | 14 different pages, read-only |
| Heavy-page verification | T020–T027 | 8 different pages, read-only |
| The rename | T034, T035, T036, T037 | 4 different files, no shared state |
| Post-rename browser checks | T042–T045 | 4 different pages, read-only |
| Polish docs | T056, T057, T058 | 3 different files (T057 depends on T038) |

Phase 2's 23 verification tasks are the largest parallel block — they are 22 independent page
reads and can be split across people.

## Implementation Strategy

**The MVP is Phase 2, not a user story.** US1–US3 already deliver their value; what is missing is
the confidence that they did not break anything. Completing Phase 2 alone converts the applied
work from "structurally verified" to "shippable", and is the only phase that must happen.

**Incremental delivery**:

1. **Phase 1 + 2** → the cleanup becomes deployable. Stop here if the `.gbr-select` collision can
   wait; the site is consistent, conformant, and verified.
2. **Phase 3** → removes the last name collision and the trap where editing one dropdown context
   silently alters the other.
3. **Phase 6** → documentation catches up with reality.

**If Phase 2 finds a regression**: fix it before starting Phase 3. Do not carry a known visual
defect into the rename — attribution becomes guesswork.
