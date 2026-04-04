import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";

/** Non-React entry points (bootstrap, logout) build paired services from the same token accessor. */
export function servicesForSession(getToken: () => string | null) {
  return { auth: new AuthService(getToken), user: new UserService(getToken) };
}
