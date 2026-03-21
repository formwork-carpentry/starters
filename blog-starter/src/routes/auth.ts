import { attr } from '../helpers.js';
import { User } from '../models/index.js';
import type { Container } from '@formwork/core/container';
import { EventDispatcher } from '@formwork/events';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';
import { Session, MemorySessionStore } from '@formwork/session';
import { Validator } from '@formwork/validation';

const validator = new Validator();
const sessionStore = new MemorySessionStore();

export function registerAuthRoutes(router: Router, container: Container): void {
  const events = container.make<EventDispatcher>('events');

  router.post('/register', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { name: 'required|string|min:2', email: 'required|email', password: 'required|string|min:8' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const user = await User.create(result.validated);
    const session = new Session(sessionStore);
    await session.start();
    await session.put('user', { id: user.id, name: result.validated['name'] });
    await session.flash('success', 'Account created!');
    await events.dispatch('user.registered', { userId: user.id });
    return CarpenterResponse.json({ data: user, flash: 'Account created!' }, 201);
  });

  router.post('/login', async (req) => {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { email: 'required|email', password: 'required|string' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const user = await User.query().where('email', '=', result.validated['email'] as string).first();
    if (!user || attr(user, 'password') !== result.validated['password']) {
      return CarpenterResponse.json({ error: 'Invalid credentials' }, 401);
    }

    const session = new Session(sessionStore);
    await session.start();
    await session.put('user', { id: user.id, name: attr(user, 'name') });
    return CarpenterResponse.json({ ok: true, flash: 'Welcome back!' });
  });

  router.post('/logout', async () => {
    const session = new Session(sessionStore);
    await session.start();
    await session.flush();
    return CarpenterResponse.json({ ok: true });
  });
}
