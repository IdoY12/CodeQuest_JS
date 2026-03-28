export default interface UserProfile {
    id: string
    email: string
    username: string
    avatarUrl: string | null
    progress: {
        goal: "JOB" | "WORK" | "FUN" | "PROJECT" | null
        experienceLevel: "BEGINNER" | "BASICS" | "INTERMEDIATE" | "ADVANCED" | null
        dailyCommitmentMinutes: 10 | 15 | 30 | null
        notificationsEnabled: boolean
        onboardingCompleted: boolean
    } | null
    duelRating: {
        rating: number
        wins: number
        losses: number
        draws: number
    } | null
}
