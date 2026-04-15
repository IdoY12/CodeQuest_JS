import { XP_POINTS_PER_LEVEL } from "@project/xp-constants";
import { activeExperienceLevelOf, prisma } from "@project/db";

export async function applyXpReward(userId: string, xpToAdd: number) {
  const level = await activeExperienceLevelOf(prisma, userId);
  const progress = await prisma.userProgress
    .findUnique({ where: { userId_experienceLevel: { userId, experienceLevel: level } } })
    .catch(() => null);

  if (!progress) return;

  const nextXp = progress.xpTotal + xpToAdd;
  const nextLevel = Math.max(1, Math.floor(nextXp / XP_POINTS_PER_LEVEL) + 1);
  await prisma.userProgress
    .update({
      where: { id: progress.id },
      data: {
        xpTotal: nextXp,
        level: nextLevel,
      },
    })
    .catch(() => null);
}
