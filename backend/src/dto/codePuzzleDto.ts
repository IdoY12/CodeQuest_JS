export type CodePuzzleDto = {
  id: number;
  prompt: string;
  orderIndex: number;
};

export type CodePuzzleSubmitDto = {
  correct: boolean;
};
