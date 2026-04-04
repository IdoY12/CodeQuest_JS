import { prisma } from "@project/db";
import type { LearningPath, User, UserProgress } from "@prisma/client";

export type ProgressWithPath = UserProgress & { path: LearningPath };

export async function touchUserLastActive(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });
}

export async function ensureUserProgressForLogin(user: User): Promise<ProgressWithPath> {
  let progress = await prisma.userProgress.findUnique({
    where: { userId: user.id },
    include: { path: true },
  });
  if (!progress) {
    const defaultPath = await prisma.learningPath.findUnique({ where: { key: "BEGINNER" } });
    if (!defaultPath) {
      throw new Error("BEGINNER path not found");
    }
    progress = await prisma.userProgress.create({
      data: {
        userId: user.id,
        pathId: defaultPath.id,
        onboardingCompleted: false,
        dailyCommitmentMinutes: 15,
        notificationsEnabled: true,
      },
      include: { path: true },
    });
  }
  return progress;
}

export async function ensureDuelRatingRow(userId: string): Promise<void> {
  await prisma.duelRating.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}
