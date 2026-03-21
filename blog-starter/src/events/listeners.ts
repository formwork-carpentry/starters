import { EventDispatcher } from '@formwork/events';
import { InMemoryBroadcaster } from '@formwork/realtime';

const broadcaster = new InMemoryBroadcaster();

export function registerEventListeners(events: EventDispatcher): void {
  events.on('user.registered', async (data) => {
    const d = data as Record<string, unknown>;
    console.log('[Event:user.registered] Welcome email queued for user ' + d['userId']);
  });

  events.on('post.created', async (data) => {
    console.log('[Event:post.created] Notifying followers:', (data as Record<string, unknown>)['title']);
  });

  events.on('comment.created', async (data) => {
    const d = data as Record<string, unknown>;
    broadcaster.broadcast('post.' + d['post_id'], 'NewComment', d);
    console.log('[Event:comment.created] Broadcast to post.' + d['post_id']);
  });
}
