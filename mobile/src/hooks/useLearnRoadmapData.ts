import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { logNav } from "@/utils/logger";
import type { Experience } from "@/redux/profile-slice";

export type BlockRow = {
  blockIndex: number;
  title: string;
  description: string;
};

const BLOCKS_BY_LEVEL: Record<Experience, BlockRow[]> = {
  JUNIOR: [
    { blockIndex: 0, title: "Block 1 · Variables & Types", description: "let/const, reassignment, typeof, and falsy values." },
    { blockIndex: 1, title: "Block 2 · Operators & Loops", description: "Comparisons, if/else, for and while loops." },
    { blockIndex: 2, title: "Block 3 · Functions & Arrays", description: "Declare functions, return values, and use arrays." },
  ],
  MID: [
    { blockIndex: 0, title: "Block 1 · Objects & Classes", description: "Constructors, methods, this, and object behaviour." },
    { blockIndex: 1, title: "Block 2 · Collections & Patterns", description: "Maps, sets, and array method patterns." },
    { blockIndex: 2, title: "Block 3 · Async & Debugging", description: "Promises, await, and common async pitfalls." },
  ],
  SENIOR: [
    { blockIndex: 0, title: "Block 1 · Architecture & Patterns", description: "Design patterns, SOLID principles, and separation of concerns." },
    { blockIndex: 1, title: "Block 2 · Performance & Memory", description: "Event loop, memory leaks, debounce, throttle, and memoization." },
    { blockIndex: 2, title: "Block 3 · Concurrency & Advanced", description: "Promises, generators, Symbol, Proxy, currying, and Reflect." },
  ],
};

export function useLearnRoadmapData() {
  const activeExperience = useAppSelector((s) => s.profile.experienceLevel) ?? "JUNIOR";

  useEffect(() => {
    logNav("screen:enter", { screen: "LearnRoadmapScreen" });
    return () => logNav("screen:leave", { screen: "LearnRoadmapScreen" });
  }, []);

  return { activeExperience, blocks: BLOCKS_BY_LEVEL[activeExperience] };
}
