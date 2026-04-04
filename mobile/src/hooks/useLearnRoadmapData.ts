import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { logNav } from "@/services/logger";
import type Chapter from "@/models/Chapter";
import { useService } from "@/hooks/useService";
import LearningService from "@/services/LearningService";
import { logChaptersError, logChaptersLoaded, logChaptersSkipNoToken } from "@/utils/learnRoadmap";

export function useLearnRoadmapData() {
  const learning = useService(LearningService);
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
        if (!accessToken) {
          logChaptersSkipNoToken(path);
          if (active) setChapterData([]);
        } else {
          const chapters = await learning.fetchChapters(path);
          logChaptersLoaded(path, chapters.length);
          if (active) setChapterData(chapters);
        }
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
  }, [accessToken, path, learning]);
  return { path, experience, accessToken, chapterData, loading };
}
