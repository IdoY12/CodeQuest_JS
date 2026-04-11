import { prisma } from "@project/db";
import type { User, UserProgress } from "@prisma/client";
import { activeExperienceLevelOf, ensureProgressRow } from "@project/db";

export async function touchUserLastActive(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });
}

export async function ensureUserProgressForLogin(user: User): Promise<UserProgress> {
  let level = await activeExperienceLevelOf(prisma, user.id);
  if (!user.activeExperienceLevel) {
    await prisma.user.update({
      where: { id: user.id },
      data: { activeExperienceLevel: "JUNIOR" },
    });
    level = "JUNIOR";
  }
  await ensureProgressRow(prisma, user.id, level);
  const progress = await prisma.userProgress.findUniqueOrThrow({
    where: { userId_experienceLevel: { userId: user.id, experienceLevel: level } },
  });
  return progress;
}

export async function ensureDuelRatingRow(userId: string): Promise<void> {
  await prisma.duelRating.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}
