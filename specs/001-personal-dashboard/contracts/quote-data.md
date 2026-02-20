# Contract: Quote Data (Local Array)

**Source**: Hardcoded TypeScript constant in `src/app/services/quote.service.ts`
**Network call**: None
**Offline**: Always available
**CORS**: Not applicable

---

## QuoteService Interface

```typescript
interface Quote {
  q: string;   // Quote text (plain string)
  a: string;   // Author name
}
```

---

## Selection Algorithm

```typescript
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay); // 1–366
}

function getTodaysQuote(): Quote {
  const day = getDayOfYear(new Date());
  return QUOTES[day % QUOTES.length];
}
```

---

## localStorage Cache Contract

```typescript
interface QuoteCache {
  q: string;
  a: string;
  date: string;   // 'YYYY-MM-DD' — used to detect day rollover
}

// Key: 'quote_cache'
// Expiry: when date !== new Date().toISOString().slice(0, 10)
```

**Read flow**:
1. Read `localStorage.getItem('quote_cache')`.
2. Parse JSON → `QuoteCache`.
3. If `cache.date === todayISO` → use `{ q: cache.q, a: cache.a }`.
4. Else → call `getTodaysQuote()`, write new cache, return quote.
5. On JSON parse error → delete key, call `getTodaysQuote()`, write fresh cache.

---

## Fallback Quote

If `QUOTES` array is empty or index computation fails:
```typescript
const FALLBACK: Quote = {
  q: "Start where you are. Use what you have. Do what you can.",
  a: "Arthur Ashe"
};
```

---

## Quote Array Requirements

- Minimum 50 entries (ensures meaningful variety across weeks).
- Each entry: `q` ≤ 300 characters; `a` is a recognisable name.
- Themes: motivation, perseverance, creativity, curiosity.
- No duplicate `q` values.
- Array exported as `export const QUOTES: Quote[]` from the service file
  (or a co-located `quotes.data.ts` if the array exceeds 150 lines).

---

## Quote Truncation Rule (FR-006 + Edge Case)

If a quote's `q` field exceeds 300 characters when displayed:
- Truncate visible text to last word boundary before 300 chars.
- Append `"…"` and a `[Read more]` toggle button.
- Expanded state is in-memory only (not persisted).
