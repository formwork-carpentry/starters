/**
 * UsageMeter island — visual progress bars for org resource consumption.
 */
import { Island } from '@formwork/ui';

interface UsageMeterProps {
  metrics: Array<{
    label: string;
    used: number;
    limit: number;
    unit: string;
  }>;
}

export const UsageMeter = Island<UsageMeterProps>({
  name: 'UsageMeter',
  hydration: 'visible',
  render: (props) => {
    const bars = props.metrics.map(m => {
      const pct = Math.min((m.used / m.limit) * 100, 100);
      const color = pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981';
      return `
        <div style="margin-bottom:0.75rem;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem;">
            <span style="font-size:0.875rem;font-weight:500;">${m.label}</span>
            <span style="font-size:0.75rem;color:#6c757d;">${m.used.toLocaleString()} / ${m.limit.toLocaleString()} ${m.unit}</span>
          </div>
          <div style="background:#e5e7eb;border-radius:4px;overflow:hidden;height:8px;">
            <div style="background:${color};height:100%;width:${pct}%;transition:width 0.3s;"></div>
          </div>
        </div>`;
    }).join('');
    return `<div class="usage-meter">${bars}</div>`;
  },
});
