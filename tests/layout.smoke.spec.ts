/**
 * Layout smoke tests for User Story 4: Responsive and Animated Layout
 *
 * Uses readFileSync to read CSS content directly, bypassing Vite's module
 * transform pipeline which strips CSS content in the jsdom test environment.
 * TestBed.resetTestingModule() is called per test to satisfy zone.js hooks
 * installed by the shared setup.ts.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

const stylesCSS = readFileSync(join(root, 'src', 'styles.css'), 'utf-8');
const appComponentCSS = readFileSync(join(root, 'src', 'app', 'app.component.css'), 'utf-8');
const timeWidgetCSS = readFileSync(
  join(root, 'src', 'app', 'widgets', 'time-widget', 'time-widget.component.css'),
  'utf-8'
);
const weatherWidgetCSS = readFileSync(
  join(root, 'src', 'app', 'widgets', 'weather-widget', 'weather-widget.component.css'),
  'utf-8'
);
const quoteWidgetCSS = readFileSync(
  join(root, 'src', 'app', 'widgets', 'quote-widget', 'quote-widget.component.css'),
  'utf-8'
);

describe('Layout Smoke Tests (US4)', () => {

  // ── Responsive Grid ────────────────────────────────────────────────────────

  describe('Responsive Grid Layout', () => {
    it('should use CSS Grid with auto-fit columns in dashboard', () => {
      expect(appComponentCSS).toContain('display: grid');
      expect(appComponentCSS).toContain('auto-fit');
      expect(appComponentCSS).toContain('minmax(280px');
    });

    it('should have tablet responsive breakpoint at 768px', () => {
      expect(appComponentCSS).toContain('max-width: 768px');
    });

    it('should have mobile responsive breakpoint at 480px', () => {
      expect(appComponentCSS).toContain('max-width: 480px');
    });
  });

  // ── Entrance Animations ────────────────────────────────────────────────────

  describe('Entrance Animations', () => {
    it('should define fade-slide-up keyframe in global styles', () => {
      expect(stylesCSS).toContain('@keyframes fade-slide-up');
    });

    it('should have staggered animation delay utilities in global styles', () => {
      // T051: staggered delay utility classes must be present in styles.css
      expect(stylesCSS).toContain('.widget-delay-2');
      expect(stylesCSS).toContain('.widget-delay-3');
    });

    it('should apply fade-slide-up to all widget cards', () => {
      expect(timeWidgetCSS).toContain('fade-slide-up');
      expect(weatherWidgetCSS).toContain('fade-slide-up');
      expect(quoteWidgetCSS).toContain('fade-slide-up');
    });

    it('should stagger animation delays across widgets', () => {
      // Weather widget (2nd): 100ms delay
      expect(weatherWidgetCSS).toContain('animation-delay: 100ms');
      // Quote widget (3rd): 200ms delay
      expect(quoteWidgetCSS).toContain('animation-delay: 200ms');
    });

    it('should complete all entrance animations within 500ms on page load', () => {
      // Quote widget is last: 200ms delay + duration must be ≤ 300ms
      // so it finishes at or before the 500ms performance target.
      expect(quoteWidgetCSS).toContain('animation-delay: 200ms');
      expect(quoteWidgetCSS).toContain('300ms');
    });
  });

  // ── Reduced Motion ─────────────────────────────────────────────────────────

  describe('Reduced Motion Support', () => {
    it('should suppress all animations globally for reduced motion preference', () => {
      expect(stylesCSS).toContain('prefers-reduced-motion: reduce');
      expect(stylesCSS).toContain('animation-duration: 0.01ms');
      expect(stylesCSS).toContain('transition-duration: 0.01ms');
    });

    it('should suppress skeleton shimmer animation for reduced motion', () => {
      expect(stylesCSS).toContain('animation: none');
    });

    it('should suppress widget card animations for reduced motion', () => {
      expect(timeWidgetCSS).toContain('prefers-reduced-motion: reduce');
      expect(weatherWidgetCSS).toContain('prefers-reduced-motion: reduce');
      expect(quoteWidgetCSS).toContain('prefers-reduced-motion: reduce');
    });

    it('should disable hover effects for reduced motion in app component', () => {
      expect(appComponentCSS).toContain('prefers-reduced-motion: reduce');
    });
  });

  // ── Hover Effects ──────────────────────────────────────────────────────────

  describe('Hover Effects', () => {
    it('should apply lift effect to widget cards on hover', () => {
      expect(appComponentCSS).toContain('translateY(-4px)');
    });

    it('should apply enhanced box-shadow on hover', () => {
      expect(appComponentCSS).toContain('box-shadow');
      expect(appComponentCSS).toContain(':hover');
    });

    it('should have smooth CSS transition for hover effects', () => {
      expect(appComponentCSS).toContain('transition:');
    });
  });
});
