import type { PrismaClient, UserProgress } from "@prisma/client";
import {
  applyStreakOnAppOpen,
  applyStreakOnQualifyingXp,
  type DailyXpStreakPersisted,
} from "@project/streak-logic";
import { getProgressForActiveUser } from "./userProgressActive.js";

function progressToStreakState(row: UserProgress): DailyXpStreakPersisted {
  return {
    streakCount: row.streakCurrent,
    lastActivityDate: row.streakLastActivityDate,
    lastCheckedDate: row.streakLastCheckedDate,
  };
}

export async function handleStreakAppOpenForUser(
  prisma: PrismaClient,
  userId: string,
  todayLocalDate: string,
): Promise<number> {
  const progress = await getProgressForActiveUser(prisma, userId);
  if (!progress) return 0;
  const next = applyStreakOnAppOpen(progressToStreakState(progress), todayLocalDate);
  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      streakCurrent: next.streakCount,
      streakLastActivityDate: next.lastActivityDate,
      streakLastCheckedDate: next.lastCheckedDate,
    },
  });
  return next.streakCount;
}

export async function handleStreakQualifyingXpForUser(
  prisma: PrismaClient,
  userId: string,
  todayLocalDate: string,
  xpEarned: number,
): Promise<number> {
  if (xpEarned <= 0) {
    const progress = await getProgressForActiveUser(prisma, userId);
    return progress?.streakCurrent ?? 0;
  }
  const progress = await getProgressForActiveUser(prisma, userId);
  if (!progress) return 0;
  const next = applyStreakOnQualifyingXp(progressToStreakState(progress), todayLocalDate);
  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      streakCurrent: next.streakCount,
      streakLastActivityDate: next.lastActivityDate,
      streakLastCheckedDate: next.lastCheckedDate,
    },
  });
  return next.streakCount;
}
