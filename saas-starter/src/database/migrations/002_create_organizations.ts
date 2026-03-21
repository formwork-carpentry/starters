/**
 * Create organizations, members, and teams tables.
 */
import { Schema, Blueprint } from '@formwork/orm';

export async function up(schema: Schema): Promise<void> {
  await schema.create('organizations', (table: Blueprint) => {
    table.id();
    table.string('name');
    table.string('slug').unique();
    table.enum('plan', ['free', 'pro', 'enterprise']).default('free');
    table.integer('owner_id').references('id').on('users');
    table.integer('seats_used').default(0);
    table.integer('seats_limit').default(3);
    table.string('domain').nullable();
    table.text('settings').nullable(); // JSON config
    table.timestamps();
    table.softDeletes();
  });

  await schema.create('members', (table: Blueprint) => {
    table.id();
    table.integer('org_id').references('id').on('organizations');
    table.integer('user_id').references('id').on('users');
    table.enum('role', ['owner', 'admin', 'member', 'viewer']).default('member');
    table.timestamps();
    table.index(['org_id', 'user_id']);
  });

  await schema.create('teams', (table: Blueprint) => {
    table.id();
    table.integer('org_id').references('id').on('organizations');
    table.string('name');
    table.string('slug');
    table.text('description').nullable();
    table.timestamps();
  });

  await schema.create('team_members', (table: Blueprint) => {
    table.id();
    table.integer('team_id').references('id').on('teams');
    table.integer('member_id').references('id').on('members');
    table.timestamps();
  });
}

export async function down(schema: Schema): Promise<void> {
  await schema.dropIfExists('team_members');
  await schema.dropIfExists('teams');
  await schema.dropIfExists('members');
  await schema.dropIfExists('organizations');
}
