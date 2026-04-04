import { readSecureSessionTokens, writeSecureSessionTokens } from "./secureSessionTokens";

export async function mergeHydratedSessionTokens<T extends Record<string, unknown>>(
  session: T,
): Promise<T & { accessToken: string | null; refreshToken: string | null }> {
  const secure = await readSecureSessionTokens();
  const accessToken = secure.accessToken ?? (session.accessToken as string | null | undefined) ?? null;
  const refreshToken = secure.refreshToken ?? (session.refreshToken as string | null | undefined) ?? null;
  await writeSecureSessionTokens(accessToken, refreshToken);
  return { ...session, accessToken, refreshToken };
}
