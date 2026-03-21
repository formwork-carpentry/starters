/**
 * Admin panel for SaaS — tenant management, subscription overview, user management.
 */
import { AdminPanel, AdminResource } from '@formwork/admin';

export function configureSaaSAdminPanel(): AdminPanel {
  const panel = new AdminPanel();
  panel.setPath('/admin');

  // ── Organization Resource ──
  const orgs = new AdminResource({ name: 'organization', label: 'Organization', labelPlural: 'Organizations', icon: 'building' });
  orgs
    .id()
    .text('name', 'Name').required().sortable().searchable()
    .text('slug', 'Slug').required().sortable()
    .select('plan', [
      { label: 'Free', value: 'free' },
      { label: 'Pro', value: 'pro' },
      { label: 'Enterprise', value: 'enterprise' },
    ], 'Plan').sortable().filterable()
    .number('seats_used', 'Seats Used').sortable()
    .number('seats_limit', 'Seats Limit').sortable()
    .text('domain', 'Custom Domain').hideOnIndex()
    .timestamps();
  orgs.filter('plan', 'select');
  orgs.action('suspend', (ids: string[]) => {
    console.log(`[Admin] Suspending orgs: ${ids.join(', ')}`);
  });
  orgs.action('upgrade-to-pro', (ids: string[]) => {
    console.log(`[Admin] Upgrading to Pro: ${ids.join(', ')}`);
  });
  panel.register(orgs);

  // ── User Resource ──
  const users = new AdminResource({ name: 'user', label: 'User', labelPlural: 'Users', icon: 'users' });
  users
    .id()
    .text('name', 'Name').required().sortable().searchable()
    .email('email', 'Email').required().sortable().searchable()
    .select('role', [
      { label: 'Super Admin', value: 'superadmin' },
      { label: 'Admin', value: 'admin' },
      { label: 'Member', value: 'member' },
    ], 'Role').sortable().filterable()
    .boolean('email_verified', 'Verified').filterable()
    .timestamps();
  users.filter('role', 'select');
  panel.register(users);

  // ── Subscription Resource ──
  const subs = new AdminResource({ name: 'subscription', label: 'Subscription', labelPlural: 'Subscriptions', icon: 'credit-card' });
  subs
    .id()
    .belongsTo('org_id', 'organization', 'Organization').sortable()
    .text('plan', 'Plan').sortable()
    .select('status', [
      { label: 'Active', value: 'active' },
      { label: 'Canceled', value: 'canceled' },
      { label: 'Past Due', value: 'past_due' },
      { label: 'Trialing', value: 'trialing' },
    ], 'Status').sortable().filterable()
    .datetime('current_period_start', 'Period Start')
    .datetime('current_period_end', 'Period End')
    .timestamps();
  subs.filter('status', 'select');
  panel.register(subs);

  // ── Member Resource ──
  const members = new AdminResource({ name: 'member', label: 'Member', labelPlural: 'Members', icon: 'user-plus' });
  members
    .id()
    .belongsTo('org_id', 'organization', 'Organization').sortable()
    .belongsTo('user_id', 'user', 'User').sortable()
    .select('role', [
      { label: 'Owner', value: 'owner' },
      { label: 'Admin', value: 'admin' },
      { label: 'Member', value: 'member' },
      { label: 'Viewer', value: 'viewer' },
    ], 'Role').sortable().filterable()
    .timestamps();
  panel.register(members);

  // ── Dashboard Widgets ──
  panel.widget({ id: 'total-orgs', label: 'Total Organizations', type: 'stat', query: 'SELECT COUNT(*) FROM organizations' });
  panel.widget({ id: 'total-revenue', label: 'Monthly Revenue', type: 'stat', query: 'SELECT SUM(amount_cents) FROM invoices WHERE status = \'paid\'' });
  panel.widget({ id: 'active-subscriptions', label: 'Active Subscriptions', type: 'stat', query: 'SELECT COUNT(*) FROM subscriptions WHERE status = \'active\'' });
  panel.widget({ id: 'plan-distribution', label: 'Plan Distribution', type: 'chart', query: 'SELECT plan, COUNT(*) FROM organizations GROUP BY plan' });

  panel.autoNav();
  return panel;
}
