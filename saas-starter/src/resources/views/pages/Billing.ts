/**
 * SaaS Billing — plan comparison, current subscription, invoices.
 */
import { IslandRenderer, Island } from '@formwork/ui';

interface BillingProps {
  currentPlan: string;
  subscription: {
    status: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string;
    amount: number;
    currency: string;
  } | null;
  invoices: Array<{ id: string; date: string; amount: number; currency: string; status: string }>;
  plans: Array<{
    name: string;
    price: number;
    period: string;
    features: string[];
    limits: { seats: number; apiCalls: number };
  }>;
}

interface PlanSelectorProps {
  plans: BillingProps['plans'];
  currentPlan: string;
}

const PlanSelector = Island<PlanSelectorProps>({
  name: 'PlanSelector',
  hydration: 'eager',
  render: (props) => {
    const cards = props.plans.map(p => {
      const isCurrent = p.name.toLowerCase() === props.currentPlan.toLowerCase();
      return `
        <div class="card" style="border: 2px solid ${isCurrent ? '#818cf8' : '#e5e7eb'}; text-align: center; padding: 2rem;">
          <h3>${p.name}</h3>
          <div style="font-size: 2.5rem; font-weight: 700; margin: 1rem 0;">$${p.price}<small style="font-size:0.875rem;color:#6c757d;">/${p.period}</small></div>
          <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem; text-align: left;">
            ${p.features.map(f => `<li style="padding: 0.25rem 0;">&#10003; ${f}</li>`).join('')}
            <li style="padding: 0.25rem 0; color: #6c757d;">Up to ${p.limits.seats} seats</li>
            <li style="padding: 0.25rem 0; color: #6c757d;">${p.limits.apiCalls.toLocaleString()} API calls/day</li>
          </ul>
          ${isCurrent
            ? '<button class="btn" disabled style="width:100%;">Current Plan</button>'
            : `<button class="btn btn-primary" style="width:100%;" data-plan="${p.name.toLowerCase()}">
                ${p.price > 0 ? 'Upgrade' : 'Downgrade'}
              </button>`}
        </div>`;
    }).join('');
    return `<div class="grid grid-3">${cards}</div>`;
  },
});

export function SaaSBillingPage(props: BillingProps, islandRenderer: IslandRenderer): string {
  const planIsland = islandRenderer.island(PlanSelector, {
    plans: props.plans,
    currentPlan: props.currentPlan,
  });

  const subCard = props.subscription
    ? `<div class="card" style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3>Current Subscription</h3>
            <span class="badge badge-${props.currentPlan}">${props.currentPlan}</span>
            <span class="badge badge-${props.subscription.status}">${props.subscription.status}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.5rem; font-weight: 700;">$${props.subscription.amount}/${props.subscription.currency}</div>
            <div style="color: #6c757d; font-size: 0.875rem;">Renews ${props.subscription.currentPeriodEnd}</div>
          </div>
        </div>
        ${props.subscription.trialEndsAt ? `<div style="margin-top:0.5rem;padding:0.5rem;background:#fef3c7;border-radius:4px;">Trial ends ${props.subscription.trialEndsAt}</div>` : ''}
      </div>`
    : `<div class="card" style="margin-bottom: 2rem; text-align: center; padding: 2rem;">
        <h3>No Active Subscription</h3>
        <p style="color: #6c757d;">You are on the free plan. Upgrade to unlock more features.</p>
      </div>`;

  const invoiceRows = props.invoices
    .map(inv => `<tr>
      <td>${inv.id}</td>
      <td>${inv.date}</td>
      <td>$${(inv.amount / 100).toFixed(2)} ${inv.currency.toUpperCase()}</td>
      <td><span class="badge badge-${inv.status}">${inv.status}</span></td>
    </tr>`)
    .join('');

  return `
    <h1 style="margin-bottom: 2rem;">Billing &amp; Plans</h1>

    ${subCard}

    <h2 style="margin-bottom: 1rem;">Choose a Plan</h2>
    ${planIsland}

    <h2 style="margin: 2rem 0 1rem;">Invoice History</h2>
    <div class="card">
      <table style="width: 100%;">
        <thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>${invoiceRows || '<tr><td colspan="4" style="text-align:center;color:#6c757d;">No invoices yet</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

export { PlanSelector };
