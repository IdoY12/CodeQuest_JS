import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { logNav } from "@/utils/logger";
import type { Experience } from "@/redux/profile-slice";

export type LevelRow = {
  experienceLevel: Experience;
  title: string;
  description: string;
};

const rows: LevelRow[] = [
  {
    experienceLevel: "JUNIOR",
    title: "Junior track",
    description: "Variables, control flow, functions, and core JavaScript patterns.",
  },
  {
    experienceLevel: "MID",
    title: "Mid track",
    description: "OOP, collections, async basics, and intermediate debugging.",
  },
  {
    experienceLevel: "SENIOR",
    title: "Senior track",
    description: "Architecture, concurrency, performance, and security-minded review.",
  },
];

export function useLearnRoadmapData() {
  const activeExperience = useAppSelector((s) => s.profile.experience) ?? "JUNIOR";
  useEffect(() => {
    logNav("screen:enter", { screen: "LearnRoadmapScreen" });
    return () => logNav("screen:leave", { screen: "LearnRoadmapScreen" });
  }, []);
  return { activeExperience, levelRows: rows };
}
