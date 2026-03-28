export type ApiChapter = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
};

export type ApiLesson = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  orderIndex: number;
};

export type ExerciseType =
  | "CONCEPT_CARD"
  | "MULTIPLE_CHOICE"
  | "FIND_THE_BUG"
  | "DRAG_DROP"
  | "CODE_FILL"
  | "TAP_TOKEN";

export type ApiExercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string;
  xpReward: number;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
};
