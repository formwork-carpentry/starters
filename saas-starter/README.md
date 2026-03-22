# Carpenter SaaS Starter

Multi-tenant SaaS platform built with the [Carpenter Framework](https://github.com/formwork-carpentry).

## Features

- **Multi-Tenancy** — Subdomain-based tenant isolation
- **Billing** — Subscription plans, usage metering, invoices
- **Authentication** — JWT + social login (Google, GitHub)
- **Authorization** — Role-based access control per tenant
- **Admin Panel** — Tenant management dashboard
- **GraphQL** — GraphQL API alongside REST
- **i18n** — Multi-language support
- **Feature Flags** — Per-tenant feature toggles
- **Queue** — Background job processing
- **Mail** — Transactional emails with templates
- **Notifications** — Multi-channel (mail, database)
- **Storage & Media** — Tenant-scoped file management
- **Scheduler** — Cron-like billing and cleanup tasks
- **Observability** — OpenTelemetry tracing & audit logging
- **Resilience** — Circuit breaker, retry, rate limiting

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
├── app/               # Application layer
├── config/            # Environment-driven configuration
├── controllers/       # Request handlers
├── database/          # Migrations, seeders
├── events/            # Domain events & listeners
├── middleware/         # Auth, tenancy, CORS middleware
├── models/            # User, Tenant, Plan, Subscription models
├── resources/         # Views, translations
├── routes/            # Web + API + tenant routes
├── services/          # Business logic
├── tenants/           # Tenant-specific configuration
├── app.ts             # Application bootstrap
└── server.ts          # Server entry point
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login (JWT) |
| POST | `/tenants` | Create tenant |
| GET | `/tenants/:id` | Tenant details |
| GET | `/billing/plans` | List plans |
| POST | `/billing/subscribe` | Subscribe to plan |
| GET | `/billing/usage` | Usage metrics |

## Environment

```bash
APP_NAME="SaaS Platform"
APP_PORT=3002
DB_CONNECTION=memory
TENANCY_RESOLVER=subdomain
JWT_SECRET=change-me
STORAGE_DRIVER=local
FLAGS_DRIVER=memory
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload |
| `npm start` | Production start |
| `npm test` | Run tests |

## License

MIT
