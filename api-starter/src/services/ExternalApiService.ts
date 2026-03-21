import { MemoryCacheStore } from '@formwork/cache';
import { CircuitBreaker, retry } from '@formwork/resilience';
/**
 * ExternalApiService - calls third-party APIs with circuit breaker + retry + cache fallback.
 */

export interface WeatherData { city: string; temperature: number; conditions: string; fetchedAt: string }
export interface ExchangeRate { from: string; to: string; rate: number; fetchedAt: string }

export class ExternalApiService {
  private breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 30000, halfOpenMaxCalls: 1 });
  constructor(private cache: MemoryCacheStore) {}

  async getWeather(city: string): Promise<WeatherData> {
    const key = 'weather:' + city.toLowerCase();
    try {
      const fresh = await this.breaker.execute(() => retry(async () => this.callWeather(city), { maxAttempts: 3, strategy: 'exponential', baseDelayMs: 200 }));
      await this.cache.put(key, fresh, 300);
      return fresh;
    } catch {
      const cached = await this.cache.get<WeatherData>(key);
      if (cached) return { ...cached, conditions: cached.conditions + ' (cached)' };
      throw new Error('Weather API unavailable for ' + city);
    }
  }

  async getExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    const key = 'fx:' + from + ':' + to;
    try {
      const fresh = await this.breaker.execute(() => retry(async () => this.callExchange(from, to), { maxAttempts: 2, strategy: 'fixed', baseDelayMs: 500 }));
      await this.cache.put(key, fresh, 600);
      return fresh;
    } catch {
      const cached = await this.cache.get<ExchangeRate>(key);
      if (cached) return cached;
      throw new Error('Exchange API unavailable for ' + from + '/' + to);
    }
  }

  getCircuitState(): string { return this.breaker.getState(); }

  private async callWeather(city: string): Promise<WeatherData> {
    const temps: Record<string, number> = { london: 12, paris: 15, tokyo: 22, nyc: 18 };
    return { city, temperature: temps[city.toLowerCase()] ?? 20, conditions: 'partly cloudy', fetchedAt: new Date().toISOString() };
  }
  private async callExchange(from: string, to: string): Promise<ExchangeRate> {
    const rates: Record<string, number> = { 'USD:EUR': 0.92, 'USD:GBP': 0.79, 'EUR:USD': 1.09 };
    return { from, to, rate: rates[from + ':' + to] ?? 1.0, fetchedAt: new Date().toISOString() };
  }
}
