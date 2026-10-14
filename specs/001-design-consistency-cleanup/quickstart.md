# Quickstart: Verifying the Design Consistency Cleanup

**Date**: 2026-08-24 | **Plan**: [plan.md](./plan.md)

This is the Phase A gate. Principle V requires it, SC-007 and SC-009 depend on it, and it has
**not been done**. Until it passes, the applied cleanup is verified structurally but not
visually, and nothing should deploy.

Budget roughly 30–40 minutes.

---

## Prerequisites

No build step, no install. Serve the folder statically so relative asset paths resolve:

```bash
cd "/home/aslam2121/Documents/Claude Projects/GBR_HTML (speckit)"
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

> Opening the files directly with `file://` mostly works but is not a valid check — the navbar
> is injected by `assets/js/custom.js` and some browsers restrict local script behaviour.

**Rollback at any point**: `git checkout .` — nothing from this feature is committed.

---

## Re-run the mechanical checks first (30 seconds)

These all passed when the work was applied. Re-run them so you know the tree is still clean
before you start looking at pages.

```bash
# 0 colours outside the 43-colour registry
python3 - <<'PY'
import re, pathlib
c = pathlib.Path(".specify/memory/constitution.md").read_text()
sec = c[c.index("## Design Token Reference"):c.index("## Technology and Integration Constraints")]
reg = {h.lower() for h in re.findall(r"#[0-9a-fA-F]{3,6}\b", sec)} | {"#000","#fff","#000000","#ffffff"}
bad = {}
for f in list(pathlib.Path(".").glob("*.html")) + [pathlib.Path("assets/css/style.css")]:
    if f.stem in ("_template","registration_old") or f.name.endswith(".bak"): continue
    off = {h.lower() for h in re.findall(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b", f.read_text())} - reg
    if off: bad[f.name] = sorted(off)
print(bad or "PASS: 0 off-registry colours")
PY

# 0 pages define private tokens; 1 typeface spelling
# (_template.html and registration_old.html are excluded legacy files — see constitution)
LIVE=$(ls *.html | grep -vE '_template|registration_old|\.bak')
grep -l -- '--[a-z0-9-]\+:' $LIVE || echo "PASS: no page tokens"
grep -rho -- "--font-sans:[^;]*" assets/css/style.css $LIVE | tr -s ' ' | sort -u
```

Expected: no off-registry colours, `PASS: no page tokens`, and exactly one `--font-sans` line.

> Both greps must exclude `_template.html`. It is an untracked scratch file that still carries
> an old private token block, and it will otherwise show up as a false failure.

---

## Phase A — the browser pass

For **each** page below: open it, look at it at a desktop width, resize to a narrow phone
width, and check the console.

### What you are checking on every page

1. **Console is clean** — no new errors. Warnings about the Leaflet CDN or fonts are
   pre-existing; a `404` on a stylesheet or image is not.
2. **Navbar and footer render**, and the navbar highlights the current page.
3. **Nothing overflows sideways** at the narrow width. The page scrolls vertically only.
4. **Buttons, inputs, cards, and headings look like they do on the other pages.**

### A1 — The 14 typeface pages (highest priority)

These previously rendered in the browser's system font and now render in Poppins. This is the
single largest change in the feature and the only one a visitor would notice site-wide.

`index` · `about` · `companies` · `company` · `contactus` · `dashboard` · `Expert` · `faq` ·
`how_gbr_works` · `investor` · `login` · `messaging` · `policies` · `videochat`

**Specifically look for**: text that now wraps to a new line where it did not before, headings
that no longer fit their container, buttons whose labels overflow, and table or card layouts
that shifted because Poppins is slightly wider than the system font at the same size.

**How to confirm the font actually applied** — in DevTools console:

```js
getComputedStyle(document.body).fontFamily   // expect: Poppins first
```

Then in the Network tab, confirm a `Poppins-*.woff2` request succeeded. If it 404s, the page is
silently falling back and the check is invalid.

### A2 — The heavily-edited pages

Their `<style>` blocks shrank the most, so they carry the most consolidation risk.

