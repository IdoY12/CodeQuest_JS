import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";

/** Domain service bound to the current JWT, or null when logged out. */
export function useAuthenticatedService<T>(Service: new (jwt: string) => T): T | null {
  const accessToken = useAppSelector((s) => s.session.accessToken);
  return useMemo(() => (accessToken ? new Service(accessToken) : null), [accessToken, Service]);
}
