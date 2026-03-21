/**
 * Auth configuration for SaaS — Padlock (auth workflows) + SocialLock (OAuth).
 */
import {
  PadlockService,
  PadlockController,
  registerPadlockRoutes,
  NullPadlockNotifier,
  MemoryTwoFactorStore,
  BuiltInTotpProvider,
  InMemoryPadlockUserRepository,
  MemoryPadlockTokenStore,
} from '@formwork/padlock';
import {
  SocialLockService,
  SocialLockController,
  MemoryStateStore,
  InMemorySocialUserRepository,
  registerSocialLockRoutes,
  googleProvider,
  githubProvider,
} from '@formwork/sociallock';
import { MemoryGuard, HashManager, InMemoryUserProvider } from '@formwork/auth';
import type { Router } from '@formwork/http';

export interface SaaSAuthServices {
  padlockService: PadlockService;
  padlockController: PadlockController;
  socialLockService: SocialLockService;
  socialLockController: SocialLockController;
}

export function configureSaaSAuth(): SaaSAuthServices {
  const userProvider = new InMemoryUserProvider();
  const hasher = new HashManager('sha256');
  const guard = new MemoryGuard(userProvider, hasher);

  const padlockService = new PadlockService({
    guard,
    hasher,
    userRepository: new InMemoryPadlockUserRepository(hasher),
    tokenStore: new MemoryPadlockTokenStore(),
    notifier: new NullPadlockNotifier(),
    twoFactorStore: new MemoryTwoFactorStore(),
    totpProvider: new BuiltInTotpProvider(),
    config: {
      lockoutMaxAttempts: 5,
      lockoutMinutes: 15,
      twoFactorIssuer: 'SaaS Platform',
    },
  });

  const padlockController = new PadlockController(padlockService);

  const providers = new Map<string, ReturnType<typeof googleProvider>>();
  providers.set('google', googleProvider(
    process.env['GOOGLE_CLIENT_ID'] ?? 'google-client-id',
    process.env['GOOGLE_CLIENT_SECRET'] ?? 'google-client-secret',
    process.env['GOOGLE_REDIRECT_URI'] ?? 'http://localhost:3000/auth/social/google/callback',
  ));
  providers.set('github', githubProvider(
    process.env['GITHUB_CLIENT_ID'] ?? 'github-client-id',
    process.env['GITHUB_CLIENT_SECRET'] ?? 'github-client-secret',
    process.env['GITHUB_REDIRECT_URI'] ?? 'http://localhost:3000/auth/social/github/callback',
  ));

  const socialLockService = new SocialLockService({
    guard,
    stateStore: new MemoryStateStore(),
    userRepository: new InMemorySocialUserRepository(),
    providers,
  });

  const socialLockController = new SocialLockController(socialLockService, {
    successRedirect: '/dashboard',
  });

  return { padlockService, padlockController, socialLockService, socialLockController };
}

export function registerSaaSAuthRoutes(router: Router, services: SaaSAuthServices): void {
  registerPadlockRoutes(router, services.padlockController);
  registerSocialLockRoutes(router, services.socialLockController, { prefix: '/auth/social' });
}
