import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  parseISO,
  startOfWeek,
} from "date-fns";
import {
  calorieTarget,
  dailyChecklistItems,
  mealDefinitions,
  proteinTarget,
  snackAuditItems,
  waterTarget,
  yogurtBoosts,
} from "@/lib/data/dietPlan";
import { badgeDefinitions } from "@/lib/data/badges";
import { weekDayAssignment, weeklyWorkoutPlan } from "@/lib/data/gymPlan";
import type {
  AppSettings,
  BadgeDefinition,
  DayLog,
  Exercise,
  ExerciseLog,
  MealLogState,
  WeightEntry,
  WorkoutDay,
} from "@/types";

export const DEFAULT_SETTINGS: AppSettings = {
  startDate: "2026-04-08",
};

export function getWorkoutDayForDate(date: Date): WorkoutDay {
  const workoutId =
    weekDayAssignment[date.getDay() as keyof typeof weekDayAssignment];
  return weeklyWorkoutPlan.find((day) => day.id === workoutId) ?? weeklyWorkoutPlan[0];
}

export function createExerciseLog(exercise: Exercise): ExerciseLog {
  return {
    exerciseId: exercise.id,
    completed: false,
    setLogs: Array.from({ length: exercise.defaultSets }, () => ({
      weightKg: "",
      repsDone: exercise.defaultReps,
      completed: false,
    })),
  };
}

export function createDefaultMeals(): MealLogState[] {
  return [
    ...mealDefinitions.map((meal) => ({
      mealId: meal.id,
      selectedOptionId: meal.defaultOptionId,
      eaten: false,
    })),
    ...yogurtBoosts.map((boost) => ({
      mealId: boost.id,
      selectedOptionId: boost.id,
      eaten: false,
    })),
  ];
}

export function createDefaultChecklist(): Record<string, boolean> {
  return dailyChecklistItems.reduce<Record<string, boolean>>((acc, item) => {
    acc[item.id] = item.locked ? true : false;
    return acc;
  }, {});
}

export function createDefaultDayLog(date: string): DayLog {
  const workoutDay = getWorkoutDayForDate(parseISO(date));
  return {
    date,
    workoutDayId: workoutDay.id,
    workoutDone: workoutDay.id === "day-7",
    exercisesCompleted: workoutDay.exercises.map(createExerciseLog),
    caloriesLogged: 0,
    proteinLogged: 0,
    waterGlasses: 0,
    meals: createDefaultMeals(),
    snacksAvoided: snackAuditItems.reduce<Record<string, boolean>>((acc, snack) => {
      acc[snack.id] = false;
      return acc;
    }, {}),
    checklist: createDefaultChecklist(),
    notes: "",
    weightKg: null,
  };
}

export function getMealState(dayLog: DayLog, mealId: string) {
  return dayLog.meals.find((meal) => meal.mealId === mealId);
}

export function calculateDayTotals(dayLog: DayLog) {
  let calories = 0;
  let protein = 0;

  for (const mealState of dayLog.meals) {
    if (!mealState.eaten) continue;

    if (mealState.mealId === "lunch-yogurt" || mealState.mealId === "dinner-yogurt") {
      protein += 10;
      continue;
    }

    const meal = mealDefinitions.find((entry) => entry.id === mealState.mealId);
    const option = meal?.options.find((entry) => entry.id === mealState.selectedOptionId);

    if (!option) continue;

    calories += option.calories;
    protein += option.protein;
  }

  return { calories, protein };
}

