// Zone.js must be imported before Angular — required for Angular's change detection
import 'zone.js';

// JIT compiler — required because @angular/common ships partially-compiled injectables
// (e.g., PlatformNavigation) that need the JIT compiler as a fallback when the Angular
// Linker hasn't fully AOT-compiled them in this Vite/Vitest environment.
import '@angular/compiler';

// NOTE: zone.js/testing and TestBed.initTestEnvironment() are intentionally omitted here.
// Importing zone.js/testing installs global beforeEach/afterEach hooks that call
// resetFakeAsyncZone() for every test, which requires an active ProxyZone. This breaks
// pure utility tests (quote, weather, layout) that never enter a TestBed context.
//
// Tests that need Angular component rendering (e.g., time-widget.smoke.spec.ts) must
// set up their own TestBed environment via TestBed.configureTestingModule() and are
// subject to the known @analogjs/vite-plugin-angular + Vitest TestBed limitation
// (NullInjectorError: No provider for TestComponentRenderer).
