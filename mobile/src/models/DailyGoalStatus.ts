export default interface DailyGoalStatus {
    goalMinutes: number
    practicedMinutes: number
    remainingMinutes: number
    canSendIncomplete: boolean
    canSendComplete: boolean
}
