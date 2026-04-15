import { ensureProgressRow, prisma } from "@project/db";
import { XP_POINTS_PER_LEVEL } from "@project/xp-constants";
import type { ExerciseSubmitResponseDto } from "../../dto/exerciseSubmitResponseDto.js";

type SubmitInput = {
  userId: string;
  exerciseId: string;
  answer: string;
};

export async function applyExerciseSubmission(input: SubmitInput): Promise<ExerciseSubmitResponseDto | null> {
  const exercise = await prisma.exercise.findUnique({ where: { id: input.exerciseId } });

  if (!exercise) return null;
  const isCorrect =
    input.answer.trim().replace(/\s/g, "") === exercise.correctAnswer.trim().replace(/\s/g, "");

  if (isCorrect) {
    await ensureProgressRow(prisma, input.userId, exercise.experienceLevel);
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_experienceLevel: { userId: input.userId, experienceLevel: exercise.experienceLevel },
      },
    });

    if (progress) {
      const nextXp = progress.xpTotal + XP_POINTS_PER_LEVEL;
      const nextLevel = Math.max(1, Math.floor(nextXp / XP_POINTS_PER_LEVEL) + 1);
      const nextIdx = Math.max(progress.currentExerciseIndex, exercise.orderIndex + 1);
      await prisma.userProgress.update({
        where: { id: progress.id },
        data: { xpTotal: nextXp, level: nextLevel, currentExerciseIndex: nextIdx },
      });
    }
  }

  // Always include correctAnswer and explanation so the client can reveal the correct
  // option in green and show the explanation regardless of whether the attempt was right.
  return {
    isCorrect,
    xpEarned: isCorrect ? XP_POINTS_PER_LEVEL : 0,
    correctAnswer: exercise.correctAnswer,
    explanation: exercise.explanation,
  };
}
