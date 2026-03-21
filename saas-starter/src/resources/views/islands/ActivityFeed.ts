/**
 * ActivityFeed island — real-time org activity stream.
 */
import { Island } from '@formwork/ui';

interface ActivityFeedProps {
  events: Array<{ icon: string; message: string; user: string; time: string }>;
}

export const ActivityFeed = Island<ActivityFeedProps>({
  name: 'ActivityFeed',
  hydration: 'visible',
  render: (props) => {
    const items = props.events
      .map(ev => `
        <div style="display:flex;gap:0.75rem;padding:0.625rem 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:1.25rem;">${ev.icon}</span>
          <div style="flex:1;">
            <div style="font-size:0.875rem;"><strong>${ev.user}</strong> ${ev.message}</div>
            <div style="font-size:0.75rem;color:#6c757d;">${ev.time}</div>
          </div>
        </div>`)
      .join('');

    return `
      <div class="activity-feed">
        ${items || '<div style="text-align:center;color:#6c757d;padding:1rem;">No recent activity</div>'}
      </div>
    `;
  },
});
