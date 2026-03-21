import { JwtGuard, InMemoryUserProvider, SimpleUser } from '@formwork/auth';
import type { Container } from '@formwork/core/container';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';

const provider = new InMemoryUserProvider();
provider.addUser(new SimpleUser(1, 'admin@acme.com', 'password', 'admin'));
provider.addUser(new SimpleUser(2, 'user@globex.com', 'password', 'member'));

const jwtConfig = { secret: 'saas-starter-secret-32-chars!!!!!!', expiresIn: 3600, issuer: 'saas' };

export function registerAuthRoutes(router: Router, _container: Container): void {
  router.post('/auth/login', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const guard = new JwtGuard(provider, jwtConfig);
    const ok = await guard.attempt({ email: body['email'] as string, password: body['password'] as string });
    if (!ok) return CarpenterResponse.json({ error: 'Invalid credentials' }, 401);
    return CarpenterResponse.json({ token: guard.getToken(), expires_in: 3600 });
  });
}
