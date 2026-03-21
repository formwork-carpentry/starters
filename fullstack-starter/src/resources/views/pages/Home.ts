/**
 * Home page — public landing page with interactive islands.
 */
import { IslandRenderer } from '@formwork/ui';
import { AppLayout } from '../layouts/AppLayout.js';
import { CounterIsland } from '../islands/Counter.js';
import { SearchBarIsland } from '../islands/SearchBar.js';

interface HomeProps {
  nav: Record<string, string>;
  recentPosts: Array<{ id: number; title: string; slug: string; category: string; published_at: string }>;
  stats: { users: number; posts: number; comments: number };
}

export function HomePage(props: HomeProps, islandRenderer: IslandRenderer): string {
  const postCards = props.recentPosts
    .map(
      (p) => `
      <div class="card">
        <span class="badge">${p.category}</span>
        <h3><a href="/posts/${p.slug}">${p.title}</a></h3>
        <time>${p.published_at}</time>
      </div>`,
    )
    .join('');

  const searchIsland = islandRenderer.island(SearchBarIsland, {
    placeholder: 'Search posts...',
    action: '/api/posts',
  });

  const counterIsland = islandRenderer.island(CounterIsland, {
    initialCount: props.stats.posts,
    label: 'Posts published',
  });

  const bodyHtml = `
    <section class="hero" style="text-align:center; padding: 4rem 0;">
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Welcome to Carpenter</h1>
      <p style="font-size: 1.2rem; color: #6c757d; max-width: 600px; margin: 0 auto 2rem;">
        A modern TypeScript framework with React Islands architecture,
        admin dashboards, and everything you need to build production apps.
      </p>
      <a href="/register" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2rem;">Get Started</a>
    </section>

    <section style="margin: 3rem 0;">
      <h2 style="margin-bottom: 1rem;">Search Posts</h2>
      ${searchIsland}
    </section>

    <section style="margin: 3rem 0;">
      <div class="grid grid-3">
        <div class="card" style="text-align:center;">
          <div style="font-size: 2rem; font-weight: 700; color: #4361ee;">${props.stats.users}</div>
          <div style="color: #6c757d;">Registered Users</div>
        </div>
        <div class="card" style="text-align:center;">
          ${counterIsland}
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-size: 2rem; font-weight: 700; color: #4361ee;">${props.stats.comments}</div>
          <div style="color: #6c757d;">Comments</div>
        </div>
      </div>
    </section>

    <section style="margin: 3rem 0;">
      <h2 style="margin-bottom: 1rem;">Recent Posts</h2>
      <div class="grid grid-3">${postCards || '<p style="color:#6c757d;">No posts yet. Be the first to publish!</p>'}</div>
    </section>
  `;

  return AppLayout({
    title: 'Home',
    nav: props.nav,
    user: null,
    bodyHtml,
    islandRenderer,
  });
}
