import axios from "axios";
import { API_BASE_URL } from "@/config/network";
import type AuthResponse from "@/models/AuthResponse";

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === "object" && "error" in error.response.data) {
    return String((error.response.data as { error: unknown }).error);
  }
  return error instanceof Error ? error.message : "Unable to continue";
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password });
    return data;
  }

  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    try {
      const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, { email, username, password });
      return data;
    } catch (e) {
      throw new Error(apiErrorMessage(e));
    }
  }

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    try {
      const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/google`, { idToken });
      return data;
    } catch (e) {
      throw new Error(apiErrorMessage(e));
    }
  }
}

const authService = new AuthService();
export default authService;