export function hydrateDayLog(dayLog: DayLog): DayLog {
  const { calories, protein } = calculateDayTotals(dayLog);

  return {
    ...dayLog,
    caloriesLogged: calories,
    proteinLogged: protein,
    checklist: {
      ...createDefaultChecklist(),
      ...dayLog.checklist,
      "protein-shake": !!getMealState(dayLog, "protein-shake")?.eaten,
      "lunch-eaten": !!getMealState(dayLog, "lunch")?.eaten,
      "fruit-snack": !!getMealState(dayLog, "fruit-snack")?.eaten,
      "workout-completed": dayLog.workoutDone,
      "water-goal": dayLog.waterGlasses >= waterTarget,
      "avoided-chips": !!dayLog.snacksAvoided["chips"],
      "avoided-chocolate": !!dayLog.snacksAvoided["milk-chocolate"],
      "avoided-bread-butter": !!dayLog.snacksAvoided["bread-butter"],
    },
  };
}

export function formatPrettyDate(date: Date) {
  return format(date, "EEEE, MMMM d");
}

export function getJourneyWeek(settings: AppSettings, date: Date) {
  return Math.max(
    1,
    Math.floor(differenceInCalendarDays(date, parseISO(settings.startDate)) / 7) + 1,
  );
}

export function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
}

export function getWeekDays(date: Date) {
  const { start, end } = getWeekRange(date);
  return eachDayOfInterval({ start, end });
}

