/**
 * Dashboard page — authenticated user dashboard with stats and islands.
 */
import { IconHome, IconUser } from '@carpentry/icons';
import { createLineChart } from '@carpentry/ui-charts';
import { createCarpenterApp, Link, usePage } from '@carpentry/ui-react';
import { dashboard } from 'routes/dashboard';
import { home } from 'routes/home';
import { posts } from 'routes/posts';
import { IslandRenderer } from '@carpentry/formworks/ui';
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
  const app = createCarpenterApp({
    initialPage: {
      component: 'Dashboard',
      props: { stats: props.stats, user: props.user },
      url: dashboard.index().href,
      version: '1.0.0',
    },
  });
  const page = usePage(app);
  const homeLink = Link({ to: home.index(), children: 'Back home' });
  const createPostLink = Link({ to: posts.create(), children: 'New Post' });
  const postsLink = Link({ to: posts.index(), children: 'Manage Posts' });
  const statsChart = createLineChart({
    labels: ['Total', 'Published', 'Drafts', 'Comments'],
    series: [{
      name: 'Posts',
      data: [props.stats.totalPosts, props.stats.publishedPosts, props.stats.draftPosts, props.stats.totalComments],
    }],
  });
  const statTrend = statsChart.dataset.series[0].data
    .map((value, index) => `<div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid #eef2f7;"><span>${statsChart.dataset.labels[index]}</span><strong>${value}</strong></div>`)
    .join('');
  const notificationBell = islandRenderer.island(NotificationBellIsland, {
    notifications: props.stats.recentNotifications,
    unreadCount: props.stats.recentNotifications.filter((n) => !n.read).length,
  });

  const bodyHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <div>
        <h1>Dashboard</h1>
        <p style="color: #6c757d; display:flex; align-items:center; gap:0.5rem;">${IconUser({ size: 16, title: 'Current user' })}<span>Welcome back, ${props.user.name}</span></p>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center;">
        ${notificationBell}
        <a href="${createPostLink.props.href}" class="btn btn-primary">${String(createPostLink.props.children)}</a>
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
          <a href="${createPostLink.props.href}" style="color: #4361ee; text-decoration: none;">📝 ${String(createPostLink.props.children)}</a>
          <a href="${postsLink.props.href}" style="color: #4361ee; text-decoration: none;">📋 ${String(postsLink.props.children)}</a>
          <a href="${homeLink.props.href}" style="color: #4361ee; text-decoration: none;">${IconHome({ size: 14, title: 'Home' })} ${String(homeLink.props.children)}</a>
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
        <div style="margin-top: 1rem;">
          <h4 style="margin-bottom: 0.75rem;">Content Trend</h4>
          ${statTrend}
          <p style="margin-top: 0.75rem; color:#6c757d; font-size:0.85rem;">Current route: <code>${page.url}</code></p>
        </div>
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
