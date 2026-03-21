/**
 * Feature flags - plan-based feature gating for SaaS tiers.
 */

export interface PlanLimits {
  features: string[];
  seats: number;
  apiCalls: number;
}

const PLANS: Record<string, PlanLimits> = {
  free:       { features: ['dashboard', 'basic_reports'], seats: 3, apiCalls: 1000 },
  pro:        { features: ['dashboard', 'basic_reports', 'advanced_analytics', 'api_access', 'webhooks', 'priority_support'], seats: 20, apiCalls: 50000 },
  enterprise: { features: ['dashboard', 'basic_reports', 'advanced_analytics', 'api_access', 'webhooks', 'priority_support', 'sso', 'audit_logs', 'custom_domain', 'sla'], seats: 999, apiCalls: 999999 },
};

export function getPlanLimits(plan: string): PlanLimits {
  return PLANS[plan] ?? PLANS['free'];
}

export function hasFeature(plan: string, feature: string): boolean {
  return getPlanLimits(plan).features.includes(feature);
}

export function getAvailablePlans(): string[] {
  return Object.keys(PLANS);
}
