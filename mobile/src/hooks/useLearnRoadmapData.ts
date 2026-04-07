import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { logNav } from "@/utils/logger";
import type Chapter from "@/models/Chapter";
import LearningService from "@/services/LearningService";
import { logChaptersError, logChaptersLoaded, logChaptersSkipNoToken } from "@/utils/learnRoadmap";

type RoadmapBlock = {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  unlocked: boolean;
  done: boolean;
};

function labelsForLevel(level: "JUNIOR" | "MID" | "SENIOR"): { title: string; description: string }[] {
  if (level === "MID") {
    return [
      { title: "Chapter 1: OOP & Error Handling", description: "Classes, objects, exceptions, and safe control flow." },
      { title: "Chapter 2: Data Structures & Recursion", description: "Arrays/maps/sets and recursive problem solving." },
      { title: "Chapter 3: APIs & Debugging", description: "Async APIs, intermediate debugging, and pattern basics." },
    ];
  }
  if (level === "SENIOR") {
    return [
      { title: "Chapter 1: Architecture & Performance", description: "Scalable architecture and performance trade-offs." },
      { title: "Chapter 2: Concurrency & Algorithms", description: "Advanced async/concurrency and algorithmic depth." },
      { title: "Chapter 3: Security & Code Review", description: "Security hardening and advanced review/debugging." },
    ];
  }
  return [
    { title: "Chapter 1: Variables & Types", description: "Syntax basics, variables, and core JavaScript types." },
    { title: "Chapter 2: Control Flow", description: "Conditionals, loops, and step-by-step logic practice." },
    { title: "Chapter 3: Functions & Scope", description: "Functions, scope rules, and beginner debugging habits." },
  ];
}

export function useLearnRoadmapData() {
  const path = useAppSelector((s) => s.profile.path);
  const experience = useAppSelector((s) => s.profile.experience) ?? "JUNIOR";
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const completedByLevel = useAppSelector((s) => s.lesson.personalizedBlocksCompletedByLevel);
  const [chapterData, setChapterData] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const completed = completedByLevel[experience] ?? [];
  const labels = labelsForLevel(experience);
  const roadmapBlocks: RoadmapBlock[] = labels.map((label, idx) => {
    const blockNumber = idx + 1;
    const done = completed.includes(blockNumber);
    return {
      id: `${experience}-block-${blockNumber}`,
      title: label.title,
      description: label.description,
      completed: done ? 10 : 0,
      total: 10,
      unlocked: blockNumber === 1 || completed.includes(blockNumber - 1),
      done,
    };
  });
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
          const learning = new LearningService(accessToken);
          const chapters = await learning.getChapters(path);
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
  }, [accessToken, path]);
  return { path, experience, accessToken, chapterData, loading, roadmapBlocks };
}
