import type { Commitment, Experience, Goal } from "@/redux/profile-slice";

export const ONBOARDING_GOALS: { key: Goal; title: string; subtitle: string }[] = [
  { key: "JOB", title: "Land a dev job", subtitle: "Build skills that get you hired" },
  { key: "WORK", title: "Level up at work", subtitle: "I am already coding. Let us go deeper." },
  { key: "FUN", title: "Code for fun", subtitle: "Explore JS as a hobby" },
  { key: "PROJECT", title: "Build a project", subtitle: "I have something specific in mind" },
];

export const ONBOARDING_LEVELS: { key: Experience; title: string; subtitle: string }[] = [
  { key: "BEGINNER", title: "Complete Beginner", subtitle: "Never written a line of code" },
  { key: "BASICS", title: "I know the basics", subtitle: "Variables, functions, maybe loops" },
  { key: "INTERMEDIATE", title: "Intermediate", subtitle: "I build things, but have gaps" },
  { key: "ADVANCED", title: "Advanced", subtitle: "I want real challenges and depth" },
];

export const ONBOARDING_COMMITMENTS: { key: Commitment; title: string; subtitle: string }[] = [
  { key: "10", title: "10 min", subtitle: "Quick daily habit" },
  { key: "15", title: "15 min", subtitle: "Steady progress" },
  { key: "30", title: "30 min", subtitle: "Fast track" },
];
