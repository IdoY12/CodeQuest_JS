<!--
Audit date: 2026-03-28
Scope: React Native iOS app in mobile/
-->

# CodeQuest — React Native mobile refactor plan

All paths below are under `mobile/` unless noted.

## 1. Current layout (before this pass)

The app already followed most of the target shape (`mobile/src/app`, `navigation`, `auth/screens`, `screens`, `common`, `hooks`, `services`, `store`, `types`, `utils`). A partial move left **broken relative imports** (paths assumed old `src/components/*` depth), a **wrong folder name** (`stores/` vs `store/useAppStore.ts`), and **RootNavigator** still importing a non-existent `../components/` tree.

## 2. Component inventory (high level)

| Area | Path pattern | Role |
|------|----------------|------|
| Root | `src/app/App.tsx`, `AppShell/` | Redux provider, query client, offline banner, hosts navigator |
| Navigation | `src/navigation/*` | Tab + stack navigators, auth modal route |
| Auth | `src/auth/screens/AuthScreen`, `OnboardingFlow` | Sign-in modal, onboarding wizard |
| Home / Daily | `src/screens/Home`, `src/screens/DailyPuzzle` | Dashboard, daily puzzle |
| Learn | `src/screens/LearnRoadmap`, `Lesson`, `LessonResults`, `Learn/components/*` | Roadmap, lesson, results, exercise type views |
| Duel | `src/navigation/DuelNavigator` | Duel UI + socket hook |
| Profile | `src/screens/Profile/ProfileScreen`, `Profile/components/*` | Guest/authenticated profile, modals, cards |
| Shared UI | `src/common/CodeSnippet` | Syntax-highlighted code block |
| State | `src/store/*`, `src/store/useAppStore.ts` | Redux + Zustand app store |

## 3. Duplication analysis (DRY)

### Safe to leave separate (with rationale)

- **ProfileUsernameModal / ProfilePasswordModal / ProfileDeleteModal** — All use `ProfileModalShell`, but body fields, validation, and handlers differ. Merging would produce a large prop union and blur security-sensitive flows. **Not merged**; shell already DRYs layout.

- **SettingRow vs OptionRow** — `SettingRow` is a pressable row with chevron; `OptionRow` is a horizontal chip group. **Not merged**.

- **Exercise*View components** — Shared spacing via `theme/theme.ts`; each type has distinct gesture/state logic. **Not merged**.

### Already DRY

- **ProfileModalShell** + shared `profileModalStyles` for the three modals.
- **ProfileSectionCard** styles reused by preference/support cards.
- **Lesson hooks** (`useExerciseMcq`, etc.) isolate repeated exercise logic.

### Structural fix (no behaviour change)

- **CodeSnippet** was nested as `common/CodeSnippet/CodeSnippet/`. **Flattened** to `common/CodeSnippet/CodeSnippet.tsx` + `CodeSnippet.styles.ts` with `index.ts` barrel.

## 4. Planned merges

| Items | Action |
|-------|--------|
| (none this pass) | Risk-averse: structural repair + navigation split only |

## 5. Planned renames / moves

| From | To |
|------|-----|
| `common/CodeSnippet/CodeSnippet/*` | `common/CodeSnippet/CodeSnippet.tsx` (+ styles alongside) |
| Monolithic `RootNavigator.tsx` | Split: `AppNavigator.tsx`, `MainNavigator.tsx`, `GuardedRoute.tsx` |
| `RootNavigator` | `RootNavigator.tsx` re-exports `AppNavigator as RootNavigator`; `AppShell` uses `AppNavigator` |

## 6. Not touched (and why)

- **API, Redux slices, Zustand store shape** — out of scope.
- **Theme token values** — only import paths fixed; no colour changes.
- **Native iOS / Expo config** — out of scope.
- **Exercise business logic and duel socket protocol** — unchanged.

## 7. Target folder structure (full)

```
mobile/src/
├── app/
│   ├── App.tsx
│   ├── AppShell/
│   └── useAppShell.ts
├── navigation/
│   ├── AppNavigator.tsx
│   ├── MainNavigator.tsx
│   ├── GuardedRoute.tsx
│   ├── RootNavigator.tsx    # re-export shim
│   ├── LearnNavigator/
│   └── DuelNavigator/
├── auth/screens/
│   ├── AuthScreen/
│   └── OnboardingFlow/
├── screens/
│   ├── Home/
│   ├── DailyPuzzle/
│   ├── LearnRoadmap/LearnRoadmapScreen/
│   ├── Lesson/LessonScreen/
│   ├── LessonResults/LessonResultsScreen/
│   ├── Learn/components/...
│   └── Profile/...
├── common/CodeSnippet/
├── hooks/
├── services/
├── store/
├── types/
├── theme/
├── data/
├── constants/
├── config/
└── utils/
```

Path alias `@/*` → `mobile/src/*` (`tsconfig` + `babel-plugin-module-resolver`).

## 8. Verification checklist

- [x] `npx tsc --noEmit` in `mobile/`
- [ ] `npx eslint .` — no ESLint config present in `mobile/` (Expo project); add config if you want this step.
- [x] Ripgrep: no `stores/useAppStore` or dead `../components/` screen imports
- [ ] Metro / `expo start` / iOS run in your environment
