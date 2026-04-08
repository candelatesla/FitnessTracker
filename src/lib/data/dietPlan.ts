import type { MealDefinition } from "@/types";

export const calorieTarget = 1550;
export const proteinTarget = 100;
export const waterTarget = 8;

export const snackAuditItems = [
  { id: "cheese", label: "Cheese (extra — beyond 1 slice)" },
  { id: "milk-chocolate", label: "Milk chocolate / candy" },
  { id: "chips", label: "Chips / crisps" },
  { id: "bagel", label: "Bagel with cream cheese / butter" },
  { id: "bread-butter", label: "Bread + butter as a snack" },
] as const;

export const dailyChecklistItems = [
  { id: "morning-coffee", label: "Morning black coffee", locked: true },
  { id: "protein-shake", label: "11 AM Protein shake", locked: false },
  { id: "lunch-eaten", label: "Lunch eaten (rice+dal OR roti+sabzi)", locked: false },
  { id: "fruit-snack", label: "Fruit snack (apple + 2 mandarins)", locked: false },
  { id: "avoided-chips", label: "Avoided chips today", locked: false },
  { id: "avoided-chocolate", label: "Avoided milk chocolate today", locked: false },
  { id: "avoided-bread-butter", label: "Avoided bread+butter as snack today", locked: false },
  { id: "workout-completed", label: "Workout completed", locked: false },
  { id: "water-goal", label: "8 glasses of water", locked: false },
  { id: "dinner-before", label: "Dinner before 9:30 PM", locked: false },
  { id: "sleep-midnight", label: "Sleep by midnight", locked: false },
] as const;

export const mealDefinitions: MealDefinition[] = [
  {
    id: "protein-shake",
    title: "Meal 1 — Protein Shake",
    timeLabel: "11 AM",
    defaultOptionId: "default",
    options: [
      {
        id: "default",
        label: "Whey + almond milk + blueberries + cocoa + flaxseed + 1/2 banana",
        calories: 294,
        protein: 26,
        description:
          "1 scoop whey, 1 cup almond milk, 1/2 cup blueberries, 1 tsp cocoa, 1 tbsp flaxseed, 1/2 banana",
      },
    ],
  },
  {
    id: "lunch",
    title: "Meal 2 — Lunch",
    timeLabel: "1–2 PM",
    defaultOptionId: "rice-dal",
    options: [
      {
        id: "rice-dal",
        label: "Rice + Dal",
        calories: 450,
        protein: 17,
      },
      {
        id: "roti-sabzi",
        label: "Roti + Sabzi (2 rotis)",
        calories: 420,
        protein: 15,
      },
    ],
  },
  {
    id: "fruit-snack",
    title: "Meal 3 — Fruit Snack",
    timeLabel: "Afternoon",
    defaultOptionId: "default",
    options: [
      {
        id: "default",
        label: "1 Apple + 2 Mandarins",
        calories: 130,
        protein: 1,
      },
    ],
  },
  {
    id: "nut-snack",
    title: "Meal 4 — Nut Snack",
    timeLabel: "3–5 PM",
    defaultOptionId: "almonds",
    options: [
      {
        id: "almonds",
        label: "Almonds (15 nos)",
        calories: 100,
        protein: 4,
      },
      {
        id: "makhana",
        label: "Makhana (1 cup)",
        calories: 50,
        protein: 2,
      },
      {
        id: "peanut-butter",
        label: "Peanut butter (1 tbsp)",
        calories: 95,
        protein: 4,
      },
    ],
  },
  {
    id: "dinner",
    title: "Meal 5 — Dinner",
    timeLabel: "8–9 PM",
    defaultOptionId: "pasta",
    options: [
      {
        id: "pasta",
        label: "Pasta (chickpea/lentil)",
        calories: 420,
        protein: 30,
        tip: "Skip parmesan. Stir unflavoured whey into tomato sauce — undetectable, +20g protein.",
      },
      {
        id: "hakka-noodles",
        label: "Hakka Noodles",
        calories: 380,
        protein: 19,
        tip: "Use whole wheat noodles, cut portion by 25%, and load extra vegetables.",
      },
      {
        id: "avocado-toast",
        label: "Avocado Toast + Greek yogurt",
        calories: 430,
        protein: 18,
        tip: "Use 1 slice whole wheat bread, no butter, and add chili flakes + lemon.",
      },
      {
        id: "roti-sabzi-yogurt",
        label: "Roti + Sabzi + Greek yogurt",
        calories: 440,
        protein: 22,
        tip: "A strong default. Add yogurt instead of extra roti and skip extra ghee.",
      },
      {
        id: "dabeli-sandwich",
        label: "Dabeli / Sandwich",
        calories: 390,
        protein: 14,
        tip: "No butter, no cheese. Keep it to one serving and pair with Greek yogurt.",
      },
    ],
  },
];

export const yogurtBoosts = [
  { id: "lunch-yogurt", label: "Greek yogurt with lunch (+10g protein)" },
  { id: "dinner-yogurt", label: "Greek yogurt with dinner (+10g protein)" },
] as const;
