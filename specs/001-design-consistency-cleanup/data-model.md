# Phase 1 Data Model: Design Consistency Cleanup

**Date**: 2026-08-24 | **Plan**: [plan.md](./plan.md)

This feature has no runtime data, no persistence, and no API. The "model" here is the set of
design entities the spec names and the rules that govern them. Each entity below maps to
something concrete in the repository, so the model is checkable rather than descriptive.

---

## Approved palette

**What it is**: The set of colours permitted anywhere in the site.

**Where it lives**: `.specify/memory/constitution.md` § Design Token Reference (v1.2.0).

**Attributes**: hex value · role · category (brand / text / neutral / surface / border /
Bootstrap semantic / third-party mark).

**Rules**:
- Membership is the test for FR-009. Current size: **43 colours**.
- A colour found in use but absent MUST be reported for amendment, never silently added
  (FR-021). Four were adopted this way in v1.2.0.
- Third-party brand marks are the only permitted exception and MUST NOT grow (FR-021b).

**Current state**: 0 off-registry colours across all 22 pages and the shared stylesheet.

---

## Named token

**What it is**: A CSS custom property referenced by pages instead of a literal value.

**Where it lives**: `:root` in `assets/css/style.css`. Defined **once**, site-wide.

**Instances** (8): `--gbr-primary` · `--gbr-primary-700` · `--gbr-secondary` ·
`--gbr-secondary-dark` · `--gbr-light-gray` · `--font-sans` · `--shadow-card` ·
`--gbr-max-width`.

**Rules**:
- Exactly one definition site-wide (FR-005). Pages MUST NOT define tokens (FR-006).
- `--font-sans` MUST exist in exactly one spelling and retain every fallback (FR-007).

**Current state**: 0 pages define private tokens, down from 9. 1 typeface spelling, down from 3.

---

## Shared component

**What it is**: A visual element used on more than one page, defined once in the shared
stylesheet.

**Where it lives**: `assets/css/style.css`.

**Attributes**: class name · the declarations all copies agreed on · the pages that use it.

**Rules**:
- Declared exactly once (FR-001), **unless** exempt under FR-001a because sharing would make it
  newly match markup on a page that never declared it.
- One class name MUST NOT style two unrelated elements (FR-004a).
- A page keeps only declarations that differ from the shared version.

**Current state**: 57 shared classes. 91 rules consolidated. 14 rules exempt under FR-001a.
1 collision outstanding (`.gbr-select`).

---

## Page delta

**What it is**: The declarations a single page keeps because they genuinely differ from the
shared component.

**Where it lives**: That page's own `<style>` block.

**Rules**:
- Contains only what differs, never a full copy (FR-002).
- Genuinely single-page rules stay and MUST NOT be promoted (FR-003).

**Current state**: 877 declarations across 9 pages, down from 2,674. Largest deltas:
`register` 82 rules, `payment` 42, `company` 31.

**Example**: `.hero-card` is three legitimate variants. The common base is shared; each page
keeps 2–4 declarations, down from 7–9.

---

## Exception list

**What it is**: Colours permitted despite not being GBR's own.

**Where it lives**: `.specify/memory/constitution.md` § Design Token Reference →
Third-party brand marks.

**Instances** (7): `#1a1f71` Visa · `#eb001b`, `#f79e1b` Mastercard · `#16366f` Mastercard
wordmark plate · `#006fcf`, `#009cde` American Express · `#003087` PayPal.

**Rules**: Each entry MUST name the mark it belongs to (FR-012). The list MUST NOT grow beyond
third-party marks (FR-013, FR-021b).

---

## Change record

**What it is**: The list of every place a page's appearance intentionally changes.

**Where it lives**: [change-record.md](./change-record.md).

**Attributes**: what changed · why (off-palette correction / duplicate resolution / typeface
unification) · affected pages.

**Rules**: Every intended difference appears here (SC-006). Every FR-001a exemption is listed
with the page it would otherwise have restyled (SC-001b).

---

## Entity relationships

```text
Approved palette ──constrains──> Named token ──referenced by──> Shared component
                 └──constrains──────────────────────────────────> Page delta
                 └──excepted by──> Exception list

Shared component ──has 0..1──> Page delta   (per page that uses it)
Shared component ──exempt via──> FR-001a ──recorded in──> Change record
Any intended visual change ────────────────recorded in──> Change record
```

## State transition — a rule's lifecycle

```text
duplicated in N pages
        │
        ├─ all copies agree ──────────────> shared (whole rule moves)
        │
        ├─ copies differ ─────────────────> shared base + per-page deltas
        │
        ├─ would newly match another page ─> stays duplicated  (FR-001a exemption)
        │
        └─ one name, two elements ────────> renamed, then shared  (FR-004a)
```

`.gbr-select` is the only rule currently sitting in the fourth branch.
