# CodeQuest_JS — Complete Technical Reference

---

## 1. App Purpose & Vision

**Problem solved:** JavaScript developers lack a mobile-native, gamified platform for deliberate daily practice. Existing tools are either too passive (video courses) or too dry (raw exercises with no engagement mechanics).

**Target audience:** JavaScript learners at three career bands — Junior (beginners learning JS syntax and fundamentals), Mid (developers who know the basics but want to deepen object/async knowledge), and Senior (experienced engineers sharpening architecture/performance/advanced patterns).

**Core learning philosophy:** Spaced daily repetition (streak system forces daily use), competitive urgency (Duel Mode creates time-pressured recall), progressive difficulty (three curriculum tracks from Junior → Senior), and immediate feedback (every exercise answer shows the correct answer and explanation). The app is explicitly designed around "minimum daily commitment" — users pick 10, 15, or 25 minutes/day.

---

## 2. Full Feature Inventory

### Onboarding Wizard
- **What:** 3-step wizard on first install. Step 1: pick level (JUNIOR/MID/SENIOR). Step 2: pick goal (JOB/WORK/FUN/PROJECT). Step 3: pick daily commitment (10/15/25 min).
- **How:** `OnboardingFlow.tsx` + `useOnboardingWizard.ts`. Completion writes `"1"` to AsyncStorage key `ONBOARDING_SEEN_STORAGE_KEY`. On subsequent launches, `AppNavigator.tsx` reads this key and skips directly to `MainNavigator`.

### Learn Roadmap
- **What:** Displays the 3 curriculum blocks for the user's active experience level. Each block has a title, description, and a "Start" button.
- **How:** `LearnRoadmapScreen.tsx` + `useLearnRoadmapData.ts`. Block metadata is hardcoded client-side (no API call). Content is: JUNIOR → Variables/Operators/Functions; MID → Objects/Collections/Async; SENIOR → Architecture/Performance/Concurrency.

### Lesson Player
- **What:** Sequentially presents exercises within a block. Shows code snippet, prompt, and either MCQ options or a type-in puzzle box. Progress bar tracks position.
- **How:** `LessonScreen.tsx` + `useLessonLoad.ts`. Exercises fetched via `GET /api/learning/exercises/:experienceLevel`. Correct answers submitted to `POST /api/learning/submit-exercise`.

### Exercise Types
- **MCQ (Multiple Choice):** `ExerciseViewMCQ.tsx`. User selects from 2–4 options, taps "Check". After correct answer, explanation shown + "Next" button.
- **Puzzle (short-answer):** `ExerciseViewPuzzle.tsx`. User types a JS expression; hint tokens from `exercise.options` (or defaults from `puzzleHintDefaults.ts`) are shown as tappable chips that append to the input.

### Lesson Results Screen
- **What:** Post-lesson summary showing accuracy %, current level, total XP, and 1–3 stars based on accuracy (>90% = 3 stars, >70% = 2, else 1).
- **How:** `LessonResultsScreen.tsx`. Stars derived client-side from accuracy param.

### Code Puzzle (standalone)
- **What:** Freestanding puzzle mode (separate from lesson puzzles). Shows a write-your-own-expression prompt. User types, submits, gets correct/incorrect feedback. "Reveal answer" button for stuck users.
- **How:** `CodePuzzleScreen.tsx` + `useCodePuzzle.ts`. Puzzles fetched from `GET /api/code-puzzles/all`. Answers submitted to `POST /api/code-puzzles/:id/submit`.

### Duel Mode (1v1 real-time)
- **What:** Ranked 1v1 real-time quiz battles over Socket.IO. 5 rounds per match. First player to answer a round correctly wins that round. Each round is a JS trivia question. After the match: results screen with XP earned, score, round replay, and rematch option.
- **How:** See Section 8 for full socket flow.

### Solo Duel (auto-match)
- **What:** If no opponent joins within 25 seconds, the server creates a synthetic solo match. The user duels against a "ghost" opponent.
- **How:** `queue.ts:scheduleSoloMatchIfAlone` — fires after `SOLO_MATCH_WAIT_MS = 25_000ms`. Creates a synthetic `QueueEntry` with `socketId = "solo:${socketId}"`.

### Profile Screen (Authenticated)
- **What:** Shows avatar, username, email; level/XP card; streak card; learn stats. Allows editing username, avatar upload, changing password, updating preferences, and account deletion.
- **How:** `AuthenticatedProfileScreen.tsx` + numerous hooks (`useProfileScreen.ts`, `useProfileAvatarHandlers.ts`, `useProfileAccountHandlers.ts`, etc.).

### Profile Screen (Guest)
- **What:** Shows "Guest" label, local XP/level, lets user change experience level and daily commitment. Redirects to Auth for sign-in. Has "Reset Learn Progress" danger zone.
- **How:** `GuestProfileBody.tsx`.

### Auth Screen
- **What:** Modal presented over the main app. Email/password login or registration, plus Google OAuth. Toggle between sign-in and register.
- **How:** `AuthScreen.tsx` + `AuthCredentials.tsx` + `AuthGoogleButton.tsx`.

### Streak System
- **What:** Increments daily if the user completes at least one qualifying exercise. Resets if the user misses 2+ calendar days.
- **How:** Shared logic in `@project/streak-logic`. Applied on exercise submit (backend), duel answer (io service), app open (progress summary endpoint).

### Daily Goal & Practice Log
- **What:** Home screen shows today's practice minutes vs. goal. Daily push notification at 7pm reminds user to practice.
- **How:** `tryPostPracticeLog.ts` + `GET/POST /api/user/practice-log`. Notification scheduled via `syncDailyPracticeReminder.ts` using `expo-notifications`. Notification fires daily at 19:00.

### XP & Level
- **What:** Each correct exercise/puzzle/duel-round answer earns 250 XP. Level = `floor(xpTotal / 250) + 1`. Puzzle XP is capped at 10 solves per puzzle.
- **How:** `@project/xp-constants:XP_PER_CORRECT_EXERCISE = 250`. Level formula in `levelFromXpTotal`.

