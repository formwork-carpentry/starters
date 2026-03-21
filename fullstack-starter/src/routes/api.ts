/**
 * @module routes
 * @description API routes - JSON endpoints for auth, posts, comments, weather, GraphQL.
 */

import { AuthController } from '../app/Controllers/AuthController.js';
import { PostController } from '../app/Controllers/PostController.js';
import { WeatherService } from '../app/Services/WeatherService.js';
import { createGraphQLSchema } from './graphql.js';
import { MemoryCacheStore } from '@formwork/cache';
import type { Container } from '@formwork/core/container';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';
import type { NotificationManager } from '@formwork/notifications';
import type { QueueManager } from '@formwork/queue';
import type { StorageManager } from '@formwork/storage';
import type { LogManager } from '@formwork/log';

export function registerApiRoutes(router: Router, container: Container): void {
  const auth = new AuthController(container);
  const posts = new PostController(container);
  const cache = container.make<MemoryCacheStore>('cache');
  const weather = new WeatherService(cache);

  // Auth (legacy REST — padlock routes are registered separately in app.ts)
  router.post('/auth/register', (req) => auth.register(req));
  router.post('/auth/login', (req) => auth.login(req));
  router.get('/auth/me', (req) => auth.me(req));
  router.post('/auth/logout', () => auth.logout());

  // Posts CRUD
  router.get('/api/posts', (req) => posts.index(req));
  router.post('/api/posts', (req) => posts.store(req));
  router.get('/api/posts/:id', (req) => posts.show(req));
  router.put('/api/posts/:id', (req) => posts.update(req));
  router.delete('/api/posts/:id', (req) => posts.destroy(req));

  // Comments
  router.post('/api/posts/:id/comments', (req) => posts.addComment(req));

  // External API with circuit breaker
  router.get('/api/weather/:city', async (req) => {
    try {
      return CarpenterResponse.json({ data: await weather.getCurrent(req.param('city')) });
    } catch (err) {
      return CarpenterResponse.json({ error: (err as Error).message, circuit: weather.getCircuitState() }, 503);
    }
  });

  // ── GraphQL endpoint ──
  const schema = createGraphQLSchema();
  router.post('/graphql', async (req) => {
    const body = req.body() as { query: string; variables?: Record<string, unknown> };
    const result = await schema.execute(body.query, body.variables ?? {});
    return CarpenterResponse.json(result);
  });

  // ── Notifications API ──
  router.get('/api/notifications', async () => {
    const notifs = container.make<NotificationManager>('notifications');
    return CarpenterResponse.json({ data: notifs.all?.() ?? [] });
  });

  // ── Storage presigned upload URL (stub) ──
  router.post('/api/uploads', async (req) => {
    const body = req.body() as { filename: string; contentType: string };
    const storage = container.make<StorageManager>('storage');
    // In production: generate a presigned URL for direct upload to S3
    return CarpenterResponse.json({
      disk: storage.getDefaultDisk(),
      path: `uploads/${Date.now()}-${body.filename}`,
      message: 'Upload endpoint ready — configure S3 for production presigned URLs',
    });
  });

  // ── Queue status ──
  router.get('/api/queue/status', async () => {
    const queue = container.make<QueueManager>('queue');
    return CarpenterResponse.json({ driver: queue.getDefaultConnection(), status: 'healthy' });
  });

  // ── Feature flags API ──
  router.get('/api/flags', async () => {
    const flags = container.make<import('@formwork/flags').InMemoryFlagProvider>('flags');
    return CarpenterResponse.json({
      flags: {
        'dark-mode': flags.isEnabled('dark-mode'),
        'new-editor': flags.isEnabled('new-editor'),
        'experimental-ai': flags.isEnabled('experimental-ai'),
        'maintenance-mode': flags.isEnabled('maintenance-mode'),
      },
    });
  });

  // ── Logs API (admin) ──
  router.get('/api/admin/logs', async () => {
    const log = container.make<LogManager>('log');
    return CarpenterResponse.json({ channel: log.getDefaultChannel(), message: 'Log access active' });
  });
}
