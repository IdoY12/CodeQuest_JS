/** Rejects duplicate socket event calls arriving faster than minIntervalMs. */
const lastCallMap = new WeakMap<object, Map<string, number>>();

export function isThrottled(socket: object, event: string, minIntervalMs: number): boolean {
  if (!lastCallMap.has(socket)) lastCallMap.set(socket, new Map());
  const events = lastCallMap.get(socket)!;
  const now = Date.now();
  const last = events.get(event) ?? 0;
  if (now - last < minIntervalMs) return true;
  events.set(event, now);
  return false;
}
