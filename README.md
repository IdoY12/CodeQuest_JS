# CodeQuest JS

Production-style monorepo for the CodeQuest JS mobile learning platform:

- `mobile` - Expo + React Native iOS app (TypeScript, Zustand, React Query, Reanimated, Gesture Handler)
- `backend` - Express + Socket.io + Prisma + PostgreSQL API and realtime duel engine

## Quick Start

### 1) Backend

```bash
cd backend
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Backend runs on `http://localhost:4000`.

### 2) Mobile

```bash
cd mobile
npm install
npm run ios
```

The app points to `http://localhost:4000/api` in `src/services/api.ts`.

## Implemented Product Areas

- Premium dark design system with centralized tokens in `mobile/src/theme/theme.ts`
- Full onboarding flow with path assignment and account creation gate
- Bottom tab navigation with Home, Learn, Duel, Profile
- Learn roadmap + lesson engine with 6 exercise types
- Duel flow: home, matchmaking, active duel rounds, results
- Profile stats and settings toggles (sounds/haptics)
- REST API groups: auth, user, learning, duels, badges, daily challenge
- Socket.io `/duel` namespace for matchmaking and rounds
- Prisma schema for users, progress, curriculum, duels, badges, streaks
- Seed content for beginner + advanced paths, exercises, badges, and 50 duel questions

## Notes

- Sound and Lottie packages are installed; hook up final asset files in `mobile/assets`.
- Update `DATABASE_URL` in `backend/.env` for your local PostgreSQL instance.
