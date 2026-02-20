# Quickstart: Personal Dashboard

**Branch**: `001-personal-dashboard` | **Date**: 2026-02-16

This guide validates that the prototype is working correctly. Run through each step
in order after each user story is completed.

---

## Prerequisites

- Node.js 20+ installed
- Git on branch `001-personal-dashboard`
- Working directory: repo root (`weather-info/`)

---

## Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# → Vite starts on http://localhost:4200 (or next available port)
# → Open the URL in Chrome/Firefox

# 3. Run smoke tests
npm run test
```

---

## Validation Checkpoints

### Checkpoint 1 — P1 MVP: Time Widget (US1)

After completing User Story 1 implementation:

1. Open `http://localhost:4200` in browser.
2. **Expected**: Dashboard loads; a widget card is visible showing:
   - Current time in `HH:MM:SS` format, seconds ticking live.
   - Current date, e.g., `Sunday, February 16, 2026`.
3. **Wait 5 seconds** — confirm seconds are incrementing.
4. **Resize browser to 375 px wide** (DevTools → device toolbar) — confirm text is
   readable, no overflow.
5. **Check animation**: Reload page — confirm the time widget fades/slides in.
6. **Verify smoke test**:
   ```bash
   npm run test -- --reporter=verbose time-widget
   # → Should see: ✓ displays current time and date
   ```

**Stop here. Demo the ticking clock to a stakeholder before proceeding.**

---

### Checkpoint 2 — Weather Widget (US2)

After completing User Story 2 implementation:

1. Open `http://localhost:4200` in browser.
2. **Geolocation flow**:
   - Browser asks for location permission → click **Allow**.
   - **Expected within 5 s**: Weather card shows temperature (°C / °F), description,
     humidity, and a weather icon.
3. **City input flow**:
   - Open the page in incognito (or reset location permission).
   - Click **Block** on the location prompt.
   - **Expected**: A text input appears prompting for a city name.
   - Type `London` and press Enter.
   - **Expected within 3 s**: Weather card updates to London weather.
4. **Error flow**:
   - Type `XXXXNOTACITY` and press Enter.
   - **Expected**: Inline message `"City not found — please try again"`.
   - Time widget continues ticking (no cascade failure).
5. **Return visit test**:
   - Close and reopen the tab.
   - **Expected**: Weather loads immediately for the last city — no prompt shown.
6. **Verify smoke test**:
   ```bash
   npm run test -- --reporter=verbose weather-widget
   # → Should see:
   #   ✓ shows skeleton while loading
   #   ✓ shows error state on network failure
   ```

---

### Checkpoint 3 — Quote Widget (US3)

After completing User Story 3 implementation:

1. Open `http://localhost:4200` in browser.
2. **Expected**: Quote card shows a quote text and author name.
3. **Same-day consistency test**:
   - Open a second tab with the same URL.
   - **Expected**: Identical quote in both tabs.
4. **Day-change simulation**:
   - In DevTools Console:
     ```javascript
     localStorage.setItem('quote_cache', JSON.stringify({q:'test',a:'test',date:'2000-01-01'}));
     location.reload();
     ```
   - **Expected**: A new quote is shown (different from `test`).
5. **Verify smoke test**:
   ```bash
   npm run test -- --reporter=verbose quote-widget
   # → Should see:
   #   ✓ returns same quote within the same day
   #   ✓ shows fallback when quote is unavailable
   ```

---

### Checkpoint 4 — Responsive Layout & Animations (US4)

After completing User Story 4 implementation:

1. **Desktop** (1440 px wide):
   - All three widgets visible side-by-side (or in a multi-column grid).
   - Hover over each widget → subtle lift/glow effect visible.
2. **Tablet** (768 px wide):
   - Layout reflows to 2 columns without overflow.
3. **Mobile** (375 px wide):
   - Layout reflows to single column; all text readable without zooming.
4. **Reduced motion**:
   - DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.
   - Reload — **Expected**: No entrance animations or hover transitions.
5. **Run all smoke tests**:
   ```bash
   npm run test
   # → All 4 smoke test files passing
   ```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Vite fails to compile with Angular errors | `@analogjs/vite-plugin-angular` not installed | `npm install` |
| Weather never loads | No geolocation permission + no city entered | Check browser permission; enter city manually |
| Different quote shown on reload | `localStorage` was cleared | Expected — a new day's quote will be selected |
| Animations not visible | `prefers-reduced-motion` may be set | Check OS accessibility settings |
| Skeleton never disappears | Network call may be blocked | Check browser console for CORS or network errors |
