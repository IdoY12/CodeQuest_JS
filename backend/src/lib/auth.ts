import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "30d" });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as AuthTokenPayload;
}
