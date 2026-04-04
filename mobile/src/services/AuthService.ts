import { AuthAware } from "@/services/AuthAware";
import type AuthMeResponse from "@/models/AuthMeResponse";
import type AuthResponse from "@/models/AuthResponse";

export default class AuthService extends AuthAware {
  constructor(getAccessToken: () => string | null = () => null) {
    super(getAccessToken);
  }

  getMe() {
    return this.getJson<AuthMeResponse>("/auth/me");
  }

  login(email: string, password: string) {
    return this.postPublicJson<AuthResponse>("/auth/login", { email, password });
  }

  register(email: string, username: string, password: string) {
    return this.postPublicJson<AuthResponse>("/auth/register", { email, username, password });
  }

  logout(accessToken: string | null, refreshToken: string | null) {
    return this.postWithOptionalAuthToken<{ ok: boolean }>(
      "/auth/logout",
      { refreshToken: refreshToken ?? "" },
      accessToken,
    );
  }
}