### Avatar Upload
- **What:** User picks from image library, crops to square, uploads to S3 (via backend server-side relay), URL saved to profile.
- **How:** `useProfileAvatarHandlers.ts` → `profileAvatarPick.ts` → `profileAvatarUpload.ts` → `PUT /api/user/avatar/upload` → S3 via `putAvatarObject`.

### Rematch System
- **What:** After a duel ends, both players can request a rematch. If both accept within 60 seconds, a new session starts automatically.
- **How:** `endSession.ts` creates a `RematchEntry`. Clients emit `rematch_request`. Server fires `match_found` to both. `rematchEntries` map keyed by original `sessionId`.

### Offline Banner
- **What:** Yellow banner shown when network connectivity is lost, prompting user to use cached lessons.
- **How:** `AppShell.tsx` + `useAppShell.ts` via `@react-native-community/netinfo`.

### Duel Queue Status
- **What:** Matchmaking screen shows live count of authenticated users connected to `/duel` namespace.
- **How:** Server broadcasts `queue_status` event with `players_online` count on every connection/disconnect.

### Session Persistence & Hydration
- **What:** Redux state is saved to AsyncStorage (key `codequest-redux-store`) on every change (debounced 500ms). JWT tokens are separately stored in `expo-secure-store`. On app start, both are merged.
- **How:** `appShellPersistence.ts:subscribeStoreToHybridStorage` + `hydrateStoreFromStorage` in `hydrateStore.ts`.

---

## 3. User Types & Auth System

### Guest User
- **How created:** When `bootstrapSession` finds no auth token, it dispatches `enterGuestMode()`, setting `isGuest: true`, `isAuthenticated: false`, tokens null.
- **Identifier:** No server-side identity. State is local-only (AsyncStorage).
- **What is allowed:** Learn tab (all levels/blocks), Code Puzzle, Profile (local preferences only).
- **What is restricted:** Duel Mode. When a guest taps the Duel tab or "Find a Match", `guardDuelAccess()` in `formatHelpers.ts` fires an `Alert.alert("Account Required", ...)` and redirects to the Auth screen.

### Authenticated User
- **Registration flow:** `POST /api/auth/register` → validates email/username/password → `createRegisteredUserWithDefaults` (Prisma transaction: creates `User` + default `UserProgress` row with `experienceLevel: JUNIOR`, `dailyCommitmentMinutes: 15`) → returns `{ user, accessToken, refreshToken }`.
- **Login flow:** `POST /api/auth/login` → verifies bcrypt hash → `loginSideEffects` (ensures UserProgress row, touches `lastActiveAt`) → returns tokens.
- **Google OAuth flow:** `POST /api/auth/google` (body: `{ idToken }`) → `verifyGoogleIdToken` (via `google-auth-library`) → `findOrCreateGoogleUser` → returns tokens.
- **JWT structure:** Payload type: `{ userId: string; email: string; tokenVersion: number }`. Algorithm: `HS256`. Access token expiry: `15m`. Refresh token expiry: `30d`.
- **Token versioning:** `User.tokenVersion` column (default 0). Auth middleware checks `decoded.tokenVersion === user.tokenVersion`. Bumping `tokenVersion` in DB (via `revokeAllSessionsForUser.ts`) instantly invalidates all outstanding tokens — used on logout, password change, account deletion.
- **Token version cache:** `authenticatedUserTokenVersionCache.ts` is an in-memory `node-cache` that caches `userId → tokenVersion`. Avoids a DB query on every authenticated request when the version is already known.
- **Token refresh:** `POST /api/auth/refresh` (body: `{ refreshToken }`) → verifies refresh JWT → checks `tokenVersion` matches DB → issues new access + refresh token pair.
- **`/api/auth/me`:** Returns `{ id, email, username, avatarUrl }` — used by `bootstrapSession` to confirm the stored token is still valid.

### Feature Access Matrix

| Feature | Guest | Authenticated |
|---------|-------|---------------|
| Learn roadmap | ✓ | ✓ |
| Lesson exercises | ✓ (local only) | ✓ (server-synced) |
| Code Puzzle | ✓ (no XP) | ✓ (XP + streak) |
| Home screen stats | Local only | Server-synced |
| Duel Mode | ✗ | ✓ |
| Profile edit | Local prefs only | Full edit |
| Progress sync | ✗ | ✓ |
| Streak (server) | ✗ | ✓ |

---

## 4. Difficulty Levels System

### Definition
Three bands defined as Prisma enums in `packages/db/prisma/models/enums.prisma`:
- `ExperienceLevel { JUNIOR, MID, SENIOR }` — used for curriculum exercises and user progress.
- `Difficulty { JUNIOR, MID, SENIOR }` — used for duel questions.

### Storage
- `User.activeExperienceLevel: ExperienceLevel?` — the user's currently active track.
- `UserProgress` has a composite unique constraint `[userId, experienceLevel]`, meaning one progress row per user per level. Each row tracks `xpTotal`, `streakCurrent`, `currentExerciseIndex`, practice log, and preferences independently for that level.

### Content filtering
- Exercises: `GET /api/learning/exercises/:experienceLevel` queries `prisma.exercise.findMany({ where: { experienceLevel } })`.
- Duel questions: `pickQuestionForSession` (in `io/src/socket/duel/services/questions.ts`) selects from `DuelQuestion` filtered by `difficulty` matching the user's `experienceLevel`.
- `BLOCKS_BY_LEVEL` in `useLearnRoadmapData.ts` maps each level to its 3 blocks client-side.

### Level selection in UI
- **Onboarding:** Step 1 of `OnboardingFlow.tsx`.
- **Guest profile:** Chip selector in `GuestProfileBody.tsx` — dispatches `updatePreferences`.
- **Authenticated profile:** `PATCH /api/user/preferences` → updates `User.activeExperienceLevel` and upserts `UserProgress` row for that level.

---

## 5. Navigation & Screen Structure

