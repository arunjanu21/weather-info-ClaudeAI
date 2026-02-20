import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherData } from '../../services/weather.service';

// Widget state machine:
// idle → locating → loading → loaded
//              ↓ (permission denied)
//          city_input → loading → loaded
//                              ↓ (error)
//                            error

export type WidgetState = 'idle' | 'locating' | 'loading' | 'loaded' | 'error' | 'city_input';

export interface Location {
  type: 'geo' | 'city';
  lat: number | null;
  lon: number | null;
  cityName: string;
}

const LOCATION_KEY = 'last_location';
const REFRESH_INTERVAL_MS = 3_600_000; // 60 minutes

// --- Exported standalone helpers (testable without injection context) ---

export function saveLocationToStorage(location: Location): void {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  } catch {
    // ignore storage errors
  }
}

export function loadLocationFromStorage(): Location | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Location;
  } catch {
    localStorage.removeItem(LOCATION_KEY);
    return null;
  }
}

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css'],
})
export class WeatherWidgetComponent implements OnInit, OnDestroy {
  private weatherService = inject(WeatherService);

  // Public signals (accessible by smoke tests and template)
  state = signal<WidgetState>('idle');
  weatherData = signal<WeatherData | null>(null);
  errorMessage = signal<string>('');
  cityInput = signal<string>('');
  cityError = signal<string>('');
  isStaleCache = signal<boolean>(false);

  private refreshTimer?: number;

  ngOnInit(): void {
    try {
      const cached = this.weatherService.getCache();
      if (cached) {
        // Fresh cache — display immediately and schedule refresh
        this.weatherData.set(cached);
        this.state.set('loaded');
        this.scheduleRefresh(cached);
        return;
      }

      const location = this.loadLocation();
      if (location) {
        // Known location from previous visit — skip prompts
        if (location.type === 'geo' && location.lat !== null && location.lon !== null) {
          this.fetchWeather(location.lat, location.lon, location.cityName);
        } else {
          this.fetchByCity(location.cityName);
        }
      } else {
        // First visit — try geolocation
        this.startGeolocation();
      }
    } catch {
      // Guard: if any synchronous init step fails, show the error state rather than a blank widget
      this.errorMessage.set('Unable to load weather data. Please refresh the page.');
      this.state.set('error');
    }
  }

  ngOnDestroy(): void {
    if (this.refreshTimer !== undefined) {
      window.clearInterval(this.refreshTimer);
    }
  }

  // --- Geolocation flow ---

  private startGeolocation(): void {
    this.state.set('locating');
    if (!navigator.geolocation) {
      this.state.set('city_input');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.saveLocation({ type: 'geo', lat: latitude, lon: longitude, cityName: '' });
        this.fetchWeather(latitude, longitude, '');
      },
      () => {
        // Permission denied or unavailable — show city input
        this.state.set('city_input');
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }

  // --- City input flow ---

  onCitySubmit(): void {
    const city = this.cityInput().trim();
    if (!city) return;
    this.cityError.set('');
    this.fetchByCity(city);
  }

  private async fetchByCity(cityName: string): Promise<void> {
    this.state.set('loading');
    try {
      const result = await this.weatherService.geocodeCity(cityName);
      if (!result) {
        this.cityError.set('City not found — please try again');
        this.state.set('city_input');
        return;
      }
      this.saveLocation({ type: 'city', lat: result.latitude, lon: result.longitude, cityName: result.name });
      await this.fetchWeather(result.latitude, result.longitude, result.name);
    } catch {
      this.handleFetchError();
    }
  }

  // --- Core fetch ---

  private async fetchWeather(lat: number, lon: number, locationName: string): Promise<void> {
    this.state.set('loading');
    try {
      const data = await this.weatherService.fetchWeatherByCoords(lat, lon, locationName);
      this.weatherData.set(data);
      this.isStaleCache.set(false);
      this.state.set('loaded');
      this.scheduleRefresh(data);
    } catch {
      this.handleFetchError();
    }
  }

  private handleFetchError(): void {
    const stale = this.weatherService.getStaleCache();
    if (stale) {
      this.weatherData.set(stale);
      this.isStaleCache.set(true);
      this.state.set('loaded');
    } else {
      this.errorMessage.set('Unable to fetch weather data. Please check your connection.');
      this.state.set('error');
    }
  }

  // --- Auto-refresh ---

  private scheduleRefresh(data: WeatherData): void {
    if (this.refreshTimer !== undefined) {
      window.clearInterval(this.refreshTimer);
    }
    const elapsed = Date.now() - data.fetchedAt;
    const remaining = Math.max(REFRESH_INTERVAL_MS - elapsed, 0);
    this.refreshTimer = window.setTimeout(() => {
      const loc = this.loadLocation();
      if (loc && loc.lat !== null && loc.lon !== null) {
        this.fetchWeather(loc.lat, loc.lon, loc.cityName);
      } else if (loc) {
        this.fetchByCity(loc.cityName);
      }
    }, remaining);
  }

  // --- localStorage helpers ---

  saveLocation(location: Location): void {
    saveLocationToStorage(location);
  }

  loadLocation(): Location | null {
    return loadLocationFromStorage();
  }

  // --- Retry handler ---

  retry(): void {
    const loc = this.loadLocation();
    if (loc && loc.lat !== null && loc.lon !== null) {
      this.fetchWeather(loc.lat, loc.lon, loc.cityName);
    } else if (loc) {
      this.fetchByCity(loc.cityName);
    } else {
      this.startGeolocation();
    }
  }
}
