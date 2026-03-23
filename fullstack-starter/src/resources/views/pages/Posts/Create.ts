/**
 * Post create/edit page — form with live validation island.
 */
import { createCarpenterApp, Link, usePage } from '@carpentry/ui-react';
import { posts } from 'routes/posts';
import { postsApi } from 'routes/postsApi';
import { IslandRenderer } from '@carpentry/formworks/ui';
import { AppLayout } from '../../layouts/AppLayout.js';
import { PostFormIsland } from '../../islands/PostForm.js';

interface PostCreateProps {
  nav: Record<string, string>;
  user: { name: string; role: string };
  categories: Array<{ id: number; slug: string; name: string }>;
  post?: { id: number; title: string; body: string; category: string; status: string } | null;
}

export function PostCreatePage(props: PostCreateProps, islandRenderer: IslandRenderer): string {
  const submitRoute = props.post ? postsApi.update({ id: props.post.id }) : postsApi.store();
  const app = createCarpenterApp({
    initialPage: {
      component: props.post ? 'Posts/Edit' : 'Posts/Create',
      props: { postId: props.post?.id ?? null },
      url: props.post ? submitRoute.href : posts.create().href,
      version: '1.0.0',
    },
  });
  const page = usePage(app);
  const backLink = Link({ to: posts.index(), children: 'Back to posts' });
  const formIsland = islandRenderer.island(PostFormIsland, {
    categories: props.categories,
    post: props.post ?? null,
    submitUrl: submitRoute.href,
    method: props.post ? 'PUT' : 'POST',
  });

  const bodyHtml = `
    <div style="max-width: 800px; margin: 0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
        <h1>${props.post ? 'Edit Post' : 'Create New Post'}</h1>
        <a href="${backLink.props.href}" style="color:#4361ee; text-decoration:none;">${String(backLink.props.children)}</a>
      </div>
      <div class="card">
        ${formIsland}
      </div>
      <p style="margin-top: 1rem; color:#6c757d; font-size:0.85rem;">Current route: <code>${page.url}</code></p>
    </div>
  `;

  return AppLayout({ title: props.post ? 'Edit Post' : 'New Post', nav: props.nav, user: props.user, bodyHtml, islandRenderer });
}
