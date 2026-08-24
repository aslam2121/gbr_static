<!--
SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Rationale: MINOR. Principle IV was materially expanded and tightened into a
non-negotiable "no new design invention" rule, and a new Design Token Reference
section was added. No principle was removed and no prior rule was reversed, so this
is an expansion rather than a backward-incompatible redefinition.

Modified principles:
  IV. Shared Design System and Partials → IV. Existing Design Language Only (NON-NEGOTIABLE)
  (I, II, III, V unchanged)

Added sections:
  Design Token Reference — enumerates the colours, typography, layout cap, and shared
  component classes already present in the codebase, so Principle IV is checkable.

Modified sections:
  Development Workflow and Quality Gates — added a Design gate.

Removed sections: none.

Follow-up TODOs: none.
-->

# GBR Constitution

## Core Principles

### I. Frontend-Only Scope (NON-NEGOTIABLE)

This repository is the GBR **frontend only**. The backend is a separate Laravel
application owned by another developer and lives outside this repository.

- Work in this repository MUST be limited to markup, styles, client-side scripts,
  static assets, and frontend documentation.
- Contributors MUST NOT add server-side code, Laravel files, Blade templates,
  migrations, seeders, ORM models, authentication logic, or database schemas here.
- Features that require server behaviour MUST be delivered as the frontend half
  (form fields, request shape, rendered states) plus a written contract note for the
  backend developer — never as a mock backend committed to this repository.
- Business rules that belong on the server (authorization, payment capture, data
  persistence, validation of record uniqueness) MUST NOT be re-implemented in
  client-side JavaScript as if they were authoritative. Client-side checks exist for
  user experience only.

Rationale: Two developers own two halves of one product. A hard scope boundary keeps
ownership unambiguous and prevents duplicated or conflicting logic across the split.

### II. Contract-First Backend Integration

Every point where a page hands data to, or takes data from, the Laravel backend MUST
be defined as an explicit contract before the frontend is built against it.

- Every form control that submits data MUST carry a stable `name` attribute, and that
  field name is the contract. Renaming a submitted field is a breaking change and MUST
  be recorded in the feature's frontend documentation.
- New or changed integration points MUST be documented in a markdown file at the
  repository root (following the pattern of `startup_registration_frontend.md`),
  listing field names, allowed values, and any coupling rules.
- Contributors MUST NOT invent endpoint URLs, response shapes, or auth flows. If the
  backend contract is unknown, the frontend MUST be built to the documented shape and
  the gap flagged, not guessed.
- Where a page must render backend-provided data, the markup MUST include a realistic
  static placeholder so the backend developer can see the target structure.

Rationale: The handoff between the two repositories is the only real interface in this
project; written contracts are what make an asynchronous, two-developer split work.

### III. Static, Build-Free Pages

The site is a set of hand-authored static HTML pages served directly. There is no
build step, bundler, package manifest, or transpiler in this repository.

- Each page MUST remain a self-contained `.html` file at the repository root that
  loads correctly when opened directly or served as a static asset.
- Contributors MUST NOT introduce a frontend framework (React, Vue, Svelte), a module
  bundler, a CSS preprocessor, or a `npm run build` step without amending this
  constitution first.
- Client-side JavaScript MUST be plain browser JavaScript — either inline in the page
  it serves or in `assets/js/custom.js` for cross-page behaviour.
- Third-party libraries MUST be limited to the already-adopted set (Bootstrap 5,
  Bootstrap Icons, Font Awesome, Leaflet). Adding a new library requires justification
  recorded in the feature's plan.

Rationale: Zero build tooling is why this site deploys as static assets and why a
backend developer can open any page and read it. That property is worth protecting.

### IV. Existing Design Language Only (NON-NEGOTIABLE)

New work MUST be assembled from the design language already present in this codebase.
Contributors MUST NOT invent new design. Every page MUST look and behave as part of the
same site.

**Colour**

- Colours MUST be drawn from the existing palette recorded in the Design Token
  Reference below. Contributors MUST NOT introduce a new hue, a new brand colour, a new
  accent, or a re-tinted variant of an existing colour.
- `#0083ae` is the brand primary and MUST remain the primary action and brand-bar
  colour. `#043443` / `#033443` remain the deep brand tone.
- Where a needed colour is not in the registry, the closest existing token MUST be used
  instead of adding one.

**Typography**

- Poppins is the site typeface, loaded from `assets/css/Poppins.css` and local files in
  `assets/fonts/`. Contributors MUST NOT add a second typeface, a web-font CDN, or an
  alternate font stack.
