/**
 * SaaS Team — member list, invite form, role management.
 */
import { IslandRenderer, Island } from '@formwork/ui';

interface TeamProps {
  orgName: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
  }>;
  pendingInvites: Array<{ email: string; role: string; sentAt: string }>;
  seatsUsed: number;
  seatsLimit: number;
}

interface TeamInviteFormProps {
  seatsRemaining: number;
}

const TeamInviteForm = Island<TeamInviteFormProps>({
  name: 'TeamInviteForm',
  hydration: 'eager',
  render: (props) => `
    <form id="invite-form" style="display: flex; gap: 0.5rem; align-items: flex-end;">
      <div style="flex: 1;">
        <label for="invite-email">Email</label>
        <input type="email" id="invite-email" name="email" placeholder="colleague@company.com" required style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:4px;" />
      </div>
      <div>
        <label for="invite-role">Role</label>
        <select id="invite-role" name="role" style="padding:0.5rem;border:1px solid #d1d5db;border-radius:4px;">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" ${props.seatsRemaining <= 0 ? 'disabled title="No seats remaining"' : ''}>
        Send Invite
      </button>
    </form>
    ${props.seatsRemaining <= 0 ? '<p style="color:#ef4444;margin-top:0.5rem;">All seats are in use. Upgrade your plan to add more members.</p>' : ''}
  `,
});

export function SaaSTeamPage(props: TeamProps, islandRenderer: IslandRenderer): string {
  const inviteIsland = islandRenderer.island(TeamInviteForm, {
    seatsRemaining: props.seatsLimit - props.seatsUsed,
  });

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = { owner: '#818cf8', admin: '#f59e0b', member: '#10b981' };
    return `<span style="background:${colors[role] ?? '#6c757d'};color:#fff;padding:0.125rem 0.5rem;border-radius:9999px;font-size:0.75rem;">${role}</span>`;
  };

  const memberRows = props.members
    .map(m => `<tr>
      <td>${m.name}</td>
      <td>${m.email}</td>
      <td>${roleBadge(m.role)}</td>
      <td>${m.joinedAt}</td>
      <td>${m.role !== 'owner' ? `<button class="btn" style="font-size:0.75rem;" data-remove="${m.id}">Remove</button>` : ''}</td>
    </tr>`)
    .join('');

  const pendingRows = props.pendingInvites
    .map(inv => `<tr>
      <td>${inv.email}</td>
      <td>${roleBadge(inv.role)}</td>
      <td>${inv.sentAt}</td>
      <td><button class="btn" style="font-size:0.75rem;" data-revoke="${inv.email}">Revoke</button></td>
    </tr>`)
    .join('');

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h1>${props.orgName} Team</h1>
      <span style="color: #6c757d;">${props.seatsUsed} / ${props.seatsLimit} seats used</span>
    </div>

    <div class="card" style="margin-bottom: 2rem;">
      <h3 style="margin-bottom: 1rem;">Invite a Team Member</h3>
      ${inviteIsland}
    </div>

    <div class="card" style="margin-bottom: 2rem;">
      <h3 style="margin-bottom: 1rem;">Members</h3>
      <table style="width: 100%;">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead>
        <tbody>${memberRows}</tbody>
      </table>
    </div>

    ${props.pendingInvites.length > 0 ? `
    <div class="card">
      <h3 style="margin-bottom: 1rem;">Pending Invites</h3>
      <table style="width: 100%;">
        <thead><tr><th>Email</th><th>Role</th><th>Sent</th><th></th></tr></thead>
        <tbody>${pendingRows}</tbody>
      </table>
    </div>` : ''}
  `;
}

export { TeamInviteForm };
