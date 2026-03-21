/**
 * SendNotificationJob — dispatched to deliver notifications asynchronously.
 */
import { BaseJob } from '@formwork/queue';
import { NotificationManager } from '@formwork/notifications';

interface SendNotificationPayload {
  notifiableId: number;
  notificationType: string;
  data: Record<string, unknown>;
}

export class SendNotificationJob extends BaseJob {
  constructor(private payload: SendNotificationPayload) {
    super();
  }

  async execute(): Promise<void> {
    console.log(`[Job:SendNotification] Delivering ${this.payload.notificationType} to user ${this.payload.notifiableId}`);
    // In production: resolve notifiable from DB, instantiate notification, send via NotificationManager
  }

  static toQueuedJob(payload: SendNotificationPayload) {
    return {
      name: 'SendNotificationJob',
      payload,
      queue: 'notifications',
      retries: 3,
    };
  }
}
