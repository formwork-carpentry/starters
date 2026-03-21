/**
 * Migration: Create users table.
 */
import { Schema, Blueprint } from '@formwork/orm';

export async function up(): Promise<void> {
  await Schema.create('users', (table: Blueprint) => {
    table.increments('id');
    table.string('name', 100);
    table.string('email', 255);
    table.string('password', 255);
    table.enum('role', ['admin', 'user']).default('user');
    table.text('bio').nullable();
    table.boolean('email_verified').default(false);
    table.string('two_factor_secret', 255).nullable();
    table.timestamps();
    table.softDeletes();
    table.unique(['email']);
  });
}

export async function down(): Promise<void> {
  await Schema.dropIfExists('users');
}
