/**
 * SaaS Layout — shell with org-scoped navigation, tenant switcher.
 */
import { IslandRenderer } from '@formwork/ui';

interface SaaSLayoutProps {
  title: string;
  orgName?: string;
  user?: { name: string; role: string } | null;
  nav: Record<string, string>;
  bodyHtml: string;
  islandRenderer: IslandRenderer;
}

export function SaaSLayout({ title, orgName, user, nav, bodyHtml, islandRenderer }: SaaSLayoutProps): string {
  const navLinks = Object.entries(nav)
    .map(([key, label]) => `<a href="/${key === 'home' ? '' : key}" class="nav-link">${label}</a>`)
    .join('');

  const userMenu = user
    ? `<div class="user-menu">
        <span>${user.name}${orgName ? ` · ${orgName}` : ''}</span>
        <a href="/settings" class="nav-link">Settings</a>
        <form method="POST" action="/auth/logout"><button type="submit">Logout</button></form>
      </div>`
    : `<div class="auth-links"><a href="/login">Login</a> <a href="/register">Get Started</a></div>`;

  return islandRenderer.renderPage(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} — SaaS Platform</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f0f2f5; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #1a1a2e; color: #fff; }
        .navbar .brand { font-weight: 700; font-size: 1.25rem; color: #818cf8; text-decoration: none; }
        .nav-links { display: flex; gap: 1.5rem; align-items: center; }
        .nav-link { color: #c7d2fe; text-decoration: none; font-weight: 500; font-size: 0.9rem; }
        .nav-link:hover { color: #fff; }
        .main-content { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        .footer { text-align: center; padding: 2rem; color: #6c757d; margin-top: 4rem; }
        .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; text-decoration: none; cursor: pointer; border: none; font-size: 0.9rem; }
        .btn-primary { background: #818cf8; color: #fff; }
        .btn-primary:hover { background: #6366f1; }
        .btn-danger { background: #ef4444; color: #fff; }
        .btn-success { background: #10b981; color: #fff; }
        .card { background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .grid { display: grid; gap: 1.5rem; }
        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }
        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
        .badge-free { background: #e5e7eb; color: #374151; }
        .badge-pro { background: #dbeafe; color: #1d4ed8; }
        .badge-enterprise { background: #fef3c7; color: #92400e; }
        .badge-active { background: #d1fae5; color: #065f46; }
        .badge-past-due { background: #fee2e2; color: #991b1b; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { font-weight: 600; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; }
        @media (max-width: 768px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
      </style>
    </head>
    <body>
      <nav class="navbar">
        <a href="/" class="brand">⚡ SaaS Platform</a>
        <div class="nav-links">${navLinks}</div>
        ${userMenu}
      </nav>
      <main class="main-content">${bodyHtml}</main>
      <footer class="footer">
        <p>Powered by Carpenter Framework &copy; ${new Date().getFullYear()}</p>
      </footer>
    </body>
    </html>
  `);
}
