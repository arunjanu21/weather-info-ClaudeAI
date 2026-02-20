/**
 * Smoke tests for the Quote Widget (User Story 3).
 *
 * TECHNICAL DEBT: Angular TestBed integration with Vitest + @analogjs/vite-plugin-angular
 * has known configuration issues ("No provider for TestComponentRenderer" and ProxyZone
 * errors) — the same issue documented in time-widget.smoke.spec.ts and
 * weather-widget.smoke.spec.ts.
 *
 * This file tests:
 *   1. Exported standalone localStorage utility functions (no injection context needed) ✓
 *   2. QuoteService pure logic — getDayOfYear, same-day consistency, fallback ✓
 *
 * Component-level rendering tests (skeleton state, quote display) require TestBed and
 * are covered by manual validation per quickstart.md Checkpoint 3:
 *   - Same quote appears in multiple tabs on the same day
 *   - Day-change simulation via localStorage override shows a new quote
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getDayOfYear,
  getQuoteFromCache,
  saveQuoteToCache,
  FALLBACK,
  QUOTES,
} from '../src/app/services/quote.service';

// ---------------------------------------------------------------------------
// localStorage utility tests (no Angular imports — always runnable)
// ---------------------------------------------------------------------------

describe('Quote localStorage utilities (Smoke Test)', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('saves a quote to localStorage with today\'s date', () => {
    const quote = { q: 'Test quote', a: 'Test author' };
    saveQuoteToCache(quote);

    const raw = localStorage.getItem('quote_cache');
    expect(raw).toBeTruthy();
    const cached = JSON.parse(raw!);
    expect(cached.q).toBe('Test quote');
    expect(cached.a).toBe('Test author');
    expect(cached.date).toBe(new Date().toISOString().slice(0, 10));
  });

  it('retrieves a valid same-day cache entry', () => {
    const quote = { q: 'Cached quote', a: 'Author' };
    saveQuoteToCache(quote);

    const retrieved = getQuoteFromCache();
    expect(retrieved).not.toBeNull();
    expect(retrieved!.q).toBe('Cached quote');
    expect(retrieved!.a).toBe('Author');
  });

  it('returns null when no cache exists', () => {
    expect(getQuoteFromCache()).toBeNull();
  });

  it('returns null for a stale cache entry from a previous day', () => {
    localStorage.setItem(
      'quote_cache',
      JSON.stringify({ q: 'old quote', a: 'old author', date: '2000-01-01' })
    );
    const result = getQuoteFromCache();
    expect(result).toBeNull();
  });

  it('returns null and clears corrupted JSON from localStorage', () => {
    localStorage.setItem('quote_cache', '{invalid json!!');

    const result = getQuoteFromCache();
    expect(result).toBeNull();
    expect(localStorage.getItem('quote_cache')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// QuoteService pure-logic tests
// ---------------------------------------------------------------------------

describe('QuoteService pure logic (Smoke Test)', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('getDayOfYear returns a value between 1 and 366', () => {
    const day = getDayOfYear(new Date());
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(366);
  });

  it('getDayOfYear is deterministic for the same date', () => {
    const date = new Date('2026-02-19');
    expect(getDayOfYear(date)).toBe(getDayOfYear(date));
  });

  it('getDayOfYear produces different values for different dates', () => {
    const jan1 = new Date('2026-01-01');
    const dec31 = new Date('2026-12-31');
    expect(getDayOfYear(jan1)).not.toBe(getDayOfYear(dec31));
  });

  it('QUOTES array has at least 50 entries', () => {
    expect(QUOTES.length).toBeGreaterThanOrEqual(50);
  });

  it('all quotes have non-empty q and a fields', () => {
    for (const quote of QUOTES) {
      expect(quote.q.length).toBeGreaterThan(0);
      expect(quote.a.length).toBeGreaterThan(0);
    }
  });

  it('returns same quote within the same day (cache consistency)', () => {
    // Simulate: first load selects quote by day index and caches it
    const day = getDayOfYear(new Date());
    const expected = QUOTES[day % QUOTES.length];
    saveQuoteToCache(expected);

    // Second load: reads from cache — must be identical
    const fromCache = getQuoteFromCache();
    expect(fromCache).not.toBeNull();
    expect(fromCache!.q).toBe(expected.q);
    expect(fromCache!.a).toBe(expected.a);
  });

  it('FALLBACK quote is available as a safety net', () => {
    expect(FALLBACK.q).toBeTruthy();
    expect(FALLBACK.a).toBeTruthy();
    expect(FALLBACK.q).toContain('Start where you are');
    expect(FALLBACK.a).toBe('Arthur Ashe');
  });

  it('FALLBACK quote is under 300 characters', () => {
    expect(FALLBACK.q.length).toBeLessThanOrEqual(300);
  });

  it('no duplicate quote texts exist in QUOTES array', () => {
    const texts = QUOTES.map(q => q.q);
    const unique = new Set(texts);
    expect(unique.size).toBe(texts.length);
  });
});
