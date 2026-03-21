/**
 * Blog Starter - Carpenter Framework
 *
 * MVC fullstack blog with session auth, i18n, real-time comments, external API.
 */
import 'reflect-metadata';
import { registerAuthRoutes } from './routes/auth.js';
import { registerPostRoutes } from './routes/posts.js';
import { registerExternalRoutes } from './routes/external.js';
import { registerEventListeners } from './events/listeners.js';
import { createTranslator } from './config/i18n.js';
import { EventDispatcher } from '@formwork/events';
import { bootstrap } from '@formwork/foundation';
import { Router, HttpKernel, CarpenterResponse } from '@formwork/http';

export async function createApp() {
  const { container, config } = await bootstrap({
    skipEnv: true,
    configOverrides: { app: { name: 'Carpenter Blog', debug: true } },
  });

  const events = container.make<EventDispatcher>('events');
  const translator = await createTranslator();

  registerEventListeners(events);

  const router = new Router();
  registerAuthRoutes(router, container);
  registerPostRoutes(router, container);
  registerExternalRoutes(router, container);

  router.put('/locale/:lang', async (req) => {
    translator.setLocale(req.param('lang'));
    return CarpenterResponse.json({ locale: req.param('lang'), nav: { home: translator.get('nav.home'), blog: translator.get('nav.blog') } });
  });

  router.get('/health', async () => CarpenterResponse.json({
    status: 'ok', app: config.get('app.name'), locale: translator.getLocale(),
  }));

  const kernel = new HttpKernel(container, router, { debug: true });
  return { kernel, container, config, translator };
}
