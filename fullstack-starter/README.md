# Carpenter Fullstack Starter

Enterprise-grade fullstack application built with the [Carpenter Framework](https://github.com/formwork-carpentry).

## Features

- **Full MVC** — Controllers, models, views, middleware, services
- **Authentication** — JWT + session + social login (Google, GitHub) via Padlock & SocialLock
- **Authorization** — Gate-based policies (e.g. PostPolicy)
- **ORM** — Active Record models with migrations, seeders, factories
- **Admin Panel** — Auto-generated admin resources
- **GraphQL** — GraphQL API alongside REST
- **i18n** — Multi-language support
- **UI Islands** — Server-rendered React islands
- **Feature Flags** — Runtime feature toggles
- **Queue** — Background job processing
- **Mail** — Email sending with templates
- **Notifications** — Multi-channel (mail, database, SMS)
- **Storage & Media** — File uploads with local/S3 drivers
- **Real-time** — WebSocket support
- **Scheduler** — Cron-like task scheduling
- **Observability** — OpenTelemetry tracing & audit logging
- **Resilience** — Circuit breaker, retry patterns

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (hot-reload)
npm run dev

# Production start
npm start
```

## Project Structure

```
src/
├── app/
│   ├── Admin/           # Admin panel resources
│   ├── Controllers/     # Request handlers
│   ├── Events/          # Domain events & listeners
│   ├── Jobs/            # Queue jobs
│   ├── Mail/            # Mailable classes
│   ├── Middleware/       # HTTP middleware
│   ├── Models/          # ORM models
│   ├── Notifications/   # Multi-channel notifications
│   ├── Policies/        # Authorization policies
│   └── Services/        # Business logic
├── config/              # Environment-driven configuration
├── database/            # Migrations, seeders, factories
├── resources/
│   ├── lang/            # Translation files
│   └── views/           # React island templates
├── routes/              # Web + API route definitions
├── storage/             # File storage
├── tests/               # Test suite
├── app.ts               # Application bootstrap
└── server.ts            # Server entry point
```

## Environment

Copy `.env` and update for your environment:

```bash
APP_NAME=CarpenterFullstack
APP_PORT=3000
DB_CONNECTION=memory
CACHE_DRIVER=memory
QUEUE_CONNECTION=sync
JWT_SECRET=change-me
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload |
| `npm start` | Production start |
| `npm test` | Run tests |

## License

MIT
