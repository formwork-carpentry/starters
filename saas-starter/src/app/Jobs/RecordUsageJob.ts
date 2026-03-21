/**
 * Record usage metric job — tracks API calls, storage usage per tenant.
 */
import { BaseJob } from '@formwork/queue';

export class RecordUsageJob extends BaseJob {
  static queue = 'metrics';
  static retries = 2;

  constructor(
    private orgId: number,
    private metric: string,
    private quantity: number,
  ) {
    super();
  }

  async handle(): Promise<void> {
    console.log(`[RecordUsageJob] Recording ${this.metric}: ${this.quantity} for org ${this.orgId}`);
    // In production: INSERT INTO usage_records
  }

  static toQueuedJob(orgId: number, metric: string, quantity: number): { name: string; payload: Record<string, unknown>; queue: string } {
    return { name: 'RecordUsageJob', payload: { orgId, metric, quantity }, queue: 'metrics' };
  }
}
