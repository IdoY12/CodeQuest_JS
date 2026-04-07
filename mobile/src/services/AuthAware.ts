import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/config/network";
import store from "@/redux/store";
import { resetStoresAfterLogout } from "@/utils/resetStoresAfterLogout";
import { readSecureSessionTokens, writeSecureSessionTokens } from "@/utils/secureSessionTokens";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export default abstract class AuthAware {
  protected axiosInstance: AxiosInstance;

  constructor(jwt: string) {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) throw error;
        const status = error.response?.status;
        const config = error.config as RetryableConfig | undefined;
        if (status !== 401 || !config || config._retry) throw error;
        config._retry = true;
        const secure = await readSecureSessionTokens();
        const refreshToken = secure.refreshToken;
        if (!refreshToken) {
          resetStoresAfterLogout(store.dispatch);
          throw error;
        }
        try {
          const refreshResponse = await axios.post<{ accessToken: string }>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const nextAccessToken = refreshResponse.data.accessToken;
          await writeSecureSessionTokens(nextAccessToken, refreshToken);
          config.headers = { ...config.headers, Authorization: `Bearer ${nextAccessToken}` };
          return this.axiosInstance.request(config);
        } catch {
          resetStoresAfterLogout(store.dispatch);
          throw error;
        }
      },
    );
  }
}
