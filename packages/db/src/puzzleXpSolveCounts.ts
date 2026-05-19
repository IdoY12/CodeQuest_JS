import type { Prisma, PrismaClient } from "@prisma/client";
import {
  levelFromXpTotal,
  nextPuzzleXpSolveCounts,
  type PuzzleXpSolveCounts,
  XP_PER_CORRECT_EXERCISE,
} from "@project/xp-constants";
import { activeExperienceLevelOf, ensureProgressRow, getProgressForActiveUser, type DbClient } from "./userProgressActive.js";
import { handleStreakQualifyingXpForUser } from "./userStreak.js";

export function parsePuzzleXpSolveCounts(raw: Prisma.JsonValue | null | undefined): PuzzleXpSolveCounts {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([, value]) => typeof value === "number" && Number.isFinite(value) && value >= 0)
      .map(([key, value]) => [key, Math.floor(value as number)]),
  );
}

export type AuthenticatedPuzzleSolveResult = {
  puzzleSolveCount: number;
  xpEarned?: number;
  xpTotal?: number;
  streakCurrent?: number;
};

export async function applyAuthenticatedPuzzleSolve(
  prisma: PrismaClient,
  userId: string,
  puzzleId: number,
  clientLocalDate: string | undefined,
): Promise<AuthenticatedPuzzleSolveResult> {
  return prisma.$transaction(async (tx: DbClient) => {
    const user = await tx.user.findUnique({ where: { id: userId }, select: { puzzleXpSolveCounts: true } });
    const { counts, countAfter, grantXp } = nextPuzzleXpSolveCounts(
      parsePuzzleXpSolveCounts(user?.puzzleXpSolveCounts),
      puzzleId,
    );
    await tx.user.update({ where: { id: userId }, data: { puzzleXpSolveCounts: counts } });
    if (!clientLocalDate) return { puzzleSolveCount: countAfter };

    const level = await activeExperienceLevelOf(tx, userId);
    await ensureProgressRow(tx, userId, level);
    const progress = await getProgressForActiveUser(tx, userId);
    if (!progress) return { puzzleSolveCount: countAfter, xpEarned: 0 };

    const xpEarned = grantXp ? XP_PER_CORRECT_EXERCISE : 0;
    let xpTotal = progress.xpTotal;
    if (grantXp) {
      xpTotal = progress.xpTotal + XP_PER_CORRECT_EXERCISE;
      await tx.userProgress.update({
        where: { id: progress.id },
        data: { xpTotal, level: levelFromXpTotal(xpTotal) },
      });
    }
    const streakCurrent = await handleStreakQualifyingXpForUser(
      tx,
      userId,
      clientLocalDate,
      grantXp ? XP_PER_CORRECT_EXERCISE : 0,
    );
    return { puzzleSolveCount: countAfter, xpEarned, xpTotal, streakCurrent };
  });
}
