# Cursor Prompt — Cleanup & Rebuild: Exact Folder Structure

---

## 🚨 SITUATION

The project's component structure is currently broken — there are multiple nested `components` folders, duplicated files, and a chaotic directory layout.

**Your job:**
1. Read and understand the full current state of the project (read-only first)
2. Wipe the broken structure
3. Rebuild **exactly one** `components` folder that looks exactly like the reference structure below
4. Update every import across the entire codebase
5. Verify the project compiles and runs

---

## 📐 THE EXACT TARGET STRUCTURE — FOLLOW THIS PRECISELY

There must be **exactly ONE folder called `components`** in the entire project (outside of `node_modules`).

Inside it, the structure must be **exactly** this pattern — one folder per concern, all at the same level, no nesting of `components` inside `components`:

```
components/
│
├── app/                         ← Root component only
│   ├── App.tsx
│   └── App.styles.ts
│
├── auth/                        ← Everything related to authentication
│   ├── login/
│   │   ├── Login.tsx
│   │   └── Login.styles.ts
│   ├── signup/
│   │   ├── Signup.tsx
│   │   └── Signup.styles.ts
│   └── [any other auth sub-components]/
│       ├── ComponentName.tsx
│       └── ComponentName.styles.ts
│
├── layout/                      ← App-wide layout (header, footer, tab bar, wrappers)
│   └── [ComponentName]/
│       ├── ComponentName.tsx
│       └── ComponentName.styles.ts
│
├── common/                      ← Shared UI components used in 2+ features
│   └── [ComponentName]/
│       ├── ComponentName.tsx
│       └── ComponentName.styles.ts
│
├── [feature-name]/              ← One folder per feature of the app
│   └── [ComponentName]/
│       ├── ComponentName.tsx
│       └── ComponentName.styles.ts
│
└── [another-feature]/
    └── [ComponentName]/
        ├── ComponentName.tsx
        └── ComponentName.styles.ts
```

### 🔑 Key rules for this structure:

- `app/` → only the root App component
- `auth/` → login, signup, auth guards, token logic
- `layout/` → anything that wraps the whole screen (headers, tab bars, drawers)
- `common/` → any component used in more than one feature
- **Feature folders** (e.g., `messages/`, `posts/`, `profile/`, `settings/`, etc.) → components that belong to only that feature
- Each feature folder can have **sub-folders** for sub-features (e.g., `messages/chat/`, `messages/inbox/`)
- **No folder should be named `components` inside another folder named `components`** — this is the exact mistake to fix

### ⚠️ STRICT FILE RULE — EXACTLY 2 FILES PER COMPONENT FOLDER

Every component folder must contain **exactly 2 files and nothing else:**

| File | Purpose |
|------|---------|
| `ComponentName.tsx` | The component itself — JSX, logic, props |
| `ComponentName.styles.ts` | All styles — `StyleSheet.create({...})` |

**FORBIDDEN — do NOT create these files:**
- ❌ `index.ts` — barrel/re-export files are not allowed anywhere
- ❌ `index.tsx` — same, not allowed
- ❌ Any file that only contains `export { X } from './X'` or `export { default } from './X'`

**Why:** These re-export files cause confusion, circular imports, and are unnecessary. All imports must reference the component file directly by its full path:

```ts
// ✅ CORRECT — import directly from the file
import { LoginScreen } from '../auth/login/Login';
import { Button } from '../common/Button/Button';

// ❌ WRONG — do not use index files
import { LoginScreen } from '../auth/login';
import { Button } from '../common/Button';
```

If any `index.ts` or `index.tsx` files currently exist in the project, **delete them all** and update every import that was pointing to them to point directly to the `.tsx` file instead.

---

## 📋 STEP 1 — AUDIT (Touch Nothing Yet)

Run these commands first and read every line of output:

```bash
# Find ALL folders named "components" — there should be only 1 when we're done
find . -type d -name "components" -not -path "*/node_modules/*"

# Full file tree of the source folder
find . \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  | sort
```

From this output, create a mapping:
- Every component file → its current path → where it belongs in the NEW structure
- Mark duplicates (same component appearing in 2+ locations)
- For duplicates: keep the most recently modified version

**Do not touch any file until you have this complete map.**

---

## 🗑️ STEP 2 — REBUILD

1. **Create the new structure** under `components/` exactly as defined above
2. **Copy** every unique component file to its correct new location — only `ComponentName.tsx` and `ComponentName.styles.ts`
3. **Delete every `index.ts` / `index.tsx`** that exists in the project (they are re-export barrel files and are not allowed)
4. **After every file is copied and confirmed**, delete all old broken folders

---

## 🔗 STEP 3 — FIX ALL IMPORTS

