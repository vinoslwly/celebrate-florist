import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import {
  themeBorderTint,
  themeSurfaceTint,
} from "@/features/themes/config/theme-surfaces";

type ExperienceSurfaceCardProps = ComponentProps<"section"> & {
  children: ReactNode;
  /** Recipient surfaces are warmer; preview surfaces are calmer and more structural. */
  tone?: "recipient" | "preview" | "highlight";
  theme?: Theme;
};

export function ExperienceSurfaceCard({
  children,
  className,
  tone = "recipient",
  theme,
  ...props
}: ExperienceSurfaceCardProps) {
  const isPreview = tone === "preview";
  const surface = theme
    ? themeSurfaceTint(theme, isPreview ? "preview" : "recipient")
    : isPreview
      ? "bg-card/90"
      : "bg-card";
  const border = theme
    ? themeBorderTint(theme)
    : isPreview
      ? "border-border/80"
      : "border-border";

  return (
    <section
      className={cn(
        "rounded-2xl border p-6",
        surface,
        border,
        tone === "recipient" && "shadow-sm",
        tone === "highlight" && "text-center space-y-3 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
