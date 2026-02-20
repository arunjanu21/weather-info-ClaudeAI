import { Injectable } from '@angular/core';

// --- Interfaces ---

export interface Quote {
  q: string; // Quote text (plain string, ≤ 300 chars recommended)
  a: string; // Author name
}

interface QuoteCache {
  q: string;
  a: string;
  date: string; // 'YYYY-MM-DD' — used to detect day rollover
}

// --- Constants ---

const QUOTE_CACHE_KEY = 'quote_cache';

export const FALLBACK: Quote = {
  q: "Start where you are. Use what you have. Do what you can.",
  a: "Arthur Ashe",
};

// --- Quotes Array (60 entries — motivation, perseverance, creativity, curiosity) ---

export const QUOTES: Quote[] = [
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
  { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
  { q: "Life is what happens when you're busy making other plans.", a: "John Lennon" },
  { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
  { q: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", a: "Benjamin Franklin" },
  { q: "When you reach the end of your rope, tie a knot in it and hang on.", a: "Franklin D. Roosevelt" },
  { q: "Always remember that you are absolutely unique. Just like everyone else.", a: "Margaret Mead" },
  { q: "You miss 100% of the shots you don't take.", a: "Wayne Gretzky" },
  { q: "Whether you think you can or you think you can't, you're right.", a: "Henry Ford" },
  { q: "I am not a product of my circumstances. I am a product of my decisions.", a: "Stephen Covey" },
  { q: "Every child is an artist. The problem is how to remain an artist once we grow up.", a: "Pablo Picasso" },
  { q: "You can never cross the ocean until you have the courage to lose sight of the shore.", a: "Christopher Columbus" },
  { q: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", a: "Maya Angelou" },
  { q: "Either you run the day, or the day runs you.", a: "Jim Rohn" },
  { q: "The two most important days in your life are the day you are born and the day you find out why.", a: "Mark Twain" },
  { q: "Whatever the mind of man can conceive and believe, it can achieve.", a: "Napoleon Hill" },
  { q: "Strive not to be a success, but rather to be of value.", a: "Albert Einstein" },
  { q: "The mind is everything. What you think you become.", a: "Buddha" },
  { q: "An unexamined life is not worth living.", a: "Socrates" },
  { q: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", a: "Mother Teresa" },
  { q: "Life isn't about finding yourself. Life is about creating yourself.", a: "George Bernard Shaw" },
  { q: "Nothing is impossible — the word itself says 'I'm possible'!", a: "Audrey Hepburn" },
  { q: "The person who says it cannot be done should not interrupt the person who is doing it.", a: "Chinese Proverb" },
  { q: "There is only one way to avoid criticism: do nothing, say nothing, and be nothing.", a: "Aristotle" },
  { q: "The only person you are destined to become is the person you decide to be.", a: "Ralph Waldo Emerson" },
  { q: "Go confidently in the direction of your dreams! Live the life you've imagined.", a: "Henry David Thoreau" },
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { q: "Everything you've ever wanted is on the other side of fear.", a: "George Addair" },
  { q: "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.", a: "Plato" },
  { q: "Start where you are. Use what you have. Do what you can.", a: "Arthur Ashe" },
  { q: "When one door of happiness closes, another opens, but often we look so long at the closed door that we do not see the one that has been opened for us.", a: "Helen Keller" },
  { q: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", a: "Maya Angelou" },
  { q: "Definiteness of purpose is the starting point of all achievement.", a: "W. Clement Stone" },
  { q: "We become what we think about.", a: "Earl Nightingale" },
  { q: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.", a: "Mark Twain" },
  { q: "Life is 10% what happens to me and 90% of how I react to it.", a: "Charles Swindoll" },
  { q: "The most common way people give up their power is by thinking they don't have any.", a: "Alice Walker" },
  { q: "The mind is not a vessel to be filled but a fire to be kindled.", a: "Plutarch" },
  { q: "You become what you believe.", a: "Oprah Winfrey" },
  { q: "The best time to plant a tree was 20 years ago. The second best time is now.", a: "Chinese Proverb" },
  { q: "I attribute my success to this: I never gave or took any excuse.", a: "Florence Nightingale" },
  { q: "You may be disappointed if you fail, but you are doomed if you don't try.", a: "Beverly Sills" },
  { q: "The only true wisdom is in knowing you know nothing.", a: "Socrates" },
  { q: "It is during our darkest moments that we must focus to see the light.", a: "Aristotle Onassis" },
  { q: "Do not go where the path may lead, go instead where there is no path and leave a trail.", a: "Ralph Waldo Emerson" },
  { q: "You will face many defeats in life, but never let yourself be defeated.", a: "Maya Angelou" },
  { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
  { q: "In the end, it's not the years in your life that count. It's the life in your years.", a: "Abraham Lincoln" },
  { q: "Never let the fear of striking out keep you from playing the game.", a: "Babe Ruth" },
  { q: "Life is either a daring adventure or nothing at all.", a: "Helen Keller" },
  { q: "Many of life's failures are people who did not realize how close they were to success when they gave up.", a: "Thomas A. Edison" },
  { q: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", a: "Dr. Seuss" },
  { q: "If life were predictable it would cease to be life and be without flavor.", a: "Eleanor Roosevelt" },
  { q: "If you look at what you have in life, you'll always have more.", a: "Oprah Winfrey" },
  { q: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", a: "James Cameron" },
  { q: "You only live once, but if you do it right, once is enough.", a: "Mae West" },
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
  { q: "Don't judge each day by the harvest you reap but by the seeds that you plant.", a: "Robert Louis Stevenson" },
  { q: "Creativity is intelligence having fun.", a: "Albert Einstein" },
  { q: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
  { q: "How wonderful it is that nobody need wait a single moment before starting to improve the world.", a: "Anne Frank" },
  { q: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
  { q: "To handle yourself, use your head; to handle others, use your heart.", a: "Eleanor Roosevelt" },
  { q: "Learn as if you will live forever, live as if you will die today.", a: "Mahatma Gandhi" },
];

// --- Exported standalone helpers (testable without injection context) ---

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay); // 1–366
}

export function getQuoteFromCache(): Quote | null {
  try {
    const raw = localStorage.getItem(QUOTE_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as QuoteCache;
    const todayISO = new Date().toISOString().slice(0, 10);
    if (cache.date === todayISO) {
      return { q: cache.q, a: cache.a };
    }
    return null;
  } catch {
    localStorage.removeItem(QUOTE_CACHE_KEY);
    return null;
  }
}

export function saveQuoteToCache(quote: Quote): void {
  try {
    const cache: QuoteCache = {
      q: quote.q,
      a: quote.a,
      date: new Date().toISOString().slice(0, 10),
    };
    localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage errors
  }
}

// --- Service ---

@Injectable({ providedIn: 'root' })
export class QuoteService {
  getTodaysQuote(): Quote {
    const cached = getQuoteFromCache();
    if (cached) return cached;

    try {
      if (!QUOTES.length) return FALLBACK;
      const day = getDayOfYear(new Date());
      const quote = QUOTES[day % QUOTES.length];
      saveQuoteToCache(quote);
      return quote;
    } catch {
      return FALLBACK;
    }
  }
}
