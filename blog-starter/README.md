# Carpenter Blog Starter

Full-featured blog application built with the [Carpenter Framework](https://github.com/formwork-carpentry).

## Features

- **MVC Fullstack** — Controllers, models, views, and services
- **Session Auth** — Login/register with hashed passwords
- **i18n** — Multi-language support (English, Spanish, French)
- **Real-time** — Live comment updates via WebSocket
- **Events** — Domain events for post creation, comments
- **Validation** — Request validation with custom rules
- **Markdown** — Blog posts with markdown rendering
- **External API** — HTTP client integration

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
├── config/          # App, i18n, session configuration
├── controllers/     # Request handlers
├── events/          # Domain events & listeners
├── middleware/       # Auth, locale, CORS middleware
├── models/          # User, Post, Comment models
├── routes/          # Auth, post, and external routes
├── services/        # Business logic
├── views/           # Template rendering
├── app.ts           # Application bootstrap
└── server.ts        # Server entry point
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check with locale info |
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Session login |
| GET | `/api/posts` | List blog posts |
| POST | `/api/posts` | Create blog post |
| PUT | `/locale/:lang` | Switch language |

## Environment

```bash
APP_NAME=CarpenterBlog
APP_PORT=3000
DB_CONNECTION=memory
SESSION_DRIVER=memory
APP_LOCALE=en
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload |
| `npm start` | Production start |
| `npm test` | Run tests |

## License

MIT
