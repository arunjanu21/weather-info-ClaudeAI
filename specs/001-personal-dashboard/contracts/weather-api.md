# Contract: Weather Data (Open-Meteo)

**Service**: Open-Meteo (https://open-meteo.com)
**Auth**: None required
**CORS**: Fully supported from browser
**Rate limit**: Fair use (no hard limit; designed for browser direct calls)

---

## Step 1: Geocode City Name → Coordinates

Used when the user enters a city name manually OR to resolve a city name to lat/lon
for the initial display name.

**Request**:
```
GET https://geocoding-api.open-meteo.com/v1/search
  ?name={cityName}
  &count=1
  &language=en
  &format=json
```

**Success Response** (`200 OK`):
```json
{
  "results": [
    {
      "id": 1264527,
      "name": "Chennai",
      "latitude": 13.08784,
      "longitude": 80.27847,
      "country": "India",
      "country_code": "IN",
      "admin1": "Tamil Nadu"
    }
  ]
}
```

**No results** (`200 OK`, empty array):
```json
{ "results": [] }
```
→ Show "City not found — please try again" inline in the weather widget.

**Error handling**:
- Network failure → set widget state to `'error'`, show user-friendly message
- `results` is empty → show inline validation message in city input field
- `results[0]` missing expected fields → treat as error

---

## Step 2: Fetch Current Weather by Coordinates

Used after geocoding OR directly after browser geolocation grants lat/lon.

**Request**:
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code
  &temperature_unit=celsius
  &wind_speed_unit=kmh
  &timezone=auto
```

**Success Response** (`200 OK`):
```json
{
  "latitude": 13.09,
  "longitude": 80.27,
  "timezone": "Asia/Kolkata",
  "current_units": {
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2026-02-16T14:30",
    "temperature_2m": 29.4,
    "relative_humidity_2m": 68,
    "apparent_temperature": 32.1,
    "weather_code": 2
  }
}
```

**Fields consumed by `WeatherService`**:

| API Field | Maps to `WeatherData` field | Transform |
|-----------|---------------------------|-----------|
| `current.temperature_2m` | `tempC` | None |
| `current.temperature_2m` | `tempF` | `(C × 9/5) + 32`, `Math.round` |
| `current.relative_humidity_2m` | `humidity` | None |
| `current.weather_code` | `weatherCode` | None |
| `current.weather_code` | `description` | WMO lookup table |
| `current.weather_code` | `icon` | WMO lookup table |

**Error handling**:
- Non-200 response → set widget state to `'error'`
- Missing `current` object → treat as error
- Network failure → check localStorage cache; if stale cache exists, show with
  "(Cached)" label; otherwise show error state

---

## Geolocation Contract (Browser Native API)

No HTTP call — uses `navigator.geolocation`.

**Request**:
```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // proceed to Step 2 above
  },
  (error) => {
    // show city name input
  },
  { timeout: 10000, maximumAge: 300000 }
);
```

**Permission denied** (`error.code === 1`) → Transition widget to `'city_input'` state.
**Position unavailable** (`error.code === 2`) → Same as denied.
**Timeout** (`error.code === 3`) → Same as denied.

---

## localStorage Cache Contract

```typescript
interface WeatherCache {
  data: WeatherData;
  savedAt: number;  // Date.now() in ms
}

// Key: 'weather_cache'
// TTL: 3_600_000 ms (60 minutes)
// Invalidation: if Date.now() - savedAt > 3_600_000, re-fetch
```
