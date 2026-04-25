import { ensureProgressRow, handleStreakQualifyingXpForUser, prisma } from "@project/db";
import { normaliseExerciseAnswer } from "@project/exercise-answer";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import type { ExerciseSubmitResponseDto } from "../../dto/exerciseSubmitResponseDto.js";

const dateKeyRegex = /^\d{4}-\d{2}-\d{2}$/;

type SubmitInput = {
  userId: string;
  exerciseId: string;
  answer: string;
  /** Client local calendar date (YYYY-MM-DD) for streak; required when persisting qualifying XP. */
  clientLocalDate?: string;
};

export async function applyExerciseSubmission(input: SubmitInput): Promise<ExerciseSubmitResponseDto | null> {
  const exercise = await prisma.exercise.findUnique({ where: { id: input.exerciseId } });

  if (!exercise) return null;
  const isCorrect =
    normaliseExerciseAnswer(input.answer) === normaliseExerciseAnswer(exercise.correctAnswer);

  let streakCurrent: number | undefined;

  if (isCorrect) {
    await ensureProgressRow(prisma, input.userId, exercise.experienceLevel);
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_experienceLevel: { userId: input.userId, experienceLevel: exercise.experienceLevel },
      },
    });

    if (progress) {
      const nextXp = progress.xpTotal + XP_PER_CORRECT_EXERCISE;
      const nextLevel = Math.max(1, Math.floor(nextXp / XP_PER_CORRECT_EXERCISE) + 1);
      const nextIdx = Math.max(progress.currentExerciseIndex, exercise.orderIndex + 1);
      await prisma.userProgress.update({
        where: { id: progress.id },
        data: { xpTotal: nextXp, level: nextLevel, currentExerciseIndex: nextIdx },
      });
      if (input.clientLocalDate && dateKeyRegex.test(input.clientLocalDate)) {
        streakCurrent = await handleStreakQualifyingXpForUser(
          prisma,
          input.userId,
          input.clientLocalDate,
          XP_PER_CORRECT_EXERCISE,
        );
      } else {
        streakCurrent = (await prisma.userProgress.findUnique({ where: { id: progress.id } }))?.streakCurrent;
      }
    }
  }

  return {
    xpEarned: isCorrect ? XP_PER_CORRECT_EXERCISE : 0,
    explanation: exercise.explanation,
    ...(streakCurrent !== undefined ? { streakCurrent } : {}),
  };
}
