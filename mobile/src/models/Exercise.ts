export default interface Exercise {
  id: string;
  experienceLevel: "JUNIOR" | "MID" | "SENIOR";
  orderIndex: number;
  sectionLabel: string | null;
  type: "CONCEPT_CARD" | "MULTIPLE_CHOICE" | "FIND_THE_BUG" | "LINE_ORDERING" | "CODE_FILL" | "TAP_TOKEN";
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string | null;
  xpReward: number;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
}
