import { Injectable } from '@angular/core';

// --- Interfaces ---

export interface WeatherData {
  locationName: string;
  tempC: number;
  tempF: number;
  humidity: number;
  weatherCode: number;
  description: string;
  icon: string;
  fetchedAt: number;
}

interface WeatherCache {
  data: WeatherData;
  savedAt: number;
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

// --- WMO Weather Code Lookup Table (20 entries) ---

const WMO_CODES: Record<number, { description: string; icon: string }> = {
  0:  { description: 'Clear sky',            icon: '☀️' },
  1:  { description: 'Mainly clear',         icon: '🌤️' },
  2:  { description: 'Partly cloudy',        icon: '⛅' },
  3:  { description: 'Overcast',             icon: '☁️' },
  45: { description: 'Fog',                  icon: '🌫️' },
  48: { description: 'Icy fog',              icon: '🌫️' },
  51: { description: 'Light drizzle',        icon: '🌦️' },
  53: { description: 'Drizzle',              icon: '🌦️' },
  55: { description: 'Heavy drizzle',        icon: '🌦️' },
  61: { description: 'Light rain',           icon: '🌧️' },
  63: { description: 'Rain',                 icon: '🌧️' },
  65: { description: 'Heavy rain',           icon: '🌧️' },
  71: { description: 'Light snow',           icon: '🌨️' },
  73: { description: 'Snow',                 icon: '🌨️' },
  75: { description: 'Heavy snow',           icon: '🌨️' },
  77: { description: 'Snow grains',          icon: '🌨️' },
  80: { description: 'Rain showers',         icon: '🌦️' },
  81: { description: 'Moderate rain showers',icon: '🌦️' },
  82: { description: 'Heavy rain showers',   icon: '🌦️' },
  85: { description: 'Snow showers',         icon: '🌨️' },
  86: { description: 'Heavy snow showers',   icon: '🌨️' },
  95: { description: 'Thunderstorm',         icon: '⛈️' },
  96: { description: 'Thunderstorm w/ hail', icon: '⛈️' },
  99: { description: 'Thunderstorm w/ hail', icon: '⛈️' },
};

const UNKNOWN_CONDITION = { description: 'Unknown conditions', icon: '🌡️' };
const CACHE_KEY = 'weather_cache';
const CACHE_TTL_MS = 3_600_000; // 60 minutes

// --- Helpers ---

export function lookupWmoCode(code: number): { description: string; icon: string } {
  return WMO_CODES[code] ?? UNKNOWN_CONDITION;
}

export function celsiusToFahrenheit(tempC: number): number {
  return Math.round((tempC * 9) / 5 + 32);
}

// --- WeatherService ---

@Injectable({ providedIn: 'root' })
export class WeatherService {
  /** Geocode a city name to coordinates. Returns null if not found. */
  async geocodeCity(cityName: string): Promise<GeocodingResult | null> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.status}`);
    }
    const json = await response.json();
    const results: GeocodingResult[] = json.results ?? [];
    if (results.length === 0) return null;
    const r = results[0];
    if (typeof r.latitude !== 'number' || typeof r.longitude !== 'number') {
      throw new Error('Geocoding result missing required fields');
    }
    return r;
  }

  /** Fetch current weather for given coordinates. Throws on error. */
  async fetchWeatherByCoords(lat: number, lon: number, locationName: string): Promise<WeatherData> {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
      `&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }
    const json = await response.json();
    const current = json.current;
    if (!current) {
      throw new Error('Weather response missing "current" object');
    }

    const tempC: number = current.temperature_2m;
    const weatherCode: number = current.weather_code;
    const { description, icon } = lookupWmoCode(weatherCode);

    const data: WeatherData = {
      locationName,
      tempC,
      tempF: celsiusToFahrenheit(tempC),
      humidity: current.relative_humidity_2m,
      weatherCode,
      description,
      icon,
      fetchedAt: Date.now(),
    };

    this.saveCache(data);
    return data;
  }

  /** Return cached WeatherData if still fresh (< 60 min old), otherwise null. */
  getCache(): WeatherData | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cache: WeatherCache = JSON.parse(raw);
      if (Date.now() - cache.savedAt > CACHE_TTL_MS) return null;
      return cache.data;
    } catch {
      return null;
    }
  }

  /** Return stale cached data (regardless of age) for offline fallback. */
  getStaleCache(): WeatherData | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cache: WeatherCache = JSON.parse(raw);
      return cache.data ?? null;
    } catch {
      return null;
    }
  }

  private saveCache(data: WeatherData): void {
    const cache: WeatherCache = { data, savedAt: Date.now() };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      // localStorage might be unavailable (private browsing quota exceeded) — ignore
    }
  }
}
