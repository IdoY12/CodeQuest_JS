import type { AppDispatch } from "@/redux/store";
import UserService from "@/services/UserService";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";

export async function confirmLogout(
  dispatch: AppDispatch,
  accessToken: string | null,
  refreshToken: string | null,
): Promise<void> {
  try {
    if (accessToken) {
      await new UserService(accessToken).logout(refreshToken ?? "");
    }
  } catch {
    // Still clear local session if the network call fails.
  } finally {
    resetStoresAfterLogout(dispatch);
  }
}