### App Launch Flow
```
App.tsx → AppShell → AppNavigator
  ├── HydrationLoadingScreen (while !hasHydrated || !authChecked)
  ├── OnboardingFlow (first launch — AsyncStorage "1" not set)
  └── NavigationContainer → MainNavigator
         ├── MainTabs (bottom tab)
         └── Auth (modal stack screen)
```

### MainTabs (Bottom Tab Navigator)
Four tabs, defined in `MainNavigatorTabs.tsx`:

| Tab | Icon | Component |
|-----|------|-----------|
| Home | 🏠 | `HomeNavigator` (stack) |
| Learn | 📚 | `LearnNavigator` (stack) |
| Duel | ⚔️ | `DuelNavigator` (stack) — guest tap intercepted |
| Profile | 👤 | `ProfileScreen` |

### HomeNavigator (Stack)
- `HomeMain` → `HomeScreen` — daily stats cards, CTAs to Learn, Puzzle, Duel.
- `CodePuzzle` → `CodePuzzleScreen` — standalone puzzle screen.

### LearnNavigator (Stack) — `LearnNavigator.tsx`
- `LearnRoadmap` → `LearnRoadmapScreen` — block list for active level.
- `Lesson` (params: `experienceLevel`, `lessonTitle`, `blockIndex`) → `LessonScreen` — sequential exercise player.
- `LessonResults` (params: `accuracy`, `lessonTitle`, `experienceLevel`) → `LessonResultsScreen` — post-lesson stars summary.

### DuelNavigator (Stack) — `DuelNavigator.tsx`
- `DuelHome` → `DuelHomeScreen` — win/loss stats, "Find a Match" button.
- `Matchmaking` → `DuelMatchmakingScreen` — queue timer, player count, opponent reveal countdown.
- `ActiveDuel` → `DuelActiveDuelScreen` — live round: code snippet, answer zone, score row, between-round overlay.
- `DuelResults` (params: `won`, `score`, `xpEarned`, `replay[]`, `opponentDisconnected?`, `tied?`) → `DuelResultsScreen` — result + round replay bar chart + rematch button.

### Auth Stack (Modal) — `MainNavigator.tsx`
- Presented as a modal over `MainTabs`.
- `Auth` → `AuthScreen` — login/register form + Google OAuth button.

### Other Screens
- `HydrationLoadingScreen` — blank spinner shown during Redux hydration.
- `OnboardingFlow` — 3-step wizard; not part of `NavigationContainer`.

---

## 6. UI & Design Language

### Color Palette — `mobile/src/theme/theme.ts`

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0D0D0D` | All screen backgrounds |
| `card` | `#1A1A2E` | Card containers, tab bar |
| `surface` | `#16213E` | Elevated surfaces |
| `accent` | `#F7DF1E` | Primary buttons, active tabs, progress fills |
| `success` | `#4ECDC4` | Correct answer feedback |
| `danger` | `#FF6B6B` | Wrong answer feedback, destructive actions |
| `duel` | `#A855F7` | Duel mode purple accent |
| `textPrimary` | `#F0F0F0` | Primary text |
| `textSecondary` | `#9CA3AF` | Subtitles, captions |
| `textMuted` | `#4B5563` | Placeholders |
| `border` | `rgba(255,255,255,0.08)` | Card borders, tab bar border |

### Typography
`fontSize`: xs=12, sm=14, base=16, md=18, lg=22, xl=28, xxl=36, xxxl=48.

### Spacing
`spacing`: xs=4, sm=8, md=12, lg=16, xl=20, xxl=24, xxxl=32, huge=40, giant=48, massive=64.

### Border Radius
`radius`: button=12, card=16, modal=24, pill=999.

### Reusable Components

| Component | File | Purpose |
|-----------|------|---------|
| `AppShell` | `AppShell.tsx` | Root wrapper: offline banner, bootstrap error, QueryClient |
| `AppNavigator` | `AppNavigator.tsx` | Routing: onboarding vs main, hydration gate |
| `MainNavigator` | `MainNavigator.tsx` | Root stack: MainTabs + Auth modal |
| `MainTabs` | `MainNavigatorTabs.tsx` | Bottom tab navigator |
| `LearnNavigator` | `LearnNavigator.tsx` | Learn stack navigator |
| `DuelNavigator` | `DuelNavigator.tsx` | Duel stack + socket bootstrap |
| `HydrationLoadingScreen` | `HydrationLoadingScreen.tsx` | Spinner while store hydrates |
| `CodeSnippet` | `CodeSnippet.tsx` | Syntax-highlighted JS code block. Custom tokenizer: keywords=`#FCD34D`, strings=`#FCA5A5`, numbers=`#93C5FD`. Horizontal + vertical scroll. |
| `ExerciseView` | `ExerciseView.tsx` | Router: renders `ExerciseViewMCQ` or `ExerciseViewPuzzle` by `exercise.type`. |
| `ExerciseViewMCQ` | `ExerciseViewMCQ.tsx` | Multiple-choice option list with correct/wrong state colors. "Check" → "Next" flow. |
| `ExerciseViewPuzzle` | `ExerciseViewPuzzle.tsx` | Text input + hint token chips that append to input. "Submit" button. |
| `DuelActiveAnswerZone` | `DuelActiveAnswerZone.tsx` | MCQ options or line-tap for duel rounds. |
| `AuthCredentials` | `AuthCredentials.tsx` | Email/password form for login/register. |
| `AuthGoogleButton` | `AuthGoogleButton.tsx` | Google OAuth button via `expo-auth-session`. |
| `OnboardingFlow` | `OnboardingFlow.tsx` | 3-step level/goal/commitment wizard. |
| `ProfileScreen` | `ProfileScreen.tsx` | Routes to `GuestProfileBody` or `AuthenticatedProfileScreen`. |
| `GuestProfileBody` | `GuestProfileBody.tsx` | Local prefs picker + sign-in CTA. |
| `AuthenticatedProfileScreen` | `AuthenticatedProfileScreen.tsx` | Full authenticated profile UI. |
| `ProfileAuthenticatedTop` | `ProfileAuthenticatedTop.tsx` | Avatar + username/email header. |
| `ProfileAuthenticatedLearn` | `ProfileAuthenticatedLearn.tsx` | Learning stats section. |
| `ProfileAuthenticatedBot` | `ProfileAuthenticatedBot.tsx` | Settings / preferences section. |
| `ProfileAuthenticatedAccount` | `ProfileAuthenticatedAccount.tsx` | Account actions (change password, delete). |
| `ProfileModal` | `ProfileModal.tsx` | Modal for editing profile fields inline. |

