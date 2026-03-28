# Cursor Refactoring Prompt — React Native iOS App

---

## 🎯 GOAL

You are tasked with performing a **safe, comprehensive refactoring** of this React Native iOS application. The refactoring has two main objectives:

1. **Apply the DRY (Don't Repeat Yourself) principle** — identify and eliminate duplicated or near-duplicate components by merging them into single, configurable, reusable components.
2. **Reorganize the folder structure** — restructure the `src/` (or components) directory into a clean, logical grouping inspired by the reference structure below.

> ⚠️ CRITICAL CONSTRAINT: **Do NOT break the app.** Every change must be safe and backward-compatible. After each major step, the app must still compile and run correctly. If you are unsure whether merging two components is safe, **leave them as-is** and add a comment explaining why.

---

## 📁 TARGET FOLDER STRUCTURE

Reorganize the project so that the component/screen directories follow this pattern:

```
src/
├── app/
│   └── App.tsx                   # Root component, providers, global setup
│
├── navigation/                   # All navigation logic (Stack, Tab, Drawer, etc.)
│   ├── AppNavigator.tsx          # Root navigator
│   ├── AuthNavigator.tsx         # Auth flow navigator (if exists)
│   ├── MainNavigator.tsx         # Main app navigator (if exists)
│   └── GuardedRoute.tsx          # Any auth-guard / protected route logic
│
├── auth/                         # Everything related to authentication
│   ├── screens/
│   │   ├── LoginScreen/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── index.ts
│   │   └── SignupScreen/
│   │       ├── SignupScreen.tsx
│   │       └── index.ts
│   └── components/               # Auth-specific sub-components (forms, panels, etc.)
│
├── screens/                      # All full-page screens grouped by feature
│   ├── Home/
│   │   ├── HomeScreen.tsx
│   │   └── index.ts
│   ├── Profile/
│   │   ├── ProfileScreen.tsx
│   │   └── index.ts
│   └── [OtherScreens]/           # One subfolder per screen/feature
│
├── common/                       # Shared, reusable UI components used across the app
│   ├── AppLayout/
│   ├── Button/
│   ├── Card/
│   ├── Header/
│   ├── Footer/
│   ├── Spinner/
│   ├── SpinnerButton/
│   ├── Pagination/
│   ├── NotFound/
│   └── [Other shared components]/
│
├── hooks/                        # Custom React hooks
├── services/                     # API calls, external services
├── store/                        # State management (Redux / Zustand / Context)
├── types/                        # TypeScript types and interfaces
└── utils/                        # Helper functions and utilities
```

> 📌 **Note:** Each component folder should have:
> - `ComponentName.tsx` — the component itself
> - `index.ts` — re-exports the component for clean imports (`import { Button } from '@/common/Button'`)
> - Optionally: `ComponentName.styles.ts` or inline StyleSheet if styles are large

---

## 🔍 STEP 1 — FULL CODEBASE AUDIT (Read Before Touching Anything)

Before making any changes, perform a complete read-only audit:

1. **List every component file** in the project. Map out:
   - Component name
   - Current file path
   - What it renders (brief description)
   - What props it accepts
   - Where it is imported/used (which files import it)

2. **Identify duplication patterns** — look for:
   - Components with very similar JSX structure (e.g., two types of cards, two types of buttons, two loading spinners)
   - Components that differ only by minor props (color, size, label text, icon)
   - Multiple files containing the same utility function or hook
   - Repeated StyleSheet definitions (same color, same padding values repeated across many files)
   - Screens that share identical sub-sections (e.g., a "header section" copy-pasted into multiple screens)

3. **Document your findings** as an inline comment block at the top of a new file called `REFACTOR_PLAN.md` placed in the project root. This plan must include:
   - A list of components you plan to MERGE and why
   - A list of components you plan to RENAME or MOVE (without logic changes)
   - A list of components you will NOT touch and why
   - The new folder structure mapped out in full

---

## 🔨 STEP 2 — DRY REFACTORING (Merge & Consolidate)

Go through the list of duplication patterns you found. For each case:

### Rule A — Safe Merge (DO THIS)
If two or more components are **functionally identical or differ only in props**, merge them into one configurable component. Example:

```tsx
// BEFORE: Two separate components
<PrimaryButton title="Submit" />
<SecondaryButton title="Cancel" />

// AFTER: One component with a variant prop
<Button title="Submit" variant="primary" />
<Button title="Cancel" variant="secondary" />
```

### Rule B — Shared Sub-component Extraction (DO THIS)
If the same JSX block (e.g., a profile avatar + name row) is copy-pasted in 3+ screens, extract it into a shared component in `common/`.

### Rule C — Shared Hook Extraction (DO THIS)
If the same `useEffect`, `useState` logic, or data-fetching pattern appears in multiple screens, extract it into a custom hook in `hooks/`.

### Rule D — Shared StyleSheet (DO THIS)
If the same color values, spacing, or typography styles are repeated across many `StyleSheet.create` calls, extract them into a `theme.ts` or `styles/tokens.ts` file and import from there.

### Rule E — STOP if Risky (DO NOT merge if ANY of these apply)
- The components look similar but have **different business logic or side effects**
- Merging would require a **complex prop API** that makes the component harder to use
- The component is **tightly coupled to a specific screen's state**
- You are not 100% sure the merge is safe
- The component has **platform-specific code** (iOS vs Android) that would conflict

In these cases, leave the components as-is and add a `// TODO: [REFACTOR CANDIDATE]` comment.

---

## 📂 STEP 3 — FOLDER RESTRUCTURE

After DRY refactoring is complete, reorganize files into the target folder structure defined above.

### Rules for restructuring:
1. **Update every import** across the entire codebase after moving a file. Use project-wide search and replace — do not leave any broken imports.
2. **Add `index.ts` barrel files** to each component folder for clean imports.
3. **Use path aliases** (e.g., `@/common/Button`) if the project already has them configured in `tsconfig.json` or `babel.config.js`. If not, add them.
4. **Keep navigation files together** in `navigation/` — do not scatter navigator files across screen folders.
5. **Group screens by feature** inside `screens/` — each screen gets its own subfolder.
6. **Auth screens go inside `auth/screens/`**, not inside the general `screens/` folder.
7. **Global/shared components go inside `common/`** — if a component is used in more than one screen, it belongs in `common/`.

---

## ✅ STEP 4 — VERIFICATION

After completing the refactoring:

1. **Run the TypeScript compiler** (`tsc --noEmit`) and fix all type errors.
2. **Run the linter** (`eslint .`) and fix all errors (warnings are OK).
3. **Do a global search** for the OLD file paths / component names to make sure no stale imports remain.
4. **Check that no file is orphaned** — every component that was moved must be imported somewhere, or explicitly documented as a "standalone screen registered in the navigator."
5. **Verify the navigation stack** — all screens that were registered in navigators must still be registered correctly after the move.
6. **Run the Metro bundler** (`npx react-native start`) and confirm there are no module resolution errors.
7. **Build the app** for iOS (`npx react-native run-ios` or via Xcode) and confirm it launches without crashes.

---

## 📝 ADDITIONAL GUIDELINES

- **Commit after each major step** (audit → DRY refactor → folder restructure → verification) so the git history is clean and reversible.
- **Do not change any business logic, API calls, or state management** as part of this refactoring. This is purely structural.
- **Do not rename props** on components that are consumed by many screens — it risks silent bugs. If you must rename, do a full find-and-replace and verify.
- **Do not delete any file** without first confirming it is no longer imported anywhere.
- **Preserve all existing functionality** — the app must look and behave identically to the user after refactoring.
- **If in doubt, ask** — if you encounter a component whose purpose is unclear, ask before moving or merging it.

---

## 🚫 OUT OF SCOPE (Do NOT do these)

- Do not change any API endpoints or data models
- Do not upgrade any dependencies or library versions
- Do not change the app's UI/UX design or layouts
- Do not add new features
- Do not modify any native iOS code (`.m`, `.mm`, `.swift`, `Info.plist`, etc.)
- Do not change the app's color scheme or theme values (only extract them if they're duplicated)

---

## 📎 REFERENCE

The target folder structure is inspired by a well-organized React web project with this grouping pattern:
- `app/` → root entry point
- `navigation/` (or `app-routes/`) → all routing/navigation logic
- `auth/` → authentication screens and components
- `screens/` (or `pages/`) → full-screen views grouped by feature
- `common/` → shared, reusable UI components

The **same logical separation applies here** to this React Native iOS app, adapted for mobile conventions (screens instead of pages, navigators instead of routes).
