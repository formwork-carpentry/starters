/**
 * SaaS web routes — SSR pages rendered with IslandRenderer.
 */
import type { Router } from '@formwork/http';
import { CarpenterResponse } from '@formwork/http';
import type { Container } from '@formwork/core/container';
import type { IslandRenderer } from '@formwork/ui';
import { SaaSLayout } from '../resources/views/layouts/SaaSLayout.js';
import { SaaSLoginPage } from '../resources/views/pages/Login.js';
import { LandingPage } from '../resources/views/pages/Landing.js';
import { SaaSDashboardPage } from '../resources/views/pages/Dashboard.js';
import { SaaSBillingPage } from '../resources/views/pages/Billing.js';
import { SaaSTeamPage } from '../resources/views/pages/Team.js';
import { Organization, Member } from '../models/Organization.js';
import { attr } from '../helpers.js';
import { getPlanLimits } from '../services/FeatureFlags.js';

export function registerWebRoutes(router: Router, container: Container): void {
  const islandRenderer = container.make<IslandRenderer>('islands');

  // Landing page (public)
  router.get('/', async () => {
    const body = LandingPage();
    return CarpenterResponse.html(SaaSLayout({ title: 'SaaS Platform', body, navItems: [] }));
  });

  // Login page (public)
  router.get('/login', async () => {
    const body = SaaSLoginPage(['google', 'github']);
    return CarpenterResponse.html(body);
  });

  // Dashboard (tenant-scoped)
  router.get('/dashboard', async (req) => {
    const slug = req.header('x-tenant') ?? 'acme';
    const org = await Organization.query().where('slug', '=', slug).first();
    const orgName = String(attr(org, 'name') ?? slug);
    const plan = String(attr(org, 'plan') ?? 'free');
    const limits = getPlanLimits(plan);

    const body = SaaSDashboardPage(
      {
        orgName,
        plan,
        stats: {
          members: Number(attr(org, 'seats_used') ?? 0),
          seatsUsed: Number(attr(org, 'seats_used') ?? 0),
          seatsLimit: limits.seats,
          apiCallsToday: Math.floor(Math.random() * limits.apiCalls),
          apiCallsLimit: limits.apiCalls,
        },
        recentActivity: [
          { action: 'Invited member', user: 'Admin', time: 'Just now' },
          { action: 'Changed plan', user: 'Admin', time: '1h ago' },
        ],
      },
      islandRenderer,
    );

    const navItems = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Team', href: '/team' },
      { label: 'Billing', href: '/billing' },
    ];
    return CarpenterResponse.html(SaaSLayout({ title: orgName + ' Dashboard', body, navItems, currentOrg: orgName }));
  });

  // Billing page
  router.get('/billing', async (req) => {
    const slug = req.header('x-tenant') ?? 'acme';
    const org = await Organization.query().where('slug', '=', slug).first();
    const plan = String(attr(org, 'plan') ?? 'free');

    const plans = ['free', 'pro', 'enterprise'].map(p => {
      const l = getPlanLimits(p);
      const prices: Record<string, number> = { free: 0, pro: 29, enterprise: 99 };
      return { name: p, price: prices[p] ?? 0, period: 'month', features: l.features, limits: { seats: l.seats, apiCalls: l.apiCalls } };
    });

    const body = SaaSBillingPage(
      { currentPlan: plan, subscription: plan !== 'free' ? { status: 'active', trialEndsAt: null, currentPeriodEnd: '2025-02-01', amount: plans.find(p => p.name === plan)?.price ?? 0, currency: 'USD' } : null, invoices: [], plans },
      islandRenderer,
    );

    const navItems = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Team', href: '/team' },
      { label: 'Billing', href: '/billing' },
    ];
    return CarpenterResponse.html(SaaSLayout({ title: 'Billing', body, navItems }));
  });

  // Team page
  router.get('/team', async (req) => {
    const slug = req.header('x-tenant') ?? 'acme';
    const org = await Organization.query().where('slug', '=', slug).first();
    const orgName = String(attr(org, 'name') ?? slug);
    const plan = String(attr(org, 'plan') ?? 'free');
    const limits = getPlanLimits(plan);

    const rows = await Member.query().where('org_id', '=', Number(attr(org, 'id') ?? 0)).get();
    const members = (rows as Array<Record<string, unknown>>).map(m => ({
      id: String(m['id']),
      name: String(m['name'] ?? ''),
      email: String(m['email'] ?? ''),
      role: (m['role'] as 'owner' | 'admin' | 'member') ?? 'member',
      joinedAt: String(m['created_at'] ?? 'Unknown'),
    }));

    const body = SaaSTeamPage(
      {
        orgName,
        members,
        pendingInvites: [],
        seatsUsed: Number(attr(org, 'seats_used') ?? 0),
        seatsLimit: limits.seats,
      },
      islandRenderer,
    );

    const navItems = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Team', href: '/team' },
      { label: 'Billing', href: '/billing' },
    ];
    return CarpenterResponse.html(SaaSLayout({ title: orgName + ' Team', body, navItems }));
  });
}
