"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8 md:pt-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="section-title">{title}</h1>
                {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
              </div>
              {actions}
            </div>
            {children}
          </div>
        </main>
        <footer className="hidden border-t border-white/10 px-8 py-4 text-sm text-muted md:block">
          Rest at the end, not in the middle.
        </footer>
      </div>
      <MobileNav />
    </div>
  );
}
