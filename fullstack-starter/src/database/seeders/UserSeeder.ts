/**
 * Seed admin and demo users.
 */
import { BaseSeeder } from '@formwork/orm';
import { User } from '../../app/Models/index.js';

export class UserSeeder extends BaseSeeder {
  async run(): Promise<void> {
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'hashed_admin_password',
      role: 'admin',
      bio: 'Platform administrator',
      email_verified: true,
    });

    await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashed_user_password',
      role: 'user',
      bio: 'Demo user — loves writing about technology.',
      email_verified: true,
    });

    await User.create({
      name: 'John Smith',
      email: 'john@example.com',
      password: 'hashed_user_password',
      role: 'user',
      bio: 'Guest contributor.',
      email_verified: true,
    });
  }
}
