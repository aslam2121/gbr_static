# Change Record — Design Consistency Cleanup

**Applied**: 2026-08-24
**Spec**: [spec.md](./spec.md)

Required by FR-004, FR-010, FR-012, FR-013 and FR-021. Lists every intentional change,
every exception, and everything deliberately left alone.

> **Superseded in part by the clarification session of 2026-08-24** (see
> [spec.md](./spec.md) § Clarifications). Four open items in this record are now decided:
> the typeface unification stands (FR-007a); the four unregistered colours are to be adopted
> into the constitution rather than replaced (FR-021a); the `.gbr-select` collision is to be
> resolved by renaming the search-panel version (FR-004a); and the 14 unconsolidated rules
> are accepted as a reasoned exception (FR-001a). **FR-004a and FR-021a are follow-up work
> and are not yet implemented.**

---

## 1. Precedence rule used

The spec (FR-004) allowed "shared stylesheet wins, else the majority version wins". A
**stricter rule was used instead: declaration intersection.**

> A rule moves to the shared stylesheet carrying only the declarations that **every** copy
> agreed on. Any declaration a page did not share stays in that page's own block.

Why the stricter rule: majority-wins would have silently changed the minority pages. The
intersection rule makes it impossible for a page to gain or lose a declaration it did not
already have, so SC-006 ("no unintended visual difference") holds by construction rather
than by inspection. It consolidates slightly less, and is worth it.

A second guard was added on top: **a rule was not shared if its selector would newly match
markup on a page that never defined it.** Fourteen rules were withheld under this guard
(section 6).

---

## 2. What moved

| | Before | After |
|---|---|---|
| Page-level CSS declarations | 2,674 | 877 (**67% removed**) |
| Page-level CSS lines | 1,297 | 308 |
| Rules defined in >1 page | 120 | 14 (deliberate — section 6) |
| Pages with private token blocks | 9 | **0** |
| Typeface stack spellings | 3 | **1** |
| Colours outside the approved palette | 55 | **0** |

`assets/css/style.css` grew from 209 to 364 lines, gaining a `:root` token block and 91
shared component rules grouped into labelled sections.

---

## 3. Intended visible changes

### 3.1 Typeface now consistent across all 22 pages — the largest change

**Before this cleanup the site rendered in two different typefaces.** Only 8 pages set
`body { font-family: var(--font-sans) }`. The other 14 — including `company.html` — fell
through to Bootstrap's `--bs-font-sans-serif`, which the bundled theme leaves as the
**system font stack, not Poppins**.

Moving `body` into the shared stylesheet applies Poppins to all 22 pages.

- **Visibly changed**: `index`, `about`, `companies`, `company`, `contactus`, `dashboard`,
  `Expert`, `faq`, `how_gbr_works`, `investor`, `login`, `messaging`, `policies`, `videochat`
  — 14 pages now render in Poppins instead of the system font.
- **Not a new asset**: Poppins is self-hosted in `assets/fonts/`, linked in the `<head>` of
  all 22 pages already, and named as *the* site typeface in the constitution's Design Token
  Reference. Nothing new was introduced; an existing font was applied consistently.
- The other two declarations in the same rule — `color: #212529` and `background: #fff` —
  are exact no-ops, matching Bootstrap's own `--bs-body-color` and `--bs-body-bg` defaults.

**This is the single change most worth looking at in a browser.** It is also the deepest
inconsistency the audit found, and the most direct answer to "design should remain same
across all pages".

### 3.2 Typeface fallback list unified (FR-007)

`member_home`, `search_expert`, and `search_investor` used
`'Poppins', system-ui, sans-serif`, omitting `-apple-system`. All pages now use the fullest
version, `'Poppins', system-ui, -apple-system, sans-serif`. Only observable on Apple devices
when Poppins fails to load.

### 3.3 Dead token system removed from `search_company.html` (FR-008)

The private parallel system of ~29 tokens — a spacing scale, a font-weight scale, semantic
colour roles, `--gbr-primary-900`, `--gbr-accent-info`, `--gbr-cream`, `--gbr-sky`,
`--gbr-mist`, `--shadow-md` — was deleted. **All 22 removed tokens had zero `var()`
references anywhere in the file**; only the six site-wide tokens and `--gbr-primary-700`
were actually used. Deleting unreferenced custom properties has no rendering effect.

Per the spec's assumption, these were retired rather than promoted site-wide. Promoting them
would be new design, which Principle IV forbids without a constitution amendment.

### 3.4 Off-palette colours replaced (36 replacements, 13 files)

