# Contract: CSS Class Names

**Date**: 2026-08-24 | **Plan**: [../plan.md](../plan.md)

This site exposes no API. Its one real internal interface is the **class-name contract between
the pages and the shared stylesheet**: which names `assets/css/style.css` owns, which names a
page may define for itself, and what a page may assume when it puts a class in its markup.

Breaking this contract is how the site drifted in the first place, so it is written down.

---

## 1. Ownership

| Namespace | Owner | A page may |
|---|---|---|
| The 57 shared classes listed in the constitution's Design Token Reference | `assets/css/style.css` | Use them in markup. Override individual declarations in its own block where it genuinely differs. |
| Any other class | The page that defines it | Define and use freely, provided the name is not already shared. |

**Rules**

- A page MUST NOT redefine a shared class wholesale. It may only override the declarations that
  genuinely differ (FR-002, FR-003).
- A page MUST NOT introduce a class whose name collides with a shared class but means something
  different (FR-004a).
- A new class used by more than one page MUST move to the shared stylesheet, unless exempt under
  FR-001a.

## 2. Cascade guarantee

Every page loads `assets/css/style.css` in `<head>`, and every page-level `<style>` block
appears **after** it. Verified across all 22 pages.

Therefore: **at equal specificity, the page wins.** A page can always override a shared
declaration without `!important`. Shared rules must never rely on winning against a page.

## 3. The `.gbr-select` split (FR-004a — pending)

One name currently covers two unrelated controls. After the split:

| Class | Element | Pages | Elements |
|---|---|---|---|
| `.gbr-select` | Form control, paired with `.gbr-input` / `.gbr-textarea` | `register`, `payment` | 8 |
| `.search-select` | Search-panel dropdown, paired with `.search-header` / `.search-body` / `.btn-search` | `member_home`, `search_company`, `search_expert`, `search_investor` | 24 |

**`.search-select` contract** — the full rule moves to the shared stylesheet, all four page
copies are deleted, and it MUST include:

```css
.search-select {
  width: 100%;
  padding: 7px 30px 7px 10px;
  font-size: 14px;
  border: 1px solid #b6bcc0;
  background: #fff url("data:image/svg+xml;…") right 10px center no-repeat;
  -webkit-appearance: none;   /* REQUIRED — see research.md R3 */
  appearance: none;           /* REQUIRED — see research.md R3 */
  border-radius: 0;
  color: #212529;
}
```

> **`appearance: none` is load-bearing.** The renamed elements stop matching the existing
> `.gbr-select { appearance: none }` rule the moment they are renamed. Omitting it brings back
> the browser's native dropdown chrome — a system arrow on top of the custom SVG arrow, and a
> possible control-height change that would misalign the search panel row. Nothing mechanical
> catches this; it is a browser-only check.

## 4. Invariants that survive any change

These hold before and after every edit in this feature, and are what SC-005 and FR-023 rest on:

- **Form field `name` attributes are untouched.** Class renames never alter `name`, `id` used by
  scripts, form behaviour, or link destinations (FR-004b, FR-023).
- **The page shell is fixed.** All 22 pages load, in order: Bootstrap → Poppins → Font Awesome →
  theme → `blocks.css` → `style.css` → page `<style>`. Plus `#navbar-placeholder` and
  `assets/js/custom.js`.
- **Tokens are referenced, never restated.** Pages use `var(--gbr-secondary)`, not `#0083ae`,
  where a token exists.
- **No `!important`** is introduced to win a cascade fight. If one seems necessary, the name is
  wrong — rename instead.

## 5. Verifying the contract

```bash
# no page defines its own tokens
grep -l -- '--[a-z0-9-]\+:' *.html          # expect: no output (excluding legacy files)

# both select classes exist, neither overlaps
grep -c 'class="[^"]*gbr-select'    register.html payment.html
grep -c 'class="[^"]*search-select' member_home.html search_*.html

# the shared stylesheet owns search-select exactly once
grep -c '^\.search-select' assets/css/style.css      # expect: 1

# appearance:none survived the rename
grep -A9 '^\.search-select' assets/css/style.css | grep -c 'appearance: none'   # expect: 2
```
