import { InMemoryTenantStore } from '@formwork/tenancy';

const tenantStore = new InMemoryTenantStore();

export async function seedTenants(): Promise<void> {
  await tenantStore.create({ id: 'acme', name: 'Acme Corp', slug: 'acme', domain: 'acme.saas.local', status: 'active' });
  await tenantStore.create({ id: 'globex', name: 'Globex Inc', slug: 'globex', domain: 'globex.saas.local', status: 'active' });
}

export function getTenantStore(): InMemoryTenantStore { return tenantStore; }
