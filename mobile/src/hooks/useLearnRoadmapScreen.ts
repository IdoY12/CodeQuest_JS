import { useEffect, useState } from "react";
import { logNav } from "../services/logger";
import { useAppStore } from "@/store/useAppStore";
import type { ApiChapter } from "../types/learn.types";
import { fetchLearnChapters, logChaptersError, logChaptersLoaded } from "../utils/learnRoadmapLoad";

export function useLearnRoadmapScreen() {
  const path = useAppStore((s) => s.path);
  const experience = useAppStore((s) => s.experience);
  const [chapterData, setChapterData] = useState<ApiChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logNav("screen:enter", { screen: "LearnRoadmapScreen" });
    return () => logNav("screen:leave", { screen: "LearnRoadmapScreen" });
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      try {
        const chapters = await fetchLearnChapters(path);
        logChaptersLoaded(path, chapters.length);
        if (active) setChapterData(chapters);
      } catch (err) {
        logChaptersError(path, err);
      } finally {
        if (active) setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [path]);

  return { path, experience, chapterData, loading };
}
