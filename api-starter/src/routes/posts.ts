import { PostController } from '../controllers/PostController.js';
import type { Container } from '@formwork/core/container';
import type { Router } from '@formwork/http';

export function registerPostRoutes(router: Router, container: Container): void {
  const posts = new PostController(container);
  router.get('/api/posts', (req) => posts.index(req));
  router.post('/api/posts', (req) => posts.store(req));
  router.get('/api/posts/:id', (req) => posts.show(req));
  router.put('/api/posts/:id', (req) => posts.update(req));
  router.delete('/api/posts/:id', (req) => posts.destroy(req));
}
