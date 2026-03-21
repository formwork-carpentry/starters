/**
 * NotificationBell island — visible hydration (hydrates when scrolled into view).
 * Displays unread notification count and dropdown.
 */
import { Island } from '@formwork/ui';
import type { HydrationStrategy } from '@formwork/ui';

interface NotificationBellProps {
  notifications: Array<{ id: number; title: string; message: string; read: boolean }>;
  unreadCount: number;
}

export const NotificationBellIsland = Island<NotificationBellProps>({
  name: 'NotificationBell',
  hydration: 'visible' as HydrationStrategy,

  render(props: NotificationBellProps): string {
    const items = props.notifications
      .slice(0, 5)
      .map(
        (n) => `
        <div style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; ${n.read ? 'opacity: 0.6;' : ''}">
          <strong style="font-size: 0.9rem;">${n.title}</strong>
          <p style="font-size: 0.8rem; color: #6c757d; margin-top: 0.25rem;">${n.message}</p>
        </div>`,
      )
      .join('');

    return `
      <div data-island="NotificationBell" style="position: relative;">
        <button data-bell-toggle style="background: none; border: none; cursor: pointer; position: relative; font-size: 1.25rem; padding: 0.25rem;">
          🔔
          ${props.unreadCount > 0 ? `<span style="position: absolute; top: -4px; right: -4px; background: #dc3545; color: #fff; font-size: 0.7rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${props.unreadCount}</span>` : ''}
        </button>
        <div data-bell-dropdown style="display: none; position: absolute; right: 0; top: 100%; width: 320px; background: #fff; border: 1px solid #dee2e6; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 50;">
          <div style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; font-weight: 600;">
            Notifications ${props.unreadCount > 0 ? `(${props.unreadCount} new)` : ''}
          </div>
          ${items || '<div style="padding: 2rem; text-align: center; color: #6c757d;">No notifications</div>'}
          <a href="/notifications" style="display: block; text-align: center; padding: 0.75rem; color: #4361ee; text-decoration: none; border-top: 1px solid #e9ecef;">View All</a>
        </div>
      </div>
    `;
  },
});
