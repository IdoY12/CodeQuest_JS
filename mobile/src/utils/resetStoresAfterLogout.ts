import type { AppDispatch } from "@/redux/store";
import { signOut } from "@/redux/session-slice";
import { resetProfile } from "@/redux/profile-slice";
import { resetXp } from "@/redux/xp-slice";
import { resetStreak } from "@/redux/streak-slice";
import { resetLesson } from "@/redux/lesson-slice";
import { resetStats } from "@/redux/duel-slice";
import { hydratePuzzle } from "@/redux/puzzle-slice";
import { clearSecureSessionTokens } from "@/utils/secureSessionTokens";

export function resetStoresAfterLogout(dispatch: AppDispatch): void {
  void clearSecureSessionTokens();
  dispatch(signOut());
  dispatch(resetProfile());
  dispatch(resetXp());
  dispatch(resetStreak());
  dispatch(resetLesson());
  dispatch(resetStats());
  dispatch(hydratePuzzle({ lastCodePuzzleSolvedDate: null, puzzleSolvedIdByDate: {} }));
}
