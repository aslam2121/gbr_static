# Implementation Plan: Design Consistency Cleanup

**Branch**: `001-design-consistency-cleanup` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-design-consistency-cleanup/spec.md`

## Summary

The bulk of this feature is **already implemented** (see [change-record.md](./change-record.md)):
page-level CSS declarations fell 67%, all private token blocks are gone, the typeface stack is
unified, and the site is fully palette-conformant against constitution v1.2.0.

This plan covers **only what remains**, which is two things:

1. **Browser verification has never been performed.** Principle V requires it and SC-007/SC-009
   depend on it. Fourteen pages changed typeface and nobody has looked at them. This is the
   gating item — nothing should deploy before it.
2. **FR-004a/FR-004b are unimplemented** — the `.gbr-select` class still names two unrelated
   elements and must be split.

The plan sequences verification **first**, because the rename adds new visual risk on four
pages and there is no point layering unverified change on unverified change.

## Technical Context

**Language/Version**: HTML5, CSS3, plain browser JavaScript (no transpilation, no modules)

**Primary Dependencies**: Bootstrap 5.3, Bootstrap Icons 1.11, Font Awesome 5.12, Leaflet,
Poppins (self-hosted in `assets/fonts/`)

**Storage**: N/A — no data layer in this feature

**Testing**: Manual browser verification only. This project has no automated test suite by
design (Principle V), so "testing" means a human opening pages at two widths and reading the
console. No test framework is introduced by this feature.

**Target Platform**: Modern evergreen browsers. Two verification widths: desktop (≥1200px) and
mobile (≤576px). Deployed as static assets to the Cloudflare Worker named `gbr`.

**Project Type**: Static multi-page website, frontend only. The Laravel backend is external and
untouched by this feature.

**Performance Goals**: None specific. This feature removes CSS and must not add render cost;
`style.css` grew 209 → 364 lines while page CSS fell 1,297 → 308, a net reduction.

**Constraints**: No build step. No new design tokens beyond constitution v1.2.0. No change to
any form field `name`, form behaviour, or link destination. Zero unintended visual change.

**Scale/Scope**: 22 live pages · 1 shared stylesheet · 24 search-panel select elements across
4 pages · 8 form-control select elements across 2 pages · 14 pages with a pending typeface
change to confirm.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against constitution **v1.2.0**.

| Principle | Status | Evidence |
|---|---|---|
| I. Frontend-Only Scope | **PASS** | Presentation only. No server code, no Laravel files, no backend logic added. |
| II. Contract-First Backend Integration | **PASS** | FR-023 and FR-004b forbid touching any form field `name`. The rename is class-only. No backend contract changes, so no contract note is owed. |
| III. Static, Build-Free Pages | **PASS** | No bundler, framework, preprocessor, or new library. Pages remain self-contained `.html`. |
| IV. Existing Design Language Only | **PASS** | v1.2.0 adopted the four outstanding colours; the site is now 0-off-registry. The rename introduces `.search-select`, which is an existing component renamed, not new design. Registry entry for `.gbr-select` is already annotated as pending this split. |
| V. Browser-Verified Delivery | **FAILING** | **No page has been opened in a browser.** SC-007 and SC-009 are unmet. |

### Gate result

**One gate is currently failing, and closing it is the primary purpose of this plan.** This is
not an unjustified violation to be waived — Phase A exists to satisfy it. No further code
change should merge or deploy until Phase A passes.

The Design gate from the constitution's Development Workflow section is satisfied: this plan
names the pages, components, and tokens the remaining work touches (below), and introduces no
colour, font, type scale, spacing value, or component outside the registry.

## Project Structure

### Documentation (this feature)

```text
specs/001-design-consistency-cleanup/
├── spec.md              # Feature specification (clarified 2026-08-24)
├── plan.md              # This file
├── change-record.md     # What was already applied, and why
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output — the verification procedure
├── contracts/
│   └── css-class-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
assets/css/style.css          # Shared stylesheet — tokens + 91 shared component rules
assets/js/custom.js           # Shared navbar injection (untouched by this feature)

member_home.html              # rename target — 8 search-panel selects
search_company.html           # rename target — 8
search_expert.html            # rename target — 4
search_investor.html          # rename target — 4

register.html                 # keeps .gbr-select — 5 form-control selects
payment.html                  # keeps .gbr-select — 3 form-control selects

index.html  about.html  companies.html  company.html  company_startup.html
contactus.html  dashboard.html  Expert.html  faq.html  how_gbr_works.html
investor.html  login.html  messaging.html  policies.html
register_confirmation.html  videochat.html
                              # verification-only; 14 of the 22 changed typeface
```

**Structure Decision**: No structural change. This is a static multi-page site with one shared
stylesheet at `assets/css/style.css` and per-page `<style>` blocks holding only genuine
per-page deltas. The rename touches markup and CSS in 4 files and the shared stylesheet; every
other file in scope is verification-only.

## Phasing

**Phase A — Verification (gating).** Close the Principle V gate on the work already applied.
Nothing else proceeds until this passes. Procedure in [quickstart.md](./quickstart.md).

**Phase B — `.gbr-select` split.** Implement FR-004a/FR-004b. Depends on Phase A because it
adds visual risk to four pages that must first be known-good.

**Phase C — Re-verify the four renamed pages.** A narrower repeat of Phase A scoped to
`member_home`, `search_company`, `search_expert`, `search_investor`.

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 0 research and Phase 1 design artifacts.*

| Principle | Status | Change from pre-design check |
|---|---|---|
| I. Frontend-Only Scope | **PASS** | Unchanged. Phase 1 produced documentation only. |
| II. Contract-First Backend Integration | **PASS** | Strengthened. `contracts/css-class-contract.md` §4 makes "form field `name` attributes are untouched" an explicit invariant with a `git diff` check, and quickstart Phase B verifies it. |
| III. Static, Build-Free Pages | **PASS** | Confirmed by research R5: automated visual regression was considered and rejected precisely because it would breach this principle. The quickstart adds no tooling — it uses `python3 -m http.server`, already present. |
| IV. Existing Design Language Only | **PASS** | `.search-select` is a rename of an existing component, not a new one. It introduces no colour, font, size, or spacing value. The constitution's registry already flags `.gbr-select` as pending this split, so the design gate is satisfied in advance. |
| V. Browser-Verified Delivery | **STILL FAILING — by design** | The plan does not close this gate; it produces the procedure that closes it. quickstart.md Phase A is now a concrete, sequenced, 22-page checklist with explicit exit criteria. |

**Verdict**: no new violations introduced by the design. The single outstanding violation is
Principle V, which is the reason this plan exists and which Phase A discharges.

Research surfaced one hazard the pre-design check could not have caught: **R3**, the
load-bearing `appearance: none`. It is recorded in research.md, made mandatory in the class
contract, and given its own check in quickstart Phase C.

## Complexity Tracking

> Filled only where the Constitution Check has a violation to justify.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principle V currently failing | Verification cannot be performed from a non-interactive shell; it needs a human with a browser. The work was applied with mechanical verification only. | Automated visual regression testing was rejected: it would require a build step, a headless browser, and a dependency manifest, all of which Principle III forbids. Manual verification is the constitution's chosen method, not a shortcut. |
| 14 rules left duplicated (FR-001a) | Sharing them would cause them to newly match markup on pages that never declared them — `.section-title` would restyle `company.html`, `.hero-row .row` would override Bootstrap's grid gutters on five pages. | Forcing full consolidation was rejected because it trades a maintenance gain for real visual regressions. Accepted by clarification on 2026-08-24 and recorded as FR-001a. |
