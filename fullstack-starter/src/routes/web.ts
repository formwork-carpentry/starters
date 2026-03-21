import type { Container } from '@formwork/core/container';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';
import type { Translator } from '@formwork/i18n';
import type { IslandRenderer } from '@formwork/ui';
import { AppLayout } from '../resources/views/layouts/AppLayout.js';
import { HomePage } from '../resources/views/pages/Home.js';
import { LoginPage } from '../resources/views/pages/Login.js';
import { DashboardPage } from '../resources/views/pages/Dashboard.js';
import { PostsIndexPage } from '../resources/views/pages/Posts/Index.js';
import { PostCreatePage } from '../resources/views/pages/Posts/Create.js';
import { Post, Category, Comment, User } from '../app/Models/index.js';
import type { InMemoryFlagProvider } from '@formwork/flags';

export function registerWebRoutes(router: Router, container: Container, translator: Translator): void {
  const getIslands = () => container.make<IslandRenderer>('islands');
  const getFlags = () => container.make<InMemoryFlagProvider>('flags');

  const nav = () => ({
    home: translator.get('nav.home'),
    blog: translator.get('nav.blog'),
    login: translator.get('nav.login'),
  });

  // ── Public Landing Page ──
  router.get('/', async () => {
    const islandRenderer = getIslands();
    const posts = await Post.query().where('status', '=', 'published').orderBy('created_at', 'desc').limit(6).get() as Array<{ id: number; title: string; slug: string; category: string; published_at: string }>;
    const bodyHtml = HomePage({ nav: nav(), recentPosts: posts, stats: { users: 0, posts: posts.length, comments: 0 } }, islandRenderer);
    const html = AppLayout({ title: 'Home', nav: nav(), user: null, bodyHtml, islandRenderer });
    return CarpenterResponse.html(html);
  });

  // ── Login Page ──
  router.get('/login', async () => {
    const islandRenderer = getIslands();
    const bodyHtml = LoginPage({ nav: nav(), error: null, socialProviders: ['google', 'github'] }, islandRenderer);
    const html = AppLayout({ title: 'Login', nav: nav(), user: null, bodyHtml, islandRenderer });
    return CarpenterResponse.html(html);
  });

  // ── Dashboard (auth required) ──
  router.get('/dashboard', async () => {
    const islandRenderer = getIslands();
    const flags = getFlags();
    const user = { name: 'Demo User', role: 'admin' };
    const bodyHtml = DashboardPage({
      nav: nav(),
      user,
      stats: { totalPosts: 0, publishedPosts: 0, draftPosts: 0, comments: 0 },
      notifications: [],
      featureFlags: { darkMode: flags.isEnabled('dark-mode'), newEditor: flags.isEnabled('new-editor') },
    }, islandRenderer);
    const html = AppLayout({ title: 'Dashboard', nav: nav(), user, bodyHtml, islandRenderer });
    return CarpenterResponse.html(html);
  });

  // ── Posts listing ──
  router.get('/posts', async () => {
    const islandRenderer = getIslands();
    const posts = await Post.query().orderBy('created_at', 'desc').get() as Array<{ id: number; title: string; category: string; status: string; author_id: number; published_at: string }>;
    const bodyHtml = PostsIndexPage({
      nav: nav(),
      posts: posts.map(p => ({ ...p, author: { name: 'Author' } })),
      pagination: { currentPage: 1, totalPages: 1, totalItems: posts.length },
    }, islandRenderer);
    const html = AppLayout({ title: 'Posts', nav: nav(), user: null, bodyHtml, islandRenderer });
    return CarpenterResponse.html(html);
  });

  // ── New Post form ──
  router.get('/posts/create', async () => {
    const islandRenderer = getIslands();
    const categories = await Category.all() as Array<{ id: number; name: string; slug: string }>;
    const bodyHtml = PostCreatePage({ nav: nav(), categories }, islandRenderer);
    const html = AppLayout({ title: 'New Post', nav: nav(), user: { name: 'Demo User', role: 'user' }, bodyHtml, islandRenderer });
    return CarpenterResponse.html(html);
  });

  // ── Locale switch ──
  router.put('/locale/:lang', async (req) => {
    translator.setLocale(req.param('lang'));
    return CarpenterResponse.json({
      locale: req.param('lang'),
      nav: nav(),
    });
  });
}
