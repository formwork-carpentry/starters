import { attr } from '../helpers.js';
import { Post, Comment } from '../models/index.js';
import { MemoryCacheStore } from '@formwork/cache';
import type { Container } from '@formwork/core/container';
import { EventDispatcher } from '@formwork/events';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';
import { Validator } from '@formwork/validation';

const validator = new Validator();

export function registerPostRoutes(router: Router, container: Container): void {
  const cache = container.make<MemoryCacheStore>('cache');
  const events = container.make<EventDispatcher>('events');

  router.get('/posts', async (req) => {
    const category = req.query('category') as string;
    const key = 'posts:' + (category || 'all');
    const posts = await cache.tags(['posts']).remember(key, 300, async () => {
      let q = Post.query().where('status', '=', 'published');
      if (category) q = q.where('category', '=', category);
      return q.orderBy('created_at', 'desc').get();
    });
    return CarpenterResponse.json({ data: posts, total: (posts as unknown[]).length });
  });

  router.post('/posts', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { title: 'required|string|min:3', body: 'required|string|min:20', category: 'required|string' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const post = await Post.create({ ...result.validated, author_id: 1, status: 'published' });
    await cache.tags(['posts']).flush();
    await events.dispatch('post.created', { postId: post.id, title: attr(post, 'title') });
    return CarpenterResponse.json({ data: post }, 201);
  });

  router.get('/posts/:id', async (req) => {
    const post = await cache.tags(['posts']).remember('post:' + req.param('id'), 600, () => Post.findOrFail(req.param('id')));
    return CarpenterResponse.json({ data: post });
  });

  router.post('/posts/:id/comments', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { body: 'required|string|min:2|max:1000' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const comment = await Comment.create({ post_id: Number(req.param('id')), author_id: 1, body: result.validated['body'] });
    await events.dispatch('comment.created', { commentId: comment.id, post_id: req.param('id'), body: attr(comment, 'body') });
    return CarpenterResponse.json({ data: comment }, 201);
  });
}
