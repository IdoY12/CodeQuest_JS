import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken";
function requireJwtAccessSecret() {
    const value = config.get("app.jwtAccessSecret");
    if (!value?.trim()) {
        throw new Error("JWT_ACCESS_SECRET must be configured");
    }
    return value.trim();
}
function requireJwtRefreshSecret() {
    const value = config.get("app.jwtRefreshSecret");
    if (!value?.trim()) {
        throw new Error("JWT_REFRESH_SECRET must be configured");
    }
    return value.trim();
}
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export function signAccessToken(payload) {
    return jwt.sign(payload, requireJwtAccessSecret(), { expiresIn: "15m" });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, requireJwtRefreshSecret(), { expiresIn: "30d" });
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
export function verifyRefreshToken(token) {
    const payload = jwt.verify(token, requireJwtRefreshSecret());
    if (typeof payload !== "object" || payload === null) {
        throw new Error("Invalid refresh token payload");
    }
    if (typeof payload.userId !== "string" || typeof payload.email !== "string" || typeof payload.tokenVersion !== "number") {
        throw new Error("Invalid refresh token shape");
    }
    return { userId: payload.userId, email: payload.email, tokenVersion: payload.tokenVersion };
}