---

## 7. Backend Architecture

### Routes Summary

**Base URL:** `/api`

#### Auth Router — `/api/auth`
| Method | Path | Handler | Auth | Rate Limited |
|--------|------|---------|------|---|
| POST | `/register` | `authRegisterHandler` | None | ✓ |
| POST | `/login` | `authLoginHandler` | None | ✓ |
| POST | `/google` | `authGoogleHandler` | None | ✓ (login limiter) |
| POST | `/refresh` | `authRefreshHandler` | None | ✓ |
| GET | `/me` | `authMeHandler` | Bearer JWT | — |
| POST | `/logout` | `authLogoutHandler` | None | ✓ |

#### Learning Router — `/api/learning`
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/exercises/:experienceLevel` | `learningGetExercisesHandler` | None |
| POST | `/submit-exercise` | `learningSubmitExerciseHandler` | Required |
| GET | `/resume` | `learningGetResumeHandler` | Required |
| DELETE | `/progress` | `learningResetProgressHandler` | Required |

#### User Router — `/api/user` (all routes: `authMiddleware` applied globally)
| Method | Path | Handler |
|--------|------|---------|
| GET | `/profile` | `getProfile` |
| PATCH | `/profile` | `patchProfile` |
| PUT | `/avatar/upload` | `putAvatarDirectUpload` — raw image body, uploads to S3 |
| PATCH | `/avatar` | `patchAvatar` — saves S3 URL |
| GET | `/progress-summary` | `getProgressSummary` — XP, streak, duel stats |
| GET | `/preferences` | `getPreferences` |
| PATCH | `/preferences` | `patchPreferences` |
| POST | `/practice-log` | `postPracticeLog` |
| GET | `/daily-goal-status/:dateKey` | `getDailyGoalStatus` |
| POST | `/daily-goal-status/:dateKey/mark-notified` | `postDailyGoalStatusMarkNotified` |
| POST | `/change-password` | `postChangePassword` |
| DELETE | `/account` | `deleteAccount` |

#### Code Puzzles Router — `/api/code-puzzles`
| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/all` | `codePuzzleAllHandler` | None |
| POST | `/:id/submit` | `codePuzzleSubmitHandler` | Optional (for XP) |

#### Health
| Method | Path |
|--------|------|
| GET | `/health` → `{ ok: true, service: "codequest-backend" }` |

### Database Tables (Prisma Models)

**`User`**
| Column | Type | Notes |
|--------|------|-------|
| `id` | String (CUID) | PK |
| `email` | String | Unique |
| `username` | String | Unique |
| `hashedPassword` | String? | Null for Google-only accounts |
| `googleId` | String? | Unique |
| `avatarUrl` | String? | S3 public URL |
| `tokenVersion` | Int | Default 0; bump to invalidate all tokens |
| `activeExperienceLevel` | ExperienceLevel? | Currently selected track |
| `puzzleXpSolveCounts` | Json | `{ puzzleId: solveCount }` map |
| `createdAt`, `updatedAt`, `lastActiveAt` | DateTime | |

**`UserProgress`**
| Column | Type | Notes |
|--------|------|-------|
| `id` | String | PK |
| `userId` | String | FK → User |
| `experienceLevel` | ExperienceLevel | One row per level per user |
| `currentExerciseIndex` | Int | Resume position |
| `xpTotal` | Int | XP earned in this level |
| `level` | Int | Derived: `floor(xpTotal/250)+1` |
| `streakCurrent` | Int | Current streak count |
| `streakLastActivityDate` | String? | YYYY-MM-DD |
| `streakLastCheckedDate` | String? | YYYY-MM-DD |
| `goal` | String? | JOB/WORK/FUN/PROJECT |
| `dailyCommitmentMinutes` | Int? | 10/15/25 |
| `notificationsEnabled` | Boolean | Default true |
| `practiceLogDateKey` | String? | YYYY-MM-DD |
| `practiceLogSeconds` | Int | Cumulative seconds for that date |
| `practiceLogIncompleteReminders` | Int | |
| `practiceLogCompleteSent` | Boolean | |
| Unique | `[userId, experienceLevel]` | |

**`Exercise`**
| Column | Type |
|--------|------|
| `id` | String (CUID) |
| `experienceLevel` | ExperienceLevel |
| `orderIndex` | Int |
| `sectionLabel` | String? |
| `type` | ExerciseType (MCQ/PUZZLE) |
| `prompt` | String |
| `codeSnippet` | String |
| `correctAnswer` | String |
| `explanation` | String |
| Index on `[experienceLevel, orderIndex]` | |

**`ExerciseOption`**
| Column | Type |
|--------|------|
| `id` | String |
| `exerciseId` | String → Exercise |
| `text` | String |
| `isCorrect` | Boolean |

**`DuelQuestion`**
| Column | Type |
|--------|------|
| `id` | String (CUID) |
| `questionText` | String |
| `codeSnippet` | String |
| `correctAnswer` | String |
| `type` | ExerciseType (MCQ/PUZZLE) |
| `difficulty` | Difficulty (JUNIOR/MID/SENIOR) |
| `options` | Json? (array of strings) |
| `explanation` | String |
| Index on `difficulty` | |

**`DuelSession`**
| Column | Type |
|--------|------|
| `id` | String (CUID) |
| `player1Id`, `player2Id` | String → User |
| `winnerId` | String? → User (null = tie) |
| `player1Score`, `player2Score` | Int |
| `roundsPlayed` | Int |
| `roundReplay` | Json? |
| `startedAt`, `endedAt` | DateTime |
| Indexes on `player1Id`, `player2Id` | |

