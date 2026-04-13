/**
 * Updates streak counters on user progress after a practice log write.
 *
 * Responsibility: isolate streak shield and day-gap rules from HTTP handler.
 * Layer: backend user HTTP handlers
 * Consumers: postPracticeLogHandler
 */

import type { ExperienceLevel, PrismaClient } from "@prisma/client";

type ProgressStreakFields = {
  streakCurrent: number;
  streakLastDate: Date | null;
  streakLongest: number;
};

export async function applyStreakAfterPracticeLog(
  prisma: PrismaClient,
  userId: string,
  experienceLevel: ExperienceLevel,
  dateKey: string,
  progress: ProgressStreakFields,
): Promise<void> {
  const today = new Date(dateKey);
  const streakLastDate = progress.streakLastDate ? new Date(progress.streakLastDate) : null;
  const msInDay = 1000 * 60 * 60 * 24;
  const daysBetween = streakLastDate ? Math.floor((today.getTime() - streakLastDate.getTime()) / msInDay) : null;

  let nextStreak = progress.streakCurrent;

  if (daysBetween === null || daysBetween <= 0) {
    nextStreak = Math.max(1, progress.streakCurrent);
  } else if (daysBetween === 1) {
    nextStreak = progress.streakCurrent + 1;
  } else if (daysBetween > 1) {
    nextStreak = 1;
  }

  await prisma.userProgress.update({
    where: { userId_experienceLevel: { userId, experienceLevel } },
    data: {
      streakCurrent: nextStreak,
      streakLongest: Math.max(progress.streakLongest, nextStreak),
      streakLastDate: today,
    },
  });
}
