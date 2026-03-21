import { EventDispatcher } from '@formwork/events';

export function registerEventListeners(events: EventDispatcher): void {
  events.on('tenant.created', async (data) => {
    const d = data as Record<string, unknown>;
    console.log('[Event:tenant.created] ' + d['name'] + ' (' + d['slug'] + ')');
    // In production: send onboarding email, provision resources
  });

  events.on('subscription.changed', async (data) => {
    const d = data as Record<string, unknown>;
    console.log('[Event:subscription.changed] ' + d['org'] + ': ' + d['previousPlan'] + ' -> ' + d['plan']);
    // In production: email notification, update billing provider, adjust limits
  });

  events.on('usage.alert', async (data) => {
    const d = data as Record<string, unknown>;
    console.log('[Alert:usage] ' + d['org'] + ' approaching ' + d['metric'] + ' limit');
    // In production: email admin, webhook, Slack notification
  });
}
