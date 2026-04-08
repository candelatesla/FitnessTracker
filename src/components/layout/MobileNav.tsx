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
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/diet", label: "Diet", icon: Salad },
  { href: "/schedule", label: "Week", icon: CalendarDays },
  { href: "/progress", label: "Stats", icon: ChartColumnBig },
  { href: "/plan", label: "Plan", icon: ScrollText },
  { href: "/rewards", label: "Rewards", icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 px-2 pb-3 pt-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-7 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px]",
                active ? "bg-accent/15 text-accent" : "text-muted",
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
