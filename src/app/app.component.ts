import { Component } from '@angular/core';
import { TimeWidgetComponent } from './widgets/time-widget/time-widget.component';
import { WeatherWidgetComponent } from './widgets/weather-widget/weather-widget.component';
import { QuoteWidgetComponent } from './widgets/quote-widget/quote-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimeWidgetComponent, WeatherWidgetComponent, QuoteWidgetComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Personal Dashboard';
}
