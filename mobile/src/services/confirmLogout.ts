import type { AppDispatch } from "@/redux/store";
import AuthService from "@/services/AuthService";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";

export async function confirmLogout(
  dispatch: AppDispatch,
  accessToken: string | null,
  refreshToken: string | null,
): Promise<void> {
  try {
    await new AuthService(() => accessToken).logout(accessToken, refreshToken);
  } catch {
    // Still clear local session if the network call fails.
  } finally {
    resetStoresAfterLogout(dispatch);
  }
}
