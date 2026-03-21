/**
 * Login page — authentication form.
 */
import { IslandRenderer } from '@formwork/ui';
import { AppLayout } from '../layouts/AppLayout.js';

interface LoginProps {
  nav: Record<string, string>;
  error?: string | null;
  socialProviders: string[];
}

export function LoginPage(props: LoginProps, islandRenderer: IslandRenderer): string {
  const socialButtons = props.socialProviders
    .map(
      (provider) => `
      <a href="/auth/social/${provider}/redirect" class="btn" style="background: #f8f9fa; border: 1px solid #dee2e6; color: #495057; width: 100%; text-align: center; margin-bottom: 0.5rem; display: block;">
        Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}
      </a>`,
    )
    .join('');

  const bodyHtml = `
    <div style="max-width: 420px; margin: 2rem auto;">
      <div class="card">
        <h2 style="text-align: center; margin-bottom: 1.5rem;">Sign In</h2>

        ${props.error ? `<div style="background: #f8d7da; color: #842029; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;">${props.error}</div>` : ''}

        <form method="POST" action="/auth/login" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label for="email" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Email</label>
            <input type="email" id="email" name="email" required
              style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem;" />
          </div>
          <div>
            <label for="password" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Password</label>
            <input type="password" id="password" name="password" required minlength="8"
              style="width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem;" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="display: flex; align-items: center; gap: 0.25rem;">
              <input type="checkbox" name="remember" /> Remember me
            </label>
            <a href="/auth/forgot-password" style="color: #4361ee; font-size: 0.9rem;">Forgot password?</a>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Sign In</button>
        </form>

        ${
          socialButtons
            ? `<div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e9ecef;">
                <p style="text-align: center; color: #6c757d; margin-bottom: 1rem;">Or continue with</p>
                ${socialButtons}
              </div>`
            : ''
        }

        <p style="text-align: center; margin-top: 1.5rem; color: #6c757d;">
          Don't have an account? <a href="/register" style="color: #4361ee;">Register</a>
        </p>
      </div>
    </div>
  `;

  return AppLayout({ title: 'Login', nav: props.nav, user: null, bodyHtml, islandRenderer });
}
