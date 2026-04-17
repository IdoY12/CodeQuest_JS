import type { ExperienceLevel, PrismaClient } from "@prisma/client";

export function resolveExperienceLevel(level: ExperienceLevel | null | undefined): ExperienceLevel {
  return level ?? "JUNIOR";
}

export async function activeExperienceLevelOf(prisma: PrismaClient, userId: string): Promise<ExperienceLevel> {
  const userRecord = await prisma.user.findUnique({ where: { id: userId }, select: { activeExperienceLevel: true } });

  return userRecord?.activeExperienceLevel ?? "JUNIOR";
}

export async function getProgressForActiveUser(prisma: PrismaClient, userId: string) {
  const level = await activeExperienceLevelOf(prisma, userId);

  return prisma.userProgress.findUnique({
    where: { userId_experienceLevel: { userId, experienceLevel: level } },
  });
}

export async function ensureProgressRow(
  prisma: PrismaClient,
  userId: string,
  experienceLevel: ExperienceLevel,
): Promise<void> {
  await prisma.userProgress.upsert({
    where: { userId_experienceLevel: { userId, experienceLevel } },
    create: {
      userId,
      experienceLevel,
      dailyCommitmentMinutes: 15,
      notificationsEnabled: true,
    },
    update: {},
  });
}

