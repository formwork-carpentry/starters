import { attr } from '../helpers.js';
/**
 * PostController - RESTful CRUD with cache tags, validation, events.
 */
import { Post } from '../models/Post.js';
import { MemoryCacheStore } from '@formwork/cache';
import type { IRequest, IResponse } from '@formwork/core/contracts';
import type { Container } from '@formwork/core/container';
import { EventDispatcher } from '@formwork/events';
import { CarpenterResponse } from '@formwork/http';
import { Validator } from '@formwork/validation';

const validator = new Validator();

export class PostController {
  private cache: MemoryCacheStore;
  private events: EventDispatcher;

  constructor(container: Container) {
    this.cache = container.make<MemoryCacheStore>('cache');
    this.events = container.make<EventDispatcher>('events');
  }

  async index(req: IRequest): Promise<IResponse> {
    const status = req.query('status') as string;
    const posts = await this.cache.tags(['posts']).remember('posts:' + (status || 'all'), 300, async () => {
      let q = Post.query();
      if (status) q = q.where('status', '=', status);
      return q.orderBy('created_at', 'desc').get();
    });
    return CarpenterResponse.json({ data: posts, total: (posts as unknown[]).length });
  }

  async store(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { title: 'required|string|min:3', body: 'required|string|min:10', category: 'required|string' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);
    const post = await Post.create({ ...result.validated, author_id: 1, status: 'draft' });
    await this.cache.tags(['posts']).flush();
    await this.events.dispatch('post.created', { postId: post.id, title: attr(post, 'title') });
    return CarpenterResponse.json({ data: post }, 201);
  }

  async show(req: IRequest): Promise<IResponse> {
    const post = await this.cache.tags(['posts']).remember('posts:' + req.param('id'), 600, () => Post.findOrFail(req.param('id')));
    return CarpenterResponse.json({ data: post });
  }

  async update(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { title: 'string|min:3', body: 'string|min:10' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);
    const post = await Post.findOrFail(req.param('id'));
    await post.update(result.validated);
    await this.cache.tags(['posts']).flush();
    await this.events.dispatch('post.updated', { postId: post.id });
    return CarpenterResponse.json({ data: post });
  }

  async destroy(req: IRequest): Promise<IResponse> {
    const post = await Post.findOrFail(req.param('id'));
    await post.delete();
    await this.cache.tags(['posts']).flush();
    await this.events.dispatch('post.deleted', { postId: post.id });
    return CarpenterResponse.json({ message: 'Post deleted' });
  }
}