export function getIsoDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function getYoutubeEmbedUrl(url?: string) {
  if (!url) return undefined;
  const id = url.split("v=")[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
}

export function isWorkoutComplete(dayLog: DayLog) {
  return dayLog.exercisesCompleted.every((exercise) => exercise.completed);
}

export function countCompletedSets(log: ExerciseLog) {
  return log.setLogs.filter((set) => set.completed).length;
}

export function isCleanSnackDay(dayLog: DayLog) {
  return Object.values(dayLog.snacksAvoided).every(Boolean);
}

export function isDietOnTarget(dayLog: DayLog) {
  return (
    dayLog.caloriesLogged >= 1500 &&
    dayLog.caloriesLogged <= 1700 &&
    dayLog.proteinLogged >= 95 &&
    isCleanSnackDay(dayLog)
  );
}

export function countStreak(logs: DayLog[], predicate: (log: DayLog) => boolean) {
  const ordered = [...logs].sort((a, b) => (a.date > b.date ? -1 : 1));
  let streak = 0;

  for (const log of ordered) {
    if (!predicate(log)) break;
    streak += 1;
  }

  return streak;
}

export function getWeekNumberFromDate(settings: AppSettings, date: string) {
  return getJourneyWeek(settings, parseISO(date));
}

export function getChartWeeks(logs: DayLog[]) {
  const grouped = new Map<
    string,
    { workouts: number; calories: number; protein: number; cleanDays: number; days: number }
  >();

  for (const log of logs) {
    const weekStart = getIsoDate(startOfWeek(parseISO(log.date), { weekStartsOn: 1 }));
    const current = grouped.get(weekStart) ?? {
      workouts: 0,
      calories: 0,
      protein: 0,
      cleanDays: 0,
      days: 0,
    };
    current.workouts += log.workoutDone ? 1 : 0;
    current.calories += log.caloriesLogged;
    current.protein += log.proteinLogged;
    current.cleanDays += isCleanSnackDay(log) ? 1 : 0;
    current.days += 1;
    grouped.set(weekStart, current);
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([weekStart, value], index) => ({
      weekStart,
      label: `W${index + 1}`,
      workouts: value.workouts,
      avgCalories: Math.round(value.calories / value.days || 0),
      avgProtein: Math.round(value.protein / value.days || 0),
      cleanRate: Math.round((value.cleanDays / value.days || 0) * 100),
    }));
}

export function getUnlockedMilestones(weights: WeightEntry[]) {
  const latest = weights.at(-1)?.weightKg ?? 57.5;
  return {
    firstKg: latest <= 56.5,
    halfway: latest <= 55,
    goal: latest <= 52,
    original: latest <= 50,
  };
}

export function computeBadgeEligibility(logs: DayLog[], weights: WeightEntry[]) {
  const unlocked = new Set<string>();
  const ordered = [...logs].sort((a, b) => (a.date > b.date ? 1 : -1));
  const weeks = getChartWeeks(ordered);

  if (ordered.some((log) => log.workoutDone)) unlocked.add("first-fire");
  if (weeks.some((week) => week.workouts >= 3)) unlocked.add("momentum");
  if (weeks.some((week) => week.workouts >= 5)) unlocked.add("full-week");
  if (weeks.some((week) => week.cleanRate === 100 && week.workouts >= 5)) {
    unlocked.add("perfect-week");
  }
  if (weeks.some((week) => week.workouts >= 2)) {
    const recent = weeks.slice(-2).reduce((sum, week) => sum + week.workouts, 0);
    if (recent >= 10) unlocked.add("two-week-warrior");
  }
  if (ordered.some(isCleanSnackDay)) unlocked.add("clean-day");
  if (countStreak(ordered, isCleanSnackDay) >= 3) unlocked.add("clean-streak-3");
  if (countStreak(ordered, (log) => log.waterGlasses >= waterTarget) >= 3) {
    unlocked.add("hydrated");
  }
  if (countStreak(ordered, (log) => log.proteinLogged >= proteinTarget) >= 3) {
    unlocked.add("protein-king");
  }
  if (ordered.length >= 7) unlocked.add("week-1-complete");
  if (countStreak(ordered, (log) => log.workoutDone || log.caloriesLogged > 0) >= 30) {
    unlocked.add("month-1");
  }
  if (countStreak(ordered, (log) => log.workoutDone && log.caloriesLogged > 0) >= 30) {
    unlocked.add("30-day-streak");
  }

  const milestones = getUnlockedMilestones(weights);
  if (milestones.firstKg) unlocked.add("first-drop");
  if (milestones.halfway) unlocked.add("halfway-there");
  if (milestones.goal) unlocked.add("goal-reached");
  if (milestones.original) unlocked.add("back-to-india-weight");

  return badgeDefinitions.filter((badge) => unlocked.has(badge.id));
}

export function getNextBadgeTarget(
  unlockedIds: string[],
  logs: DayLog[],
  weights: WeightEntry[],
): { badge: BadgeDefinition; hint: string } | null {
  const unlocked = new Set(unlockedIds);
  const eligible = new Set(computeBadgeEligibility(logs, weights).map((badge) => badge.id));
  const next = badgeDefinitions.find((badge) => !unlocked.has(badge.id) && !eligible.has(badge.id));
  if (!next) return null;

  switch (next.id) {
    case "momentum": {
      const week = getChartWeeks(logs).at(-1)?.workouts ?? 0;
      return { badge: next, hint: `${Math.max(0, 3 - week)} more workouts this week.` };
    }
    case "clean-streak-3": {
      return {
        badge: next,
        hint: `${Math.max(0, 3 - countStreak(logs, isCleanSnackDay))} more clean snack days.`,
      };
    }
    case "protein-king": {
      return {
        badge: next,
        hint: `${Math.max(0, 3 - countStreak(logs, (log) => log.proteinLogged >= proteinTarget))} more high-protein days.`,
      };
    }
    default:
      return { badge: next, hint: next.description };
  }
}

export function buildWeekSkeleton(date: Date) {
  return getWeekDays(date).map((day) => ({
    date: getIsoDate(day),
    title: getWorkoutDayForDate(day).title,
  }));
}

export function withFallbackLogs(logs: DayLog[], date: Date) {
  const needed = buildWeekSkeleton(date);
  return needed.map(({ date: iso }) => logs.find((log) => log.date === iso) ?? createDefaultDayLog(iso));
}

export function seedWeights(settings: AppSettings): WeightEntry[] {
  return [
    {
      weekStartDate: settings.startDate,
      weekNumber: 1,
      weightKg: 57.5,
    },
  ];
}

export function getWeekDatesFromStart(startDate: string) {
  return Array.from({ length: 7 }, (_, index) => getIsoDate(addDays(parseISO(startDate), index)));
}
