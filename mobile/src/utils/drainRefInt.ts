import type { MutableRefObject } from "react";

export function drainRefInt(ref: MutableRefObject<number>): number {
  const value = ref.current;
  ref.current = 0;
  return value;
}
