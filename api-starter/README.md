# Carpenter API Starter

Production-ready REST API built with the [Carpenter Framework](https://github.com/formwork-carpentry).

## Features

- **MVC Architecture** — Controllers, models, services, and middleware
- **Authentication** — JWT + session guards with hashing
- **Event System** — Domain events with listeners
- **Validation** — Request validation with custom rules
- **Resilience** — Circuit breaker, retry, and rate limiting
- **HTTP Client** — External API integration

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
├── config/          # Environment-driven configuration
├── controllers/     # Request handlers
├── events/          # Domain events & listeners
├── middleware/       # HTTP middleware
├── models/          # ORM models (Active Record)
├── routes/          # Route definitions (auth, posts, external)
├── services/        # Business logic
├── app.ts           # Application bootstrap
└── server.ts        # Server entry point
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login (JWT) |
| GET | `/api/posts` | List posts |
| POST | `/api/posts` | Create post |
| GET | `/api/external/weather` | External API demo |

## Environment

Copy `.env` and configure as needed:

```bash
APP_NAME=APIStarter
APP_PORT=3000
DB_CONNECTION=memory
JWT_SECRET=change-me-in-production
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload |
| `npm start` | Production start |
| `npm test` | Run tests |

## License

MIT
