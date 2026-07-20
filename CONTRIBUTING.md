# Contributing to SciBitHub

Thank you for your interest in contributing to SciBitHub! We welcome contributions from everyone — whether you're fixing a bug, improving documentation, suggesting a feature, or helping with design. This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Submitting Changes](#submitting-changes)
- [Commit Guidelines](#commit-guidelines)
- [Communication](#communication)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Ways to Contribute

You don't have to write code to contribute. Here are some ways you can help:

- **Report bugs** — open a GitHub issue describing the problem
- **Suggest features** — open a GitHub issue with your idea and use case
- **Improve documentation** — fix typos, clarify explanations, or add missing docs
- **Fix bugs or implement features** — pick an open issue and submit a pull request
- **Review pull requests** — help review and give feedback on open PRs
- **Share the project** — spread the word about SciBitHub in open science communities

Look for issues tagged [`good first issue`](https://github.com/MAY55A/SciBitHub/issues?q=label%3A%22good+first+issue%22) if you're new to the project.

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — required for Supabase local dev and MinIO
- [Supabase CLI](https://supabase.com/docs/guides/cli) — installed automatically via npm

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/MAY55A/SciBitHub.git
cd SciBitHub
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> **Note:** The `--legacy-peer-deps` flag is required due to peer dependency conflicts between some packages. This is a known issue that will be resolved in a future update.

### 3. Set up environment variables

```bash
cp .env.example .env.development.local
```

Open `.env.development.local` and fill in the values. The Supabase local keys will be available after the next step.

### 4. Start Docker Desktop

Make sure Docker Desktop is running before continuing. All local services depend on it.

### 5. Start MinIO (local file storage)

```bash
docker-compose up -d
```

This starts a local MinIO server at `http://localhost:9000`. The MinIO dashboard is available at `http://localhost:9001` (login: `minioadmin` / `minioadmin`).

> This only needs to be run once — MinIO restarts automatically with Docker Desktop.

### 6. Start Supabase locally

```bash
npx supabase start
```

Once started, copy the output credentials (`publishable key` and `secret key`) into your `.env.development.local` file (`anon key` and `service role key`).

### 7. Apply database migrations and seed data

```bash
npx supabase db reset
```

This applies all migrations and seeds the database with test data automatically.

### 8. Set up local storage

```bash
npm run setup:storage
```

This downloads sample files from GitHub Releases and uploads them to MinIO and Supabase Storage automatically.

### 9. Test accounts

The following test accounts are available after running `npx supabase db reset`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@scibithub.test | Admin1234 |
| Contributor | contributor@scibithub.test | Contributor1234 |
| Researcher | researcher@scibithub.test | Researcher1234 |

### 10. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

### Daily workflow

After the one-time setup above, your daily workflow is just:

```bash
npm run dev
```

Supabase and MinIO restart automatically with Docker Desktop.

---

### Notes

> **Google OAuth** is not available in local development. Use email/password to sign in locally.

> **File storage** requires both MinIO (for data uploads) and Supabase Storage (for profile pictures and project covers) to be running. Make sure Docker Desktop is active.

> If you pull new migrations from the repo, run `npx supabase db reset` to apply them.

---

## Submitting Changes

1. Fork the repository and create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and test them locally
3. Commit following the [commit guidelines](#commit-guidelines) below
4. Push your branch and open a **Pull Request** against `dev`
5. Fill in the PR description explaining what you changed and why
6. Wait for review — we aim to respond within a week

> **Note:** All pull requests should target the `dev` branch, not `main`. Changes are merged into `main` only after review and testing.

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <short description>
```

Common types:

| Type | When to use |
|------|-------------|
| `feat` | A new user-facing feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons (no logic change) |
| `refactor` | Code restructuring without behavior change |
| `chore` | Maintenance tasks, dependency updates, project setup |

**Examples:**
```
feat: add discussion thread reply notifications
fix: resolve project card rendering on mobile
docs: update local setup instructions
chore: add CONTRIBUTING.md
```

---

## Communication

- **GitHub Issues** — for bug reports, feature requests, and general discussion
- **Email** — for private matters, reach out at [mayssa.ghanmi@scibithub.tech](mailto:mayssa.ghanmi@scibithub.tech)

We're a small early-stage project and deeply appreciate every contribution. Don't hesitate to ask questions — no contribution is too small!