import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "@/config/network";

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
  }
}