- The font stack MUST remain `'Poppins', system-ui, -apple-system, sans-serif`, and MUST
  be referenced through `--font-sans` or inherited from `body` — never hard-coded per
  element with a different stack.
- Contributors MUST NOT introduce new type scales; sizes and weights MUST match those
  already used for the equivalent element elsewhere on the site.

**Structure and layout**

- New pages MUST reuse the established page shell: the standard `<head>` stylesheet
  order, `<div id="navbar-placeholder"></div>` for the navbar, the Bootstrap container
  or full-bleed section pattern, and the shared footer.
- The `--gbr-max-width: 1600px` content cap MUST be respected. Contributors MUST NOT
  introduce a competing width convention or a second container pattern.
- Layouts MUST be built with the existing Bootstrap 5 grid and the existing section
  patterns. Contributors MUST NOT introduce a new layout system, spacing scale, or
  border-radius/shadow convention.
- All layouts MUST work at mobile widths — a layout that only works on desktop is
  incomplete.

**Components**

- Before creating any new visual component, contributors MUST look for an existing one
  that already serves the purpose (for example `.subtype-toggle` / `.subtype-pill` for
  segmented choices, `.chat-card` for conversation surfaces, `.gbr-navbar`,
  `.gbr-footer`, `.gbr-accent-rule`) and reuse it.
- A genuinely new component is permitted only when no existing component fits. It MUST
  be built from existing tokens, MUST be added to `assets/css/style.css` so it is
  reusable, and its necessity MUST be stated in the feature's plan.
- Reusable styles MUST live in `assets/css/style.css`. Page-specific `<style>` blocks
  are permitted only for genuinely single-page layout, and MUST NOT redefine, restyle,
  or fork a shared component class.
- The navigation bar MUST be injected via `#navbar-placeholder` and
  `assets/js/custom.js`. Pages MUST NOT hand-copy or locally modify navbar markup.

**Cross-page consistency**

- The same element MUST look the same on every page. A button, form field, card,
  heading, table, or badge MUST NOT have a different appearance on one page than on
  another.
- A change to a shared component changes it everywhere by design. Contributors MUST NOT
  work around that by cloning the component under a new class name for one page.
- When a new page is added, it MUST be visually comparable against at least one
  existing page of the same kind, and any divergence MUST be corrected before the work
  is reported complete.

Rationale: With no component framework and no designer in the loop, consistency
survives only if every change is drawn from what already exists. Each invented colour,
font, or one-off component permanently fragments the site and makes the next change
harder.

### V. Browser-Verified Delivery

This project has no automated test suite. Verification is therefore explicit, manual,
and required before any change is considered done.

- Every changed page MUST be opened in a browser and visually checked at a desktop
  width and a mobile width before the work is reported complete.
- The browser console MUST be free of new errors on every page touched by a change.
- Interactive behaviour (multi-step forms, toggles, conditional fields, maps) MUST be
  exercised by hand, including the path where the user switches an option back.
- Links, form field names, and asset paths introduced by a change MUST be confirmed to
  resolve — no broken hrefs or 404 assets.
- A change MUST NOT be described as verified on the basis of reading the diff alone.

Rationale: Absent a test runner, the browser is the test runner. Making that step
mandatory and specific is what keeps "done" honest.

## Design Token Reference

This registry records the design language already in the codebase. It is the allowed
set under Principle IV. It is descriptive, not aspirational — entries are added here
only when they already exist in the code, and adding an entry is an amendment.

**Brand and action colours**

- `#0083ae` — brand primary: navbar accent bar, primary buttons, active pills.
- `#0a8cb7`, `#046c8e` — brand primary hover / darker states.
- `#043443`, `#033443` — deep brand tone: dark surfaces and dark buttons.
- `#59d27d` — success accent used in existing status treatments.

**Text and neutral colours**

- `#212529` — body text. `#000` — maximum-contrast text where already used.
- `#495057`, `#6c757d`, `#343a40`, `#adb5bd` — secondary and muted text.
- `#fff` — primary surface. `#f8f9fa`, `#f7fafb`, `#f7f7f7`, `#f3f4f5` — light surfaces.
- `#e3e6e8`, `#e6e7e8`, `#dee2e6`, `#d8dde0`, `#d6dadd`, `#cdd6d9`, `#c8cdd1`,
  `#b6bcc0` — borders, rules, and dividers.

**Bootstrap semantic colours** (used as-is, not re-tinted)

- `#dc3545` danger, `#198754` success, `#ffc107` warning, `#0dcaf0` info,
  `#0d6efd` Bootstrap primary.

