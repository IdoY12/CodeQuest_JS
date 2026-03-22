# CodeQuest backend

Express + Prisma + PostgreSQL. Copy `.env.example` → `.env` before running.

## Database URL

`DATABASE_URL` must point at a running PostgreSQL instance the Node process can authenticate to.

### Recommended: Docker (see repo root `README.md`)

Avoids Postgres.app quirks on macOS.

### Postgres.app — trust authentication rejected

Postgres.app can **block passwordless (`trust`) connections** from Node/Electron-based clients.

Pick **one** of these:

1. **Allow the client in Postgres.app**  
   Follow [Postgres.app — app permissions](https://postgresapp.com/l/app-permissions/) and allow your terminal/Node (or disable the restriction that blocks trust for Electron-linked clients).

2. **Use a user + password in `DATABASE_URL` (often simplest)**  
   Set a password on your DB role and use SCRAM in the URL, for example:

   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/codequest_js?schema=public
   ```

   Create the database if needed (`codequest_js` or whatever name you use), then:

   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   npm run dev
   ```

3. **Only one server on port 5432**  
   If Docker Postgres and Postgres.app both try to use `5432`, stop one or change the port.

After `DATABASE_URL` works, registration should return **201** instead of **503**.
