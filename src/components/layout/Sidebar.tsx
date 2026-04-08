"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartColumnBig,
  Dumbbell,
  LayoutDashboard,
  Salad,
  ScrollText,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout", label: "Today's Workout", icon: Dumbbell },
  { href: "/diet", label: "Diet Tracker", icon: Salad },
  { href: "/schedule", label: "Weekly Schedule", icon: CalendarDays },
  { href: "/progress", label: "Progress", icon: ChartColumnBig },
  { href: "/plan", label: "Full Plan", icon: ScrollText },
  { href: "/rewards", label: "Rewards", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-white/10 bg-black/30 md:block">
      <div className="sticky top-0 flex min-h-screen flex-col px-5 py-6">
        <div className="panel-raised px-5 py-6">
          <p className="font-display text-4xl uppercase tracking-[0.1em] text-accent">
            Fitness Tracker
          </p>
          <p className="mt-2 text-sm text-muted">Yash Doshi · Bryan, Texas</p>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                  active
                    ? "border-accent/50 bg-accent/10 text-foreground"
                    : "border-white/5 bg-white/[0.03] text-muted hover:border-white/10 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-muted")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto panel px-4 py-4">
          <p className="font-display text-2xl uppercase tracking-[0.08em] text-foreground">
            Kobe's Rule
          </p>
          <p className="mt-2 text-sm text-muted">Rest at the end, not in the middle.</p>
        </div>
      </div>
    </aside>
  );
}
