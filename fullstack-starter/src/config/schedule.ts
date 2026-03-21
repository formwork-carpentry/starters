/**
 * Scheduler configuration — cron-based task definitions.
 */
import { Scheduler } from '@formwork/scheduler';

export function configureScheduler(): Scheduler {
  const scheduler = new Scheduler();

  scheduler
    .schedule('cache:clear-expired', async () => {
      console.log('[Scheduler] Clearing expired cache entries');
      // In production: cache.tags(['expired']).flush()
    })
    .daily()
    .description('Clear expired cache entries');

  scheduler
    .schedule('analytics:daily-report', async () => {
      console.log('[Scheduler] Generating daily analytics report');
      // In production: compile stats, store in DB, optionally email admins
    })
    .dailyAt(2, 0)
    .description('Generate daily analytics summary at 2 AM');

  scheduler
    .schedule('digest:weekly-posts', async () => {
      console.log('[Scheduler] Sending weekly post digest emails');
      // In production: query recent posts, send PostDigestMail to subscribers
    })
    .weeklyOn(1, 9, 0)
    .description('Send weekly post digest every Monday at 9 AM');

  scheduler
    .schedule('audit:prune-old-entries', async () => {
      console.log('[Scheduler] Pruning audit log entries older than 90 days');
      // In production: DELETE FROM activity_log WHERE created_at < NOW() - INTERVAL 90 DAY
    })
    .monthly()
    .description('Prune audit log entries older than 90 days');

  scheduler
    .schedule('queue:retry-failed', async () => {
      console.log('[Scheduler] Retrying failed queue jobs');
      // In production: move failed_jobs back to jobs table
    })
    .hourly()
    .description('Retry failed queue jobs');

  return scheduler;
}