**`CodePuzzle`**
| Column | Type |
|--------|------|
| `id` | Int (autoincrement) |
| `prompt` | String |
| `acceptedAnswers` | String[] |
| `testCases` | Json? |
| `orderIndex` | Int (unique) |

### Service Layer
- `createRegisteredUserWithDefaults` — Prisma transaction: User + UserProgress creation.
- `applyExerciseSubmission` — correctness check, XP update, streak update.
- `applyAuthenticatedPuzzleSolve` — puzzle XP (capped per puzzle), streak update.
- `codePuzzleSandbox / codePuzzleAllTestCasesPass` — isolated-vm sandbox for test case evaluation.
- `googleAccountLinking / findOrCreateGoogleUser` — idempotent Google sign-in.
- `loginSideEffects` — ensures UserProgress row, touches `lastActiveAt`.
- `revokeAllSessionsForUser` — bumps `tokenVersion` to invalidate all tokens.

### Middleware
- `authMiddleware` — verifies Bearer JWT, checks `tokenVersion` vs DB (with in-memory cache).
- `optionalAuthMiddleware` — same but continues without auth if no token.
- `authRateLimiters` — `express-rate-limit` on register, login, refresh, logout endpoints.
- `validateBody / validateQuery / validateParams` — Zod schema validation.
- `requestLogger` — logs every HTTP request.
- `helmet` — security headers; `crossOriginResourcePolicy: cross-origin` for S3 assets.
- `cors` — origin read from config; credentials enabled.

---

## 8. Real-Time System (Duel)

### Service
Separate Node.js process (`io/`) running Socket.IO 4.x on port 4001. Namespace: `/duel`.

### Authentication
`attachDuelConnectionAuthentication` — middleware on the `/duel` namespace that reads the JWT access token from `socket.handshake.auth.token`, verifies it, and sets `socket.data.authenticatedUserId`. Unauthenticated connections are still allowed to connect but cannot join the queue.

### Socket.IO Event Reference

#### Client → Server
| Event | Payload | Action |
|-------|---------|--------|
| `join_queue` | `{ username: string }` | Add to in-memory queue or match immediately |
| `leave_queue` | — | Remove from queue |
| `player_ready` | `{ session_id, streak_local_date? }` | Mark player ready; start round when both ready |
| `submit_answer` | `{ session_id, round_number, answer, time_taken_ms, streak_local_date? }` | Validate answer, award round |
| `leave_duel` | `{ session_id }` | Forfeit session |
| `rematch_request` | `{ session_id }` | Request rematch from results screen |
| `rematch_abandoned` | `{ session_id }` | Cancel pending rematch request |

#### Server → Client
| Event | Payload | When |
|-------|---------|------|
| `queue_status` | `{ players_online: number }` | On every connection/disconnect |
| `queue_rejected` | `{ reason: "already_in_duel" \| "superseded_by_other_device" \| "authentication_required" }` | When queue join fails |
| `match_found` | `{ session_id, opponent: { username, avatar_url } }` | After matchmaking paired |
| `round_start` | `{ round_number, question: { id, code_snippet, prompt, type, options }, starts_at }` | Round begins |
| `answer_feedback` | `{ isCorrect: false }` | Wrong answer submitted |
| `round_result` | `{ winner_user_id, correct_answer, explanation, scores, player_ids, response_times }` | Round resolved |
| `duel_end` | `{ winner_user_id, my_score, opp_score, xp_earned, streak_current, round_replay, tied? }` | All 5 rounds complete |
| `opponent_disconnected` | — | Opponent's socket disconnected mid-duel |
| `rematch_declined` | `{ reason: "timeout" }` | Rematch window expired |

### Full Session Flow
1. **Queue join:** Client emits `join_queue`. Server runs `handleQueueJoin`: if opponent exists in `queue[]`, calls `finalizeMatch` immediately; otherwise adds to queue and schedules a solo match timer (25s).
2. **Match found:** Server emits `match_found` to both sockets. Creates `SessionState` in `sessions` Map. Both sockets join shared room `duel_${sessionId}`.
3. **Ready:** Both clients emit `player_ready`. When `readyUserIds.size >= 2` (or 1 for solo), `startRound` is called.
4. **Round start:** `startRound` calls `pickQuestionForSession` (DB query filtered by difficulty, excluding already-asked IDs). Emits `round_start` to room. Resets `answered = false`, attempt counters.
5. **Answer submission:** Client emits `submit_answer`. Server checks: correct round number, valid slot, throttle (300ms). If wrong: increments attempt counter (max 3 per player per round, `DUEL_MAX_ATTEMPTS_PER_ROUND`). If both exhausted: `advanceDuelRoundNoWinner`. If correct: `applyCorrectDuelAnswer` — increments score, grants XP via `applyXpReward`, emits `round_result`, schedules next round after `DUEL_BETWEEN_ROUNDS_DELAY_MS = 4000ms`.
6. **Game end:** After round 5 (`DUEL_ROUND_COUNT = 5`) or when no questions remain, `endSession` is called: writes `DuelSession` to DB, deletes from `sessions` Map, emits personalized `duel_end` to each player (with their own `my_score`, `opp_score`, `xp_earned`, `streak_current`), creates `RematchEntry` (expires 60s).
7. **Reconnection:** On connect, `syncActiveDuelOnConnect` finds the active session for the user ID. Re-joins the room, updates socketId. Replays the appropriate event: `match_found` (round=0), `round_result` (answered), or `round_start` (in-progress).

### In-Memory State (`state.ts`)
- `queue: QueueEntry[]` — waiting players.
- `sessions: Map<string, SessionState>` — active in-flight sessions (not persisted to DB until end).
- `soloMatchTimers: Map<string, ReturnType<typeof setTimeout>>` — one timer per queued socket.
- `rematchEntries: Map<string, RematchEntry>` — post-session rematch state, expires after 60s.

