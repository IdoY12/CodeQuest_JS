export default interface UserPreferences {
    goal: "JOB" | "WORK" | "FUN" | "PROJECT"
    experienceLevel: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED"
    dailyCommitmentMinutes: 10 | 15 | 30
    notificationsEnabled: boolean
    pathKey: "BEGINNER" | "ADVANCED"
    hasCompletedOnboarding?: boolean
    userGoal?: "JOB" | "WORK" | "FUN" | "PROJECT" | null
    userLevel?: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED" | null
    dailyGoalMinutes?: 10 | 15 | 30 | null
}
