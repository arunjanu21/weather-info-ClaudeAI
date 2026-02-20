# Research: Personal Dashboard

**Branch**: `001-personal-dashboard` | **Date**: 2026-02-16
**Phase**: 0 — Outline & Research

---

## Decision 1: Angular + Vite Setup

**Decision**: Use `@analogjs/vite-plugin-angular` as the Vite plugin for Angular, scaffolded
via `npm create analog@latest` or manually configured. Standalone Angular components (no
NgModule). Angular Signals for reactive state.

**Rationale**:
- `@analogjs/vite-plugin-angular` is the only stable, maintained Vite plugin for Angular
  in 2025. Angular's own CLI uses esbuild (not Vite) natively; the only path to a true
  Vite dev server with Angular is this plugin.
- Standalone components (introduced in Angular 15, default in Angular 17) eliminate
  NgModule boilerplate, keeping component files concise.
- Angular Signals (stable since Angular 17) replace RxJS `BehaviorSubject` for local
  reactive state without adding `rxjs` usage overhead — aligns with "minimal libraries."
- `inject()` function (Angular 14+) allows service injection without constructor
  boilerplate.

**Alternatives considered**:
- Angular CLI (`ng new`) with esbuild builder: Fast build, but not true Vite. Rejected
  because the user explicitly requested Vite.
- Custom Vite + `@angular/compiler` config without AnalogJS: Technically possible but
  requires maintaining a fragile Vite plugin config. Rejected for complexity.
- Nx with Vite executor: Overkill for a single-app project. Rejected.

**Core packages** (final list):
```
# Runtime dependencies
@angular/core ^17
@angular/common ^17
@angular/platform-browser ^17
@angular/platform-browser-dynamic ^17
rxjs ^7.8              (Angular runtime requirement — not used directly in app code)
tslib ^2.6
zone.js ^0.14          (Angular change detection runtime)

# Dev dependencies
@angular/compiler ^17
@analogjs/vite-plugin-angular ^1
vite ^5
typescript ^5.4
vitest ^1              (test runner — native Vite integration)
```

**Note on zone.js**: Angular 17 supports experimental zoneless change detection via
`provideExperimentalZonelessChangeDetection()`. For the prototype this is acceptable
to adopt — it removes the zone.js runtime dep and pairs cleanly with Signals. Decision
deferred to implementation (does not affect data model or contracts).

