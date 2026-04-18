import axios from "axios";
import { API_BASE_URL } from "@/config/network";
import type AuthResponse from "@/models/AuthResponse";

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password });
    return data;
  }

  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, { email, username, password });
    return data;
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const { data } = await axios.post<{ accessToken: string }>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    return data;
  }
}

const authService = new AuthService();
export default authService;
