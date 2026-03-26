# CodeQuest backend

Express + **Prisma** + PostgreSQL. Configuration uses the **`config`** package (`config/default.json`, merges `production.json` when `NODE_ENV=production`, and `custom-environment-variables.json` for env overrides).

## Database URL

Set **`database.url`** in config:

- **Default (local):** `config/default.json` → `database.url`
- **Production:** override in `config/production.json` or set **`DATABASE_URL`** (mapped to `database.url` via `custom-environment-variables.json`)
- **Docker / Compose:** `config/docker.json` or `config/compose.json`

The app injects this value into `process.env.DATABASE_URL` only inside `src/db/prisma.ts` (required by Prisma’s engine). Everything else reads from `config`.

### Prisma CLI (`migrate`, `generate`)

Use npm scripts so the URL comes from config:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Postgres.app / Docker

If Postgres.app blocks trust connections, use a **user + password** URL in `database.url` (or `DATABASE_URL`). See repo root `README.md` for Docker-based Postgres.

After the DB is reachable, registration should return **201** instead of **503**.
