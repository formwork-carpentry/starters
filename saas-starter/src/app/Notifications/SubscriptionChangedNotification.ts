/**
 * Subscription changed notification — sent when an org changes its plan.
 */
import { BaseNotification } from '@formwork/notifications';

export class SubscriptionChangedNotification extends BaseNotification {
  constructor(
    private orgName: string,
    private oldPlan: string,
    private newPlan: string,
  ) {
    super();
  }

  via(): string[] {
    return ['mail', 'database'];
  }

  toMail(): { to: string; subject: string; html: string } {
    return {
      to: '',
      subject: `Subscription updated for ${this.orgName}`,
      html: `<h1>Plan Changed</h1><p>${this.orgName} has been updated from <strong>${this.oldPlan}</strong> to <strong>${this.newPlan}</strong>.</p>`,
    };
  }

  toDatabase(): Record<string, unknown> {
    return { type: 'subscription_changed', orgName: this.orgName, oldPlan: this.oldPlan, newPlan: this.newPlan };
  }
}
