"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { LogoutButton } from "@/features/studio/components/logout-button";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";

type StudioShellProps = {
  children: ReactNode;
};

const NAV_ITEMS = [
  { href: STUDIO_ROUTES.home, label: "Dashboard" },
  { href: STUDIO_ROUTES.orders, label: "Orders" },
] as const;

export function StudioShell({ children }: StudioShellProps) {
  const currentPath = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="border-b border-border px-4 py-5">
          <p className="font-mono text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Celebrate Florist
          </p>
          <p className="font-serif text-lg font-semibold">Studio</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === STUDIO_ROUTES.home
                ? currentPath === STUDIO_ROUTES.home
                : currentPath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 md:px-6">
          <nav className="flex gap-2 md:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
