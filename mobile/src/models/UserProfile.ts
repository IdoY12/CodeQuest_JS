export default interface UserProfile {
    id: string
    email: string
    username: string
    avatarUrl: string | null
    progress: {
        goal: "JOB" | "WORK" | "FUN" | "PROJECT" | null
        experienceLevel: "JUNIOR" | "MID" | "SENIOR" | null
        dailyCommitmentMinutes: 10 | 15 | 25 | null
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
