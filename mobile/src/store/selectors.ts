import { createSelector } from "reselect";
import type { RootState } from "./store";

const selectSession = (state: RootState) => state.session;
const selectProgress = (state: RootState) => state.progress;

export const selectHasHydrated = createSelector([selectSession], (s) => s.hasHydrated);
export const selectAuthChecked = createSelector([selectSession], (s) => s.authChecked);
export const selectIsAuthenticated = createSelector([selectSession], (s) => s.isAuthenticated);
export const selectIsGuest = createSelector([selectSession], (s) => s.isGuest);
export const selectHasCompletedOnboarding = createSelector([selectSession], (s) => s.hasCompletedOnboarding);
export const selectAccessToken = createSelector([selectSession], (s) => s.accessToken);
export const selectUsername = createSelector([selectSession], (s) => s.username);
export const selectEmail = createSelector([selectSession], (s) => s.email);
export const selectUserAvatarUrl = createSelector([selectSession], (s) => s.avatarUrl);
export const selectNotificationsEnabled = createSelector([selectSession], (s) => s.notificationsEnabled);
export const selectSessionPath = createSelector([selectSession], (s) => s.path);
export const selectExperience = createSelector([selectSession], (s) => s.experience);
export const selectGoal = createSelector([selectSession], (s) => s.goal);
export const selectCommitment = createSelector([selectSession], (s) => s.commitment);
export const selectSoundsEnabled = createSelector([selectSession], (s) => s.soundsEnabled);
export const selectHapticsEnabled = createSelector([selectSession], (s) => s.hapticsEnabled);
export const selectSessionUserIdentity = createSelector([selectSession], (s) => ({
  userId: s.userId,
  username: s.username,
  email: s.email,
  avatarUrl: s.avatarUrl,
}));

export const selectDuelRating = createSelector([selectProgress], (p) => p.duelRating);
export const selectXpTotal = createSelector([selectProgress], (p) => p.xpTotal);
export const selectLevel = createSelector([selectProgress], (p) => p.level);
export const selectStreakCurrent = createSelector([selectProgress], (p) => p.streakCurrent);
export const selectStreakDays = createSelector([selectProgress], (p) => p.streakDays);
export const selectLessonsCompleted = createSelector([selectProgress], (p) => p.lessonsCompleted);
export const selectDuelWins = createSelector([selectProgress], (p) => p.duelWins);
export const selectDuelLosses = createSelector([selectProgress], (p) => p.duelLosses);
export const selectDuelDraws = createSelector([selectProgress], (p) => p.duelDraws);
export const selectStreakShieldAvailable = createSelector([selectProgress], (p) => p.streakShieldAvailable);

export const selectXpMultiplier = createSelector([selectProgress], (p) => ({
  factor: p.xpMultiplierFactor,
  endsAt: p.xpMultiplierEndsAt,
}));

export const selectDailyPuzzleState = createSelector([selectProgress], (p) => ({
  lastDailyPuzzleSolvedDate: p.lastDailyPuzzleSolvedDate,
  puzzleSolvedIdByDate: p.puzzleSolvedIdByDate,
}));
