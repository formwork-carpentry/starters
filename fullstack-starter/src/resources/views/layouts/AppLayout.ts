/**
 * AppLayout — server-rendered HTML shell with nav, sidebar, and footer.
 * Islands are hydrated client-side within this layout.
 */
import { IslandRenderer } from '@formwork/ui';

interface LayoutProps {
  title: string;
  nav: Record<string, string>;
  user?: { name: string; role: string } | null;
  bodyHtml: string;
  islandRenderer: IslandRenderer;
}

export function AppLayout({ title, nav, user, bodyHtml, islandRenderer }: LayoutProps): string {
  const navLinks = Object.entries(nav)
    .map(([key, label]) => `<a href="/${key === 'home' ? '' : key}" class="nav-link">${label}</a>`)
    .join('');

  const userMenu = user
    ? `<div class="user-menu">
        <span>${user.name}</span>
        <a href="/admin" class="nav-link">${user.role === 'admin' ? 'Admin' : 'Dashboard'}</a>
        <form method="POST" action="/auth/logout"><button type="submit">Logout</button></form>
      </div>`
    : `<div class="auth-links"><a href="/login">Login</a> <a href="/register">Register</a></div>`;

  return islandRenderer.renderPage(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} — Carpenter</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8f9fa; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #fff; border-bottom: 1px solid #e9ecef; }
        .navbar .brand { font-weight: 700; font-size: 1.25rem; color: #4361ee; text-decoration: none; }
        .nav-links { display: flex; gap: 1.5rem; align-items: center; }
        .nav-link { color: #495057; text-decoration: none; font-weight: 500; }
        .nav-link:hover { color: #4361ee; }
        .main-content { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        .footer { text-align: center; padding: 2rem; color: #6c757d; border-top: 1px solid #e9ecef; margin-top: 4rem; }
        .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; text-decoration: none; cursor: pointer; border: none; }
        .btn-primary { background: #4361ee; color: #fff; }
        .btn-primary:hover { background: #3a56d4; }
        .card { background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .grid { display: grid; gap: 1.5rem; }
        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 768px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
      </style>
    </head>
    <body>
      <nav class="navbar">
        <a href="/" class="brand">🪚 Carpenter</a>
        <div class="nav-links">${navLinks}</div>
        ${userMenu}
      </nav>
      <main class="main-content">${bodyHtml}</main>
      <footer class="footer">
        <p>Built with Carpenter Framework &copy; ${new Date().getFullYear()}</p>
      </footer>
    </body>
    </html>
  `);
}
