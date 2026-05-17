import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
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

const MS_DAY = 1000 * 60 * 60 * 24;

export function useCodePuzzle() {
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const appRef = useRef(AppState.currentState as AppStateStatus);
  const isGuest = useAppSelector((s) => s.session.isGuest);
  const puzzleService = useAuthenticatedService(PuzzleService);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const puzzle = puzzles[puzzleIndex] ?? null;

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => { appRef.current = nextAppState; });
    if (!focused) return () => appStateSubscription.remove();
    const studyTimerId = setInterval(() => appRef.current === "active" && dispatch(addStudySeconds(1)), 1000);
    return () => { clearInterval(studyTimerId); appStateSubscription.remove(); };
  }, [dispatch, focused]);
  useEffect(() => { setTriedSubmit(false); setRefOpen(false); }, [puzzle?.id]);
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setFeedbackMessage(null);
    const cachedPuzzleList = store.getState().puzzle.allPuzzles;
    const puzzleCountToIndex = (puzzleCount: number) => Math.floor(Date.now() / MS_DAY) % puzzleCount;
    if (cachedPuzzleList !== null) {
      setPuzzles(cachedPuzzleList); if (cachedPuzzleList.length) setPuzzleIndex(puzzleCountToIndex(cachedPuzzleList.length)); setLoading(false);
      return () => { cancelled = true; };
    }
    puzzleService.getAllPuzzles().then((loadedPuzzles) => {
      if (cancelled) return; dispatch(setCachedAllPuzzles(loadedPuzzles)); setPuzzles(loadedPuzzles);
      if (loadedPuzzles.length) setPuzzleIndex(puzzleCountToIndex(loadedPuzzles.length));
    }).catch(() => !cancelled && setFeedbackMessage("Failed to load puzzles. Please try again.")).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [dispatch, puzzleService]);

  const onSubmit = useCallback(async () => {
    if (!puzzle) return;
    if (!input.trim()) { setFeedbackMessage("Please enter a one-line JavaScript expression."); return; }
    const calendarDateISO = getStreakCalendarDate();
    try {
      const submitResult = await puzzleService.submitPuzzle(puzzle.id, { answer: input, clientLocalDate: calendarDateISO });
      setTriedSubmit(true);
      if (!submitResult.correct) { setFeedbackMessage("Not quite. Try another valid one-line expression."); return; }
      if (isGuest) {
        dispatch(runStreakAppOpen({ today: calendarDateISO })); dispatch(runStreakQualifyingExercise({ today: calendarDateISO })); dispatch(addXp(XP_PER_CORRECT_EXERCISE));
      } else {
        typeof submitResult.xpTotal === "number"
          ? dispatch(hydrateXp({ xpTotal: submitResult.xpTotal, level: Math.max(1, Math.floor(submitResult.xpTotal / XP_PER_CORRECT_EXERCISE) + 1) }))
          : dispatch(addXp(XP_PER_CORRECT_EXERCISE));
        if (typeof submitResult.streakCurrent === "number") dispatch(hydrateStreak({ streakCurrent: submitResult.streakCurrent, lastActivityDate: calendarDateISO, lastCheckedDate: calendarDateISO }));
      }
      setFeedbackMessage(`Puzzle solved! +${XP_PER_CORRECT_EXERCISE} XP.`);
    } catch { setTriedSubmit(true); setFeedbackMessage("Failed to submit. Please try again."); }
  }, [dispatch, input, isGuest, puzzle, puzzleService]);
  const revealReferenceAnswer = useCallback(() => setRefOpen(true), []);
  return {
    loading, puzzle, puzzles, currentIndex: puzzleIndex, setCurrentIndex: setPuzzleIndex, input, setInput, message: feedbackMessage, onSubmit,
    attemptedSubmit: triedSubmit, revealReferenceAnswer, referenceSnippet: puzzle && refOpen ? puzzle.acceptedAnswers[0] ?? "" : null,
  };
}