For every file that moved, do a **global search** (use grep or Cursor's search) for the old import path and replace with the new one.

```bash
# After fixing, run TypeScript — must be 0 errors
npx tsc --noEmit

# Search for any remaining broken paths (old folder name)
grep -r "from.*components.*components" . --include="*.ts" --include="*.tsx" | grep -v node_modules
```

The last grep should return **zero results** — if `components/components` still appears anywhere, fix it.

---

## 🗂️ REDUX STRUCTURE — FOLLOW THIS EXACTLY

The `redux/` folder must be completely rebuilt to match this exact structure:

```
redux/
├── feed-slice.ts
├── followers-slice.ts
├── following-slice.ts
├── messages-slice.ts
├── profile-slice.ts
├── [any-other-feature]-slice.ts
├── store.ts
└── hooks.ts
```

### Rules:
- **Flat folder** — no subfolders inside `redux/`, just files
- **One slice per feature** — `[feature-name]-slice.ts`
- **Every file must be 80 lines or fewer** — if a slice is longer, split the async thunks into a separate `[feature]-thunks.ts` file next to the slice
- **No duplicate stores** — there must be exactly one `store.ts`
- **No duplicate hooks** — there must be exactly one `hooks.ts`

---

### `store.ts` — must look exactly like this:

```ts
import { configureStore } from "@reduxjs/toolkit";
import followersSlice from "./followers-slice";
import followingSlice from "./following-slice";
import profileSlice from "./profile-slice";
import feedSlice from "./feed-slice";
import messagesSlice from "./messages-slice";
// ... import any other slices

const store = configureStore({
    reducer: {
        followersSlice,
        followingSlice,
        profileSlice,
        feedSlice,
        messagesSlice
        // ... add other slices here
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### `hooks.ts` — must look exactly like this:

```ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatcher = useDispatch.withTypes<AppDispatch>();
```

> ⚠️ These are the **only two typed hooks** allowed. Everywhere in the app that currently uses `useDispatch` or `useSelector` directly must be updated to use `useAppDispatcher` and `useAppSelector` instead.

---

### Each slice file — follow this pattern (max 80 lines):

```ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type SomeModel from "../models/some-model";

interface SliceState {
    // state fields here
}

const initialState: SliceState = {
    // initial values here
};

export const featureSlice = createSlice({
    name: 'feature',
    initialState,
    reducers: {
        // reducers here — each one should be short and focused
    }
});

export const { action1, action2 } = featureSlice.actions;

export default featureSlice.reducer;
```

**If a slice file exceeds 80 lines:**
- Move all `createAsyncThunk` calls into a `[feature]-thunks.ts` file
- Keep only the slice definition (state, reducers, exports) in `[feature]-slice.ts`
- Import the thunks back into the slice file using `extraReducers` if needed

---

### Update all usages across the app:

After rebuilding the redux folder, do a global search and replace:

```bash
# Find all direct useDispatch / useSelector usages that need to be updated
grep -r "useDispatch\|useSelector" . --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v "hooks.ts"
```

Every result must be changed to import from `../redux/hooks` and use `useAppDispatcher` / `useAppSelector` instead.

---

## ✅ STEP 4 — VERIFY

```bash
# 1. Exactly ONE components folder must exist
find . -type d -name "components" -not -path "*/node_modules/*"
# → Must print exactly 1 line

# 2. TypeScript clean
npx tsc --noEmit

# 3. Linter clean
npx eslint . --ext .ts,.tsx

# 4. Metro bundler — no module errors
npx react-native start

# 5. iOS build
npx react-native run-ios
```

---

## ✅ DEFINITION OF DONE

- [ ] Exactly **one** `components` folder exists in the project
- [ ] Its internal structure matches the pattern defined in this prompt
- [ ] No folder called `components` exists inside another `components` folder
- [ ] The `redux/` folder contains only: one `store.ts`, one `hooks.ts`, and one `[feature]-slice.ts` per feature
- [ ] Every slice file is **80 lines or fewer**
- [ ] Zero usages of raw `useDispatch` or `useSelector` remain — all replaced with `useAppDispatcher` / `useAppSelector`
- [ ] `tsc --noEmit` passes with 0 errors
- [ ] Metro bundler starts with no module-not-found errors
- [ ] iOS app builds and runs, looking and behaving identically to before

---

## 🚫 DO NOT

- Do not change any component's internal logic, props, or UI
- Do not touch `node_modules/`, `ios/`, `android/`, `.git/`
- Do not add new features or redesign anything
- Do not create a second `components` folder anywhere
- Do not delete any file before confirming it is safely copied to the new location
- ❌ Do NOT create `index.ts` or `index.tsx` files — not in any folder, not anywhere
- ❌ Do NOT write any file whose only content is re-exporting another file
