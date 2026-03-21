/**
 * Create billing tables: subscriptions, invoices, usage_records.
 */
import { Schema, Blueprint } from '@formwork/orm';

export async function up(schema: Schema): Promise<void> {
  await schema.create('subscriptions', (table: Blueprint) => {
    table.id();
    table.integer('org_id').references('id').on('organizations');
    table.string('plan');
    table.enum('status', ['active', 'canceled', 'past_due', 'trialing']).default('active');
    table.string('stripe_subscription_id').nullable();
    table.datetime('trial_ends_at').nullable();
    table.datetime('current_period_start');
    table.datetime('current_period_end');
    table.timestamps();
  });

  await schema.create('invoices', (table: Blueprint) => {
    table.id();
    table.integer('org_id').references('id').on('organizations');
    table.integer('subscription_id').references('id').on('subscriptions');
    table.integer('amount_cents');
    table.string('currency').default('usd');
    table.enum('status', ['draft', 'open', 'paid', 'void']).default('draft');
    table.string('stripe_invoice_id').nullable();
    table.datetime('due_date');
    table.datetime('paid_at').nullable();
    table.timestamps();
  });

  await schema.create('usage_records', (table: Blueprint) => {
    table.id();
    table.integer('org_id').references('id').on('organizations');
    table.string('metric'); // api_calls, storage_bytes, seats
    table.integer('quantity');
    table.date('recorded_date');
    table.timestamps();
    table.index(['org_id', 'metric', 'recorded_date']);
  });
}

export async function down(schema: Schema): Promise<void> {
  await schema.dropIfExists('usage_records');
  await schema.dropIfExists('invoices');
  await schema.dropIfExists('subscriptions');
}
