import { BaseModel } from '@formwork/orm';

export class Organization extends BaseModel {
  static table = 'organizations';
  static fillable = ['name', 'slug', 'plan', 'owner_id', 'seats_used', 'seats_limit'];
  static timestamps = true;
}

export class Member extends BaseModel {
  static table = 'members';
  static fillable = ['org_id', 'user_id', 'role', 'email', 'name'];
  static timestamps = true;
}

export async function seedOrganizations(): Promise<void> {
  await Organization.create({ name: 'Acme Corp', slug: 'acme', plan: 'pro', owner_id: 1, seats_used: 5, seats_limit: 20 });
  await Organization.create({ name: 'Globex Inc', slug: 'globex', plan: 'free', owner_id: 2, seats_used: 2, seats_limit: 3 });
}
