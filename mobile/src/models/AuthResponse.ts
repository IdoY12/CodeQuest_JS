import type User from "./User"

export default interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}
