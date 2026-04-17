import { describe, expect, it } from "vitest";
import {
  applyStreakOnAppOpen,
  applyStreakOnQualifyingXp,
  calendarDaysBetweenEarlierAndLater,
  type DailyXpStreakPersisted,
} from "@project/streak-logic";
import { buildStreakDotHighlights, shouldShowStreakDotRow, streakDotRowMaxInclusive } from "./dailyXpStreakCore";

const empty: DailyXpStreakPersisted = { streakCount: 0, lastActivityDate: null, lastCheckedDate: null };

describe("calendarDaysBetweenEarlierAndLater", () => {
  it("counts whole local calendar days between ISO date strings", () => {
    expect(calendarDaysBetweenEarlierAndLater("2026-04-14", "2026-04-16")).toBe(2);
    expect(calendarDaysBetweenEarlierAndLater("2026-04-14", "2026-04-15")).toBe(1);
    expect(calendarDaysBetweenEarlierAndLater("2026-04-15", "2026-04-15")).toBe(0);
  });
});

describe("applyStreakOnAppOpen", () => {
  it("new user: first open keeps streak at 0 and sets lastCheckedDate", () => {
    expect(applyStreakOnAppOpen(empty, "2026-04-16")).toEqual({
      streakCount: 0,
      lastActivityDate: null,
      lastCheckedDate: "2026-04-16",
    });
  });

  it("resets when the app was not opened for two or more calendar days", () => {
    const s: DailyXpStreakPersisted = {
      streakCount: 5,
      lastActivityDate: "2026-04-10",
      lastCheckedDate: "2026-04-10",
    };
    expect(applyStreakOnAppOpen(s, "2026-04-12").streakCount).toBe(0);
  });

  it("resets when the last qualifying exercise was two or more calendar days before today", () => {
    const s: DailyXpStreakPersisted = {
      streakCount: 5,
      lastActivityDate: "2026-04-14",
      lastCheckedDate: "2026-04-15",
    };
    expect(applyStreakOnAppOpen(s, "2026-04-16").streakCount).toBe(0);
  });
});

describe("applyStreakOnQualifyingXp", () => {
  it("new user with null lastActivity first exercise sets streak to 1", () => {
    const s: DailyXpStreakPersisted = { streakCount: 0, lastActivityDate: null, lastCheckedDate: "2026-04-16" };
    expect(applyStreakOnQualifyingXp(s, "2026-04-16")).toEqual({
      streakCount: 1,
      lastActivityDate: "2026-04-16",
      lastCheckedDate: "2026-04-16",
    });
  });

  it("first exercise on a day increments streak once", () => {
    const afterOpen: DailyXpStreakPersisted = {
      streakCount: 0,
      lastActivityDate: null,
      lastCheckedDate: "2026-04-16",
    };
    expect(applyStreakOnQualifyingXp(afterOpen, "2026-04-16")).toEqual({
      streakCount: 1,
      lastActivityDate: "2026-04-16",
      lastCheckedDate: "2026-04-16",
    });
  });

  it("multiple qualifying exercises the same day do not increment again", () => {
    const once: DailyXpStreakPersisted = {
      streakCount: 1,
      lastActivityDate: "2026-04-16",
      lastCheckedDate: "2026-04-16",
    };
    expect(applyStreakOnQualifyingXp(once, "2026-04-16")).toEqual(once);
  });

  it("exercise on day 1 then day 2 yields streak 2", () => {
    const day1: DailyXpStreakPersisted = {
      streakCount: 1,
      lastActivityDate: "2026-04-16",
      lastCheckedDate: "2026-04-16",
    };
    const openedDay2 = applyStreakOnAppOpen(
      { ...day1, lastCheckedDate: "2026-04-16" },
      "2026-04-17",
    );
    expect(applyStreakOnQualifyingXp(openedDay2, "2026-04-17").streakCount).toBe(2);
  });

  it("exercise day 1 then day 10 without app opens restarts streak at 1 (gap >= 2)", () => {
    const afterDay1: DailyXpStreakPersisted = {
      streakCount: 3,
      lastActivityDate: "2026-04-01",
      lastCheckedDate: "2026-04-01",
    };
    expect(applyStreakOnQualifyingXp(afterDay1, "2026-04-10")).toEqual({
      streakCount: 1,
      lastActivityDate: "2026-04-10",
      lastCheckedDate: "2026-04-01",
    });
  });

  it("exercise day 1, skip day 2, exercise day 3 yields streak 1", () => {
    const afterDay1: DailyXpStreakPersisted = {
      streakCount: 1,
      lastActivityDate: "2026-04-16",
      lastCheckedDate: "2026-04-16",
    };
    const openedDay2 = applyStreakOnAppOpen(afterDay1, "2026-04-17");
    expect(openedDay2.streakCount).toBe(1);
    const openedDay3 = applyStreakOnAppOpen(openedDay2, "2026-04-18");
    expect(openedDay3.streakCount).toBe(0);
    expect(applyStreakOnQualifyingXp(openedDay3, "2026-04-18").streakCount).toBe(1);
  });

  it("five exercises in one day keep streak at 1", () => {
    let s: DailyXpStreakPersisted = {
      streakCount: 0,
      lastActivityDate: null,
      lastCheckedDate: "2026-04-16",
    };
    s = applyStreakOnQualifyingXp(s, "2026-04-16");
    s = applyStreakOnQualifyingXp(s, "2026-04-16");
    s = applyStreakOnQualifyingXp(s, "2026-04-16");
    s = applyStreakOnQualifyingXp(s, "2026-04-16");
    s = applyStreakOnQualifyingXp(s, "2026-04-16");
    expect(s.streakCount).toBe(1);
  });

  it("eight consecutive qualifying days reach streak count 8", () => {
    let s = empty;
    const days = [
      "2026-04-01",
      "2026-04-02",
      "2026-04-03",
      "2026-04-04",
      "2026-04-05",
      "2026-04-06",
      "2026-04-07",
      "2026-04-08",
    ];
    days.forEach((day) => {
      s = applyStreakOnAppOpen(s, day);
      s = applyStreakOnQualifyingXp(s, day);
    });
    expect(s.streakCount).toBe(8);
  });

  it("streak 5 then miss a day resets to 0 on next open", () => {
    let s: DailyXpStreakPersisted = {
      streakCount: 5,
      lastActivityDate: "2026-04-10",
      lastCheckedDate: "2026-04-10",
    };
    s = applyStreakOnAppOpen(s, "2026-04-12");
    expect(s.streakCount).toBe(0);
    expect(buildStreakDotHighlights(s.streakCount).every((v) => !v)).toBe(true);
  });
});

describe("buildStreakDotHighlights", () => {
  it("fills at most seven dots for long streaks (UI hides the row when streak exceeds 7)", () => {
    expect(buildStreakDotHighlights(8).filter(Boolean).length).toBe(streakDotRowMaxInclusive);
    expect(buildStreakDotHighlights(0).filter(Boolean).length).toBe(0);
    expect(shouldShowStreakDotRow(7)).toBe(true);
    expect(shouldShowStreakDotRow(8)).toBe(false);
  });
});
