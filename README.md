# CodeQuest JS

Production-style monorepo for the CodeQuest JS mobile learning platform.

- `mobile` - Expo + React Native app (TypeScript, Zustand, React Query)
- `backend` - Express + Prisma + PostgreSQL REST API
- `io` - Dedicated Socket.IO duel service
- `infra` - local infrastructure scripts (LocalStack S3 init)

## Demo Setup (Interview-Ready)

Follow these steps in order to run the full app locally.

Prisma schema ownership is shared in `packages/db/prisma` and consumed by both `backend` and `io`.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose
- PostgreSQL running locally (or in Docker)
- iOS Simulator (Xcode) and/or Expo Go

## 1) Start PostgreSQL (Docker)

If you do not already have PostgreSQL running, start it with Docker:

```bash
docker run -d \
  --name codequest-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=codequest_js \
  -p 5432:5432 \
  postgres:16
```

Quick verification:

```bash
docker ps
```

You should see a running container named `codequest-db` with port `5432`.

Use this `DATABASE_URL` in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codequest_js?schema=public
```

## 2) Start LocalStack (S3 for avatars)

From the repository root:

```bash
docker compose up -d localstack
```

Optional verification:

```bash
docker exec localstack awslocal s3 ls
```

You should see `questcode-avatars`.

## 3) Start Backend

```bash
npm install
npm run db:generate
cd backend
cp .env.example .env
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Backend default URL:

- `http://localhost:4000`

### Required backend `.env` values

At minimum, make sure these are valid in `backend/.env`:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

For local avatar upload with LocalStack:

- `AWS_ENDPOINT=http://localhost:4566`
- `AWS_REGION=us-east-1`
- `AWS_ACCESS_KEY_ID=test`
- `AWS_SECRET_ACCESS_KEY=test`
- `S3_BUCKET=questcode-avatars`

## 4) Start IO Service

In a new terminal:

```bash
cd io
cp .env.example .env
npm run dev
```

IO service default URL:

- `http://localhost:4001`

## 5) Start Mobile

In a new terminal:

```bash
cd mobile
npm install
npx expo start --clear
```

Then:

- Press `i` to open iOS Simulator, or
- Scan the QR code with Expo Go

## 6) Quick Demo Checklist

Use this checklist right before your interview demo:

1. Register a new user and complete onboarding
2. Confirm Home / Learn / Duel / Profile tabs work
3. Open Daily Puzzle and navigate back to Learn
4. Upload profile image in Profile screen
5. Change username / password
6. Save learning preferences
7. Verify delete-account flow (requires typing `DELETE`)

## 7) Troubleshooting

- **`Network request failed` on mobile**
  - Verify backend is running on port `4000`
  - Verify IO service is running on port `4001`
  - Restart Expo with `npx expo start --clear`
  - Make sure mobile and backend are on the same network

- **Prisma schema mismatch errors**
  - Run `cd backend && npx prisma migrate dev && npx prisma generate`

- **Avatar upload fails**
  - Ensure LocalStack is running (`docker ps`)
  - Ensure bucket exists (`docker exec localstack awslocal s3 ls`)

- **Database connection errors**
  - Ensure `codequest-db` is running (`docker ps`)
  - Ensure `DATABASE_URL` matches the exact value above
  - If needed, restart DB container:
    - `docker restart codequest-db`

- **Postgres.app on macOS: `rejected "trust" authentication` / Electron**
  - Postgres.app can block passwordless (`trust`) connections from Node. Fix one of:
    - **Recommended:** Use the Docker PostgreSQL from step 1 and point `DATABASE_URL` at it (stop Postgres.app or use a different port for one of them so only one service uses `5432`).
    - **Stay on Postgres.app:** In Postgres.app settings, allow your client / use **SCRAM** auth: create or use a role with a password and set e.g. `DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/codequest_js?schema=public` in `backend/.env` (database name must exist).
  - After fixing DB: `cd backend && npx prisma migrate dev && npm run prisma:seed`, then restart `npm run dev`.
  - Step-by-step: [`backend/README.md`](backend/README.md).

## 8) Useful Commands

```bash
# Start DB quickly (if missing)
docker start codequest-db || docker run -d --name codequest-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=codequest_js -p 5432:5432 postgres:16

# Backend type-check
cd backend && npx tsc --noEmit

# IO type-check
cd io && npx tsc --noEmit

# Mobile type-check
cd mobile && npx tsc --noEmit

# Backend health
curl http://localhost:4000/health

# IO health
curl http://localhost:4001/health
```
