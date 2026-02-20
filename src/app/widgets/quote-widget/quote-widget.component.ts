import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService, Quote, FALLBACK } from '../../services/quote.service';

const TRUNCATE_LENGTH = 300;

@Component({
  selector: 'app-quote-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-widget.component.html',
  styleUrls: ['./quote-widget.component.css'],
})
export class QuoteWidgetComponent implements OnInit {
  private quoteService = inject(QuoteService);

  isLoading = signal(true);
  quote = signal<Quote | null>(null);
  isExpanded = signal(false);

  needsTruncation = computed(() => {
    const q = this.quote();
    return q !== null && q.q.length > TRUNCATE_LENGTH;
  });

  displayText = computed(() => {
    const q = this.quote();
    if (!q) return '';
    if (this.isExpanded() || q.q.length <= TRUNCATE_LENGTH) return q.q;
    // Truncate to last word boundary before TRUNCATE_LENGTH
    const truncated = q.q.slice(0, TRUNCATE_LENGTH);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.slice(0, lastSpace > -1 ? lastSpace : TRUNCATE_LENGTH) + '\u2026';
  });

  ngOnInit(): void {
    try {
      const quote = this.quoteService.getTodaysQuote();
      this.quote.set(quote);
    } catch {
      // Service unavailable — display fallback quote so the widget still renders
      this.quote.set(FALLBACK);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleExpand(): void {
    this.isExpanded.update(v => !v);
  }
}
