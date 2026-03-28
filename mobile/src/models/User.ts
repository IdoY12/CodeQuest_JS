export default interface User {
    id: string
    email: string
    username: string
    avatarUrl: string | null
    onboardingCompleted: boolean
    pathKey: "BEGINNER" | "ADVANCED"
    goal: "JOB" | "WORK" | "FUN" | "PROJECT" | null
    experienceLevel: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED" | null
    dailyCommitmentMinutes: number | null
    notificationsEnabled: boolean | null
}
