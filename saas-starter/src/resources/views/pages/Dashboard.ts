/**
 * SaaS Dashboard — org overview with stats, usage, recent activity.
 */
import { IslandRenderer, Island } from '@formwork/ui';

interface DashboardProps {
  orgName: string;
  plan: string;
  stats: {
    members: number;
    seatsUsed: number;
    seatsLimit: number;
    apiCallsToday: number;
    apiCallsLimit: number;
  };
  recentActivity: Array<{ action: string; user: string; time: string }>;
}

interface UsageChartProps {
  apiUsage: number;
  apiLimit: number;
  seatUsage: number;
  seatLimit: number;
}

const UsageChart = Island<UsageChartProps>({
  name: 'UsageChart',
  hydration: 'visible',
  render: (props) => `
    <div class="usage-chart">
      <div style="margin-bottom: 1rem;">
        <label>API Calls</label>
        <div style="background: #e5e7eb; border-radius: 4px; overflow: hidden;">
          <div style="background: ${props.apiUsage / props.apiLimit > 0.8 ? '#ef4444' : '#818cf8'}; height: 20px; width: ${Math.min((props.apiUsage / props.apiLimit) * 100, 100)}%;"></div>
        </div>
        <small>${props.apiUsage.toLocaleString()} / ${props.apiLimit.toLocaleString()}</small>
      </div>
      <div>
        <label>Seats</label>
        <div style="background: #e5e7eb; border-radius: 4px; overflow: hidden;">
          <div style="background: ${props.seatUsage / props.seatLimit > 0.8 ? '#ef4444' : '#10b981'}; height: 20px; width: ${Math.min((props.seatUsage / props.seatLimit) * 100, 100)}%;"></div>
        </div>
        <small>${props.seatUsage} / ${props.seatLimit}</small>
      </div>
    </div>
  `,
});

export function SaaSDashboardPage(props: DashboardProps, islandRenderer: IslandRenderer): string {
  const usageIsland = islandRenderer.island(UsageChart, {
    apiUsage: props.stats.apiCallsToday,
    apiLimit: props.stats.apiCallsLimit,
    seatUsage: props.stats.seatsUsed,
    seatLimit: props.stats.seatsLimit,
  });

  const activityRows = props.recentActivity
    .map(a => `<tr><td>${a.action}</td><td>${a.user}</td><td>${a.time}</td></tr>`)
    .join('');

  const planBadge = `<span class="badge badge-${props.plan}">${props.plan}</span>`;

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h1>${props.orgName} Dashboard</h1>
      <div>${planBadge} <a href="/billing" class="btn btn-primary" style="margin-left: 0.5rem;">Manage Plan</a></div>
    </div>

    <div class="grid grid-4" style="margin-bottom: 2rem;">
      <div class="card" style="text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">${props.stats.members}</div>
        <div style="color: #6c757d;">Team Members</div>
      </div>
      <div class="card" style="text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">${props.stats.seatsUsed}/${props.stats.seatsLimit}</div>
        <div style="color: #6c757d;">Seats</div>
      </div>
      <div class="card" style="text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">${props.stats.apiCallsToday.toLocaleString()}</div>
        <div style="color: #6c757d;">API Calls Today</div>
      </div>
      <div class="card" style="text-align: center;">
        <div style="font-size: 2rem; font-weight: 700; color: #10b981;">Active</div>
        <div style="color: #6c757d;">Status</div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Usage</h3>
        ${usageIsland}
      </div>
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Recent Activity</h3>
        <table>
          <thead><tr><th>Action</th><th>User</th><th>Time</th></tr></thead>
          <tbody>${activityRows || '<tr><td colspan="3" style="text-align:center;color:#6c757d;">No recent activity</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

export { UsageChart };
