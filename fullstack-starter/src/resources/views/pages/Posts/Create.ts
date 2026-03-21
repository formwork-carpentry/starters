/**
 * Post create/edit page — form with live validation island.
 */
import { IslandRenderer } from '@formwork/ui';
import { AppLayout } from '../../layouts/AppLayout.js';
import { PostFormIsland } from '../../islands/PostForm.js';

interface PostCreateProps {
  nav: Record<string, string>;
  user: { name: string; role: string };
  categories: Array<{ id: number; slug: string; name: string }>;
  post?: { id: number; title: string; body: string; category: string; status: string } | null;
}

export function PostCreatePage(props: PostCreateProps, islandRenderer: IslandRenderer): string {
  const formIsland = islandRenderer.island(PostFormIsland, {
    categories: props.categories,
    post: props.post ?? null,
    submitUrl: props.post ? `/api/posts/${props.post.id}` : '/api/posts',
    method: props.post ? 'PUT' : 'POST',
  });

  const bodyHtml = `
    <div style="max-width: 800px; margin: 0 auto;">
      <h1 style="margin-bottom: 1.5rem;">${props.post ? 'Edit Post' : 'Create New Post'}</h1>
      <div class="card">
        ${formIsland}
      </div>
    </div>
  `;

  return AppLayout({ title: props.post ? 'Edit Post' : 'New Post', nav: props.nav, user: props.user, bodyHtml, islandRenderer });
}
