import { prisma } from "@project/db";
import { XP_POINTS_PER_LEVEL } from "../../constants/xpProgressConstants.js";
import type { ExerciseSubmitResponseDto } from "../../dto/exerciseSubmitResponseDto.js";

type SubmitInput = {
  userId: string;
  exerciseId: string;
  answer: string;
  timeTakenMs: number;
  attempts: number;
};

export async function applyExerciseSubmission(input: SubmitInput): Promise<ExerciseSubmitResponseDto | null> {
  const exercise = await prisma.exercise.findUnique({ where: { id: input.exerciseId } });
  if (!exercise) return null;
  const isCorrect =
    input.answer.trim().replace(/\s/g, "") === exercise.correctAnswer.trim().replace(/\s/g, "");
  await prisma.userExerciseHistory.create({
    data: {
      userId: input.userId,
      exerciseId: exercise.id,
      isCorrect,
      attempts: input.attempts,
      timeTakenMs: input.timeTakenMs,
    },
  });
  if (isCorrect) {
    const existingProgress = await prisma.userProgress.findUnique({ where: { userId: input.userId } });
    if (existingProgress) {
      const nextXp = existingProgress.xpTotal + exercise.xpReward;
      const nextLevel = Math.max(1, Math.floor(nextXp / XP_POINTS_PER_LEVEL) + 1);
      await prisma.userProgress.update({
        where: { userId: input.userId },
        data: { xpTotal: nextXp, level: nextLevel },
      });
    }
  }
  return isCorrect
    ? {
        isCorrect: true,
        xpEarned: exercise.xpReward,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
      }
    : { isCorrect: false, xpEarned: 0 };
}