**Typography**

- Typeface: Poppins, self-hosted via `assets/css/Poppins.css` and `assets/fonts/`.
- Stack: `'Poppins', system-ui, -apple-system, sans-serif`, exposed as `--font-sans`.

**Layout**

- `--gbr-max-width: 1600px`, defined in `:root` in `assets/css/style.css`.
- Bootstrap 5.3 grid, containers, and spacing utilities.

**Icons**

- Bootstrap Icons and Font Awesome, already linked in the standard page `<head>`.

**Shared component classes** (in `assets/css/style.css`)

- `.gbr-navbar`, `.gbr-nav-link`, `.gbr-footer`, `.gbr-accent-rule`
- `.subtype-toggle`, `.subtype-pill`, `.startup-field`, `.startup-filter`,
  `.startup-only`, `.badge-fund`
- `.chat-card`, `.chat-head`, `.chat-body`, `.chat-input`, `.bubble`, `.bubble-me`,
  `.bubble-them`

## Technology and Integration Constraints

- **Stack**: HTML5, CSS3, plain browser JavaScript, Bootstrap 5.3.
- **Assets**: Styles in `assets/css/`, scripts in `assets/js/`, images in
  `assets/img/`, fonts in `assets/fonts/`. Shared markup fragments in
  `assets/includes/` are untracked and MUST NOT be relied on by committed pages.
- **Deployment**: The site deploys as static assets to the existing Cloudflare Worker
  named `gbr`, configured by `wrangler.jsonc`. Changing the Worker name or the assets
  directory would orphan the existing deployment and MUST NOT be done casually.
- **Backend boundary**: The Laravel application is external. This repository holds no
  backend credentials, no `.env` values, and no API secrets. `.env*` and `.dev.vars*`
  remain gitignored.
- **Excluded paths**: `_archive/`, `_template.html`, `register.html.bak`,
  `registration_old.html`, and `assets/includes/` are legacy or scratch. Contributors
  MUST NOT build new features on them, and MUST NOT treat them as the current pattern
  or as a source of design tokens.

## Development Workflow and Quality Gates

- **Specification flow**: Feature work follows the Spec Kit flow —
  `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
  Specs MUST describe frontend behaviour and the backend contract it assumes, never
  backend implementation.
- **Scope gate**: Before implementation, each planned task MUST be checked against
  Principle I. Any task that would create server-side code is out of scope and MUST be
  handed to the backend developer as a documented contract instead.
- **Design gate**: Before implementation, every plan MUST name the existing pages,
  components, and tokens the feature will reuse. A plan that introduces a colour, font,
  type scale, spacing convention, or component not in the Design Token Reference MUST
  either be revised to reuse an existing one, or state the justification explicitly and
  add the new entry to the registry by amendment.
- **Verification gate**: Principle V's browser checks MUST be performed and reported
  before a feature is marked complete, including the cross-page visual comparison
  required by Principle IV. Failures MUST be reported with what was seen, not silently
  omitted.
- **Contract gate**: If a feature changes any submitted field name, adds fields, or
  assumes a new backend behaviour, the corresponding root-level frontend markdown
  document MUST be created or updated in the same change.
- **Commits**: Changes are committed only when the user asks. Commit messages describe
  the user-visible frontend change.

## Governance

- This constitution supersedes ad-hoc practice and prior conventions in this
  repository. Where legacy files conflict with it, this document wins.
- **Amendment procedure**: Amendments are made by updating this file via
  `/speckit-constitution`, with a Sync Impact Report recorded at the top. Any principle
  change that would permit backend code, a build step, a new frontend framework, or a
  new design token requires explicit approval from the repository owner before it takes
  effect.
- **Versioning policy**: Semantic versioning applies to this document.
  MAJOR — a principle is removed or redefined in a backward-incompatible way.
  MINOR — a principle or section is added, or guidance is materially expanded.
  PATCH — clarifications, wording, and non-semantic refinements.
- **Compliance review**: Every plan produced by `/speckit-plan` MUST include a
  constitution check against Principles I–V. Every implementation report MUST state
  how the design gate and the verification gate were satisfied. Complexity that departs
  from Principle III, or design that departs from Principle IV, MUST be justified in
  writing or removed.
- **Runtime guidance**: Agent and contributor working guidance lives in `CLAUDE.md`
  when present; this constitution governs, and `CLAUDE.md` MUST NOT contradict it.

**Version**: 1.1.0 | **Ratified**: 2026-08-24 | **Last Amended**: 2026-08-24