### `SessionState` structure
```
{
  sessionId, roomId,
  player1: QueueEntry, player2: QueueEntry,
  score: { player1: number, player2: number },
  round: number,
  readyUserIds: Set<string>,
  currentQuestionId: string | null,
  currentQuestion: CachedQuestion | null,
  answered: boolean,
  player1Attempts: number, player2Attempts: number,
  roundNonce: number,
  roundReplay: Array<{ roundNumber, winnerUserId, correctAnswer, player1TimeMs, player2TimeMs }>,
  player1StreakLocalDate: string | null, player2StreakLocalDate: string | null,
  xpGrantedP1: number, xpGrantedP2: number,
  askedQuestionIds: Set<string>,
  abandonInProgress?: boolean
}
```

---

## 9. State Management

All state lives in a single Redux store (`mobile/src/redux/store.ts`) using Redux Toolkit.

### Slices

**`session`** — `session-slice.ts`
Owns: `hasHydrated`, `authChecked`, `isAuthenticated`, `isGuest`, `accessToken`, `refreshToken`, `userId`, `studyDateKey`, `studySecondsToday`, `bootstrapError`.
Key actions: `signIn`, `signOut`, `enterGuestMode`, `hydrateSession`, `updateTokens`, `addStudySeconds`, `reconcileStudyCalendarDay`.

**`profile`** — `profile-slice.ts`
Owns: `username`, `email`, `avatarUrl`, `goal`, `experienceLevel`, `commitment`, `notificationsEnabled`.
Key actions: `hydrateProfile`, `setUserIdentity`, `setOnboarding`, `completeOnboarding`, `updatePreferences`, `resetProfile`.

**`xp`** — `xp-slice.ts`
Owns: `level`, `xpTotal`.
Key actions: `addXp`, `hydrateXp`, `resetXp`. Level derived inline: `floor(xpTotal/250)+1`.

**`streak`** — `streak-slice.ts`
Owns: `streakCurrent`, `lastActivityDate`, `lastCheckedDate`.
Key actions: `hydrateStreak`, `resetStreak`, `runStreakAppOpen`, `runStreakQualifyingExercise`. Logic delegated to `@project/streak-logic`.

**`lesson`** — `lesson-slice.ts`
Owns: `currentExperienceLevel`, `lessonExerciseIndex`, `blockProgress: Record<string, number>`, `exercisesByExperienceLevel: Partial<Record<string, Exercise[]>>`.
Key actions: `setCurrentExperienceLevel`, `setExerciseIndex`, `saveBlockProgress`, `resetBlockProgress`, `setCachedExercisesForLevel`, `hydrateLesson`, `resetLesson`.

**`duel`** — `duel-slice.ts`
Owns: `duelWins`, `duelLosses`, `lessonsCompleted` (cumulative stats, persisted).
Key actions: `applyDuelResult`, `hydrateStats`, `resetStats`.

**`duelLive`** — `duel-live-slice.ts`
Owns: `playersOnline`, `sessionId`, `opponent`, `round`, `score`, `wrongAnswerCount`, `duelEnd`, `rematchStatus`, `lastCorrectAnswer`, `queueRejected`, `opponentLeft`.
Key actions: `matchFound`, `roundStarted`, `roundResultReceived`, `duelEnded`, `opponentDisconnected`, `wrongAnswerIncremented`, `rematchDeclined`, `duelReset`. **Not persisted.**

**`puzzle`** — `puzzle-slice.ts`
Owns: `allPuzzles: Puzzle[] | null`, `xpSolveCounts: Record<string, number>`.
Key actions: `setCachedAllPuzzles`, `incrementPuzzleXpSolveCount`, `hydratePuzzle`, `resetPuzzle`.

### Persistence Strategy
- **AsyncStorage** (key `codequest-redux-store`): JSON snapshot of `session` (tokens zeroed out), `profile`, `xp`, `streak`, `lesson`, `duel`, `puzzle`. Written on every state change (debounced 500ms) via `subscribeStoreToHybridStorage`.
- **`expo-secure-store`**: Access token + refresh token stored separately with hardware-backed encryption. Priority source on hydration.
- **Not persisted:** `duelLive` slice (transient match state), `accessToken`/`refreshToken` in the AsyncStorage session snapshot.

---

## 10. Monorepo Structure

Root workspace (`npm workspaces`): `backend`, `io`, `mobile`, `packages/*`.

### Packages

**`@project/auth-jwt`** — `packages/auth-jwt/`
Exports: `signAccessToken`, `signRefreshToken`, `verifyAccessToken`, `verifyRefreshToken`, `parseVerifiedPayload`, `AuthTokenPayload`, `ACCESS_TOKEN_JWT_EXPIRY` (15m), `REFRESH_TOKEN_JWT_EXPIRY` (30d), `JWT_SIGNING_ALGORITHM` (HS256).
Used by: `backend` (signing/verifying tokens), `io` (access token verification for socket auth).

**`@project/db`** — `packages/db/`
Exports: `prisma` (singleton PrismaClient), `getProgressForActiveUser`, `ensureProgressRow`, `handleStreakAppOpenForUser`, `handleStreakQualifyingXpForUser`, `resolveExperienceLevel`, `userProgressActive.ts` helpers, `userStreak.ts` helpers, `puzzleXpSolveCounts.ts` helpers.
Contains the Prisma schema (multi-file schema in `prisma/models/`).
Used by: `backend`, `io`.

**`@project/duel-constants`** — `packages/duel-constants/`
Exports: `DUEL_MAX_ATTEMPTS_PER_ROUND = 3`.
Used by: `io`, `mobile`.

**`@project/exercise-answer`** — `packages/exercise-answer/`
Exports: `normaliseExerciseAnswer(s)` — trims and removes whitespace for answer comparison.
Used by: `backend` (exercise submit).

**`@project/server-kit`** — `packages/server-kit/`
Exports: CORS helpers (`resolveExpressCorsOrigin`, `resolveSocketIoCors`, `parseCommaSeparatedOrigin`), logger (`logInfo`, `logWarn`, `logError`), security validators (`validateBackendSecurity`, `validateIoSecurity`, `assertNonWildcardOrigin`, `assertPostgresUrl`, `jwtSecretRules`).
Used by: `backend`, `io`.

