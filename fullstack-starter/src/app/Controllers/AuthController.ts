import { attr } from '../../helpers.js';
/**
 * @module app/Controllers
 * @description AuthController - handles user registration, login, logout, and profile.
 */

import { User } from '../Models/index.js';
import { createToken } from '@formwork/auth';
import type { IRequest, IResponse } from '@formwork/core/contracts';
import type { Container } from '@formwork/core/container';
import { EventDispatcher } from '@formwork/events';
import { CarpenterResponse } from '@formwork/http';
import { Session, MemorySessionStore } from '@formwork/session';
import { Validator } from '@formwork/validation';

const validator = new Validator();
const sessionStore = new MemorySessionStore();

export class AuthController {
  private events: EventDispatcher;

  constructor(private container: Container) {
    this.events = container.make<EventDispatcher>('events');
  }

  /**
   * POST /auth/register - Create a new user account.
   *
   * @param {IRequest} req - Request with { name, email, password } body
   * @returns {Promise<IResponse>} 201 with user data + JWT, or 422 with validation errors
   */
  async register(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, {
      name: 'required|string|min:2|max:100',
      email: 'required|email',
      password: 'required|string|min:8',
    });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const user = await User.create({ ...result.validated, role: 'user' });
    await this.events.dispatch('user.registered', { userId: user.id, email: result.validated['email'] });

    const token = await createToken(
      { sub: String(user.id), email: result.validated['email'] as string },
      { secret: process.env['JWT_SECRET'] ?? 'dev-secret-change-me-32-chars!!!!', expiresIn: 3600 },
    );

    const session = new Session(sessionStore);
    await session.start();
    await session.put('user', { id: user.id, name: result.validated['name'] });
    await session.flash('success', 'Account created!');

    return CarpenterResponse.json({
      data: { id: user.id, name: result.validated['name'], email: result.validated['email'] },
      token,
    }, 201);
  }

  /**
   * POST /auth/login - Authenticate and return JWT.
   *
   * @param {IRequest} req - Request with { email, password } body
   * @returns {Promise<IResponse>} 200 with JWT, or 401
   */
  async login(req: IRequest): Promise<IResponse> {
    const body = req.body() as Record<string, unknown>;
    const result = validator.validate(body, { email: 'required|email', password: 'required|string' });
    if (!result.passes) return CarpenterResponse.json({ errors: result.errors }, 422);

    const user = await User.query().where('email', '=', result.validated['email'] as string).first();
    if (!user || attr(user, 'password') !== result.validated['password']) {
      return CarpenterResponse.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await createToken(
      { sub: String(user.id) },
      { secret: process.env['JWT_SECRET'] ?? 'dev-secret-change-me-32-chars!!!!', expiresIn: parseInt(process.env['JWT_EXPIRY'] ?? '3600', 10) },
    );
    return CarpenterResponse.json({ token, expires_in: 3600 });
  }

  /**
   * GET /auth/me - Get authenticated user profile.
   *
   * @param {IRequest} _req - Request (JWT verified by middleware)
   * @returns {Promise<IResponse>} 200 with user profile
   */
  async me(_req: IRequest): Promise<IResponse> {
    // In production: extract user from JWT middleware
    return CarpenterResponse.json({ data: { id: 1, name: 'Authenticated User', role: 'user' } });
  }

  /**
   * POST /auth/logout - Destroy session.
   *
   * @returns {Promise<IResponse>} 200 with success message
   */
  async logout(): Promise<IResponse> {
    const session = new Session(sessionStore);
    await session.start();
    await session.flush();
    return CarpenterResponse.json({ message: 'Logged out' });
  }
}
