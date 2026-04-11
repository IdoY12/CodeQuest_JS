/** Response from GET /user/preferences (differs from PATCH body/response field names). */
export default interface UserPreferencesGet {
    hasCompletedOnboarding: boolean
    userGoal: "JOB" | "WORK" | "FUN" | "PROJECT" | null
    userLevel: "JUNIOR" | "MID" | "SENIOR" | null
    dailyGoalMinutes: 10 | 15 | 25 | null
    notificationsEnabled: boolean
    pathKey: "JUNIOR" | "MID" | "SENIOR"
}
