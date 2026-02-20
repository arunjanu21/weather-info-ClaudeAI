import { Component, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-time-widget',
  standalone: true,
  imports: [],
  templateUrl: './time-widget.component.html',
  styleUrls: ['./time-widget.component.css'],
})
export class TimeWidgetComponent implements OnInit, OnDestroy {
  // Time state signals
  hours = signal<string>('00');
  minutes = signal<string>('00');
  seconds = signal<string>('00');
  dayOfWeek = signal<string>('');
  dateLabel = signal<string>('');

  private intervalId?: number;

  ngOnInit(): void {
    // Update time immediately on mount
    this.updateTime();

    // Set up interval to update every second
    this.intervalId = window.setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Clean up interval on component destruction
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
    }
  }

  private updateTime(): void {
    try {
      const now = new Date();

      // Update time signals with zero-padded values
      this.hours.set(String(now.getHours()).padStart(2, '0'));
      this.minutes.set(String(now.getMinutes()).padStart(2, '0'));
      this.seconds.set(String(now.getSeconds()).padStart(2, '0'));

      // Update day of week
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      this.dayOfWeek.set(daysOfWeek[now.getDay()]);

      // Update date label (e.g., "February 16, 2026")
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const month = months[now.getMonth()];
      const date = now.getDate();
      const year = now.getFullYear();
      this.dateLabel.set(`${month} ${date}, ${year}`);
    } catch {
      // Guard: keep displaying the last known time if an unexpected error occurs
    }
  }
}
