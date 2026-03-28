export default interface DailyGoalStatus {
    goalMinutes: number
    practicedMinutes: number
    remainingMinutes: number
    streakShieldAvailable: boolean
    shieldConsumedToday: boolean
    canSendIncomplete: boolean
    canSendComplete: boolean
}
