import config from "config";
import jwt from "jsonwebtoken";
function requireJwtAccessSecret() {
    const value = config.get("app.jwtAccessSecret");
    if (!value?.trim()) {
        throw new Error("JWT_ACCESS_SECRET must be configured");
    }
    return value.trim();
}
export function verifyAccessToken(token) {
    const payload = jwt.verify(token, requireJwtAccessSecret());
    if (typeof payload !== "object" || payload === null) {
        throw new Error("Invalid access token payload");
    }
    if (typeof payload.userId !== "string" || typeof payload.email !== "string" || typeof payload.tokenVersion !== "number") {
        throw new Error("Invalid access token shape");
    }
    return { userId: payload.userId, email: payload.email, tokenVersion: payload.tokenVersion };
}
