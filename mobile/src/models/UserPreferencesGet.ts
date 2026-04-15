/** Response from GET /user/preferences (field names differ from PATCH body). */
export default interface UserPreferencesGet {
  userGoal: "JOB" | "WORK" | "FUN" | "PROJECT" | null;
  experienceLevel: "JUNIOR" | "MID" | "SENIOR";
  dailyGoalMinutes: 10 | 15 | 25 | null;
  notificationsEnabled: boolean;
}
