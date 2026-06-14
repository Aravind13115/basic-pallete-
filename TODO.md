# TODO — Minimalist 3-Color Mobile Dashboard (Dark Mode)

## Step 1 — Convert dashboard structure to phone-first layout
- [ ] Refactor `dashboard.html` into a mobile dashboard: header + KPI cards + single chart + activity list + bottom nav.

## Step 2 — Enforce strict palette variables
- [ ] Update `styles.css` variables to: charcoal background, slate cards, electric lime accents only.
- [ ] Remove/neutralize all other accent colors (cyan/hot) and glass/glow effects.

## Step 3 — Update components to flat vector style
- [ ] Replace icon characters with inline SVG icons (vector-like).
- [ ] Update chart SVG to lime-only strokes/fills.

## Step 4 — Scope styles safely
- [ ] Scope dashboard styles under a wrapper class to avoid breaking login/other pages.

## Step 5 — Validate
- [ ] Open `dashboard.html` in browser and verify:
  - [ ] only 3 colors appear in UI
  - [ ] sharp borders
  - [ ] buttons and chart use lime accent
  - [ ] no backdrop-filter/glass blur

