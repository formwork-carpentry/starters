/**
 * Migration: Create notifications and activity_log tables.
 */
import { Schema, Blueprint } from '@formwork/orm';

export async function up(): Promise<void> {
  await Schema.create('notifications', (table: Blueprint) => {
    table.increments('id');
    table.string('type', 255);
    table.integer('notifiable_id');
    table.string('notifiable_type', 100);
    table.json('data');
    table.timestamp('read_at').nullable();
    table.timestamps();
    table.index(['notifiable_id', 'notifiable_type']);
  });

  await Schema.create('activity_log', (table: Blueprint) => {
    table.increments('id');
    table.string('action', 100);
    table.string('subject_type', 100).nullable();
    table.integer('subject_id').nullable();
    table.integer('user_id').nullable();
    table.json('properties').nullable();
    table.string('ip_address', 45).nullable();
    table.timestamps();
    table.index(['user_id']);
    table.index(['subject_type', 'subject_id']);
  });

  await Schema.create('jobs', (table: Blueprint) => {
    table.increments('id');
    table.string('queue', 100).default('default');
    table.string('name', 255);
    table.longText('payload');
    table.integer('attempts').default(0);
    table.integer('max_retries').default(3);
    table.timestamp('available_at');
    table.timestamp('reserved_at').nullable();
    table.timestamps();
    table.index(['queue', 'available_at']);
  });

  await Schema.create('failed_jobs', (table: Blueprint) => {
    table.increments('id');
    table.string('queue', 100);
    table.string('name', 255);
    table.longText('payload');
    table.longText('exception');
    table.timestamps();
  });
}

export async function down(): Promise<void> {
  await Schema.dropIfExists('failed_jobs');
  await Schema.dropIfExists('jobs');
  await Schema.dropIfExists('activity_log');
  await Schema.dropIfExists('notifications');
}
