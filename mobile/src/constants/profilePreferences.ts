export const goals = [
  { key: "JOB", label: "Land a dev job" },
  { key: "WORK", label: "Level up at work" },
  { key: "FUN", label: "Code for fun" },
  { key: "PROJECT", label: "Build a project" },
] as const;

export const levels = [
  { key: "BEGINNER", label: "Complete Beginner" },
  { key: "BASICS", label: "I Know the Basics" },
  { key: "INTERMEDIATE", label: "Intermediate" },
  { key: "ADVANCED", label: "Advanced" },
] as const;

export const commitmentOptions = [
  { key: "10", label: "10 min" },
  { key: "15", label: "15 min" },
  { key: "30", label: "30 min" },
] as const;
