/**
 * Create users table for SaaS platform.
 */
import { Schema, Blueprint } from '@formwork/orm';

export async function up(schema: Schema): Promise<void> {
  await schema.create('users', (table: Blueprint) => {
    table.id();
    table.string('name');
    table.string('email').unique();
    table.string('password');
    table.enum('role', ['superadmin', 'admin', 'member']).default('member');
    table.string('avatar_url').nullable();
    table.boolean('email_verified').default(false);
    table.string('two_factor_secret').nullable();
    table.timestamps();
    table.softDeletes();
  });
}

export async function down(schema: Schema): Promise<void> {
  await schema.dropIfExists('users');
}
