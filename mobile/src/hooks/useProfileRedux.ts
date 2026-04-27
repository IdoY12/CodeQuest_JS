import { useAppSelector } from "@/redux/hooks";

export function useProfileRedux() {
  const username = useAppSelector((s) => s.profile.username);
  const email = useAppSelector((s) => s.profile.email);
  const avatarUrl = useAppSelector((s) => s.profile.avatarUrl);
  const level = useAppSelector((s) => s.xp.level);
  const xp = useAppSelector((s) => s.xp.xpTotal);
  const streakCurrent = useAppSelector((s) => s.streak.streakCurrent);
  const lessonsCompleted = useAppSelector((s) => s.duel.lessonsCompleted);
  const duelWins = useAppSelector((s) => s.duel.duelWins);
  const duelLosses = useAppSelector((s) => s.duel.duelLosses);
  const goal = useAppSelector((s) => s.profile.goal);
  const experienceLevel = useAppSelector((s) => s.profile.experienceLevel);
  const commitment = useAppSelector((s) => s.profile.commitment);
  const notificationsEnabled = useAppSelector((s) => s.profile.notificationsEnabled);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const refreshToken = useAppSelector((s) => s.session.refreshToken);
  const studySecondsToday = useAppSelector((s) => s.session.studySecondsToday);

  const studyMinutesToday = Math.floor(studySecondsToday / 60);
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
    goal,
    experienceLevel,
    commitment,
    notificationsEnabled,
    accessToken,
    refreshToken,
    duelWinRate,
    studyMinutesToday,
  };
}

export type ProfileReduxState = ReturnType<typeof useProfileRedux>;
