/**
 * SaaS Landing page — pricing, features, CTA.
 */
import { IslandRenderer } from '@formwork/ui';

interface LandingProps {
  nav: Record<string, string>;
  plans: Array<{ id: string; name: string; price: number; features: string[] }>;
}

export function LandingPage(props: LandingProps, islandRenderer: IslandRenderer): string {
  const planCards = props.plans.map(plan => `
    <div class="card" style="text-align: center; ${plan.id === 'pro' ? 'border: 2px solid #818cf8;' : ''}">
      <h3>${plan.name}</h3>
      <p style="font-size: 2rem; font-weight: 700; margin: 1rem 0;">
        ${plan.price === 0 ? 'Free' : `$${(plan.price / 100).toFixed(0)}<span style="font-size: 1rem; font-weight: 400;">/mo</span>`}
      </p>
      <ul style="list-style: none; text-align: left; margin: 1rem 0;">
        ${plan.features.map(f => `<li style="padding: 0.25rem 0;">✓ ${f.replace(/_/g, ' ')}</li>`).join('')}
      </ul>
      <a href="/register?plan=${plan.id}" class="btn btn-primary" style="width: 100%;">
        ${plan.price === 0 ? 'Start Free' : 'Get Started'}
      </a>
    </div>
  `).join('');

  return `
    <section style="text-align: center; padding: 4rem 0;">
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Build your SaaS faster</h1>
      <p style="font-size: 1.2rem; color: #6c757d; max-width: 600px; margin: 0 auto 2rem;">
        Multi-tenant architecture, billing, team management, and more — all built on Carpenter Framework.
      </p>
      <a href="/register" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2rem;">Start Your Free Trial</a>
    </section>

    <section style="margin: 3rem 0;">
      <h2 style="text-align: center; margin-bottom: 2rem;">Pricing</h2>
      <div class="grid grid-3">${planCards}</div>
    </section>

    <section style="margin: 4rem 0; text-align: center;">
      <h2 style="margin-bottom: 1rem;">Everything you need</h2>
      <div class="grid grid-4" style="text-align: left;">
        <div class="card"><h4>Multi-Tenancy</h4><p>Isolated data per organization with subdomain routing.</p></div>
        <div class="card"><h4>Billing</h4><p>Stripe-ready subscriptions with usage metering.</p></div>
        <div class="card"><h4>Team Management</h4><p>RBAC, invitations, and org-scoped permissions.</p></div>
        <div class="card"><h4>Feature Flags</h4><p>Plan-gated features with progressive rollouts.</p></div>
      </div>
    </section>
  `;
}
