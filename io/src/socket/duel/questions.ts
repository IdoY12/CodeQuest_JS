import type { Difficulty, DuelQuestion } from "@prisma/client";
import { prisma } from "@project/db";
import type { SessionState } from "./types.js";

const LEVELS = new Set<string>(["JUNIOR", "MID", "SENIOR"]);

function asDifficulty(value: string): Difficulty | null {
  if (LEVELS.has(value)) return value as Difficulty;

  return null;
}

export async function pickRandomDuelQuestion(difficulty?: Difficulty): Promise<DuelQuestion | null> {
  // Two round trips (count + findFirst/skip): extra network latency on each duel round — slower in practice here than one fetch.
  // Raw SQL with ORDER BY RANDOM(): forbidden by ORM-only policy; also forces O(n log n) sort work in the database.
  // findMany + random index in JS: single Prisma round trip; duel pools are small (~40 rows per difficulty), so the payload cost beats a second query.
  const questions = await prisma.duelQuestion.findMany({
    where: difficulty !== undefined ? { difficulty } : undefined,
  });

  if (questions.length === 0) return null;

  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Picks duel question difficulty from both players' experience levels and current round.
 * Odd session.round → first band in each mixed pair; even → second (see product rules in task spec).
 */
export async function pickQuestionForSession(session: SessionState) {
  const p1 = asDifficulty(session.player1.experienceLevel);
  const p2 = asDifficulty(session.player2.experienceLevel);

  if (!p1 || !p2) {
    return pickRandomDuelQuestion();
  }

  const odd = session.round % 2 === 1;
  let targetDifficulty: Difficulty;

  if (p1 === p2) {
    targetDifficulty = p1;
  } else {
    const hasJunior = p1 === "JUNIOR" || p2 === "JUNIOR";
    const hasMid = p1 === "MID" || p2 === "MID";
    const hasSenior = p1 === "SENIOR" || p2 === "SENIOR";

    if (hasJunior && hasMid && !hasSenior) {
      targetDifficulty = odd ? "JUNIOR" : "MID";
    } else if (hasMid && hasSenior && !hasJunior) {
      targetDifficulty = odd ? "MID" : "SENIOR";
    } else if (hasJunior && hasSenior && !hasMid) {
      targetDifficulty = odd ? "JUNIOR" : "SENIOR";
    } else {
      return pickRandomDuelQuestion();
    }
  }

  let question = await pickRandomDuelQuestion(targetDifficulty);

  if (!question) {
    question = await pickRandomDuelQuestion();
  }

  return question;
}
