/**
 * WelcomeMail — sent to new users after registration.
 */
import { BaseMailable } from '@formwork/mail';
import type { MailMessage } from '@formwork/mail';

export class WelcomeMail extends BaseMailable {
  constructor(
    private userName: string,
    private userEmail: string,
  ) {
    super();
  }

  build(): MailMessage {
    return this
      .to(this.userEmail, this.userName)
      .subject(`Welcome to Carpenter, ${this.userName}!`)
      .toMessage();
  }
}
