/**
 * NotificationBell island — live notification dropdown for SaaS.
 */
import { Island } from '@formwork/ui';

interface NotificationBellProps {
  unreadCount: number;
  recent: Array<{ id: string; title: string; time: string; read: boolean }>;
}

export const NotificationBell = Island<NotificationBellProps>({
  name: 'NotificationBell',
  hydration: 'eager',
  render: (props) => {
    const items = props.recent
      .map(n => `
        <div style="padding:0.5rem 0.75rem;border-bottom:1px solid #f3f4f6;${!n.read ? 'background:#eff6ff;' : ''}">
          <div style="font-size:0.875rem;">${n.title}</div>
          <div style="font-size:0.75rem;color:#6c757d;">${n.time}</div>
        </div>`)
      .join('');

    return `
      <div style="position:relative;display:inline-block;">
        <button id="notif-toggle" style="background:none;border:none;cursor:pointer;position:relative;font-size:1.25rem;color:#cbd5e1;">
          &#128276;
          ${props.unreadCount > 0 ? `<span style="position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;font-size:0.625rem;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;">${props.unreadCount}</span>` : ''}
        </button>
        <div id="notif-panel" style="display:none;position:absolute;right:0;top:100%;margin-top:0.5rem;background:#fff;border:1px solid #e5e7eb;border-radius:8px;width:300px;max-height:320px;overflow-y:auto;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:50;">
          <div style="padding:0.75rem;border-bottom:1px solid #e5e7eb;font-weight:600;">Notifications</div>
          ${items || '<div style="padding:1rem;text-align:center;color:#6c757d;">No notifications</div>'}
          <a href="/notifications" style="display:block;text-align:center;padding:0.5rem;font-size:0.875rem;color:#818cf8;">View All</a>
        </div>
      </div>
    `;
  },
});
