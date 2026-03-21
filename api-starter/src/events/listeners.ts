import { EventDispatcher } from '@formwork/events';
/**
 * Event listeners - react to domain events.
 */

export function registerEventListeners(events: EventDispatcher): void {
  events.on('user.registered', async (data) => {
    const d = data as Record<string, unknown>;
    console.log('[Event:user.registered] Welcome email queued for user ' + d['userId']);
  });
  events.on('post.created', async (data) => {
    console.log('[Event:post.created] Notifying followers:', (data as Record<string, unknown>)['title']);
  });
  events.on('post.updated', async () => console.log('[Event:post.updated] Search index refreshed'));
  events.on('post.deleted', async () => console.log('[Event:post.deleted] Cleanup done'));
}
