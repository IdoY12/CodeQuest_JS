export default interface UserPreferences {
  goal: "JOB" | "WORK" | "FUN" | "PROJECT";
  experienceLevel: "JUNIOR" | "MID" | "SENIOR";
  dailyCommitmentMinutes: 10 | 15 | 25;
  notificationsEnabled: boolean;
}
