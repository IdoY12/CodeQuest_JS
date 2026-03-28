import { prisma } from "@project/db";

export async function applyXpReward(userId: string, xpToAdd: number) {
  const progress = await prisma.userProgress.findUnique({ where: { userId } }).catch(() => null);
  if (!progress) return;
  const nextXp = progress.xpTotal + xpToAdd;
  const nextLevel = Math.max(1, Math.floor(nextXp / 250) + 1);
  await prisma.userProgress
    .update({
      where: { userId },
      data: {
        xpTotal: nextXp,
        level: nextLevel,
      },
    })
    .catch(() => null);
}
