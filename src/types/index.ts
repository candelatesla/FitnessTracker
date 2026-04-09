export type MuscleTag =
  | "Inner thighs"
  | "Outer thighs"
  | "Glutes"
  | "Hamstrings"
  | "Quads"
  | "Cardio"
  | "Core"
  | "Shoulders"
  | "Back"
  | "Chest"
  | "Arms"
  | "Recovery"
  | "Rest";

export interface Exercise {
  id: string;
  name: string;
  target: string;
  rest: string;
  muscleGroup: MuscleTag;
  youtube?: string;
  note?: string;
  defaultSets: number;
  defaultReps: string;
}

export interface WorkoutDay {
  id: string;
  shortLabel: string;
  title: string;
  summary: string;
  warmup?: string;
  cooldown?: string;
  cardioFinisher?: string;
  exercises: Exercise[];
}

export interface MealOption {
  id: string;
  label: string;
  calories: number;
  protein: number;
  description?: string;
  tip?: string;
}

export interface MealDefinition {
  id: string;
  title: string;
  timeLabel: string;
  options: MealOption[];
  defaultOptionId: string;
}

export interface SetLogEntry {
  weightKg: string;
  repsDone: string;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  completed: boolean;
  setLogs: SetLogEntry[];
}

export interface MealLogState {
  mealId: string;
  selectedOptionId: string;
  eaten: boolean;
}

export interface DayLog {
  date: string;
  workoutDayId: string;
  workoutDone: boolean;
  exercisesCompleted: ExerciseLog[];
  caloriesLogged: number;
  proteinLogged: number;
  waterGlasses: number;
  meals: MealLogState[];
  snacksAvoided: Record<string, boolean>;
  checklist: Record<string, boolean>;
  notes: string;
  weightKg: number | null;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeightEntry {
  weekStartDate: string;
  weightKg: number;
  weekNumber: number;
}

export interface Quote {
  athlete: string;
  flag: string;
  quote: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: "weekly" | "diet" | "progress" | "consistency";
}

export interface AppSettings {
  startDate: string;
}
