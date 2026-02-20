# Implementation Plan: Personal Dashboard

**Branch**: `001-personal-dashboard` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-personal-dashboard/spec.md`

## Summary

Build a single-page personal dashboard using Modern Angular (v17+) with Vite as the build
tool. The dashboard displays three independently deliverable widgets — a real-time clock,
current weather conditions, and a daily quote — with a responsive CSS grid layout and
smooth CSS animations. No backend is required; all data is fetched client-side using native
browser APIs and two external public APIs. Browser `localStorage` handles quote caching and
location persistence.

## Technical Context

**Language/Version**: TypeScript 5.4 (bundled with Angular 17+)
**Primary Dependencies**: Angular 17+ (standalone components, Signals), Vite 5,
  @analogjs/vite-plugin-angular — no UI library, no state management library, no CSS
  framework. Vanilla CSS throughout.
**Storage**: Browser `localStorage` — quote cached by date key; last-used location
  persisted as city name or lat/lon string.
**Testing**: Vitest (native Vite test runner) for smoke tests
**Target Platform**: Modern evergreen browsers — Chrome 114+, Firefox 115+, Safari 16.4+,
  Edge 114+. No IE or legacy support.
**Project Type**: Single-page web application (client-side only, no backend)
**Performance Goals**: Time widget visible within 1 s of page load; weather data rendered
  within 5 s; quote rendered within 3 s; all animations complete within 500 ms.
**Constraints**: Minimal dependency footprint (Angular + Vite plugin only); vanilla CSS
  for all layout and animations; `prefers-reduced-motion` media query respected; no CSS
  framework; responsive 320–2560 px.
**Scale/Scope**: Single user, ~4 standalone Angular components, 2 services, no routing,
  no authentication.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate Question | Status | Notes |
|-----------|--------------|--------|-------|
| I. Prototype-First | Can P1 (time widget) run with zero network calls? | ✅ PASS | `TimeWidgetComponent` uses only `setInterval` — no external deps |
| I. Prototype-First | Is initial impl completable in one session? | ✅ PASS | Time widget is < 50 lines of TS + minimal HTML/CSS |
| II. Simplicity | Are we introducing architectural patterns before validation? | ✅ PASS | No repositories, no event buses, no NgRx |
| II. Simplicity | Does every service exist at ≥3 call sites? | ✅ PASS | WeatherService and QuoteService each used by exactly one component — acceptable because services encapsulate async fetch logic |
| III. Incremental Delivery | Does each user story produce an independently demo-able artefact? | ✅ PASS | US1 → clock renders; US2 → weather card renders; US3 → quote card renders; US4 → layout polished |
| IV. Smoke Testing Only | Is test scope limited to happy path + one critical failure per story? | ✅ PASS | Plan targets 1 Vitest file per story (4 total) |
| V. Timebox & Validate | Are exit criteria defined for each story? | ✅ PASS | Each story has Independent Test in spec |

**Result: ALL GATES PASS. Proceeding to Phase 0.**

*Post-Phase 1 re-check: No additional patterns introduced. All gates remain green.*

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── weather-api.md
│   └── quote-data.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.component.ts          # Root component — dashboard grid layout
│   ├── app.component.html
│   ├── app.component.css
│   ├── widgets/
│   │   ├── time-widget/
│   │   │   ├── time-widget.component.ts
│   │   │   ├── time-widget.component.html
│   │   │   └── time-widget.component.css
│   │   ├── weather-widget/
│   │   │   ├── weather-widget.component.ts
│   │   │   ├── weather-widget.component.html
│   │   │   └── weather-widget.component.css
│   │   └── quote-widget/
│   │       ├── quote-widget.component.ts
│   │       ├── quote-widget.component.html
│   │       └── quote-widget.component.css
│   └── services/
│       ├── weather.service.ts    # Fetch + cache weather from Open-Meteo
│       └── quote.service.ts      # Select + cache daily quote from local data
├── styles.css                    # Global reset, CSS custom properties, skeleton animation
├── main.ts                       # bootstrapApplication entry
└── index.html

tests/
├── time-widget.smoke.spec.ts     # US1 smoke test
├── weather-widget.smoke.spec.ts  # US2 smoke test
├── quote-widget.smoke.spec.ts    # US3 smoke test
└── layout.smoke.spec.ts          # US4 smoke test

vite.config.ts
vitest.config.ts
package.json
tsconfig.json
```

**Structure Decision**: Single project layout. No backend folder — this is a pure
client-side SPA. Angular standalone components (no NgModule) for minimal boilerplate.
Services in a flat `services/` directory (2 services only); no feature-module splitting.

## Complexity Tracking

> No constitution violations requiring justification.

*(Table left blank — all gate checks passed.)*
