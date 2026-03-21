import type { Container } from '@formwork/core/container';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';
import { CircuitBreaker, retry } from '@formwork/resilience';

const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 15000, halfOpenMaxCalls: 1 });

async function fetchQuote(): Promise<{ text: string; author: string }> {
  return breaker.execute(() => retry(async () => {
    // Replace with real fetch('https://api.quotable.io/random') in production
    const quotes = [
      { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
      { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, { maxAttempts: 2, strategy: 'fixed', baseDelayMs: 300 }));
}

export function registerExternalRoutes(router: Router, _container: Container): void {
  router.get('/api/quote', async () => {
    try {
      return CarpenterResponse.json({ data: await fetchQuote() });
    } catch (err) {
      return CarpenterResponse.json({ error: (err as Error).message, circuit: breaker.getState() }, 503);
    }
  });
}
