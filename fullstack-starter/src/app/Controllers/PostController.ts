import { attr } from '../../helpers.js';
/**
 * @module app/Controllers
 * @description PostController - RESTful blog post management.
 */

import { Post, Comment } from '../Models/index.js';
import { MemoryCacheStore } from '@carpentry/formworks/cache';
import type { IRequest, IResponse } from '@carpentry/formworks/core/contracts';
import type { Container } from '@carpentry/formworks/core/container';
import { EventDispatcher } from '@carpentry/formworks/events';
import { CarpenterResponse } from '@carpentry/formworks/http';
import { Validator } from '@carpentry/formworks/validation';

const validator = new Validator();

export class PostController {
  private cache: MemoryCacheStore;
  private events: EventDispatcher;

  constructor(container: Container) {
    this.cache = container.make<MemoryCacheStore>('cache');
    this.events = container.make<EventDispatcher>('events');
  }

  /**
   * GET /api/posts - List posts with optional filters.
   *
   * @param {IRequest} req - Query params: ?status=published&category=tech
   * @returns {Promise<IResponse>} 200 with posts array
   */
  async index(req: IRequest): Promise<IResponse> {
    const status = req.query('status') as string;
    const category = req.query('category') as string;
    const key = 'posts:' + (status || 'all') + ':' + (category || 'all');

    const posts = await this.cache.tags(['posts']).remember(key, 300, async () => {
      let q = Post.query();
      if (status) q = q.where('status', '=', status);
      if (category) q = q.where('category', '=', category);
      return q.orderBy('created_at', 'desc').get();
    });
    return CarpenterResponse.json({ data: posts, total: (posts as unknown[]).length });
  }

  /**
   * POST /api/posts - Create a new post.
   *
   * @param {IRequest} req - Body: { title, body, category, status? }
   * @returns {Promise<IResponse>} 201 with post, or 422 with errors
   */
  async store(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, {
      title: 'required|string|min:3|max:200',
      body: 'required|string|min:20',
      category: 'required|string',
      status: 'in:draft,published',
    });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const post = await Post.create({
      ...result.validated,
      author_id: 1,
      status: result.validated['status'] ?? 'draft',
      published_at: result.validated['status'] === 'published' ? new Date().toISOString() : null,
    });
    await this.cache.tags(['posts']).flush();
    await this.events.dispatch('post.created', { postId: post.id, title: attr(post, 'title') });
    return CarpenterResponse.json({ data: post }, 201);
  }

  /**
   * GET /api/posts/:id - Show a single post.
   *
   * @param {IRequest} req - Route param: id
   * @returns {Promise<IResponse>} 200 with post
   */
  async show(req: IRequest): Promise<IResponse> {
    const id = req.param('id');
    const post = await this.cache.tags(['posts']).remember('post:' + id, 600, () => Post.findOrFail(id));
    return CarpenterResponse.json({ data: post });
  }

  /**
   * PUT /api/posts/:id - Update a post.
   *
   * @param {IRequest} req - Route param: id, Body: partial post fields
   * @returns {Promise<IResponse>} 200 with updated post, or 422
   */
  async update(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { title: 'string|min:3', body: 'string|min:20', status: 'in:draft,published,archived' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const post = await Post.findOrFail(req.param('id'));
    await post.update(result.validated);
    await this.cache.tags(['posts']).flush();
    await this.events.dispatch('post.updated', { postId: post.id });
    return CarpenterResponse.json({ data: post });
  }

  /**
   * DELETE /api/posts/:id - Soft-delete a post.
   *
   * @param {IRequest} req - Route param: id
   * @returns {Promise<IResponse>} 200 with confirmation
   */
  async destroy(req: IRequest): Promise<IResponse> {
    const post = await Post.findOrFail(req.param('id'));
    await post.delete();
    await this.cache.tags(['posts']).flush();
    await this.events.dispatch('post.deleted', { postId: post.id });
    return CarpenterResponse.json({ message: 'Post deleted' });
  }

  /**
   * POST /api/posts/:id/comments - Add a comment to a post.
   *
   * @param {IRequest} req - Route param: id, Body: { body }
   * @returns {Promise<IResponse>} 201 with comment
   */
  async addComment(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { body: 'required|string|min:2|max:1000' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const comment = await Comment.create({ post_id: Number(req.param('id')), author_id: 1, body: result.validated['body'] });
    await this.events.dispatch('comment.created', { commentId: comment.id, post_id: req.param('id') });
    return CarpenterResponse.json({ data: comment }, 201);
  }
}