**`@project/streak-logic`** — `packages/streak-logic/`
Exports: `applyStreakOnAppOpen`, `applyStreakOnQualifyingXp`, `DailyXpStreakPersisted`, `calendarDaysBetweenEarlierAndLater`.
Logic: streak resets if `gap >= 2` (one day missed). Pure functions, no side effects.
Used by: `backend` (via `@project/db`), `io` (rewards service), `mobile` (streak slice).

**`@project/user-credentials`** — `packages/user-credentials/`
Exports: validation constants and functions — `USERNAME_MIN_LEN` (2), `USERNAME_MAX_LEN` (25), `PASSWORD_MIN_LEN` (8), `PASSWORD_MAX_LEN` (64), `EMAIL_MIN_LEN` (5), `EMAIL_MAX_LEN` (254), `registerValidationError`, `usernameValidationError`, `passwordPolicyError`, error message strings.
Used by: `backend` (auth validators), `mobile` (client-side form validation).

**`@project/xp-constants`** — `packages/xp-constants/`
Exports: `XP_PER_CORRECT_EXERCISE = 250`, `PUZZLE_MAX_XP_SOLVES = 10`, `levelFromXpTotal`, `puzzleXpGrantForSolve`, `nextPuzzleXpSolveCounts`, `puzzleSolveFeedbackMessage`, `PuzzleXpSolveCounts` type.
Used by: `backend`, `io`, `mobile` — single source of truth for all XP math.

---

## 11. Gamification System

### XP System
- **Earned:** 250 XP per correct lesson exercise, puzzle solve, or duel round win.
- **Level formula:** `level = max(1, floor(xpTotal / 250) + 1)` — implemented in `levelFromXpTotal` (`@project/xp-constants`), mirrored in `xp-slice.ts`.
- **Storage:** `UserProgress.xpTotal` + `UserProgress.level` (server). `xp` Redux slice (client, synced from server on login/app-open).
- **Display:** Home screen "Level X · Y / Z XP" card with progress bar. Lesson results screen shows level + total XP.

### Puzzle XP Cap
- Each `CodePuzzle` can only award XP for the first 10 solves (`PUZZLE_MAX_XP_SOLVES = 10`).
- Tracked in `User.puzzleXpSolveCounts: Json` — a `{ puzzleId: count }` map on the `User` row (not per `UserProgress`).
- `puzzleXpGrantForSolve(countBeforeSolve)` returns `{ grantXp: boolean; xpEarned: number }`.
- Client mirrors this in `puzzle.xpSolveCounts` Redux slice.

### Streak System
- **Qualifying activity:** Any correct lesson exercise, puzzle solve (with `clientLocalDate`), or duel round correct answer.
- **Increment rule:** `applyStreakOnQualifyingXp` — if `lastActivityDate !== today`, check gap. Gap < 2: `streakCount + 1`. Gap >= 2: reset to 1 (restart).
- **Reset rule:** `applyStreakOnAppOpen` — on each app open (via `/api/user/progress-summary`), if `lastCheckedDate` or `lastActivityDate` is >= 2 days ago, streak resets to 0.
- **Storage:** `UserProgress.streakCurrent`, `streakLastActivityDate`, `streakLastCheckedDate`. Client mirrors in `streak` Redux slice.
- **Visual:** Home screen "🔥 N-day streak" card. If streak ≤ 7, shows a 7-dot row (filled = consecutive days). Dots hidden for streaks > 7.

### Daily Goal
- User picks a daily commitment: 10, 15, or 25 minutes.
- Stored in `UserProgress.dailyCommitmentMinutes`.
- Progress tracked in `UserProgress.practiceLogSeconds` (cumulative seconds for `practiceLogDateKey`).
- **Backend:** `POST /api/user/practice-log` accumulates seconds. `GET /api/user/daily-goal-status/:dateKey` returns `{ goalMinutes, practicedMinutes, remainingMinutes, canSendIncomplete, canSendComplete }`.
- **Client:** `addStudySeconds` Redux action + `tryPostPracticeLog.ts` periodically syncs to server. Home screen shows `practiceMinutesToday / dailyGoalMinutes min` with a progress bar.
- **Push notifications:** `syncDailyPracticeReminder.ts` schedules a daily notification at 19:00 via `expo-notifications`. Works for both guests and authenticated users. Notification cancelled and re-scheduled if settings change.

### Duel Stats
- `duelWins`, `duelLosses` — counted from `DuelSession` rows in DB (`winnerId === userId` = win; participant + `winnerId !== null` + `winnerId !== userId` = loss).
- Displayed on `DuelHomeScreen` and authenticated Profile.

---

## 12. Code Puzzle System

### Structure in DB
`CodePuzzle` table:
- `id` — auto-increment integer.
- `prompt` — natural language description of the puzzle.
- `acceptedAnswers: String[]` — array of string answers considered correct (whitespace-normalized comparison).
- `testCases: Json?` — optional array of `{ inputContext: Record<string, unknown>, expectedOutput: unknown }` for sandboxed evaluation.
- `orderIndex: Int` — unique display order.

Seeds: `codePuzzleSeed.shard0.ts`, `codePuzzleSeed.shard1.ts`, `codePuzzleSeed.shard2.ts` — three shards to respect the 80-line file limit. Combined in `codePuzzles.ts:seedCodePuzzles`.

### Evaluation (`codePuzzleSandbox.ts`)
Uses **`isolated-vm`** — V8 isolate sandbox for safe code execution:
- Isolate memory: 32 MB. Script timeout: 100ms.
- Answer is wrapped: `(()=>{"use strict";return (${answer});})()`
- `inputContext` variables are injected into the isolate context via `ivm.ExternalCopy`.
- Only `Math.max`, `Math.min`, `Object.keys` are bridged into the sandbox as `ivm.Reference` callbacks.
- `async` returns are rejected. Result compared with `isDeepStrictEqual`.

