# Contributing to Starters

Thank you for your interest in contributing to Starters — the collection of professional starter templates for Carpenter projects! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Adding a New Starter](#adding-a-new-starter)
- [Commit Convention](#commit-convention)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to maintaining a welcoming, respectful community.

---

## Getting Started

### Prerequisites

- **Node.js** 20 or 22 (LTS recommended)
- **npm** 10+

### Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/<your-username>/starters.git
cd starters

# Add upstream remote
git remote add upstream https://github.com/formwork-carpentry/starters.git
```

---

## Development Setup

```bash
# Navigate to a starter and install dependencies
cd api-starter
npm install

# Start development server
npm run dev
```

---

## Project Structure

```
starters/
├── api-starter/        # REST API starter template
├── blog-starter/       # Blog application starter
├── fullstack-starter/  # Full-stack application starter
├── saas-starter/       # SaaS application starter
├── .github/            # GitHub Actions, templates, config
└── README.md           # Project overview
```

---

## Making Changes

### Branch Naming

```
feat/short-description
fix/short-description
chore/short-description
docs/short-description
```

### Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/my-improvement
   ```

2. **Make your changes** in the relevant starter(s)

3. **Test locally**:
   ```bash
   cd <starter-directory>
   npm install
   npm run dev
   ```

4. **Commit** using conventional commits (see below)

5. **Push** and open a pull request

---

## Adding a New Starter

1. Create a new directory at the root level:
   ```bash
   mkdir my-new-starter
   cd my-new-starter
   ```

2. Follow the conventions of existing starters:
   - Include a `package.json` with `name`, `version`, `description`
   - Include a `README.md` with setup instructions
   - Ensure `npm install && npm run dev` works out of the box

3. Add the new starter to the root `README.md` table

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature or new starter |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code refactoring |
| `chore` | Build process, tooling, dependencies |
| `ci` | CI configuration changes |

### Scopes

Use the starter name as scope: `api-starter`, `blog-starter`, `fullstack-starter`, `saas-starter`.

### Examples

```
feat(api-starter): add authentication scaffold
fix(blog-starter): resolve missing env variable
docs(saas-starter): update setup instructions
chore(deps): upgrade dependencies across starters
```

---

## Submitting a Pull Request

1. Ensure your branch is up to date with `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your branch:
   ```bash
   git push origin feat/my-improvement
   ```

3. Open a PR on GitHub using the pull request template

4. Fill out all sections of the PR template

5. Ensure all CI checks pass
