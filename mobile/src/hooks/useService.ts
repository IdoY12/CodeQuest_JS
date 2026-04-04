import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";

/** Stable service instances keyed to the current access token (inject via `getAccessToken`). */
export function useService<T>(Service: new (getToken: () => string | null) => T): T {
  const accessToken = useAppSelector((s) => s.session.accessToken);
  return useMemo(() => new Service(() => accessToken ?? null), [accessToken, Service]);
}