| Was | Now | Why | Files |
|---|---|---|---|
| `#0582ad` | `#0083ae` | near-duplicate of brand blue | dashboard, index, messaging |
| `#1e88e5` | `#0083ae` | Material blue, foreign family (map marker) | index |
| `#42a5f5` | `#0a8cb7` | Material blue, foreign family (map fill) | index |
| `#dde2e6` | `#dee2e6` | one character off an approved border grey | company |
| `#9aa0a6` | `#adb5bd` | nearest approved muted grey | company, company_startup, register |
| `#f0f2f3`, `#f5f6f6` | `#f3f4f5` | nearest approved light surface | company, company_startup |
| `#f0f8fc` | `#f7fafb` | nearest approved pale surface | company, register |
| `#ccc` | `#c8cdd1` | nearest approved border grey | index, style.css |
| `#c4c8cb` | `#c8cdd1` | nearest approved border grey | member_home, payment, register |
| `#dde8ec` | `#e3e6e8` | nearest approved hover surface | member_home, search_× 3 |
| `#cfe1e9` | `#cdd6d9` | nearest approved active surface | search_× 3 |
| `#b0b5b9`, `#b8bdc1` | `#b6bcc0` | nearest approved input border | payment, register, register_confirmation |
| `#ebeded` | `#e6e7e8` | nearest approved light surface | style.css (shared `.pin-block`) |
| `#d0d3d6` | `#d6dadd` | nearest approved divider grey | register |

Most are imperceptible greys. The visible ones are the three brand-blue corrections on
`dashboard`, `index`, and `messaging`, which is the point of FR-011.

---

## 4. Exception list (FR-012, FR-013)

Kept deliberately. These are **third-party brand marks** on `payment.html` and cannot be
substituted with palette colours without misrepresenting the marks.

| Colour | Mark |
|---|---|
| `#1a1f71` | Visa |
| `#eb001b` | Mastercard (red disc) |
| `#f79e1b` | Mastercard (orange disc) |
| `#16366f` | Mastercard wordmark plate (`.brand-mc`) |
| `#006fcf` | American Express |
| `#009cde` | American Express (secondary) |
| `#003087` | PayPal |

Per FR-013 this list must not grow beyond third-party marks without an explicit decision.

---

## 5. Reported for constitution amendment (FR-021)

Four colours are in genuine, intentional use but are **not** in the Design Token Reference.
They were **left untouched** and are reported here rather than silently added or replaced.

| Colour | Role | Where |
|---|---|---|
| `#e7f9fc` | pale sky section background | index, companies, company, company_startup, search_company |
| `#f9efe3` | cream section background | index, companies, search_company |
| `#032a36` | `--gbr-primary-700`, darkest brand tone | shared token, used by search_company |
| `#cce6ef` | navbar link hover tint | style.css `.gbr-nav-link:hover` / `.active` |

`#e7f9fc` and `#f9efe3` are the home page's hero tile backgrounds — clearly deliberate brand
surfaces, not drift. Recommend adding all four to the Design Token Reference via
`/speckit-constitution`.

---

## 6. Deliberately not consolidated

Fourteen rules stayed duplicated. Each one's selector matches markup on a page that never
defined it, so sharing it would have restyled that page — a regression, not a cleanup.

| Rule | Would have newly hit |
|---|---|
| `.section-title` | company.html |
| `.hero-row .row` | member_home + 4 others (would fight Bootstrap gutters) |
| `.hero-card h3`, `.hero-card p` | member_home, search_× 3 |
| `.hero-card .tagline`, `.hero-card img` | payment, register, register_confirmation |
| `.contact-item` and 3 variants | member_home |
| `.field-label` | payment, register, register_confirmation |
| `.contact-id` (mobile) | company_startup |
| `.get-in-touch .gt-icon:hover` | search_investor |
| `.login-wrap` (mobile) | register |

`.gbr-select` is a related case: the same class name serves two different elements — a form
control on `register`/`payment` and a search-panel dropdown on the four search pages. Only
the two declarations both versions agree on were shared; each context keeps its own rule.
Renaming one of them would be the real fix and is left as a follow-up.

`.hero-card` is genuinely three variants (register; payment/register_confirmation;
member_home/search pages). The common base is now shared and each page keeps a 2–4
declaration delta, down from 7–9.

---

## 7. Verification status — read this before deploying

**Done — mechanical, and it passed:**

- Every page's *effective* styles were reconstructed before and after (shared stylesheet plus
  page block, with token and colour equivalence resolved) and compared property by property,
  restricted to selectors that actually match that page's markup.
  **Result: 0 properties lost, 0 unintended value changes.** The only differences are the
  22 unreferenced tokens in section 3.3 and the `--font-sans` fallback in section 3.2.
- Brace balance verified in `style.css` and all 22 page style blocks.
- All 22 pages still load the shared stylesheet, Poppins, navbar placeholder, and
  `custom.js`, in the established order.
- 0 off-palette colours remain outside the documented exceptions.
- 0 private token blocks remain; 1 typeface spelling site-wide.

**Not done — and required by Principle V and SC-007/SC-009:**

- **No page has been opened in a browser.** The manual check at a desktop and a mobile width,
  and the browser-console check, have not been performed — they cannot be done from here.
- Priority for that pass: the **14 pages that change typeface** (section 3.1), then
  `search_company.html` (largest edit, 437 → 26 lines), then `register.html` and
  `payment.html` (most complex layouts).

Until that pass is done, this work is verified structurally but **not** verified visually.
