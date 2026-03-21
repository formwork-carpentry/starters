/**
 * Seed demo blog posts and categories.
 */
import { BaseSeeder } from '@formwork/orm';
import { Post, Category } from '../../app/Models/index.js';

export class PostSeeder extends BaseSeeder {
  async run(): Promise<void> {
    await Category.create({ name: 'Technology', slug: 'technology', description: 'Tech news and tutorials' });
    await Category.create({ name: 'Design', slug: 'design', description: 'UI/UX and graphic design' });
    await Category.create({ name: 'Business', slug: 'business', description: 'Startups, strategy, and growth' });

    await Post.create({
      title: 'Getting Started with Carpenter',
      slug: 'getting-started-with-carpenter',
      body: 'Carpenter is a modern TypeScript framework inspired by the best ideas from Laravel, Rails, and Next.js. This guide walks you through setting up your first project...',
      author_id: 1,
      category: 'technology',
      status: 'published',
      published_at: new Date().toISOString(),
    });

    await Post.create({
      title: 'Building React Islands',
      slug: 'building-react-islands',
      body: 'React Islands let you sprinkle interactivity into server-rendered pages without shipping a full SPA bundle. Learn how the Island architecture works and when to use each hydration strategy...',
      author_id: 2,
      category: 'technology',
      status: 'published',
      published_at: new Date().toISOString(),
    });

    await Post.create({
      title: 'Designing a Multi-Tenant SaaS',
      slug: 'designing-multi-tenant-saas',
      body: 'Multi-tenancy is a core requirement for SaaS applications. This article explores tenant isolation strategies — from shared database with scoped queries to fully isolated schemas...',
      author_id: 2,
      category: 'business',
      status: 'draft',
    });
  }
}
