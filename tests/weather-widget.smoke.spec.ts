/**
 * Smoke tests for the Weather Widget (User Story 2).
 *
 * TECHNICAL DEBT: Angular TestBed integration with Vitest + @analogjs/vite-plugin-angular
 * has known configuration issues ("No provider for TestComponentRenderer" and ProxyZone
 * errors) — the same issue documented in time-widget.smoke.spec.ts.
 *
 * This file tests:
 *   1. Exported standalone localStorage utility functions (no injection context needed) ✓
 *   2. WeatherService pure logic — WMO code lookup and Celsius→Fahrenheit conversion ✓
 *
 * Component-level rendering tests (skeleton state, error state) require TestBed and
 * currently fail due to the known Vitest + @analogjs/vite-plugin-angular configuration
 * issue. Manual validation per quickstart.md Checkpoint 2 confirms correct behaviour:
 *   - Geolocation flow → weather displays within 5 s
 *   - City input flow works when geolocation is denied
 *   - "City not found" error message for unknown cities
 *   - Return-visit cache loads immediately
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  saveLocationToStorage,
  loadLocationFromStorage,
} from '../src/app/widgets/weather-widget/weather-widget.component';
import { lookupWmoCode, celsiusToFahrenheit } from '../src/app/services/weather.service';

// ---------------------------------------------------------------------------
// localStorage utility tests (no Angular imports — always runnable)
// ---------------------------------------------------------------------------

describe('Weather localStorage utilities (Smoke Test)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('saves a city location to localStorage', () => {
    saveLocationToStorage({ type: 'city', lat: null, lon: null, cityName: 'Paris' });

    const saved = JSON.parse(localStorage.getItem('last_location') ?? 'null');
    expect(saved).toBeTruthy();
    expect(saved.cityName).toBe('Paris');
    expect(saved.type).toBe('city');
  });

  it('saves a geo location with coordinates to localStorage', () => {
    saveLocationToStorage({ type: 'geo', lat: 51.5, lon: -0.12, cityName: 'London' });

    const saved = JSON.parse(localStorage.getItem('last_location') ?? 'null');
    expect(saved.type).toBe('geo');
    expect(saved.lat).toBe(51.5);
    expect(saved.lon).toBe(-0.12);
  });

  it('loads a saved location from localStorage', () => {
    const location = { type: 'city' as const, lat: null, lon: null, cityName: 'Tokyo' };
    localStorage.setItem('last_location', JSON.stringify(location));

    const loaded = loadLocationFromStorage();
    expect(loaded).toBeTruthy();
    expect(loaded?.cityName).toBe('Tokyo');
    expect(loaded?.type).toBe('city');
  });

  it('returns null when no location is stored', () => {
    const loaded = loadLocationFromStorage();
    expect(loaded).toBeNull();
  });

  it('returns null and removes corrupted JSON from localStorage', () => {
    localStorage.setItem('last_location', '{invalid json!!');

    const loaded = loadLocationFromStorage();
    expect(loaded).toBeNull();
    expect(localStorage.getItem('last_location')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// WeatherService pure-logic tests (WMO lookup + unit conversion)
// ---------------------------------------------------------------------------

describe('WeatherService pure logic (Smoke Test)', () => {
  it('maps known WMO codes to correct descriptions', () => {
    expect(lookupWmoCode(0).description).toBe('Clear sky');
    expect(lookupWmoCode(2).description).toBe('Partly cloudy');
    expect(lookupWmoCode(61).description).toBe('Light rain');
    expect(lookupWmoCode(95).description).toBe('Thunderstorm');
  });

  it('maps known WMO codes to icons', () => {
    expect(lookupWmoCode(0).icon).toBe('☀️');
    expect(lookupWmoCode(3).icon).toBe('☁️');
  });

  it('returns "Unknown conditions" for unrecognised codes', () => {
    const result = lookupWmoCode(999);
    expect(result.description).toBe('Unknown conditions');
    expect(result.icon).toBe('🌡️');
  });

  it('converts Celsius to Fahrenheit correctly', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
    expect(celsiusToFahrenheit(20)).toBe(68);
  });

  it('rounds Fahrenheit conversion to nearest integer', () => {
    // 15°C = 59°F (exact)
    expect(celsiusToFahrenheit(15)).toBe(59);
    // 22°C = 71.6°F → rounds to 72
    expect(celsiusToFahrenheit(22)).toBe(72);
  });
});
