import { hydrateStreak } from "@/redux/streak-slice";
import type { AppDispatch } from "@/redux/store";
import UserService from "@/services/auth-aware/UserService";
import { getStreakCalendarDate } from "@/utils/streakCalendar";

/** Fetches progress summary (runs server streak app-open) and mirrors `streakCurrent` into Redux. */
export async function syncRegisteredStreakFromServer(dispatch: AppDispatch, _accessToken: string): Promise<void> {
  const progress = await new UserService().getProgressSummary(getStreakCalendarDate());
  dispatch(
    hydrateStreak({
      streakCurrent: progress.streakCurrent,
      lastActivityDate: null,
      lastCheckedDate: null,
    }),
  );
}
