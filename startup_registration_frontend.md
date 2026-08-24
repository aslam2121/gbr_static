# Company Registration — Established / Startup (Frontend)

Adds an **Established / Startup (US Fundraising)** toggle to the Company step of the
registration form. Selecting **Startup** reveals US-startup fundraising fields and
locks Country to "United States".

Field names produced: `company_type` (`established` | `startup`), `funding_stage`,
`sector`, `goal`, `valuation`, `min_investment` (plus existing `country`, `state`).

---

## 1. `register.html` — Established/Startup toggle
Place at the **top of the Company step-2 panel** (`#s2-company`, before the form grid):

```html
<div class="subtype-toggle" id="companyTypeToggle" style="margin-bottom:16px;">
    <button type="button" class="subtype-pill active" data-ctype="established">Established</button>
    <button type="button" class="subtype-pill" data-ctype="startup">Startup (US Fundraising)</button>
</div>
<input type="hidden" name="company_type" id="companyTypeInput" value="established">
```

## 2. `register.html` — Country field
Give the Country input a `name` and `id` so the script can lock it:

```html
<span class="lbl">Foundation Year</span><div class="fy-row"><input class="gbr-input" type="text" name="founded_year" /><span class="country-label">Country</span><input class="gbr-input" type="text" name="country" id="companyCountry" /></div>
```

## 3. `register.html` — Startup-only fields
Add inside the Company step-2 form grid (hidden until Startup is selected):

```html
<span class="lbl startup-field">US State</span>
<select class="gbr-select startup-field" name="state">
    <option value="">-- Select State --</option>
    <option>Alabama</option><option>Alaska</option><option>Arizona</option><option>Arkansas</option><option>California</option><option>Colorado</option><option>Connecticut</option><option>Delaware</option><option>Florida</option><option>Georgia</option><option>Hawaii</option><option>Idaho</option><option>Illinois</option><option>Indiana</option><option>Iowa</option><option>Kansas</option><option>Kentucky</option><option>Louisiana</option><option>Maine</option><option>Maryland</option><option>Massachusetts</option><option>Michigan</option><option>Minnesota</option><option>Mississippi</option><option>Missouri</option><option>Montana</option><option>Nebraska</option><option>Nevada</option><option>New Hampshire</option><option>New Jersey</option><option>New Mexico</option><option>New York</option><option>North Carolina</option><option>North Dakota</option><option>Ohio</option><option>Oklahoma</option><option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option><option>South Carolina</option><option>South Dakota</option><option>Tennessee</option><option>Texas</option><option>Utah</option><option>Vermont</option><option>Virginia</option><option>Washington</option><option>West Virginia</option><option>Wisconsin</option><option>Wyoming</option>
</select>
<span class="lbl startup-field">Funding Stage</span>
<select class="gbr-select startup-field" name="funding_stage">
    <option value="">-- Select --</option>
    <option>Pre-Seed</option><option>Seed</option><option>Series A</option><option>Series B</option><option>Series C+</option>
</select>
<span class="lbl startup-field">Sector</span><input class="gbr-input startup-field" type="text" name="sector" placeholder="e.g. Robotics &amp; Automation" />
<span class="lbl startup-field">Fundraising Goal (USD)</span><input class="gbr-input startup-field" type="number" name="goal" placeholder="3600000" />
<span class="lbl startup-field">Pre-money Valuation (USD)</span><input class="gbr-input startup-field" type="number" name="valuation" placeholder="45000000" />
<span class="lbl startup-field">Minimum Investment (USD)</span><input class="gbr-input startup-field" type="number" name="min_investment" placeholder="500" />
```

## 4. `register.html` — JavaScript
Add inside the page's `<script>` (after the DOM elements are defined):

```html
<script>
// Company sub-type: Established vs US Startup
(function () {
    var panel = document.getElementById('s2-company');
    var hidden = document.getElementById('companyTypeInput');
    var country = document.getElementById('companyCountry');
    if (!panel || !hidden) return;
    panel.querySelectorAll('.subtype-pill').forEach(function (pill) {
        pill.addEventListener('click', function () {
            panel.querySelectorAll('.subtype-pill').forEach(function (p) { p.classList.remove('active'); });
            pill.classList.add('active');
            var isStartup = pill.dataset.ctype === 'startup';
            hidden.value = isStartup ? 'startup' : 'established';
            panel.classList.toggle('startup-selected', isStartup);
            if (country) {
                if (isStartup) { country.value = 'United States'; country.readOnly = true; }
                else { country.readOnly = false; if (country.value === 'United States') country.value = ''; }
            }
        });
    });
})();
</script>
```

## 5. `assets/css/style.css` — CSS

```css
.subtype-toggle { background: #f3f4f5; padding: 10px 22px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.subtype-pill { background: #fff; border: 1px solid #b6bcc0; color: #495057; font-size: 13px; font-weight: 500; padding: 5px 14px; border-radius: 20px; cursor: pointer; font-family: inherit; }
.subtype-pill.active { background: #0083ae; border-color: #0083ae; color: #fff; }
.startup-field { display: none; }
#s2-company.startup-selected .startup-field { display: block; }
```
