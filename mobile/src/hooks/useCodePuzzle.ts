import { useCallback, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { XP_PER_CORRECT_EXERCISE } from "@project/xp-constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCachedAllPuzzles } from "@/redux/puzzle-slice";
import store from "@/redux/store";
import { addXp, hydrateXp } from "@/redux/xp-slice";
import { runStreakAppOpen, runStreakQualifyingExercise, hydrateStreak } from "@/redux/streak-slice";
import { getStreakCalendarDate } from "@/utils/streakCalendar";
import { addStudySeconds } from "@/redux/session-slice";
import { useAuthenticatedService } from "@/hooks/useAuthenticatedService";
import PuzzleService, { type Puzzle } from "@/services/auth-aware/PuzzleService";

const STUDY_TIMER_INTERVAL_MS = 1000;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function useCodePuzzle() {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const isGuest = useAppSelector((s) => s.session.isGuest);
  const accessToken = useAppSelector((s) => s.session.accessToken);
  const puzzleService = useAuthenticatedService(PuzzleService);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const puzzle = puzzles[currentIndex] ?? null;

  useEffect(() => {
    if (!isFocused) return;
    const t = setInterval(() => dispatch(addStudySeconds(1)), STUDY_TIMER_INTERVAL_MS);
    return () => clearInterval(t);
  }, [dispatch, isFocused]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessage(null);
    const cached = store.getState().puzzle.allPuzzles;
    if (cached !== null) {
      setPuzzles(cached);
      if (cached.length > 0) setCurrentIndex(Math.floor(Date.now() / MS_PER_DAY) % cached.length);
      setLoading(false);
      return () => { cancelled = true; };
    }
    puzzleService.getAllPuzzles()
      .then((data) => { if (!cancelled) { dispatch(setCachedAllPuzzles(data)); setPuzzles(data); setCurrentIndex(Math.floor(Date.now() / MS_PER_DAY) % data.length); } })
      .catch(() => { if (!cancelled) setMessage("Failed to load puzzles. Please try again."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [dispatch, puzzleService]);

  const onSubmit = useCallback(async () => {
    if (!puzzle) return;
    if (!input.trim()) { setMessage("Please enter a one-line JavaScript expression."); return; }
    const clientLocalDate = getStreakCalendarDate();
    try {
      const data = await puzzleService.submitPuzzle(puzzle.id, { answer: input, clientLocalDate });
      if (!data.correct) { setMessage("Not quite. Try another valid one-line expression."); return; }
      if (isGuest) {
        const today = clientLocalDate;
        dispatch(runStreakAppOpen({ today })); dispatch(runStreakQualifyingExercise({ today })); dispatch(addXp(XP_PER_CORRECT_EXERCISE));
      } else {
        if (typeof data.xpTotal === "number") dispatch(hydrateXp({ xpTotal: data.xpTotal, level: Math.max(1, Math.floor(data.xpTotal / XP_PER_CORRECT_EXERCISE) + 1) }));
        else dispatch(addXp(XP_PER_CORRECT_EXERCISE));
        if (typeof data.streakCurrent === "number") dispatch(hydrateStreak({ streakCurrent: data.streakCurrent, lastActivityDate: null, lastCheckedDate: null }));
      }
      setMessage(`Puzzle solved! +${XP_PER_CORRECT_EXERCISE} XP.`);
    } catch { setMessage("Failed to submit. Please try again."); }
  }, [accessToken, dispatch, input, isGuest, puzzle, puzzleService]);

  return { loading, puzzle, puzzles, currentIndex, setCurrentIndex, input, setInput, message, onSubmit };
}
