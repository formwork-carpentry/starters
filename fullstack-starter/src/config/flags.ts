/**
 * Feature flags configuration — progressive rollouts and experiments.
 */
import { InMemoryFlagProvider, Experiment } from '@formwork/flags';

export function configureFlags(): InMemoryFlagProvider {
  const flags = new InMemoryFlagProvider();

  // Percentage-based rollout: new rich text editor
  flags.define('new-editor', {
    enabled: true,
    percentage: 25,
  });

  // Simple toggle: dark mode for all users
  flags.define('dark-mode', {
    enabled: true,
  });

  // Targeted rollout: experimental AI features for specific users
  flags.define('experimental-ai', {
    enabled: true,
    allowedUsers: [1],
    allowedGroups: ['beta-testers'],
  });

  // Disabled by default: maintenance mode
  flags.define('maintenance-mode', {
    enabled: false,
  });

  return flags;
}

/** A/B test: dashboard layout variants. */
export function dashboardExperiment(): Experiment<string> {
  return new Experiment('dashboard-layout', [
    { name: 'classic', value: 'classic-grid', weight: 50 },
    { name: 'modern', value: 'card-based', weight: 30 },
    { name: 'minimal', value: 'minimal-list', weight: 20 },
  ]);
}
