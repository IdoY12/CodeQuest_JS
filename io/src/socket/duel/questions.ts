import type { Difficulty } from "@prisma/client";
import { prisma } from "@project/db";
import type { SessionState } from "./types.js";

export async function pickRandomDuelQuestion(difficulty?: Difficulty) {
  const total = await prisma.duelQuestion.count({
    where: difficulty !== undefined ? { difficulty } : undefined,
  });
  if (total === 0) return null;
  const skip = Math.floor(Math.random() * total);
  return prisma.duelQuestion.findFirst({
    where: difficulty !== undefined ? { difficulty } : undefined,
    skip,
    orderBy: { id: "asc" },
  });
}

export async function pickQuestionForSession(session: SessionState) {
  const p1Exp = session.player1.experienceLevel;
  const p2Exp = session.player2.experienceLevel;
  const beginnerLike = ["BEGINNER", "BASICS", "INTERMEDIATE"];
  const p1IsBeginnerLike = beginnerLike.includes(p1Exp);
  const p2IsBeginnerLike = beginnerLike.includes(p2Exp);

  const targetDifficulty: Difficulty =
    p1IsBeginnerLike && p2IsBeginnerLike
      ? "BEGINNER"
      : !p1IsBeginnerLike && !p2IsBeginnerLike
        ? "ADVANCED"
        : session.round % 2 === 0
          ? "ADVANCED"
          : "BEGINNER";

  let q = await pickRandomDuelQuestion(targetDifficulty);
  if (!q) {
    q = await pickRandomDuelQuestion();
  }
  return q;
}
