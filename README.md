# Carpenter Starters

Ready-to-use starter templates for Carpenter projects.

## Available Starters

| Starter | Description |
|---------|-------------|
| **api-starter** | Minimal API server |
| **blog-starter** | Blog with content management |
| **fullstack-starter** | Fullstack app with frontend |
| **saas-starter** | Multi-tenant SaaS application |

## Usage

Use the Carpenter CLI to scaffold from a starter:

```bash
bunx create-carpenter-app my-app --starter api
```

Or clone directly:

```bash
git clone https://github.com/formwork-carpentry/starters.git
cp -r starters/api-starter my-new-project
cd my-new-project
bun install
```
