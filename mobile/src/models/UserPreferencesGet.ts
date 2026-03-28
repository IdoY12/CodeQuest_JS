/** Response from GET /user/preferences (differs from PATCH body/response field names). */
export default interface UserPreferencesGet {
    hasCompletedOnboarding: boolean
    userGoal: "JOB" | "WORK" | "FUN" | "PROJECT" | null
    userLevel: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED" | null
    dailyGoalMinutes: 10 | 15 | 30 | null
    notificationsEnabled: boolean
    pathKey: "BEGINNER" | "ADVANCED"
}