### Serving and Evaluation Flow
1. `GET /api/code-puzzles/all` — returns all puzzles (no auth). Client caches in `puzzle.allPuzzles` Redux slice.
2. `POST /api/code-puzzles/:id/submit` (body: `{ answer, clientLocalDate? }`) — optional auth via `optionalAuthMiddleware`.
   - Normalizes answer (remove whitespace, trailing semicolon).
   - Checks `acceptedAnswers` array first.
   - If no match and `testCases` present, runs `codePuzzleAllTestCasesPass` via isolated-vm.
   - If correct and authenticated: calls `applyAuthenticatedPuzzleSolve` → updates `puzzleXpSolveCounts` on `User`, awards XP (capped), updates streak.
   - Response: `{ correct: boolean, xpEarned?, xpTotal?, streakCurrent?, puzzleSolveCount? }`.

### Difference from Lesson Exercises

| Dimension | Lesson Exercise (PUZZLE type) | Code Puzzle (standalone) |
|-----------|-------------------------------|--------------------------|
| DB table | `Exercise` | `CodePuzzle` |
| Linked to | Curriculum block/level | Independent |
| Evaluation | String comparison via `normaliseExerciseAnswer` | `acceptedAnswers` + isolated-vm `testCases` |
| XP cap | None per exercise | 10 solves per puzzle |
| Input UI | TextInput + hint chips | TextInput, free-form |
| Route | `POST /api/learning/submit-exercise` | `POST /api/code-puzzles/:id/submit` |

---

## 13. Technical Stack

### Mobile (`mobile/`)
| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81.5 | Cross-platform mobile framework |
| React | 19.1.0 | UI rendering |
| Expo | ~54.0.0 | Build toolchain, native modules |
| TypeScript | ~5.9.2 | Type safety |
| Redux Toolkit | ^2.11.2 | State management |
| React Redux | ^9.2.0 | Redux React bindings |
| React Navigation (native) | ^7.1.33 | Navigation container |
| React Navigation (native-stack) | ^7.14.4 | Stack navigator |
| React Navigation (bottom-tabs) | ^7.15.5 | Bottom tab navigator |
| TanStack React Query | ^5.90.21 | Server state / QueryClientProvider |
| Axios | ^1.13.2 | HTTP client |
| Socket.IO Client | ^4.8.3 | Real-time duel connection |
| AsyncStorage | 2.2.0 | Local state persistence |
| NetInfo | 11.4.1 | Network connectivity detection |
| expo-secure-store | ~15.0.8 | Encrypted JWT storage |
| expo-auth-session | ~7.0.11 | OAuth flows (Google) |
| expo-notifications | ~0.32.16 | Push / local scheduled notifications |
| expo-image-picker | ~17.0.10 | Camera roll access for avatar |
| expo-image-manipulator | ~14.0.8 | Image cropping/resizing |
| expo-haptics | ~15.0.8 | Haptic feedback |
| expo-web-browser | ~15.0.11 | OAuth in-app browser |
| react-native-gesture-handler | ~2.28.0 | Touch gesture system |
| react-native-reanimated | ~4.1.1 | Animation library |
| react-native-safe-area-context | ~5.6.0 | Notch/home indicator insets |
| react-native-screens | ~4.16.0 | Native navigation screens |
| react-native-worklets | 0.5.1 | Reanimated worklets |
| Vitest | ^3.2.4 | Unit testing (streak logic tests) |

### Backend (`backend/`)
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| TypeScript | ^5.9.3 | Type safety |
| Express | ^5.2.1 | HTTP framework |
| Prisma | ^6.19.0 | ORM + migrations |
| PostgreSQL | 16 (docker) | Database |
| bcrypt | ^6.0.0 | Password hashing |
| jsonwebtoken (via auth-jwt) | — | JWT sign/verify |
| zod | ^4.3.6 | Request validation |
| helmet | ^8.1.0 | Security headers |
| cors | ^2.8.6 | CORS |
| express-rate-limit | ^8.2.1 | Rate limiting |
| node-cache | ^5.1.2 | In-memory token version cache |
| isolated-vm | ^6.1.2 | Sandboxed code execution for puzzles |
| @aws-sdk/client-s3 | ^3.922.0 | Avatar image storage |
| google-auth-library | ^9.15.1 | Google ID token verification |
| config | ^4.4.1 | Environment-aware config files |
| tsx | ^4.21.0 | TS execution / watch mode |

### Socket.IO Service (`io/`)
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| TypeScript | ^5.9.3 | Type safety |
| Socket.IO | ^4.8.3 | Real-time bidirectional events |
| Prisma | ^6.19.0 | DB access (write DuelSession, read questions) |
| config | ^4.4.1 | Config files |
| tsx | ^4.21.0 | TS execution / watch mode |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker / Docker Compose | Local dev: PostgreSQL 16, LocalStack S3, backend, io |
| LocalStack 3.8.0 | Local AWS S3 emulation for avatar uploads |
| AWS S3 | Production avatar storage (bucket: `questcode-avatars`) |
| patch-package | Patches applied to `node_modules` (see `patches/`) |
| knip | Dead code detection (`knip.config.ts`) |

---

## Known Incomplete Areas

1. `io/src/socket/duel/services/questions.ts` and `io/src/socket/duel/services/rewards.ts` — referenced in imports; implement question picking (difficulty band + deduplication) and `applyXpReward` respectively.
2. `io/src/socket/duel/middleware/attachDuelConnectionAuthentication.ts` — JWT verification for socket handshake.
3. `io/src/socket/duel/handlers/disconnect.ts`, `joinQueue.ts`, `leaveQueue.ts`, `rematchRequest.ts` — handler files registered in `duel/index.ts`.
4. `CodeSnippet.tsx` — the "Live Output" section renders a static placeholder (`$ output preview ready`); not connected to a JS evaluator.
5. Backend has no test suite (`"test": "echo \"No tests configured yet\""`). Mobile has Vitest for streak logic only (`dailyXpStreakCore.test.ts`, `dailyGoalReminderSync.test.ts`).
