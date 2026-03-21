/**
 * Team invite mail — sent alongside invite notification.
 */
import { BaseMailable } from '@formwork/mail';

export class TeamInviteMail extends BaseMailable {
  constructor(
    private recipientEmail: string,
    private orgName: string,
    private inviterName: string,
    private inviteUrl: string,
  ) {
    super();
  }

  build(): this {
    return this
      .to(this.recipientEmail)
      .subject(`You've been invited to join ${this.orgName}`)
      .toMessage(`
        <h1>Join ${this.orgName}</h1>
        <p>${this.inviterName} has invited you to collaborate on ${this.orgName}.</p>
        <p><a href="${this.inviteUrl}" style="background:#4361ee;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Accept Invitation</a></p>
        <p>This invitation will expire in 7 days.</p>
      `);
  }
}
