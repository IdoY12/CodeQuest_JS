/** Response from GET /auth/me (subset of fields returned by the server). */
export default interface AuthMeResponse {
    id: string
    email: string
    username: string
    avatarUrl: string | null
}
