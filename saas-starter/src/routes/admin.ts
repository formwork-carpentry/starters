import { Organization } from '../models/Organization.js';
import { getTenantStore } from '../tenants/seed.js';
import { getPlanLimits } from '../services/FeatureFlags.js';
import type { Container } from '@formwork/core/container';
import { EventDispatcher } from '@formwork/events';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';
import { Validator } from '@formwork/validation';

const validator = new Validator();

export function registerAdminRoutes(router: Router, container: Container): void {
  const events = container.make<EventDispatcher>('events');
  const tenantStore = getTenantStore();

  router.get('/admin/tenants', async () => {
    const tenants = await tenantStore.all();
    return CarpenterResponse.json({ data: tenants, total: tenants.length });
  });

  router.post('/admin/tenants', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { name: 'required|string|min:2', slug: 'required|string|min:2', plan: 'in:free,pro,enterprise' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const plan = (result.validated['plan'] as string) ?? 'free';
    const tenant = await tenantStore.create({
      id: result.validated['slug'] as string,
      name: result.validated['name'] as string,
      slug: result.validated['slug'] as string,
      domain: result.validated['slug'] + '.saas.local',
      status: 'active',
    });
    await Organization.create({
      name: result.validated['name'], slug: result.validated['slug'],
      plan, owner_id: 0, seats_used: 0, seats_limit: getPlanLimits(plan).seats,
    });
    await events.dispatch('tenant.created', { name: result.validated['name'], slug: result.validated['slug'] });
    return CarpenterResponse.json({ data: tenant }, 201);
  });
}
