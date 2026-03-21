/**
 * Factory for generating User model instances.
 */
import { User } from '../../app/Models/index.js';

let sequence = 100;

/** Generate attributes for a random user. */
export function userAttributes(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const id = ++sequence;
  return {
    name: `User ${id}`,
    email: `user${id}@example.com`,
    password: 'hashed_test_password',
    role: 'user',
    bio: null,
    email_verified: false,
    ...overrides,
  };
}

/** Create and persist a User instance. */
export async function createUser(overrides: Record<string, unknown> = {}): Promise<typeof User.prototype> {
  return User.create(userAttributes(overrides));
}

/** Create multiple users. */
export async function createUsers(count: number, overrides: Record<string, unknown> = {}): Promise<Array<typeof User.prototype>> {
  const users: Array<typeof User.prototype> = [];
  for (let i = 0; i < count; i++) {
    users.push(await createUser(overrides));
  }
  return users;
}
