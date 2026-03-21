/**
 * PostPublishedNotification — sent when a post is published.
 * Delivers via database and webhook channels.
 */
import { BaseNotification } from '@formwork/notifications';
import type { Notifiable } from '@formwork/notifications';

export class PostPublishedNotification extends BaseNotification {
  constructor(
    private postTitle: string,
    private postId: number,
  ) {
    super();
  }

  via(_notifiable: Notifiable): string[] {
    return ['database', 'webhook'];
  }

  toDatabase(_notifiable: Notifiable): Record<string, unknown> {
    return {
      type: 'post_published',
      title: 'New Post Published',
      message: `"${this.postTitle}" has been published.`,
      post_id: this.postId,
    };
  }

  toWebhook(_notifiable: Notifiable): Record<string, unknown> {
    return {
      event: 'post.published',
      data: { post_id: this.postId, title: this.postTitle },
    };
  }
}
