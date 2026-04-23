FROM node:22-bookworm-slim

WORKDIR /repo

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY io/package.json ./io/package.json
COPY mobile/package.json ./mobile/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/user-credentials/package.json ./packages/user-credentials/package.json

RUN npm ci

COPY io ./io
COPY packages ./packages

RUN npm --prefix packages/db run prisma:generate
RUN npm --prefix io run build

WORKDIR /repo/io
EXPOSE 4001
CMD ["node", "dist/index.js"]