**Minimal `vite.config.ts`**:
```typescript
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

---

## Decision 2: Weather Data Source

**Decision**: **Open-Meteo** (https://open-meteo.com) — free, no API key, no rate limit
(fair use), full CORS support.

**Rationale**:
- Open-Meteo requires **zero API key setup** — perfectly aligned with Principle I
  (Prototype-First: runnable immediately) and Principle II (Simplicity: no secret
  management).
- Two-step pattern: geocode city name → fetch weather by lat/lon.
- Returns WMO weather codes which map cleanly to icon/description strings via a small
  lookup table (20 entries — inlined in the service, no library).
- Aligns with constitution: no external dependency beyond the fetch call itself.

**Endpoints used**:

| Purpose | URL |
|---------|-----|
| Geocode city | `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en` |
| Current weather (lat/lon) | `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&temperature_unit=celsius&wind_speed_unit=kmh` |

**Sample response** (current weather):
```json
{
  "current": {
    "temperature_2m": 28.5,
    "relative_humidity_2m": 72,
    "apparent_temperature": 31.2,
    "weather_code": 3
  },
  "current_units": {
    "temperature_2m": "°C",
    "relative_humidity_2m": "%"
  }
}
```

**Fahrenheit conversion**: `F = (C × 9/5) + 32` — inline in component, no library.

**WMO code → description mapping** (subset, inline constant in service):
```
0  → Clear sky ☀️
1  → Mainly clear 🌤️
2  → Partly cloudy ⛅
3  → Overcast ☁️
45 → Foggy 🌫️
61 → Light rain 🌦️
71 → Light snow 🌨️
95 → Thunderstorm ⛈️
```
Full 20-entry table included in `weather.service.ts`.

**Geolocation**: Browser `navigator.geolocation.getCurrentPosition()` — no library.

**Alternatives considered**:
- OpenWeatherMap: Requires API key (delays prototype start by up to 2 hours for
  activation). Rejected for prototype stage.
- WeatherAPI.com: API key required. Rejected for same reason.
- wttr.in: Simple but returns text format; harder to parse for structured display.
  Rejected.

---

## Decision 3: Daily Quote Source

**Decision**: **Local hardcoded quote array** (TypeScript constant in `quote.service.ts`),
selected by `dayOfYear % quotes.length`. No external API call.

**Rationale**:
- All public free quote APIs have browser CORS issues or unreliable uptime (ZenQuotes
  blocks browser-direct calls; quotable.io is deprecated; api-ninjas requires a key).
- A local array of 50–100 curated quotes:
  - Guarantees same quote all day (deterministic by date)
  - Works offline from first load
  - Zero network dependency
  - Zero rate limit
  - Eliminates an entire failure mode
- Perfectly aligned with Principle I (prototype runs without network) and Principle II
  (simplest implementation that satisfies FR-006).
- If a real API is desired in a hardening phase, the `QuoteService` interface is the
  only file that needs to change.

**Algorithm**:
```typescript
const dayOfYear = getDayOfYear(new Date());   // 1–366
const quote = QUOTES[dayOfYear % QUOTES.length];
```

**Cache key in localStorage**: `quote_${yyyy-MM-dd}` — stores `{ q, a }` JSON.
On load: check localStorage; if key matches today → use cache; else compute + store.

**Alternatives considered**:
- **ZenQuotes `/api/today`**: Free, no auth, same quote per calendar day, reportedly
  CORS-friendly in recent versions. CORS reliability has been inconsistent historically.
  **Recommended as a hardening-phase upgrade** — simply swap `QuoteService.getTodaysQuote()`
  with a `fetch` call; the interface and cache contract remain unchanged.
- quotable.io: Was popular but deprecated/unmaintained since 2024. Rejected.
- api.adviceslip.com: Returns advice, not inspirational quotes. Rejected.
- api-ninjas quotes: 50 calls/month on free tier — unusable. Rejected.

---

## Decision 4: CSS Animations Strategy

**Decision**: Pure CSS `@keyframes` and `transition` properties — no `@angular/animations`
package.

**Rationale**:
- `@angular/animations` adds ~30 KB to the bundle and requires `BrowserAnimationsModule`
  import. Rejected for "minimal libraries" mandate.
- CSS `@keyframes` for entrance animations (`fade-slide-up`), CSS `transition` for hover
  effects — zero runtime overhead.
- `@media (prefers-reduced-motion: reduce)` wraps all animation declarations — native
  CSS, no JS logic needed.

**Animation plan**:
```css
@keyframes fade-slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.widget { animation: fade-slide-up 400ms ease-out both; }
.widget:nth-child(2) { animation-delay: 100ms; }
.widget:nth-child(3) { animation-delay: 200ms; }

.widget:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.15); }

@media (prefers-reduced-motion: reduce) {
  .widget, .widget:hover { animation: none; transition: none; transform: none; }
}
```

**Skeleton shimmer** (FR-012):
```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 4px;
}
```

---

## Decision 5: Responsive Layout Strategy

**Decision**: CSS Grid with auto-fit columns — no CSS framework.

**Layout**:
```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  min-height: 100vh;
}
```

- Mobile (320 px): Single column stack
- Tablet (768 px): 2-column grid
- Desktop (1200 px+): 3-column grid (time + weather + quote side by side)

No media query breakpoints needed — `auto-fit minmax` handles all widths.

---

## Summary: Final Technology Decisions

| Concern | Decision | Rationale |
|---------|----------|-----------|
| Build tool | Vite 5 + @analogjs/vite-plugin-angular | Only stable Vite+Angular path |
| Framework | Angular 17+ standalone + Signals | Minimal boilerplate, reactive, no extras |
| Weather API | Open-Meteo (free, no key) | Zero setup, CORS-friendly, prototype-ready |
| Quote source | Local array keyed by day-of-year | Offline, deterministic, CORS-proof |
| Animations | Vanilla CSS @keyframes | No @angular/animations, zero overhead |
| Layout | CSS Grid auto-fit | Responsive without breakpoints or framework |
| State | Angular Signals | Built-in, no RxJS/NgRx needed |
| Persistence | Browser localStorage | Native API, no library |
| Testing | Vitest | Native Vite integration |
