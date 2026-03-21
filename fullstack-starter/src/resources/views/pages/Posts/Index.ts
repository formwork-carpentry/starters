/**
 * Posts index page — CRUD table with search island.
 */
import { IslandRenderer } from '@formwork/ui';
import { AppLayout } from '../../layouts/AppLayout.js';
import { SearchBarIsland } from '../../islands/SearchBar.js';

interface PostsIndexProps {
  nav: Record<string, string>;
  user: { name: string; role: string } | null;
  posts: Array<{
    id: number;
    title: string;
    category: string;
    status: string;
    author_name: string;
    published_at: string | null;
    created_at: string;
  }>;
  pagination: { page: number; perPage: number; total: number };
}

export function PostsIndexPage(props: PostsIndexProps, islandRenderer: IslandRenderer): string {
  const searchIsland = islandRenderer.island(SearchBarIsland, {
    placeholder: 'Search posts by title...',
    action: '/posts',
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = { published: '#2ec4b6', draft: '#f4a261', archived: '#6c757d' };
    return `<span style="background: ${colors[status] ?? '#6c757d'}; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${status}</span>`;
  };

  const rows = props.posts
    .map(
      (p) => `
      <tr>
        <td>${p.id}</td>
        <td><a href="/posts/${p.id}" style="color: #4361ee;">${p.title}</a></td>
        <td>${p.category}</td>
        <td>${statusBadge(p.status)}</td>
        <td>${p.author_name}</td>
        <td>${p.published_at ?? '—'}</td>
        <td>
          <a href="/posts/${p.id}/edit" style="color: #4361ee; margin-right: 0.5rem;">Edit</a>
          <form method="POST" action="/api/posts/${p.id}" style="display:inline;">
            <input type="hidden" name="_method" value="DELETE">
            <button type="submit" style="color: #dc3545; background: none; border: none; cursor: pointer;">Delete</button>
          </form>
        </td>
      </tr>`,
    )
    .join('');

  const totalPages = Math.ceil(props.pagination.total / props.pagination.perPage);

  const bodyHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h1>Posts</h1>
      <a href="/posts/create" class="btn btn-primary">+ New Post</a>
    </div>

    <div style="margin-bottom: 1.5rem;">${searchIsland}</div>

    <div class="card" style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #e9ecef; text-align: left;">
            <th style="padding: 0.75rem;">ID</th>
            <th style="padding: 0.75rem;">Title</th>
            <th style="padding: 0.75rem;">Category</th>
            <th style="padding: 0.75rem;">Status</th>
            <th style="padding: 0.75rem;">Author</th>
            <th style="padding: 0.75rem;">Published</th>
            <th style="padding: 0.75rem;">Actions</th>
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#6c757d;">No posts found.</td></tr>'}</tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem;">
      ${props.pagination.page > 1 ? `<a href="/posts?page=${props.pagination.page - 1}" class="btn">← Prev</a>` : ''}
      <span style="padding: 0.5rem 1rem; color: #6c757d;">Page ${props.pagination.page} of ${totalPages}</span>
      ${props.pagination.page < totalPages ? `<a href="/posts?page=${props.pagination.page + 1}" class="btn">Next →</a>` : ''}
    </div>
  `;

  return AppLayout({ title: 'Posts', nav: props.nav, user: props.user, bodyHtml, islandRenderer });
}
