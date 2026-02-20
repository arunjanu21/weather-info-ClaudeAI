# Data Model: Personal Dashboard

**Branch**: `001-personal-dashboard` | **Date**: 2026-02-16

All data is client-side only. No database. Persistent state lives in browser
`localStorage`. Runtime state lives in Angular Signals within components/services.

---

## Entities

### 1. TimeState

Held entirely in `TimeWidgetComponent` as Angular Signals. Never persisted.

| Field | Type | Description |
|-------|------|-------------|
| `hours` | `signal<string>` | Current hour, zero-padded (e.g., `"09"`) |
| `minutes` | `signal<string>` | Current minute, zero-padded (e.g., `"05"`) |
| `seconds` | `signal<string>` | Current second, zero-padded (e.g., `"03"`) |
| `dayOfWeek` | `signal<string>` | e.g., `"Monday"` |
| `dateLabel` | `signal<string>` | e.g., `"February 16, 2026"` |

**Update rule**: `setInterval` fires every 1000 ms; all signals updated from
`new Date()` each tick.

**Validation**: Values derived from `Date` object — always valid by construction.

---

### 2. WeatherData

Returned by the Open-Meteo API and held in `WeatherWidgetComponent` as Signals.
Cached to `localStorage` with a 60-minute TTL.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `locationName` | `string` | Geocoding response or user input | Display name of city |
| `tempC` | `number` | `current.temperature_2m` | Temperature in Celsius |
| `tempF` | `number` | Derived: `(C × 9/5) + 32`, rounded | Temperature in Fahrenheit |
| `humidity` | `number` | `current.relative_humidity_2m` | Relative humidity (%) |
| `weatherCode` | `number` | `current.weather_code` | WMO weather code |
| `description` | `string` | Derived from `weatherCode` lookup | e.g., `"Partly Cloudy"` |
| `icon` | `string` | Derived from `weatherCode` lookup | Emoji or icon class |
| `fetchedAt` | `number` | `Date.now()` at fetch time | Unix ms timestamp for TTL check |

**Validation rules**:
- `tempC` MUST be a finite number between −90 and 60 (sanity check).
- `humidity` MUST be 0–100.
- `weatherCode` MUST map to a known WMO code; unknown codes fall back to
  `"Unknown conditions"`.

**State transitions** (held in `WeatherWidgetComponent`):

```
IDLE ──(mount)──► LOCATING ──(location granted)──► LOADING ──(success)──► LOADED
                      │                                │
                      │ (permission denied)            │ (network error)
                      ▼                                ▼
                  CITY_INPUT ──(city submitted)──► LOADING     ERROR
                                                       │
                                                       │ (success)
                                                       ▼
                                                    LOADED
```

**localStorage cache key**: `weather_cache`
**Cached shape**: `{ data: WeatherData, savedAt: number }`
**TTL**: 3600 seconds (60 minutes). If `Date.now() - savedAt > 3 600 000`, cache is stale.

---

### 3. Location

Persisted to `localStorage`. Loaded on mount to skip the location-prompt flow on
return visits.

| Field | Type | Description |
|-------|------|-------------|
| `type` | `'geo' \| 'city'` | How the location was determined |
| `lat` | `number \| null` | Latitude (set when `type === 'geo'`) |
| `lon` | `number \| null` | Longitude (set when `type === 'geo'`) |
| `cityName` | `string` | Display name — always populated |

**localStorage key**: `last_location`
**Serialised as**: JSON string.

**Validation rules**:
- If `type === 'geo'`: `lat` MUST be −90–90, `lon` MUST be −180–180.
- If `type === 'city'`: `cityName` MUST be a non-empty string (trimmed).
- On parse failure (corrupted JSON), key is deleted and location detection restarts.

---

### 4. QuoteData

Computed once per calendar day and cached in `localStorage`.

| Field | Type | Description |
|-------|------|-------------|
| `q` | `string` | Full quote text (max 300 chars displayed; truncated if longer) |
| `a` | `string` | Author name |
| `date` | `string` | ISO date string `YYYY-MM-DD` when this quote was cached |

**localStorage key**: `quote_cache`
**Cached shape**: `{ q: string, a: string, date: string }`
**Expiry rule**: Compare cached `date` to `new Date().toISOString().slice(0, 10)`.
If different → generate new quote for today and overwrite.

**Selection algorithm**:
```typescript
const dayOfYear = getDayOfYear(new Date()); // 1–366
const quote = QUOTES[dayOfYear % QUOTES.length];
```

**Fallback** (if `QUOTES` array is empty or index out of bounds):
```typescript
{ q: "Start where you are. Use what you have. Do what you can.", a: "Arthur Ashe" }
```

---

### 5. WidgetState (shared pattern, not a stored entity)

Each widget component holds its own UI state as a local Signal:

| Value | Meaning |
|-------|---------|
| `'idle'` | Not yet started |
| `'loading'` | Fetching / computing data |
| `'loaded'` | Data ready to display |
| `'error'` | Fetch or parse failed |

`TimeWidgetComponent` is always `'loaded'` immediately (no async). `WeatherWidgetComponent`
additionally has `'locating'` and `'city_input'` states. `QuoteWidgetComponent` transitions
`loading → loaded | error`.

---

## localStorage Key Summary

| Key | Owner | TTL | Notes |
|-----|-------|-----|-------|
| `last_location` | `WeatherWidgetComponent` | Permanent (until user changes) | JSON `Location` object |
| `weather_cache` | `WeatherService` | 60 minutes | JSON `{ data, savedAt }` |
| `quote_cache` | `QuoteService` | Until next calendar day | JSON `{ q, a, date }` |

---

## WMO Weather Code Lookup Table

Inline TypeScript constant — not persisted; no library.

| WMO Code | Description | Icon |
|----------|-------------|------|
| 0 | Clear sky | ☀️ |
| 1 | Mainly clear | 🌤️ |
| 2 | Partly cloudy | ⛅ |
| 3 | Overcast | ☁️ |
| 45, 48 | Fog | 🌫️ |
| 51, 53, 55 | Drizzle | 🌦️ |
| 61, 63, 65 | Rain | 🌧️ |
| 71, 73, 75 | Snow | 🌨️ |
| 77 | Snow grains | 🌨️ |
| 80, 81, 82 | Rain showers | 🌦️ |
| 85, 86 | Snow showers | 🌨️ |
| 95 | Thunderstorm | ⛈️ |
| 96, 99 | Thunderstorm with hail | ⛈️ |
| (unknown) | Unknown conditions | 🌡️ |
