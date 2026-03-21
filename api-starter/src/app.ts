/**
 * API Starter - Carpenter Framework
 *
 * Production-ready REST API with MVC architecture.
 * Run: npx tsx starters/api-starter/src/app.ts
 */

import 'reflect-metadata';
import { registerAuthRoutes } from './routes/auth.js';
import { registerPostRoutes } from './routes/posts.js';
import { registerExternalRoutes } from './routes/external.js';
import { registerEventListeners } from './events/listeners.js';
import { EventDispatcher } from '@formwork/events';
import { bootstrap } from '@formwork/foundation';
import { Router, HttpKernel, CarpenterResponse } from '@formwork/http';

export async function createApp() {
  const { container, config } = await bootstrap({
    skipEnv: true,
    configOverrides: {
      app: { name: 'API Starter', debug: true, url: 'http://localhost:3000' },
    },
  });

  // Wire event listeners
  const events = container.make<EventDispatcher>('events');
  registerEventListeners(events);

  // Routes
  const router = new Router();
  registerAuthRoutes(router, container);
  registerPostRoutes(router, container);
  registerExternalRoutes(router, container);

  router.get('/health', async () => CarpenterResponse.json({
    status: 'ok',
    app: config.get('app.name'),
    timestamp: new Date().toISOString(),
  }));

  const kernel = new HttpKernel(container, router, { debug: true });
  return { kernel, container, config, router };
}
