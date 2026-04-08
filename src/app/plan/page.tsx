"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/shared/PageTransition";

const sections = [
  { id: "audit", label: "Problem Foods" },
  { id: "diet", label: "Daily Diet" },
  { id: "dinner", label: "Dinner Guide" },
  { id: "tips", label: "Lifestyle Tips" },
  { id: "timeline", label: "Timeline" },
  { id: "claude", label: "Claude HTML" },
] as const;

export default function PlanPage() {
  const [activeSection, setActiveSection] =
    useState<(typeof sections)[number]["id"]>("audit");

  return (
    <AppShell
      title="Full Plan Reference"
      subtitle="Alternative reference view with a direct Claude HTML version included."
      actions={
        <Link
          href="/claude-reference"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 px-4 text-sm text-accent"
        >
          Open Claude HTML Directly
        </Link>
      }
    >
      <PageTransition>
        <div className="mb-6 flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`min-h-11 rounded-2xl border px-4 text-sm transition ${
                activeSection === section.id
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-white/10 bg-white/[0.03] text-muted hover:text-foreground"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === "audit" ? (
          <div className="panel p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="pb-3">Food</th>
                    <th className="pb-3">Why It Hurts</th>
                    <th className="pb-3">Strategy</th>
                  </tr>
                </thead>
                <tbody className="align-top text-foreground">
                  <tr><td className="py-3">Cheese</td><td className="py-3">100–120 kcal/slice, saturated fat, easy to overeat silently.</td><td className="py-3">Max 1 thin slice/day. Swap with nutritional yeast on pasta.</td></tr>
                  <tr><td className="py-3">Chips</td><td className="py-3">~150 kcal/oz, zero satiety, sodium causes water retention.</td><td className="py-3">Replace with makhana, popcorn, or 15 almonds.</td></tr>
                  <tr><td className="py-3">Milk Chocolate</td><td className="py-3">High sugar spikes insulin and promotes lower-body fat storage.</td><td className="py-3">Swap to 1–2 squares 70%+ dark chocolate or fruit.</td></tr>
                  <tr><td className="py-3">Bagels</td><td className="py-3">~270 kcal, 55g refined carbs, low fibre and low satiety.</td><td className="py-3">Eliminate. If unavoidable: mini bagel only, no cream cheese.</td></tr>
                  <tr><td className="py-3">Bread + Butter</td><td className="py-3">~300 kcal snack with refined carbs + saturated fat.</td><td className="py-3">Never as a standalone snack. Use hummus or avocado in a meal instead.</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-5 rounded-3xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
              These 5 foods together add 400–700 kcal/day. Cutting them alone can create the full daily deficit.
            </div>
          </div>
        ) : null}

        {activeSection === "diet" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel p-5">11 AM Protein Shake · ~294 kcal · ~26g protein</div>
            <div className="panel p-5">Lunch · Rice + Dal or Roti + Sabzi · ~420–450 kcal · ~15–17g protein</div>
            <div className="panel p-5">Fruit Snack · Apple + 2 Mandarins · ~130 kcal</div>
            <div className="panel p-5">Nut Snack · Almonds / Makhana / Peanut Butter · ~50–100 kcal</div>
            <div className="panel p-5 md:col-span-2">Dinner Rotation · Pasta / Noodles / Avocado Toast / Roti + Sabzi / Dabeli-Sandwich with lighter tweaks and Greek yogurt support.</div>
          </div>
        ) : null}

        {activeSection === "dinner" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Pasta: Tomato-based only, skip parmesan, stir unflavoured whey into sauce.",
              "Hakka noodles: Whole wheat noodles, more vegetables, slightly smaller portion.",
              "Avocado toast: 1 slice whole wheat, no butter, pair with Greek yogurt.",
              "Roti + sabzi: Best default. Add yogurt instead of extra roti.",
              "Dabeli / sandwich: No butter, no cheese, keep it to one serving.",
            ].map((item) => (
              <div key={item} className="panel p-5 text-sm text-foreground">{item}</div>
            ))}
          </div>
        ) : null}

        {activeSection === "tips" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Walk 8,000–10,000 steps/day.",
              "Sleep 7–8 hours. Cortisol drives thigh/hip fat storage.",
              "Drink 2.5–3 litres of water daily.",
              "Late dinner rule: lower carbs, higher protein + veg, finish by 9:30 PM.",
              "USA food environment hack: do not keep chips at home; pre-portion makhana bags.",
            ].map((item) => (
              <div key={item} className="panel p-5 text-sm text-foreground">{item}</div>
            ))}
          </div>
        ) : null}

        {activeSection === "timeline" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Week 1–2: Water weight drops, energy improves, bloating reduces → -1.5 kg",
              "Week 4–6: Thigh circumference reduces, pants feel less tight",
              "Week 8–12: 3–5 kg total loss, fitting into old clothes",
              "Week 12–20: Reaching 50–52 kg",
            ].map((item) => (
              <div key={item} className="panel p-5 text-sm text-foreground">{item}</div>
            ))}
          </div>
        ) : null}

        {activeSection === "claude" ? (
          <div className="panel overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="font-display text-3xl uppercase tracking-[0.08em] text-foreground">
                Claude HTML Reference
              </p>
              <Link
                href="/claude-reference"
                className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent"
              >
                Open Fullscreen
              </Link>
            </div>
            <iframe
              src="/claude-reference"
              title="Claude HTML Reference"
              className="h-[75vh] w-full bg-white"
            />
          </div>
        ) : null}
      </PageTransition>
    </AppShell>
  );
}
