import { AuthController } from '../controllers/AuthController.js';
import type { Container } from '@formwork/core/container';
import type { Router } from '@formwork/http';

export function registerAuthRoutes(router: Router, container: Container): void {
  const auth = new AuthController(container);
  router.post('/auth/register', (req) => auth.register(req));
  router.post('/auth/login', (req) => auth.login(req));
  router.get('/auth/me', (req) => auth.me(req));
}
