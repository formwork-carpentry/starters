import { attr } from '../helpers.js';
/**
 * AuthController - register, login, profile.
 */
import { User } from '../models/User.js';
import { createToken } from '@formwork/auth';
import type { IRequest, IResponse } from '@formwork/core/contracts';
import type { Container } from '@formwork/core/container';
import { EventDispatcher } from '@formwork/events';
import { CarpenterResponse } from '@formwork/http';
import { Validator } from '@formwork/validation';

const validator = new Validator();

export class AuthController {
  private events: EventDispatcher;
  constructor(container: Container) { this.events = container.make<EventDispatcher>('events'); }

  async register(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { name: 'required|string|min:2', email: 'required|email', password: 'required|string|min:8' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const user = await User.create({ ...result.validated, role: 'user' });
    await this.events.dispatch('user.registered', { userId: user.id, email: result.validated['email'] });
    const token = await createToken({ sub: String(user.id) }, { secret: 'change-me-in-production-32-chars!!', expiresIn: 3600 });
    return CarpenterResponse.json({ data: { id: user.id, name: result.validated['name'] }, token }, 201);
  }

  async login(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { email: 'required|email', password: 'required|string' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const user = await User.query().where('email', '=', result.validated['email'] as string).first();
    if (!user || attr(user, 'password') !== result.validated['password']) {
      return CarpenterResponse.json({ error: 'Invalid credentials' }, 401);
    }
    const token = await createToken({ sub: String(user.id) }, { secret: 'change-me-in-production-32-chars!!', expiresIn: 3600 });
    return CarpenterResponse.json({ token, expires_in: 3600 });
  }

  async me(_req: IRequest): Promise<IResponse> {
    return CarpenterResponse.json({ data: { id: 1, name: 'Authenticated User', role: 'user' } });
  }
}
