import { Organization } from '../models/Organization.js';
import { getTenantStore } from '../tenants/seed.js';
import { getPlanLimits, hasFeature } from '../services/FeatureFlags.js';
import { fetchAnalytics, getAnalyticsCircuitState } from '../services/AnalyticsService.js';

const validator = new Validator();
import { attr } from '../helpers.js';
import { MemoryCacheStore } from '@formwork/cache';
import type { Container } from '@formwork/core/container';
import { EventDispatcher } from '@formwork/events';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';
import { TenantCacheScope } from '@formwork/tenancy';
import { Validator } from '@formwork/validation';

export function registerTenantRoutes(router: Router, container: Container): void {
  const cache = container.make<MemoryCacheStore>('cache');
  const events = container.make<EventDispatcher>('events');
  const tenantStore = getTenantStore();

  // Tenant info with scoped cache
  router.get('/api/org', async (req) => {
    const slug = req.header('x-tenant') ?? 'acme';
    const tenant = await tenantStore.findBySlug(slug);
    if (!tenant) return CarpenterResponse.json({ error: 'Tenant not found' }, 404);

    const org = await Organization.query().where('slug', '=', slug).first();
    const plan = String(attr(org, 'plan') ?? 'free');
    const tenantCache = new TenantCacheScope(cache, tenant);
    const visits = ((await tenantCache.get<number>('visits')) ?? 0) + 1;
    await tenantCache.put('visits', visits);

    return CarpenterResponse.json({
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      plan, features: getPlanLimits(plan).features,
      limits: { seats: getPlanLimits(plan).seats, apiCalls: getPlanLimits(plan).apiCalls },
      visits,
    });
  });

  // Feature gate check
  router.get('/api/features/:feature', async (req) => {
    const slug = req.header('x-tenant') ?? 'acme';
    const org = await Organization.query().where('slug', '=', slug).first();
    const plan = String(attr(org, 'plan') ?? 'free');
    const feature = req.param('feature');

    if (!hasFeature(plan, feature)) {
      return CarpenterResponse.json({ error: 'Feature "' + feature + '" requires upgrade', upgrade: '/billing/upgrade' }, 403);
    }
    return CarpenterResponse.json({ feature, allowed: true, plan });
  });

  // Change subscription plan
  router.put('/api/billing/plan', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { plan: 'required|in:free,pro,enterprise' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const slug = req.header('x-tenant') ?? 'acme';
    const row = await Organization.query().where('slug', '=', slug).first();
    if (!row) return CarpenterResponse.json({ error: 'Organization not found' }, 404);

    const org = Organization.hydrate(row);
    const oldPlan = String(attr(org, 'plan') ?? 'free');
    await org.update({ plan: result.validated['plan'] });
    await events.dispatch('subscription.changed', { org: slug, plan: result.validated['plan'], previousPlan: oldPlan });
    return CarpenterResponse.json({ org: slug, plan: result.validated['plan'], features: getPlanLimits(result.validated['plan'] as string).features });
  });

  // External analytics (gated to pro+)
  router.get('/api/analytics', async (req) => {
    const slug = req.header('x-tenant') ?? 'acme';
    const org = await Organization.query().where('slug', '=', slug).first();
    const plan = String(attr(org, 'plan') ?? 'free');

    if (!hasFeature(plan, 'advanced_analytics')) {
      return CarpenterResponse.json({ error: 'Analytics requires Pro plan', upgrade: '/billing/upgrade' }, 403);
    }
    try {
      return CarpenterResponse.json({ data: await fetchAnalytics(slug) });
    } catch (err) {
      return CarpenterResponse.json({ error: (err as Error).message, circuit: getAnalyticsCircuitState() }, 503);
    }
  });
}
