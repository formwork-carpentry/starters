/**
 * Migration: Create posts and categories tables.
 */
import { Schema, Blueprint } from '@formwork/orm';

export async function up(): Promise<void> {
  await Schema.create('categories', (table: Blueprint) => {
    table.increments('id');
    table.string('name', 100);
    table.string('slug', 100);
    table.text('description').nullable();
    table.timestamps();
    table.unique(['slug']);
  });

  await Schema.create('posts', (table: Blueprint) => {
    table.increments('id');
    table.string('title', 200);
    table.string('slug', 200);
    table.longText('body');
    table.integer('author_id');
    table.integer('category_id').nullable();
    table.string('category', 100).nullable();
    table.enum('status', ['draft', 'published', 'archived']).default('draft');
    table.string('cover_url', 500).nullable();
    table.timestamp('published_at').nullable();
    table.timestamps();
    table.softDeletes();
    table.foreign('author_id').references('id').on('users');
    table.index(['status']);
    table.index(['author_id']);
  });

  await Schema.create('comments', (table: Blueprint) => {
    table.increments('id');
    table.integer('post_id');
    table.integer('author_id');
    table.text('body');
    table.timestamps();
    table.foreign('post_id').references('id').on('posts');
    table.foreign('author_id').references('id').on('users');
  });
}

export async function down(): Promise<void> {
  await Schema.dropIfExists('comments');
  await Schema.dropIfExists('posts');
  await Schema.dropIfExists('categories');
}
