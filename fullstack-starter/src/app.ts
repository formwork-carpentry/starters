/**
 * @module fullstack-starter
 * @description Application entry point - bootstraps the Carpenter framework
 * with environment-driven configuration, service providers, and route registration.
 *
 * This starter showcases the full Carpenter package ecosystem:
 *   src/app/Controllers/  — Request handlers
 *   src/app/Models/       — ORM models (Active Record)
 *   src/app/Middleware/    — HTTP middleware
 *   src/app/Services/     — Business logic + external APIs
 *   src/app/Events/       — Domain event definitions
 *   src/app/Jobs/         — Background queue jobs
 *   src/app/Mail/         — Mailable templates
 *   src/app/Notifications/ — Multi-channel notifications
 *   src/app/Policies/     — Authorization policies (Gate)
 *   src/app/Admin/        — Admin panel resources
 *   src/config/           — Environment-driven config files
 *   src/routes/           — Route definitions (web + api + graphql)
 *   src/resources/views/  — React Islands SSR views
 *   src/resources/lang/   — Translation files
 *   src/database/         — Migrations, seeders, factories
 */

import 'reflect-metadata';
import { join } from 'node:path';
import { registerWebRoutes } from './routes/web.js';
import { registerApiRoutes } from './routes/api.js';
import { registerEventListeners } from './app/Events/index.js';
import { createTranslator } from './config/i18n.js';
import { configureLogging } from './config/logging.js';
import { configureStorage } from './config/storage.js';
import { configureFlags, dashboardExperiment } from './config/flags.js';
import { configureScheduler } from './config/schedule.js';
import { configureAuth, registerAuthRoutes } from './config/auth.js';
import { configureGate } from './app/Policies/PostPolicy.js';
import { configureAdminPanel } from './app/Admin/panel.js';
import type { Config } from '@formwork/core';
import { EventDispatcher } from '@formwork/events';
import { bootstrap } from '@formwork/foundation';
import { Router, HttpKernel, CarpenterResponse } from '@formwork/http';
import { IslandRenderer } from '@formwork/ui';
import { QueueManager, SyncQueueAdapter } from '@formwork/queue';
import { MailManager, LogMailAdapter } from '@formwork/mail';
import { NotificationManager, ArrayChannel as NotifArrayChannel } from '@formwork/notifications';
import { AuditLogger } from '@formwork/log';

export async function createApp(options: { skipEnv?: boolean; configOverrides?: Record<string, unknown> } = {}) {
  const { container, config } = await bootstrap({
    skipEnv: options.skipEnv ?? false,
    envPath: join(import.meta.dirname ?? '.', '../../.env'),
    configOverrides: options.configOverrides,
  });

  const env = config.get('app.env', 'development') as string;

  // ── Events ──
  const events = container.make<EventDispatcher>('events');
  registerEventListeners(events);

  // ── i18n ──
  const translator = await createTranslator();

  // ── Logging + Audit ──
  const logManager = configureLogging(env);
  const audit = new AuditLogger(logManager);

  // ── Storage + Media ──
  const storage = configureStorage(env);

  // ── Feature flags ──
  const flags = configureFlags();
  const _experiment = dashboardExperiment();

  // ── Queue ──
  const queue = new QueueManager('sync', {
    sync: { driver: 'sync' },
  });

  // ── Mail ──
  const mail = new MailManager('log', {
    log: { driver: 'log' },
  });

  // ── Notifications ──
  const notifications = new NotificationManager();
  notifications.addChannel(new NotifArrayChannel('array'));

  // ── Scheduler ──
  const scheduler = configureScheduler();

  // ── Auth (Padlock + SocialLock) ──
  const authServices = configureAuth();

  // ── Authorization (Gate with PostPolicy) ──
  const gate = configureGate();

  // ── Admin Panel ──
  const adminPanel = configureAdminPanel();

  // ── UI (Island Renderer) ──
  const islandRenderer = new IslandRenderer();

  // ── Register services in container ──
  container.singleton('log', () => logManager);
  container.singleton('audit', () => audit);
  container.singleton('storage', () => storage);
  container.singleton('flags', () => flags);
  container.singleton('queue', () => queue);
  container.singleton('mail', () => mail);
  container.singleton('notifications', () => notifications);
  container.singleton('scheduler', () => scheduler);
  container.singleton('gate', () => gate);
  container.singleton('admin', () => adminPanel);
  container.singleton('islands', () => islandRenderer);
  container.singleton('auth.padlock', () => authServices.padlockService);
  container.singleton('auth.sociallock', () => authServices.socialLockService);

  // ── Router ──
  const router = new Router();

  // Auth routes (padlock + sociallock)
  registerAuthRoutes(router, authServices);

  // Web routes (SSR pages with islands)
  registerWebRoutes(router, container, translator);

  // API routes (REST + GraphQL)
  registerApiRoutes(router, container);

  // Health endpoint
  router.get('/health', async () => CarpenterResponse.json({
    status: 'ok',
    app: config.get('app.name', 'CarpenterFullstack'),
    env,
    timestamp: new Date().toISOString(),
  }));

  const kernel = new HttpKernel(container, router, {
    debug: config.get('app.debug', true) as boolean,
  });

  return { kernel, container, config, router, translator, islandRenderer, scheduler };
}
