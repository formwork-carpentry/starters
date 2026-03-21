/**
 * OrgSwitcher island — dropdown to switch between organizations.
 */
import { Island } from '@formwork/ui';

interface OrgSwitcherProps {
  current: { id: string; name: string };
  organizations: Array<{ id: string; name: string; plan: string }>;
}

export const OrgSwitcher = Island<OrgSwitcherProps>({
  name: 'OrgSwitcher',
  hydration: 'eager',
  render: (props) => {
    const options = props.organizations
      .map(o => `<option value="${o.id}" ${o.id === props.current.id ? 'selected' : ''}>${o.name} (${o.plan})</option>`)
      .join('');

    return `
      <div class="org-switcher" style="position:relative;">
        <select
          id="org-select"
          style="appearance:none;background:#1e293b;color:#fff;border:1px solid #475569;border-radius:6px;padding:0.375rem 2rem 0.375rem 0.75rem;font-size:0.875rem;cursor:pointer;"
          onchange="window.location.href='/org/' + this.value + '/dashboard'"
        >
          ${options}
        </select>
        <span style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);pointer-events:none;color:#94a3b8;">&#9662;</span>
      </div>
    `;
  },
});
