/**
 * Dashboard page — authenticated user dashboard with stats and islands.
 */
import { IslandRenderer } from '@formwork/ui';
import { AppLayout } from '../layouts/AppLayout.js';
import { NotificationBellIsland } from '../islands/NotificationBell.js';

interface DashboardProps {
  nav: Record<string, string>;
  user: { name: string; role: string; email: string };
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalComments: number;
    recentNotifications: Array<{ id: number; title: string; message: string; read: boolean }>;
  };
  featureFlags: { darkMode: boolean; newEditor: boolean };
}

export function DashboardPage(props: DashboardProps, islandRenderer: IslandRenderer): string {
  const notificationBell = islandRenderer.island(NotificationBellIsland, {
    notifications: props.stats.recentNotifications,
    unreadCount: props.stats.recentNotifications.filter((n) => !n.read).length,
  });

  const bodyHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <div>
        <h1>Dashboard</h1>
        <p style="color: #6c757d;">Welcome back, ${props.user.name}</p>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center;">
        ${notificationBell}
        <a href="/posts/create" class="btn btn-primary">New Post</a>
      </div>
    </div>

    <div class="grid grid-4" style="margin-bottom: 2rem;">
      <div class="card" style="text-align:center; border-left: 4px solid #4361ee;">
        <div style="font-size: 2rem; font-weight: 700;">${props.stats.totalPosts}</div>
        <div style="color: #6c757d;">Total Posts</div>
      </div>
      <div class="card" style="text-align:center; border-left: 4px solid #2ec4b6;">
        <div style="font-size: 2rem; font-weight: 700;">${props.stats.publishedPosts}</div>
        <div style="color: #6c757d;">Published</div>
      </div>
      <div class="card" style="text-align:center; border-left: 4px solid #f72585;">
        <div style="font-size: 2rem; font-weight: 700;">${props.stats.draftPosts}</div>
        <div style="color: #6c757d;">Drafts</div>
      </div>
      <div class="card" style="text-align:center; border-left: 4px solid #7209b7;">
        <div style="font-size: 2rem; font-weight: 700;">${props.stats.totalComments}</div>
        <div style="color: #6c757d;">Comments</div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Quick Actions</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <a href="/posts/create" style="color: #4361ee; text-decoration: none;">📝 Create New Post</a>
          <a href="/admin/posts" style="color: #4361ee; text-decoration: none;">📋 Manage Posts</a>
          <a href="/admin/users" style="color: #4361ee; text-decoration: none;">👥 Manage Users</a>
          <a href="/admin/comments" style="color: #4361ee; text-decoration: none;">💬 Moderate Comments</a>
        </div>
      </div>
      <div class="card">
        <h3 style="margin-bottom: 1rem;">Account Info</h3>
        <table style="width: 100%;">
          <tr><td style="color: #6c757d;">Name</td><td>${props.user.name}</td></tr>
          <tr><td style="color: #6c757d;">Email</td><td>${props.user.email}</td></tr>
          <tr><td style="color: #6c757d;">Role</td><td style="text-transform: capitalize;">${props.user.role}</td></tr>
          <tr><td style="color: #6c757d;">Dark Mode</td><td>${props.featureFlags.darkMode ? '✅ Enabled' : '❌ Disabled'}</td></tr>
          <tr><td style="color: #6c757d;">New Editor</td><td>${props.featureFlags.newEditor ? '✅ Beta' : '❌ Classic'}</td></tr>
        </table>
      </div>
    </div>
  `;

  return AppLayout({
    title: 'Dashboard',
    nav: props.nav,
    user: props.user,
    bodyHtml,
    islandRenderer,
  });
}
