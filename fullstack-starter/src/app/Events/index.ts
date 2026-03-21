import { EventDispatcher } from '@formwork/events';
import { InMemoryBroadcaster } from '@formwork/realtime';
/**
 * @module app/Events
 * @description Domain event listeners - side effects triggered by business events.
 *
 * Events:
 *   user.registered  -> Queue welcome email, log analytics
 *   post.created     -> Notify followers, index search
 *   post.updated     -> Refresh search index
 *   post.deleted     -> Cleanup attachments
 *   comment.created  -> Broadcast to post channel, notify author
 *
 * @example
 * ```ts
 * const events = container.make<EventDispatcher>('events');
 * registerEventListeners(events);
 * await events.dispatch('post.created', { postId: 1, title: 'Hello' });
 * ```
 */


const broadcaster = new InMemoryBroadcaster();

/**
 * Register all application event listeners.
 *
 * @param {EventDispatcher} events - The event dispatcher instance
 * @returns {void}
 */
export function registerEventListeners(events: EventDispatcher): void {
  events.on('user.registered', async (data) => {
    const d = data as Record<string, unknown>;
    console.log('[Event:user.registered] Welcome email queued for user ' + d['userId']);
    // In production: queue.push({ name: 'SendWelcomeEmail', payload: d });
  });

  events.on('post.created', async (data) => {
    const d = data as Record<string, unknown>;
    console.log('[Event:post.created] Notifying followers: ' + d['title']);
  });

  events.on('post.updated', async () => console.log('[Event:post.updated] Search index refreshed'));
  events.on('post.deleted', async () => console.log('[Event:post.deleted] Cleanup done'));

  events.on('comment.created', async (data) => {
    const d = data as Record<string, unknown>;
    broadcaster.broadcast('post.' + d['post_id'], 'NewComment', d);
    console.log('[Event:comment.created] Broadcast to post.' + d['post_id']);
  });
}
