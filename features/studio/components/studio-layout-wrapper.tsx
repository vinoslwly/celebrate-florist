"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { StudioShell } from "@/features/studio/components/studio-shell";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";

type StudioLayoutWrapperProps = {
  children: ReactNode;
};

export function StudioLayoutWrapper({ children }: StudioLayoutWrapperProps) {
  const pathname = usePathname();

  if (pathname === STUDIO_ROUTES.login) {
    return <>{children}</>;
  }

  return <StudioShell>{children}</StudioShell>;
}
