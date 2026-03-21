/**
 * Team invite notification — sent when a user is invited to join an organization.
 */
import { BaseNotification } from '@formwork/notifications';

export class TeamInviteNotification extends BaseNotification {
  constructor(
    private orgName: string,
    private inviterName: string,
    private inviteUrl: string,
  ) {
    super();
  }

  via(): string[] {
    return ['mail', 'database'];
  }

  toMail(): { to: string; subject: string; html: string } {
    return {
      to: '', // filled by notification system
      subject: `You've been invited to join ${this.orgName}`,
      html: `<h1>Team Invitation</h1><p>${this.inviterName} invited you to join <strong>${this.orgName}</strong>.</p><p><a href="${this.inviteUrl}">Accept Invitation</a></p>`,
    };
  }

  toDatabase(): Record<string, unknown> {
    return { type: 'team_invite', orgName: this.orgName, inviterName: this.inviterName, inviteUrl: this.inviteUrl };
  }
}
