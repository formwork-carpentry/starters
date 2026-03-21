import type { MemoryCacheStore } from '@formwork/cache';
import { CircuitBreaker, retry } from '@formwork/resilience';
/**
 * @module app/Services
 * @description WeatherService - fetches weather data from an external API
 * with circuit breaker, retry, and cache fallback.
 *
 * @example
 * ```ts
 * const weather = new WeatherService(cache);
 * const data = await weather.getCurrent('london');
 * // { city: 'london', temperature: 12, conditions: 'partly cloudy', ... }
 * ```
 */


/** @typedef {Object} WeatherData */
export interface WeatherData {
  city: string;
  temperature: number;
  conditions: string;
  humidity: number;
  fetchedAt: string;
}

export class WeatherService {
  private breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 30000, halfOpenMaxCalls: 1 });

  /**
   * @param {MemoryCacheStore} cache - Cache store for fallback
   */
  constructor(private cache: MemoryCacheStore) {}

  /**
   * Fetch current weather with resilience (circuit breaker + retry + cache fallback).
   *
   * @param {string} city - City name (e.g., 'london', 'tokyo')
   * @returns {Promise<WeatherData>} Weather data
   * @throws {Error} If API is down and no cached data available
   */
  async getCurrent(city: string): Promise<WeatherData> {
    const key = 'weather:' + city.toLowerCase();
    try {
      const fresh = await this.breaker.execute(() =>
        retry(async () => this.fetchApi(city), { maxAttempts: 3, strategy: 'exponential', baseDelayMs: 200 }),
      );
      await this.cache.put(key, fresh, 300);
      return fresh;
    } catch {
      const cached = await this.cache.get<WeatherData>(key);
      if (cached) return { ...cached, conditions: cached.conditions + ' (cached)' };
      throw new Error('Weather API unavailable for ' + city);
    }
  }

  /**
   * Get circuit breaker state.
   * @returns {string} 'closed' | 'open' | 'half-open'
   */
  getCircuitState(): string { return this.breaker.getState(); }

  /** @internal Replace with real fetch() in production */
  private async fetchApi(city: string): Promise<WeatherData> {
    const temps: Record<string, number> = { london: 12, paris: 15, tokyo: 22, nyc: 18, lagos: 31, accra: 29 };
    return { city, temperature: temps[city.toLowerCase()] ?? 20, conditions: 'partly cloudy', humidity: 65, fetchedAt: new Date().toISOString() };
  }
}
