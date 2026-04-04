import * as SecureStore from "expo-secure-store";
import {
  SECURE_STORAGE_ACCESS_TOKEN_KEY,
  SECURE_STORAGE_REFRESH_TOKEN_KEY,
} from "@/constants/secureStorageKeyConstants";

export async function writeSecureSessionTokens(
  accessToken: string | null,
  refreshToken: string | null,
): Promise<void> {
  if (accessToken) {
    await SecureStore.setItemAsync(SECURE_STORAGE_ACCESS_TOKEN_KEY, accessToken);
  } else {
    await SecureStore.deleteItemAsync(SECURE_STORAGE_ACCESS_TOKEN_KEY).catch(() => undefined);
  }
  if (refreshToken) {
    await SecureStore.setItemAsync(SECURE_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await SecureStore.deleteItemAsync(SECURE_STORAGE_REFRESH_TOKEN_KEY).catch(() => undefined);
  }
}

export async function readSecureSessionTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(SECURE_STORAGE_ACCESS_TOKEN_KEY).catch(() => null),
    SecureStore.getItemAsync(SECURE_STORAGE_REFRESH_TOKEN_KEY).catch(() => null),
  ]);
  return { accessToken, refreshToken };
}

export async function clearSecureSessionTokens(): Promise<void> {
  await writeSecureSessionTokens(null, null);
}
