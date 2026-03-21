/**
 * WelcomeNotification — sent when a new user registers.
 * Delivers via mail and database channels.
 */
import { BaseNotification } from '@formwork/notifications';
import type { Notifiable } from '@formwork/notifications';
import type { MailMessage } from '@formwork/mail';

export class WelcomeNotification extends BaseNotification {
  constructor(private userName: string) {
    super();
  }

  via(_notifiable: Notifiable): string[] {
    return ['mail', 'database'];
  }

  toMail(_notifiable: Notifiable): MailMessage {
    return {
      to: [{ email: _notifiable.routeNotificationFor('mail') ?? '' }],
      subject: `Welcome to Carpenter, ${this.userName}!`,
      html: `<h1>Welcome, ${this.userName}!</h1><p>Your account has been created. Get started by creating your first post.</p>`,
      text: `Welcome, ${this.userName}! Your account has been created.`,
    };
  }

  toDatabase(_notifiable: Notifiable): Record<string, unknown> {
    return {
      type: 'welcome',
      title: 'Welcome!',
      message: `Welcome to Carpenter, ${this.userName}. Start by exploring the dashboard.`,
    };
  }
}
