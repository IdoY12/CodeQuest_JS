import * as SecureStore from "expo-secure-store";
import {
  SECURE_STORAGE_ACCESS_TOKEN_KEY,
  SECURE_STORAGE_REFRESH_TOKEN_KEY,
} from "@/constants/secureStorageKeyConstants";

/**
 * Saves or deletes tokens in the device's hardware-encrypted storage.
 */
export async function writeSecureSessionTokens(
  accessToken: string | null,
  refreshToken: string | null,
): Promise<void> {
  // If an accessToken exists, save it. Otherwise, attempt to delete it.
  if (accessToken) {
    await SecureStore.setItemAsync(SECURE_STORAGE_ACCESS_TOKEN_KEY, accessToken);
  } else {
    // We use .catch() to ignore errors if the key was already missing.
    await SecureStore.deleteItemAsync(SECURE_STORAGE_ACCESS_TOKEN_KEY).catch(() => undefined);
  }

  if (refreshToken) {
    await SecureStore.setItemAsync(SECURE_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await SecureStore.deleteItemAsync(SECURE_STORAGE_REFRESH_TOKEN_KEY).catch(() => undefined);
  }
}

/**
 * Fetches tokens from the secure vault.
 */
export async function readSecureSessionTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  // Promise.all runs both fetches at the same time to save time.
  const [accessToken, refreshToken] = await Promise.all([
    // If the vault is empty or locked, we return 'null' instead of crashing the app.
    SecureStore.getItemAsync(SECURE_STORAGE_ACCESS_TOKEN_KEY).catch(() => null),
    SecureStore.getItemAsync(SECURE_STORAGE_REFRESH_TOKEN_KEY).catch(() => null),
  ]);
  return { accessToken, refreshToken };
}

export async function clearSecureSessionTokens(): Promise<void> {
  await writeSecureSessionTokens(null, null);
}
