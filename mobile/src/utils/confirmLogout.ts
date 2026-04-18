import type { AppDispatch } from "@/redux/store";
import UserService from "@/services/auth-aware/UserService";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";

export async function confirmLogout(
  dispatch: AppDispatch,
  accessToken: string | null,
  refreshToken: string | null,
): Promise<void> {
  try {
    if (accessToken) {
      await new UserService().logout(refreshToken ?? "");
    }
  } catch {
    // Still clear local session if the network call fails.
  } finally {
    resetStoresAfterLogout(dispatch);
  }
}
