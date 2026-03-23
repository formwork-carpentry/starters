/**
 * Billing configuration — integrates @carpentry/billing with plan-based pricing.
 */
import { InMemoryPaymentProvider } from '@carpentry/billing';
import type { Plan, Customer, Subscription } from '@carpentry/billing';

/** Available SaaS plans. */
export const PLANS: Plan[] = [
  { id: 'free', name: 'Free', price: 0, currency: 'usd', interval: 'month', features: ['dashboard', 'basic_reports'], limits: { seats: 3, apiCalls: 1000 } },
  { id: 'pro', name: 'Pro', price: 2900, currency: 'usd', interval: 'month', features: ['dashboard', 'basic_reports', 'advanced_analytics', 'api_access', 'webhooks', 'priority_support'], limits: { seats: 20, apiCalls: 50000 } },
  { id: 'enterprise', name: 'Enterprise', price: 9900, currency: 'usd', interval: 'month', features: ['dashboard', 'basic_reports', 'advanced_analytics', 'api_access', 'webhooks', 'priority_support', 'sso', 'audit_logs', 'custom_domain', 'sla'], limits: { seats: 999, apiCalls: 999999 } },
];

export function configureBilling(): InMemoryPaymentProvider {
  const provider = new InMemoryPaymentProvider();
  for (const plan of PLANS) {
    provider.addPlan(plan);
  }
  return provider;
}

export function createBillingConfig(): InMemoryPaymentProvider {
  return configureBilling();
}

export function getPlan(id: string): Plan | undefined {
  return PLANS.find(p => p.id === id);
}

export function getPlanFeatures(planId: string): string[] {
  return getPlan(planId)?.features ?? PLANS[0].features;
}
