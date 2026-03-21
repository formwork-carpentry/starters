/**
 * SaaS GraphQL schema — Organization, Member, Subscription, Team types.
 */
import { SchemaBuilder } from '@formwork/graphql';

export function buildSaaSSchema() {
  const schema = new SchemaBuilder();

  schema.type('Organization', {
    fields: {
      id: 'ID!',
      name: 'String!',
      slug: 'String!',
      plan: 'String!',
      seats_used: 'Int!',
      seats_limit: 'Int!',
      domain: 'String',
      created_at: 'String',
    },
  });

  schema.type('Member', {
    fields: {
      id: 'ID!',
      org_id: 'Int!',
      user_id: 'Int!',
      name: 'String!',
      email: 'String!',
      role: 'String!',
    },
  });

  schema.type('Subscription', {
    fields: {
      id: 'ID!',
      org_id: 'Int!',
      plan: 'String!',
      status: 'String!',
      amount_cents: 'Int!',
      currency: 'String!',
      trial_ends_at: 'String',
      current_period_start: 'String',
      current_period_end: 'String',
    },
  });

  schema.type('Invoice', {
    fields: {
      id: 'ID!',
      org_id: 'Int!',
      amount_cents: 'Int!',
      currency: 'String!',
      status: 'String!',
      due_date: 'String',
      paid_at: 'String',
    },
  });

  schema.type('Team', {
    fields: {
      id: 'ID!',
      org_id: 'Int!',
      name: 'String!',
      description: 'String',
    },
  });

  schema.type('UsageRecord', {
    fields: {
      metric: 'String!',
      quantity: 'Int!',
      recorded_date: 'String!',
    },
  });

  // Queries
  schema.query('organization', {
    type: 'Organization',
    args: { slug: 'String!' },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      const { Organization } = await import('../models/Organization.js');
      return Organization.query().where('slug', '=', args['slug'] as string).first();
    },
  });

  schema.query('members', {
    type: '[Member!]!',
    args: { orgId: 'Int!' },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      const { Member } = await import('../models/Organization.js');
      return Member.query().where('org_id', '=', args['orgId'] as number).get();
    },
  });

  schema.query('organizations', {
    type: '[Organization!]!',
    resolve: async () => {
      const { Organization } = await import('../models/Organization.js');
      return Organization.all();
    },
  });

  // Mutations
  schema.mutation('inviteMember', {
    type: 'Member',
    args: { orgId: 'Int!', email: 'String!', role: 'String!' },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      const { Member } = await import('../models/Organization.js');
      return Member.create({
        org_id: args['orgId'],
        email: args['email'],
        role: args['role'],
        name: (args['email'] as string).split('@')[0],
        user_id: 0,
      });
    },
  });

  schema.mutation('changePlan', {
    type: 'Organization',
    args: { slug: 'String!', plan: 'String!' },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      const { Organization } = await import('../models/Organization.js');
      const row = await Organization.query().where('slug', '=', args['slug'] as string).first();
      if (!row) return null;
      const org = Organization.hydrate(row);
      await org.update({ plan: args['plan'] });
      return org;
    },
  });

  schema.mutation('removeMember', {
    type: 'Boolean',
    args: { id: 'ID!' },
    resolve: async (_parent: unknown, args: Record<string, unknown>) => {
      const { Member } = await import('../models/Organization.js');
      const row = await Member.find(args['id'] as number);
      if (!row) return false;
      const member = Member.hydrate(row);
      await member.delete();
      return true;
    },
  });

  return schema;
}
