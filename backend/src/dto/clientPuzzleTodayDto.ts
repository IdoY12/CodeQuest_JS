export type DailyPuzzleDto = {
  id: number;
  prompt: string;
  orderIndex: number;
  totalCount: number;
  prevId: number | null;
  nextId: number | null;
};

export type DailyPuzzleSubmitDto = {
  correct: boolean;
};
