export default interface UserPreferences {
    goal: "JOB" | "WORK" | "FUN" | "PROJECT"
    experienceLevel: "JUNIOR" | "MID" | "SENIOR"
    dailyCommitmentMinutes: 10 | 15 | 25
    notificationsEnabled: boolean
    pathKey: "JUNIOR" | "MID" | "SENIOR"
    hasCompletedOnboarding?: boolean
    userGoal?: "JOB" | "WORK" | "FUN" | "PROJECT" | null
    userLevel?: "JUNIOR" | "MID" | "SENIOR" | null
    dailyGoalMinutes?: 10 | 15 | 25 | null
}
