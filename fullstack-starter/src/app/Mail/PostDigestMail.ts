/**
 * PostDigestMail — weekly digest of new posts.
 */
import { BaseMailable } from '@formwork/mail';
import type { MailMessage } from '@formwork/mail';

export class PostDigestMail extends BaseMailable {
  constructor(
    private recipientEmail: string,
    private posts: Array<{ title: string; slug: string }>,
  ) {
    super();
  }

  build(): MailMessage {
    const list = this.posts.map((p) => `<li><a href="/posts/${p.slug}">${p.title}</a></li>`).join('');
    return this
      .to(this.recipientEmail)
      .subject('Your Weekly Post Digest')
      .toMessage();
  }
}
