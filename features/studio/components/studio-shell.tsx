"use client";

import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BRAND_LOGO } from "@/features/landing/config/hero-media";
import { LogoutButton } from "@/features/studio/components/logout-button";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";

type StudioShellProps = {
  children: ReactNode;
};

const NAV_ITEMS = [
  { href: STUDIO_ROUTES.home, label: "Beranda", match: "home" },
  { href: STUDIO_ROUTES.orders, label: "Order", match: "orders" },
  { href: STUDIO_ROUTES.ordersNew, label: "Order baru", match: "exact" },
  { href: STUDIO_ROUTES.settings, label: "Website", match: "exact" },
  { href: STUDIO_ROUTES.strips, label: "Strip PNG", match: "exact" },
] as const;

export function StudioShell({ children }: StudioShellProps) {
  const currentPath = usePathname();

  return (
    <div className="page-studio">
      <div className="studio-shell">
        <aside className="studio-sidebar">
          <Link className="studio-brand" href={STUDIO_ROUTES.home}>
            <Image
              className="brand-logo"
              src={BRAND_LOGO}
              alt="Celebrate Studio"
              width={40}
              height={40}
            />
            Celebrate Studio
          </Link>
          <nav>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.match === "home"
                  ? currentPath === item.href
                  : item.match === "orders"
                    ? currentPath === STUDIO_ROUTES.orders ||
                      (currentPath.startsWith(`${STUDIO_ROUTES.orders}/`) &&
                        currentPath !== STUDIO_ROUTES.ordersNew)
                    : currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "is-active" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="studio-logout">
            <LogoutButton />
          </div>
        </aside>
        <main className="studio-main">{children}</main>
      </div>
    </div>
  );
}
