# Dynamic Island — Implementation Checklist

- [ ] Add Dynamic Island markup into the dashboard header (or as a standalone component if no header exists).
- [ ] Create 3 visual states using CSS classes: `is-idle`, `is-loading`, `is-expanded`.
- [ ] Ensure animation uses `transform`, `opacity`, `scale` only (no width/height transitions).
- [ ] Add JS event handlers: click to expand, click outside / Escape to collapse, simulated loading state.
- [ ] Sync colors with existing CSS variables (`--bg-color` / `--text-color` or current theme vars).
- [ ] Add keyboard & a11y attributes (role, aria-expanded, focus handling).
- [ ] Wire `script.js` into `dashboard.html` and (optionally) `index.html` if needed.
- [ ] Verify smoothness: consider `prefers-reduced-motion`.

