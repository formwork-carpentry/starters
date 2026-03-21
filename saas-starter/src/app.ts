/**
 * SaaS Starter - Carpenter Framework
 *
 * Multi-tenant SaaS with padlock/sociallock auth, billing, team management,
 * feature flags, queue, scheduler, mail, notifications, admin panel,
 * GraphQL API, and React Islands SSR UI.
 */
import 'reflect-metadata';
import { registerAuthRoutes } from './routes/auth.js';
import { registerTenantRoutes } from './routes/tenant.js';
import { registerAdminRoutes } from './routes/admin.js';
import { registerWebRoutes } from './routes/web.js';
import { registerEventListeners } from './events/listeners.js';
import { seedTenants, getTenantStore } from './tenants/seed.js';
import { seedOrganizations } from './models/Organization.js';
import { buildSaaSSchema } from './routes/graphql.js';
import { configureSaaSAuth, registerSaaSAuthRoutes } from './config/auth.js';
import { createBillingConfig } from './config/billing.js';
import { configureLogging } from './config/logging.js';
import { configureStorage } from './config/storage.js';
import { registerScheduledTasks } from './config/schedule.js';
import { createTranslator } from './config/i18n.js';
import { buildAdminPanel } from './app/Admin/panel.js';
import { EventDispatcher } from '@formwork/events';
import { bootstrap } from '@formwork/foundation';
import { Router, HttpKernel, CarpenterResponse } from '@formwork/http';
import { LogManager } from '@formwork/log';
import { QueueManager, InMemoryQueueDriver } from '@formwork/queue';
import { MailManager, InMemoryMailTransport } from '@formwork/mail';
import { NotificationManager } from '@formwork/notifications';
import { Scheduler } from '@formwork/scheduler';
import { InMemoryFlagProvider } from '@formwork/flags';
import { IslandRenderer } from '@formwork/ui';
import { StorageManager, InMemoryStorageDriver } from '@formwork/storage';

export async function createApp() {
  const { container, config } = await bootstrap({
    skipEnv: true,
    configOverrides: { app: { name: 'SaaS Platform', debug: true } },
  });

  // Events
  const events = container.make<EventDispatcher>('events');
  registerEventListeners(events);

  // Logging
  const logManager = configureLogging();
  const logger = logManager.channel('console');
  container.singleton('log', () => logManager);

  // Storage
  const storage = configureStorage();
  container.singleton('storage', () => storage);

  // Queue
  const queue = new QueueManager();
  queue.addDriver('memory', new InMemoryQueueDriver());
  container.singleton('queue', () => queue);

  // Mail
  const mail = new MailManager();
  mail.addTransport('memory', new InMemoryMailTransport());
  container.singleton('mail', () => mail);

  // Notifications
  const notifications = new NotificationManager(mail);
  container.singleton('notifications', () => notifications);

  // Scheduler
  const scheduler = new Scheduler();
  registerScheduledTasks(scheduler);
  container.singleton('scheduler', () => scheduler);

  // Feature Flags
  const flags = new InMemoryFlagProvider();
  flags.set('team-invites', true);
  flags.set('billing-v2', false);
  flags.set('usage-alerts', true);
  flags.set('graphql-api', true);
  container.singleton('flags', () => flags);

  // Billing
  const billing = createBillingConfig();
  container.singleton('billing', () => billing);

  // i18n
  const translator = createTranslator();
  container.singleton('translator', () => translator);

  // Island Renderer (React Islands SSR)
  const islandRenderer = new IslandRenderer();
  container.singleton('islands', () => islandRenderer);

  // Admin Panel
  const admin = buildAdminPanel();
  container.singleton('admin', () => admin);

  // GraphQL
  const graphqlSchema = buildSaaSSchema();
  container.singleton('graphql', () => graphqlSchema);

  // Auth (Padlock + SocialLock)
  const authConfig = configureSaaSAuth();
  container.singleton('auth.padlock', () => authConfig.padlockService);
  container.singleton('auth.sociallock', () => authConfig.socialLockService);

  // Seed data
  await seedTenants();
  await seedOrganizations();
  logger.info('SaaS platform seeded');

  // Router
  const router = new Router();

  // Auth routes (padlock + sociallock)
  registerSaaSAuthRoutes(router, authConfig);

  // Legacy Auth (JWT-based)
  registerAuthRoutes(router, container);

  // Tenant API routes (preserved)
  registerTenantRoutes(router, container);
  registerAdminRoutes(router, container);

  // Web SSR routes
  registerWebRoutes(router, container);

  // GraphQL endpoint
  router.post('/graphql', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const result = await graphqlSchema.execute(
      body['query'] as string,
      body['variables'] as Record<string, unknown> | undefined,
    );
    return CarpenterResponse.json(result);
  });

  // Queue status
  router.get('/api/queue/status', async () => {
    return CarpenterResponse.json({ driver: 'memory', status: 'running' });
  });

  // Notifications list
  router.get('/api/notifications', async () => {
    return CarpenterResponse.json({ data: [], total: 0 });
  });

  // Health check
  router.get('/health', async () => {
    const tenantStore = getTenantStore();
    return CarpenterResponse.json({
      status: 'ok',
      app: config.get('app.name'),
      tenants: (await tenantStore.all()).length,
      services: {
        queue: 'ok',
        mail: 'ok',
        storage: 'ok',
        scheduler: 'ok',
        flags: 'ok',
        billing: 'ok',
        graphql: 'ok',
      },
    });
  });

  const kernel = new HttpKernel(container, router, { debug: true });
  return { kernel, container, config, tenantStore: getTenantStore(), scheduler, islandRenderer };
}