| Page | Was → now | Look hardest at |
|---|---|---|
| `search_company` | 437 → 26 lines | Search panel, results list, right rail, the Established/Startup toggle |
| `register` | 165 → 90 | All 4 steps, the progress bar, conditional startup fields, upload rows |
| `payment` | 130 → 48 | Card-brand marks still in their own colours, form grid, right rail |
| `company` | 151 → 35 | Section titles, the map, detail fields |
| `member_home` | 89 → 21 | Greeting strip, search panel, contacts list, chat card |
| `register_confirmation` | 92 → 18 | Hero cards, pin block, confirmation copy |
| `company_startup` | 77 → 35 | Fundraising widget, progress bar, member rating spacing |
| `search_expert`, `search_investor` | 78 → ~17 | Detail field grids, get-in-touch row |

### A3 — Targeted colour checks

Three brand-blue corrections are the only deliberately visible colour changes:

- `dashboard.html` — the coloured card was `#0582ad`, now brand `#0083ae`
- `messaging.html` — the outgoing chat bubble, same correction
- `index.html` — the Leaflet map marker and polygon, previously Material blues

Confirm they read as the same blue as the navbar accent rule. On `payment.html`, confirm the
Visa / Mastercard / Amex / PayPal marks still show their **own** brand colours — those are
deliberate exceptions and must not have become teal.

### A4 — Cross-page consistency

Open `index.html` and `about.html` side by side with `company.html`. Body text, headings,
buttons, and the footer should be indistinguishable in font, size, and colour. This is the
SC-008 check and the whole point of the feature.

---

## Phase A exit criteria

- [ ] All 22 pages opened at desktop and mobile widths
- [ ] 0 new console errors on any page
- [ ] 0 pages scroll horizontally at the narrow width
- [ ] All 14 typeface pages render in Poppins with no broken wrapping or overflow
- [ ] The 3 brand-blue corrections match the navbar accent
- [ ] Payment card marks retain their own brand colours
- [ ] No page looks out of family with the others

**If anything fails**: record it, then check whether it is caused by this feature or was already
broken. `git stash` and reload the same page to compare against the pre-cleanup state.

---

## Phase B — the `.gbr-select` split

Only after Phase A passes. Full contract in
[contracts/css-class-contract.md](./contracts/css-class-contract.md), rationale in
[research.md](./research.md) R1–R4.

Shape of the change:

1. In `member_home`, `search_company`, `search_expert`, `search_investor`: rename
   `class="gbr-select"` → `class="search-select"` (24 elements total: 8, 8, 4, 4).
2. Delete the four page-level `.gbr-select` rules.
3. Add one `.search-select` rule to `assets/css/style.css` — **including
   `-webkit-appearance: none` and `appearance: none`** (research.md R3).
4. Leave `register` and `payment` untouched.

Verify mechanically:

```bash
grep -c 'class="[^"]*search-select' member_home.html search_company.html search_expert.html search_investor.html
# expect: 8, 8, 4, 4

grep -c 'class="[^"]*gbr-select' register.html payment.html
# expect: 5, 3

grep -c 'gbr-select' member_home.html search_*.html    # expect: 0 on all four
grep -c '^\.search-select' assets/css/style.css        # expect: 1
grep -A9 '^\.search-select' assets/css/style.css | grep -c 'appearance: none'   # expect: 2
```

**Confirm no form field names moved** — this must be empty:

```bash
git diff -U0 -- '*.html' | grep -E '^[-+].*\bname="' | grep -v '^[-+][-+]'
```

## Phase C — re-verify the four renamed pages

Repeat the Phase A checks on `member_home`, `search_company`, `search_expert`,
`search_investor` only, and on each:

- [ ] Every dropdown shows **one** custom arrow, not a native arrow as well
- [ ] Dropdown height and alignment match the row they sit in
- [ ] Opening a dropdown still works and options are readable
- [ ] The search panel grid has not reflowed

That first item is the R3 hazard. It is the most likely thing to go wrong in Phase B and the
only way to catch it is to look.
