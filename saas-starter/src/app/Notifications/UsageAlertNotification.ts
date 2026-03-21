/**
 * Usage alert notification — sent when a tenant approaches usage limits.
 */
import { BaseNotification } from '@formwork/notifications';

export class UsageAlertNotification extends BaseNotification {
  constructor(
    private orgName: string,
    private metric: string,
    private currentUsage: number,
    private limit: number,
  ) {
    super();
  }

  via(): string[] {
    return ['mail', 'database'];
  }

  toMail(): { to: string; subject: string; html: string } {
    const pct = Math.round((this.currentUsage / this.limit) * 100);
    return {
      to: '',
      subject: `Usage alert: ${this.orgName} at ${pct}% of ${this.metric} limit`,
      html: `<h1>Usage Alert</h1><p>${this.orgName} is at <strong>${pct}%</strong> of the ${this.metric} limit (${this.currentUsage}/${this.limit}).</p><p><a href="/billing/upgrade">Upgrade Plan</a></p>`,
    };
  }

  toDatabase(): Record<string, unknown> {
    return { type: 'usage_alert', orgName: this.orgName, metric: this.metric, currentUsage: this.currentUsage, limit: this.limit };
  }
}
