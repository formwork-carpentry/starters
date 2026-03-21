/**
 * i18n configuration for SaaS.
 */
import { Translator, ObjectLoader, Pluralizer } from '@formwork/i18n';

const en = {
  nav: { home: 'Home', dashboard: 'Dashboard', billing: 'Billing', team: 'Team', settings: 'Settings', login: 'Login' },
  billing: {
    current_plan: 'Current Plan',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    manage_subscription: 'Manage Subscription',
    invoices: 'Invoices',
  },
  team: {
    members: 'Team Members',
    invite: 'Invite Member',
    remove: 'Remove',
    role: 'Role',
  },
  auth: { welcome: 'Welcome back, :name!', login: 'Sign In', register: 'Create Account' },
};

export async function createTranslator(): Promise<Translator> {
  const translator = new Translator(
    new ObjectLoader({ en }),
    new Pluralizer(),
    'en',
  );
  await translator.loadAll('en');
  return translator;
}
