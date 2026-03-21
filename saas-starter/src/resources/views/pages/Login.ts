/**
 * SaaS Login — branded login page with social login buttons.
 */
export function SaaSLoginPage(providers: string[]): string {
  const socialButtons = providers
    .map(p => {
      const colors: Record<string, string> = { google: '#4285F4', github: '#333' };
      return `<a href="/auth/${p}" class="btn" style="display:block;width:100%;margin-bottom:0.5rem;background:${colors[p] ?? '#6c757d'};color:#fff;text-align:center;padding:0.75rem;border-radius:6px;text-decoration:none;">
        Continue with ${p.charAt(0).toUpperCase() + p.slice(1)}
      </a>`;
    })
    .join('');

  return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f3f4f6;">
      <div style="background:#fff;border-radius:12px;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="text-align:center;margin-bottom:2rem;">
          <h1 style="font-size:1.5rem;font-weight:700;">Sign in to your workspace</h1>
          <p style="color:#6c757d;font-size:0.875rem;">Welcome back! Choose your sign-in method.</p>
        </div>

        ${socialButtons}

        <div style="display:flex;align-items:center;margin:1.5rem 0;">
          <div style="flex:1;height:1px;background:#e5e7eb;"></div>
          <span style="padding:0 1rem;color:#6c757d;font-size:0.75rem;">OR</span>
          <div style="flex:1;height:1px;background:#e5e7eb;"></div>
        </div>

        <form method="POST" action="/auth/login">
          <div style="margin-bottom:1rem;">
            <label for="email" style="display:block;margin-bottom:0.25rem;font-size:0.875rem;">Email</label>
            <input type="email" id="email" name="email" required style="width:100%;padding:0.625rem;border:1px solid #d1d5db;border-radius:6px;" />
          </div>
          <div style="margin-bottom:1.5rem;">
            <label for="password" style="display:block;margin-bottom:0.25rem;font-size:0.875rem;">Password</label>
            <input type="password" id="password" name="password" required style="width:100%;padding:0.625rem;border:1px solid #d1d5db;border-radius:6px;" />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;padding:0.75rem;">Sign In</button>
        </form>

        <p style="text-align:center;margin-top:1.5rem;font-size:0.875rem;color:#6c757d;">
          Don't have an account? <a href="/register" style="color:#818cf8;">Start free trial</a>
        </p>
      </div>
    </div>
  `;
}
