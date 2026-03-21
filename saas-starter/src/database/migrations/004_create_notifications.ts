/**
 * Create notifications, activity_log, jobs tables.
 */
import { Schema, Blueprint } from '@formwork/orm';

export async function up(schema: Schema): Promise<void> {
  await schema.create('notifications', (table: Blueprint) => {
    table.id();
    table.string('type');
    table.integer('notifiable_id');
    table.string('notifiable_type');
    table.text('data');
    table.datetime('read_at').nullable();
    table.timestamps();
    table.index(['notifiable_type', 'notifiable_id']);
  });

  await schema.create('activity_log', (table: Blueprint) => {
    table.id();
    table.integer('org_id').nullable();
    table.string('action');
    table.string('subject_type').nullable();
    table.integer('subject_id').nullable();
    table.integer('user_id').nullable();
    table.text('properties').nullable();
    table.string('ip_address').nullable();
    table.timestamps();
  });

  await schema.create('jobs', (table: Blueprint) => {
    table.id();
    table.string('queue').default('default');
    table.string('name');
    table.text('payload');
    table.integer('attempts').default(0);
    table.integer('max_retries').default(3);
    table.datetime('available_at');
    table.datetime('reserved_at').nullable();
    table.timestamps();
  });

  await schema.create('failed_jobs', (table: Blueprint) => {
    table.id();
    table.string('queue');
    table.string('name');
    table.text('payload');
    table.text('exception');
    table.timestamps();
  });
}

export async function down(schema: Schema): Promise<void> {
  await schema.dropIfExists('failed_jobs');
  await schema.dropIfExists('jobs');
  await schema.dropIfExists('activity_log');
  await schema.dropIfExists('notifications');
}
