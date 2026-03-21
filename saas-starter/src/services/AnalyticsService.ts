import { CircuitBreaker, retry } from '@formwork/resilience';
/**
 * AnalyticsService - fetches usage analytics from external API with circuit breaker.
 */

const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 20000, halfOpenMaxCalls: 1 });

export interface AnalyticsData {
  orgId: string;
  activeUsers: number;
  apiCallsToday: number;
  errorRate: string;
  fetchedAt: string;
}

export async function fetchAnalytics(orgId: string): Promise<AnalyticsData> {
  return breaker.execute(() => retry(async () => {
    // Replace with real fetch() in production
    return {
      orgId,
      activeUsers: Math.floor(Math.random() * 100),
      apiCallsToday: Math.floor(Math.random() * 5000),
      errorRate: (Math.random() * 5).toFixed(2) + '%',
      fetchedAt: new Date().toISOString(),
    };
  }, { maxAttempts: 2, strategy: 'exponential', baseDelayMs: 300 }));
}

export function getAnalyticsCircuitState(): string { return breaker.getState(); }
