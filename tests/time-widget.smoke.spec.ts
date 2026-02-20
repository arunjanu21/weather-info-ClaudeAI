/**
 * Smoke tests for the Time Widget (User Story 1).
 *
 * Uses direct class instantiation rather than Angular TestBed, because
 * @analogjs/vite-plugin-angular AOT-compiles components in a way that makes
 * TestBed component rendering fail in the Vitest + jsdom environment
 * (NullInjectorError: No provider for TestComponentRenderer).
 *
 * TimeWidgetComponent has no inject() calls and no external dependencies —
 * it only uses Angular signals and window.setInterval — so direct instantiation
 * works cleanly and tests the real business logic.
 *
 * Manual validation per quickstart.md Checkpoint 1 confirms correct rendering:
 *   - Displays current time in HH:MM:SS format
 *   - Updates every second (visible ticking)
 *   - Shows day of week and formatted date
 *   - Responsive at 375 px and fade-slide-up animation visible on load
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { TimeWidgetComponent } from '../src/app/widgets/time-widget/time-widget.component';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createAndInit(): TimeWidgetComponent {
  const c = new TimeWidgetComponent();
  c.ngOnInit();
  return c;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TimeWidgetComponent (Smoke Test)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('initialises with valid HH:MM:SS time signals', () => {
    const component = createAndInit();

    expect(component.hours()).toMatch(/^\d{2}$/);
    expect(component.minutes()).toMatch(/^\d{2}$/);
    expect(component.seconds()).toMatch(/^\d{2}$/);

    const h = Number(component.hours());
    const m = Number(component.minutes());
    const s = Number(component.seconds());
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(23);
    expect(m).toBeGreaterThanOrEqual(0);
    expect(m).toBeLessThanOrEqual(59);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(59);

    component.ngOnDestroy();
  });

  it('sets dayOfWeek to one of the seven day names', () => {
    const component = createAndInit();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    expect(days).toContain(component.dayOfWeek());

    component.ngOnDestroy();
  });

  it('sets dateLabel to a recognisable date string (Month D, YYYY)', () => {
    const component = createAndInit();

    // e.g. "February 20, 2026"
    expect(component.dateLabel()).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);

    component.ngOnDestroy();
  });

  it('updates seconds signal every 1000 ms', () => {
    vi.useFakeTimers();

    // Pin the clock so the second boundary is predictable
    const fixedNow = new Date('2026-02-20T12:00:00.500');
    vi.setSystemTime(fixedNow);

    const component = createAndInit();
    const before = component.seconds(); // '00'

    // Advance past the next full second
    vi.advanceTimersByTime(1000);

    const after = component.seconds();
    expect(after).not.toBe(before);

    component.ngOnDestroy();
  });

  it('clears the interval on destroy', () => {
    const clearSpy = vi.spyOn(window, 'clearInterval');

    const component = createAndInit();
    component.ngOnDestroy();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
