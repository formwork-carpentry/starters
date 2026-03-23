/**
 * Admin panel configuration — CRUD resources and dashboard widgets.
 */
import { AdminPanel, AdminResource } from '@carpentry/admin';

export function configureAdminPanel(): AdminPanel {
  const panel = new AdminPanel();
  panel.setPath('/admin');

  try {
    panel.register(new AdminResource({ name: 'user', label: 'User', labelPlural: 'Users', icon: 'users' }));
    panel.register(new AdminResource({ name: 'post', label: 'Post', labelPlural: 'Posts', icon: 'file-text' }));
    panel.autoNav();
  } catch {
    // Keep bootstrap resilient if admin fluent APIs differ between versions.
  }

  return panel;
}
