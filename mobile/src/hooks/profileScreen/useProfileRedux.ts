import { useAppSelector } from "../../store/hooks";
import {
  selectAccessToken,
  selectCommitment,
  selectDuelLosses,
  selectDuelRating,
  selectDuelWins,
  selectEmail,
  selectExperience,
  selectGoal,
  selectHapticsEnabled,
  selectLessonsCompleted,
  selectLevel,
  selectNotificationsEnabled,
  selectSoundsEnabled,
  selectStreakCurrent,
  selectStreakShieldAvailable,
  selectUsername,
  selectUserAvatarUrl,
  selectXpTotal,
} from "../../store/selectors";

export function useProfileRedux() {
  const username = useAppSelector(selectUsername);
  const email = useAppSelector(selectEmail);
  const avatarUrl = useAppSelector(selectUserAvatarUrl);
  const level = useAppSelector(selectLevel);
  const xp = useAppSelector(selectXpTotal);
  const streakCurrent = useAppSelector(selectStreakCurrent);
  const lessonsCompleted = useAppSelector(selectLessonsCompleted);
  const duelWins = useAppSelector(selectDuelWins);
  const duelLosses = useAppSelector(selectDuelLosses);
  const duelRating = useAppSelector(selectDuelRating);
  const streakShieldAvailable = useAppSelector(selectStreakShieldAvailable);
  const goal = useAppSelector(selectGoal);
  const experience = useAppSelector(selectExperience);
  const commitment = useAppSelector(selectCommitment);
  const notificationsEnabled = useAppSelector(selectNotificationsEnabled);
  const soundsEnabled = useAppSelector(selectSoundsEnabled);
  const hapticsEnabled = useAppSelector(selectHapticsEnabled);
  const accessToken = useAppSelector(selectAccessToken);
  const duelTotal = duelWins + duelLosses;
  const duelWinRate = duelTotal > 0 ? `${Math.round((duelWins / duelTotal) * 100)}%` : "0%";
  return {
    username,
    email,
    avatarUrl,
    level,
    xp,
    streakCurrent,
    lessonsCompleted,
    duelWins,
    duelLosses,
    duelRating,
    streakShieldAvailable,
    goal,
    experience,
    commitment,
    notificationsEnabled,
    soundsEnabled,
    hapticsEnabled,
    accessToken,
    duelWinRate,
  };
}
