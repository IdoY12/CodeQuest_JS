import { useEffect, useState } from "react";
import { logNav } from "../services/logger";
import { useAppSelector } from "@/redux/hooks";
import type Chapter from "@/models/Chapter";
import { fetchLearnChapters, logChaptersError, logChaptersLoaded } from "../utils/learnRoadmapLoad";

export function useLearnRoadmapScreen() {
  const path = useAppSelector((s) => s.profile.path);
  const experience = useAppSelector((s) => s.profile.experience);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const [chapterData, setChapterData] = useState<Chapter[]>([]);
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
        const chapters = await fetchLearnChapters(path, accessToken);
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
  }, [accessToken, path]);

  return { path, experience, chapterData, loading, accessToken };
}
