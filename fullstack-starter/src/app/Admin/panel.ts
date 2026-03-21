/**
 * Admin panel configuration — CRUD resources and dashboard widgets.
 */
import { AdminPanel, AdminResource } from '@formwork/admin';

export function configureAdminPanel(): AdminPanel {
  const panel = new AdminPanel();
  panel.setPath('/admin');

  // ── User Resource ──
  const users = new AdminResource({ name: 'user', label: 'User', labelPlural: 'Users', icon: 'users' });
  users
    .id()
    .text('name', 'Name').required().sortable().searchable()
    .email('email', 'Email').required().sortable().searchable()
    .select('role', [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ], 'Role').sortable().filterable()
    .boolean('email_verified', 'Verified').sortable().filterable()
    .textarea('bio', 'Bio').hideOnIndex()
    .timestamps();
  users.filter('role', 'select');
  users.filter('email_verified', 'boolean');
  users.action('verify', (ids: string[]) => {
    console.log(`[Admin] Verifying users: ${ids.join(', ')}`);
  });
  panel.register(users);

  // ── Post Resource ──
  const posts = new AdminResource({ name: 'post', label: 'Post', labelPlural: 'Posts', icon: 'file-text' });
  posts
    .id()
    .text('title', 'Title').required().sortable().searchable()
    .text('slug', 'Slug').hideOnIndex()
    .textarea('body', 'Content').required().hideOnIndex()
    .belongsTo('author_id', 'user', 'Author').sortable()
    .text('category', 'Category').sortable().filterable()
    .select('status', [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived', value: 'archived' },
    ], 'Status').sortable().filterable()
    .datetime('published_at', 'Published At').sortable().hideOnCreate()
    .timestamps();
  posts.filter('status', 'select');
  posts.filter('category', 'text');
  posts.action('publish', (ids: string[]) => {
    console.log(`[Admin] Publishing posts: ${ids.join(', ')}`);
  });
  posts.action('archive', (ids: string[]) => {
    console.log(`[Admin] Archiving posts: ${ids.join(', ')}`);
  });
  panel.register(posts);

  // ── Category Resource ──
  const categories = new AdminResource({ name: 'category', label: 'Category', labelPlural: 'Categories', icon: 'folder' });
  categories
    .id()
    .text('name', 'Name').required().sortable().searchable()
    .text('slug', 'Slug').required().sortable()
    .textarea('description', 'Description').hideOnIndex()
    .timestamps();
  panel.register(categories);

  // ── Comment Resource ──
  const comments = new AdminResource({ name: 'comment', label: 'Comment', labelPlural: 'Comments', icon: 'message-circle' });
  comments
    .id()
    .belongsTo('post_id', 'post', 'Post').sortable()
    .belongsTo('author_id', 'user', 'Author').sortable()
    .textarea('body', 'Content').required().searchable()
    .timestamps();
  comments.action('delete', (ids: string[]) => {
    console.log(`[Admin] Deleting comments: ${ids.join(', ')}`);
  });
  panel.register(comments);

  // ── Dashboard Widgets ──
  panel.widget({
    name: 'total-users',
    type: 'stat',
    label: 'Total Users',
    value: async () => 0, // In production: User.query().count()
    icon: 'users',
  });
  panel.widget({
    name: 'total-posts',
    type: 'stat',
    label: 'Total Posts',
    value: async () => 0, // In production: Post.query().count()
    icon: 'file-text',
  });
  panel.widget({
    name: 'published-posts',
    type: 'stat',
    label: 'Published',
    value: async () => 0, // In production: Post.where('status','=','published').count()
    icon: 'check-circle',
  });
  panel.widget({
    name: 'recent-comments',
    type: 'stat',
    label: 'Comments Today',
    value: async () => 0, // In production: Comment.where('created_at','>=',today).count()
    icon: 'message-circle',
  });

  panel.autoNav();

  return panel;
}
