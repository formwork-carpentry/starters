/**
 * Auth configuration — wires @formwork/padlock (auth workflows) and
 * @formwork/sociallock (OAuth social login) together.
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

export interface AuthServices {
  padlockService: PadlockService;
  padlockController: PadlockController;
  socialLockService: SocialLockService;
  socialLockController: SocialLockController;
}

/**
 * Configure the full auth system:
 * - Padlock: registration, login, 2FA, password reset, email verification
 * - SocialLock: Google + GitHub OAuth redirects/callbacks
 */
export function configureAuth(): AuthServices {
  // Core auth dependencies
  const userProvider = new InMemoryUserProvider();
  const hasher = new HashManager('sha256');
  const guard = new MemoryGuard(userProvider, hasher);

  // Padlock service — full auth workflow engine
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
      twoFactorIssuer: 'Carpenter',
    },
  });

  const padlockController = new PadlockController(padlockService);

  // SocialLock service — OAuth social login
  const googleClientId = process.env['GOOGLE_CLIENT_ID'] ?? 'google-client-id';
  const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET'] ?? 'google-client-secret';
  const googleRedirectUri = process.env['GOOGLE_REDIRECT_URI'] ?? 'http://localhost:3000/auth/social/google/callback';

  const githubClientId = process.env['GITHUB_CLIENT_ID'] ?? 'github-client-id';
  const githubClientSecret = process.env['GITHUB_CLIENT_SECRET'] ?? 'github-client-secret';
  const githubRedirectUri = process.env['GITHUB_REDIRECT_URI'] ?? 'http://localhost:3000/auth/social/github/callback';

  const providers = new Map<string, ReturnType<typeof googleProvider>>();
  providers.set('google', googleProvider(googleClientId, googleClientSecret, googleRedirectUri));
  providers.set('github', githubProvider(githubClientId, githubClientSecret, githubRedirectUri));

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

/**
 * Register all auth routes on the router.
 * Padlock routes: /auth/register, /auth/login, /auth/logout, /auth/me, 2FA, password reset, email verify
 * SocialLock routes: /auth/social/:provider, /auth/social/:provider/callback
 */
export function registerAuthRoutes(router: Router, services: AuthServices): void {
  // Padlock routes (registration, login, 2FA, password management)
  registerPadlockRoutes(router, services.padlockController);

  // SocialLock routes (OAuth redirects and callbacks)
  registerSocialLockRoutes(router, services.socialLockController, {
    prefix: '/auth/social',
  });
}
