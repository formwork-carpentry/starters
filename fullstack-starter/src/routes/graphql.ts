/**
 * GraphQL route — schema with User, Post, Category types.
 */
import { SchemaBuilder, DataLoader } from '@formwork/graphql';
import { User, Post, Category, Comment } from '../app/Models/index.js';

export function createGraphQLSchema(): SchemaBuilder {
  const schema = new SchemaBuilder();

  // ── Types ──

  schema.type('User', {
    id: { type: 'Int!' },
    name: { type: 'String!' },
    email: { type: 'String!' },
    role: { type: 'String!' },
    bio: { type: 'String' },
  }, 'A registered user');

  schema.type('Category', {
    id: { type: 'Int!' },
    name: { type: 'String!' },
    slug: { type: 'String!' },
    description: { type: 'String' },
  }, 'A post category');

  schema.type('Post', {
    id: { type: 'Int!' },
    title: { type: 'String!' },
    slug: { type: 'String' },
    body: { type: 'String!' },
    category: { type: 'String' },
    status: { type: 'String!' },
    author_id: { type: 'Int!' },
    published_at: { type: 'String' },
    created_at: { type: 'String' },
  }, 'A blog post');

  schema.type('Comment', {
    id: { type: 'Int!' },
    post_id: { type: 'Int!' },
    author_id: { type: 'Int!' },
    body: { type: 'String!' },
    created_at: { type: 'String' },
  }, 'A comment on a post');

  // ── Queries ──

  schema.query('users', {
    type: '[User!]!',
    resolve: async () => User.all(),
  });

  schema.query('user', {
    type: 'User',
    args: { id: { type: 'Int!' } },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => User.find(args['id'] as number),
  });

  schema.query('posts', {
    type: '[Post!]!',
    args: {
      status: { type: 'String' },
      category: { type: 'String' },
    },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      let q = Post.query();
      if (args['status']) q = q.where('status', '=', args['status'] as string);
      if (args['category']) q = q.where('category', '=', args['category'] as string);
      return q.orderBy('created_at', 'desc').get();
    },
  });

  schema.query('post', {
    type: 'Post',
    args: { id: { type: 'Int!' } },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => Post.find(args['id'] as number),
  });

  schema.query('categories', {
    type: '[Category!]!',
    resolve: async () => Category.all(),
  });

  // ── Mutations ──

  schema.mutation('createPost', {
    type: 'Post!',
    args: {
      title: { type: 'String!' },
      body: { type: 'String!' },
      category: { type: 'String!' },
      status: { type: 'String' },
    },
    resolve: async (_parent: unknown, args: Record<string, unknown>) =>
      Post.create({
        title: args['title'],
        body: args['body'],
        category: args['category'],
        status: (args['status'] as string) ?? 'draft',
        author_id: 1, // In production: from auth context
      }),
  });

  schema.mutation('updatePost', {
    type: 'Post',
    args: {
      id: { type: 'Int!' },
      title: { type: 'String' },
      body: { type: 'String' },
      category: { type: 'String' },
      status: { type: 'String' },
    },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      const post = await Post.findOrFail(args['id'] as number);
      const { id: _id, ...updates } = args as Record<string, unknown>;
      const filtered = Object.fromEntries(Object.entries(updates).filter(([, v]) => v != null));
      await post.update(filtered);
      return post;
    },
  });

  schema.mutation('deletePost', {
    type: 'Boolean!',
    args: { id: { type: 'Int!' } },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      const post = await Post.findOrFail(args['id'] as number);
      await post.delete();
      return true;
    },
  });

  return schema;
}
