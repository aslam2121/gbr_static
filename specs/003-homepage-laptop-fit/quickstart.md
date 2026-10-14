# Quickstart: Verifying the Homepage Fits One Laptop Screen

**Feature**: [spec.md](spec.md) · **Contract**: [contracts/home-layout-contract.md](contracts/home-layout-contract.md)

This project has no test suite (Principle V), so this guide is the test. Run Phase A **before** any
change, to record the baseline, and Phases B–E after.

## Setup

From the repository root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/index.html` in Chrome or Edge. Open DevTools, turn on the device toolbar
(Ctrl+Shift+M), choose **Responsive**, and type each width and height below into its boxes.

**Measurement snippet**: paste into the DevTools console after each reload:

```js
(() => {
  const q = s => document.querySelector(s);
  const shown = s => { const e = q(s); return !!(e && e.offsetParent); };
  const h = s => { const e = q(s); return e && e.offsetParent ? Math.round(e.getBoundingClientRect().height) : 0; };
  const main = q('.home-main') || document.querySelectorAll('body section')[1];
  const input = q('#homeChatContent .chat-input');
  // Content clipped at either edge of a centred prompt (scrollHeight alone misses the top edge)
  const clip = s => { const e = q(s); if (!e || !e.offsetParent || !e.children.length) return 0;
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    const top = r.top + parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop);
    const bottom = r.bottom - parseFloat(cs.borderBottomWidth) - parseFloat(cs.paddingBottom);
    const first = e.firstElementChild.getBoundingClientRect(), last = e.lastElementChild.getBoundingClientRect();
    return Math.max(0, Math.ceil(top - first.top), Math.ceil(last.bottom - bottom)); };
  return {
    viewport: innerWidth + 'x' + innerHeight,
    fits: Math.round(main.getBoundingClientRect().bottom) <= innerHeight,
    mainBottom: Math.round(main.getBoundingClientRect().bottom),
    pageHeight: document.documentElement.scrollHeight,
    sidewaysScroll: document.documentElement.scrollWidth > innerWidth,
    guestPromptsShown: shown('#mapLocked') || shown('#homeChatLocked'),
    memberViewShown: shown('#mapContent') || shown('#homeChatContent'),
    mapPromptOverflow: clip('#mapLocked'),
    lockedChatOverflow: clip('#homeChatLocked'),
    chatInputOnScreen: input && input.offsetParent ? input.getBoundingClientRect().bottom <= innerHeight : null,
    heights: { strip: h('header') - h('header nav') - 8, tiles: h('.home-hero') || h('body section'), photo: h('.home-photo') || h('img[src*=sidebar]') },
  };
})()
```

**Viewing the member state**: the page shows the member view only when the backend sets
`window.GBR_USER = { loggedIn: true }` before the page scripts run. To try it without the backend
and without editing the repository, use a DevTools local override:

1. Open **Sources › Overrides** and choose an empty folder outside the repository.
2. Open `index.html` in Sources and, right after `<body>`, add
   `<script>window.GBR_USER = { loggedIn: true };</script>`.
3. Save and reload.

Turn the override off to return to the guest view.

## Phase A — Baseline (before any change)

At **390×664** and **768×900**, guest view, run the snippet and write down `pageHeight` and
`heights`. Expected today: 390×664 → page 2182px; 768×900 → page 2371px. These are the figures
SC-005 compares against.

## Phase B — Guest view fits (User Story 1)

At each viewport, guest view, run the snippet:

| Viewport | `fits` | `pageHeight` | `lockedChatOverflow` | Look at the photo banner |
|---|---|---|---|---|
| 1366×610 | true | ≤ 684 | 0 | Full slogan; no logo; no line cut |
| 1366×641 | true | ≤ 715 | 0 | Full slogan; no line cut |
| 1280×690 | true | ≤ 764 | 0 | Full slogan; no line cut |
| 1536×737 | true | ≤ 811 | 0 | Full slogan; no line cut |
| 1440×789 | true | ≤ 863 | 0 | Logo **and** full slogan |
| 1920×953 | true | ≤ 1027 | 0 | Logo **and** full slogan |
| 1024×660 | true | ≤ 734 | 0 | Full slogan; no line cut |

At every size also confirm by eye: `sidewaysScroll` is false; the strip shows "Welcome to GBR" beside
both fields and both buttons; all three tiles show their heading, text, and the "Yes I want to Join"
button; the map prompt shows its lock, heading, text, and both buttons; the chat prompt shows its
icon, heading, text, and both buttons. Scrolling down reveals only the footer.

**Pass**: every row matches, and nothing is clipped.

## Phase C — Member view fits (User Story 2)

Turn on the local override. At 1366×610, 1536×737, and 1920×953, run the snippet:

- `guestPromptsShown` is **false** and `memberViewShown` is **true** (the defect is fixed).
- `fits` is true and `chatInputOnScreen` is true.
- Scroll inside the chat box: the messages move, the page does not, and the message field stays put.
- The map fills its panel with no grey band. Drag the window narrower and wider: the map redraws to
  fill.

**Pass**: all of the above at all three sizes.

## Phase D — Other devices unchanged (User Story 3)

1. At **390×664** and **768×900**, guest view: `pageHeight` and `heights` match Phase A within 2px.
   Compare against a screenshot from Phase A, too: the tiles stack, the map box is 320px / 420px tall,
   and the chat prompt keeps its padding.
2. At **1366×500** (standing in for browser zoom or a short window): `fits` is false, the map area is
   288px tall, the page scrolls, and nothing overlaps the footer.
3. At **1366×768** with browser zoom set to **125%**: the same as step 2 — content readable, page
   scrolls, nothing overlapping.

**Pass**: all three.

## Phase E — Invariants (contract §5)

From the repository root:

```bash
# 1–2. No form field names touched
git diff -U0 -- index.html | grep -E '^[-+].*\bname="' | grep -v '^[-+][-+]'        # expect: no output

# 3. Link and button destinations unchanged
diff <(git show HEAD:index.html | grep -oE 'href="[^"]*"' | sort) \
     <(grep -oE 'href="[^"]*"' index.html | sort)                                   # expect: no output

# 4a. No colour value that was not already in these two files
comm -13 <( (git show HEAD:index.html; git show HEAD:assets/css/style.css) | grep -oiE '#[0-9a-f]{3,8}\b' | tr A-F a-f | sort -u ) \
         <( cat index.html assets/css/style.css | grep -oiE '#[0-9a-f]{3,8}\b' | tr A-F a-f | sort -u )   # expect: no output

# 4b. Font sizes added by this feature
git diff -U0 -- index.html assets/css/style.css | grep -E '^\+' | grep -oE 'font-size: *[^;"]*'      # expect: only 1.75rem

# 6. New hooks appear on the homepage only
grep -l -E 'home-screen|home-hero|home-main|home-photo' *.html                      # expect: index.html
```

Check 4a compares the colour sets before and after rather than reading the diff, because moving an
inline size off a line also re-lists the colours that stay on it. Check 4b's only acceptable output
is `font-size: 1.75rem`.

Finally, open `about.html`, `company.html`, and `register.html` and confirm the navbar and footer
look exactly as before, and that the browser console shows **no new errors** on any page opened in
this guide.

## Done when

Phases B–E all pass. Record the results — including any failure, with what was seen — in the
implementation report, as Principle V requires.
