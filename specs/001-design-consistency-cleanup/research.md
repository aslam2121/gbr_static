# Phase 0 Research: Design Consistency Cleanup

**Date**: 2026-08-24 | **Plan**: [plan.md](./plan.md)

The Technical Context carried no `NEEDS CLARIFICATION` markers — the stack is fixed by the
constitution and the three open spec questions were settled in the clarification session of
2026-08-24. Research therefore focused on the two open implementation questions and on one
hazard discovered while measuring the rename.

---

## R1 — What name should the search-panel dropdown take?

**Decision**: `.search-select`.

**Rationale**: It sits alongside the existing `.search-header`, `.search-body`, and
`.btn-search` classes, so it reads as part of the same component family. It is descriptive of
context rather than appearance, which is how the rest of the shared vocabulary is built
(`.greeting-strip`, `.right-rail`, `.chat-card`). It also cannot collide — no `search-select`
string exists anywhere in the codebase today.

**Alternatives considered**:
- `.gbr-select-search` — keeps the `gbr-` prefix but reads as a variant of the form control,
  which is precisely the confusion being removed.
- `.filter-select` — accurate for the search pages but wrong for `member_home`, where the
  panel is the member's own search, not a filter.
- Leaving both as `.gbr-select` and scoping by ancestor (`.search-body .gbr-select`) — rejected
  because it preserves the collision, and the spec's edge case explicitly calls for a rename
  rather than a merge.

---

## R2 — Which side of the collision should be renamed?

**Decision**: Rename the **search-panel** side (4 pages, 24 elements). `register` and `payment`
keep `.gbr-select`.

**Rationale**: Confirmed by counting actual usage.

| Side | Pages | Elements | Risk profile |
|---|---|---|---|
| Search panel | `member_home` 8, `search_company` 8, `search_expert` 4, `search_investor` 4 | **24** | Display-only filters and dropdowns |
| Form control | `register` 5, `payment` 3 | **8** | Sit inside the registration and payment forms |

The form-control side is smaller, but `register.html` carries 36 inputs and `payment.html`
handles payment data — these are the two pages where a mistake costs the most and where FR-023
(no change to form field names or behaviour) bites hardest. Renaming the larger but lower-risk
side keeps the blast radius away from the forms. `.gbr-select` also stays semantically paired
with `.gbr-input` and `.gbr-textarea`, which only exist on the form side.

**Alternatives considered**: Renaming the form side to `.gbr-form-select` — identical benefit,
but it edits the two highest-consequence pages on the site for no gain.

---

## R3 — Hazard: the shared `appearance: none` is load-bearing

**Decision**: `.search-select` MUST carry `-webkit-appearance: none; appearance: none;`
explicitly, and this must be verified visually on all four pages.

**Rationale**: This is the trap in the rename. `assets/css/style.css:277` currently holds:

```css
.gbr-select { -webkit-appearance: none; appearance: none; }
```

That rule is the intersection the cleanup extracted, and it presently applies to **all six**
pages. The moment 24 elements are renamed to `.search-select`, they stop matching it. Each
page's local rule supplies `background`, `border`, `padding`, and `border-radius` but **not**
`appearance` — so without care the four search pages would regain the browser's native
dropdown chrome: a system arrow drawn on top of the custom SVG arrow, and on some platforms a
different control height that would shift the search panel's row alignment.

Nothing in the mechanical checks would catch this. It is only visible in a browser, which is
why R3 is called out here and repeated as a specific check in
[quickstart.md](./quickstart.md).

**Alternatives considered**: Retaining `.gbr-select` on the renamed elements as a second class
so the rule still applies — rejected, as carrying both names is exactly the ambiguity the
rename exists to remove.

---

## R4 — How should the four identical search rules be consolidated?

**Decision**: Move the full rule to `assets/css/style.css` as a single `.search-select`
declaration and delete all four page-level copies.

**Rationale**: The four copies are byte-identical after whitespace normalisation, so the
intersection is the whole rule and no page needs a delta. This is the one place in the feature
where a component consolidates cleanly to a single definition with nothing left behind, which
is why FR-004a is worth doing rather than accepting the split.

The new rule must also survive the FR-001a guard: `search-select` appears in no page's markup
today, so after the rename it can only match the 24 elements deliberately given the class. No
leak is possible.

**Alternatives considered**: Leaving the four copies in place after renaming — rejected, it
would satisfy the naming half of FR-004a while ignoring the consolidation half.

---

## R5 — Can verification be automated within the constitution?

**Decision**: No. Verification stays manual, per Principle V.

**Rationale**: Automated visual regression (Playwright, Percy, BackstopJS) would require a
package manifest, a headless browser dependency, and a build/run step. Principle III forbids
introducing any of those without a constitution amendment, and Principle V already names the
browser as this project's verification method. The mechanical checks already performed —
effective-style diffing, brace balance, palette scanning, page-shell checks — are the
appropriate automated layer for a project with no build tooling, and they have all passed.

**Alternatives considered**: Amending the constitution to permit a dev-only test toolchain —
out of scope for this feature and a significant change to the project's character. Worth
raising separately if the site grows.
