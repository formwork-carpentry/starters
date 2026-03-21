/**
 * Authorization policies — gate definitions and post policy using @formwork/padlock.
 */
import { Gate } from '@formwork/auth';
import type { IAuthenticatable } from '@formwork/auth';

/**
 * PostPolicy — controls who can edit/delete posts.
 */
export class PostPolicy {
  /** Only the post author or an admin can update a post. */
  update(user: IAuthenticatable, post: { author_id: number }): boolean {
    const userId = user.getAuthIdentifier();
    return userId === post.author_id || (user as unknown as { role: string }).role === 'admin';
  }

  /** Only the post author or an admin can delete a post. */
  delete(user: IAuthenticatable, post: { author_id: number }): boolean {
    return this.update(user, post);
  }

  /** Any authenticated user can create a post. */
  create(_user: IAuthenticatable): boolean {
    return true;
  }

  /** Any user can view published posts. Admins can view all. */
  view(user: IAuthenticatable, post: { status: string; author_id: number }): boolean {
    if (post.status === 'published') return true;
    const userId = user.getAuthIdentifier();
    return userId === post.author_id || (user as unknown as { role: string }).role === 'admin';
  }
}

/**
 * Configure authorization gate with global abilities and policies.
 */
export function configureGate(): Gate {
  const gate = new Gate();

  // Admin bypass — admins can do anything
  gate.before(async (user: IAuthenticatable, _ability: string) => {
    if ((user as unknown as { role: string }).role === 'admin') return true;
    return null; // Fall through to specific checks
  });

  // Post abilities
  const postPolicy = new PostPolicy();
  gate.define('post.create', (_user: IAuthenticatable) => postPolicy.create(_user));
  gate.define('post.update', (user: IAuthenticatable, ...args: unknown[]) => postPolicy.update(user, args[0] as { author_id: number }));
  gate.define('post.delete', (user: IAuthenticatable, ...args: unknown[]) => postPolicy.delete(user, args[0] as { author_id: number }));
  gate.define('post.view', (user: IAuthenticatable, ...args: unknown[]) => postPolicy.view(user, args[0] as { status: string; author_id: number }));

  // Admin panel access
  gate.define('admin.access', (user: IAuthenticatable) => {
    return (user as unknown as { role: string }).role === 'admin';
  });

  // User management
  gate.define('user.manage', (user: IAuthenticatable) => {
    return (user as unknown as { role: string }).role === 'admin';
  });

  return gate;
}
