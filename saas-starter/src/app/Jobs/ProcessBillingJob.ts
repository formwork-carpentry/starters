/**
 * Process billing job — handles subscription billing and invoice generation.
 */
import { BaseJob } from '@formwork/queue';

export class ProcessBillingJob extends BaseJob {
  static queue = 'billing';
  static retries = 3;

  constructor(private orgId: number, private planId: string) {
    super();
  }

  async handle(): Promise<void> {
    console.log(`[ProcessBillingJob] Processing billing for org ${this.orgId}, plan: ${this.planId}`);
    // In production: create Stripe charge, generate invoice, update subscription status
  }

  static toQueuedJob(orgId: number, planId: string): { name: string; payload: Record<string, unknown>; queue: string } {
    return { name: 'ProcessBillingJob', payload: { orgId, planId }, queue: 'billing' };
  }
}
