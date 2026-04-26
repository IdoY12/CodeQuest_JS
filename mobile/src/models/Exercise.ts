export default interface Exercise {
  id: string;
  type: "MCQ" | "PUZZLE";
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
  explanation: string | null;
  options: Array<{ text: string }>;
}
