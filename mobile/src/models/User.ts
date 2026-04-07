export default interface User {
    id: string
    email: string
    username: string
    avatarUrl: string | null
    onboardingCompleted: boolean
    pathKey: "BEGINNER" | "ADVANCED"
    goal: "JOB" | "WORK" | "FUN" | "PROJECT" | null
    experienceLevel: "JUNIOR" | "MID" | "SENIOR" | null
    dailyCommitmentMinutes: number | null
    notificationsEnabled: boolean | null
}
