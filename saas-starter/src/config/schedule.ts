/**
 * Scheduler for SaaS — billing cycles, usage metering, cleanup.
 */
import { Scheduler } from '@formwork/scheduler';

export function configureScheduler(): Scheduler {
  const scheduler = new Scheduler();

  scheduler
    .schedule('billing:meter-usage', async () => {
      console.log('[Scheduler] Metering API usage across all tenants');
    })
    .hourly()
    .description('Record hourly API usage per tenant');

  scheduler
    .schedule('billing:generate-invoices', async () => {
      console.log('[Scheduler] Generating monthly invoices');
    })
    .monthly()
    .description('Generate invoices at start of billing period');

  scheduler
    .schedule('billing:check-past-due', async () => {
      console.log('[Scheduler] Checking for past-due subscriptions');
    })
    .daily()
    .description('Flag past-due subscriptions and send reminders');

  scheduler
    .schedule('tenants:cleanup-expired-trials', async () => {
      console.log('[Scheduler] Cleaning up expired trial accounts');
    })
    .daily()
    .description('Deactivate tenants whose trial has expired');

  scheduler
    .schedule('audit:prune-old-entries', async () => {
      console.log('[Scheduler] Pruning audit entries older than 90 days');
    })
    .monthly()
    .description('Remove old audit log entries');

  return scheduler;
}
