import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import {
  themeAtmosphereAsset,
  themeCornerDecoration,
  themeDecorativeOpacity,
} from "@/features/themes/config/theme-assets";
import {
  type ThemeSurface,
  themePageAtmosphere,
} from "@/features/themes/config/theme-surfaces";

type ThemePageAtmosphereProps = {
  theme: Theme;
  surface: ThemeSurface;
  children: ReactNode;
  className?: string;
};

/** Subtle fixed page atmosphere — CSS wash + optional artwork; never blocks pointers. */
export function ThemePageAtmosphere({
  theme,
  surface,
  children,
  className,
}: ThemePageAtmosphereProps) {
  const atmosphereSrc = themeAtmosphereAsset(theme);
  const cornerSrc = themeCornerDecoration(theme);
  const motifOpacity = themeDecorativeOpacity(theme);
  const intensity = surface === "recipient" ? 0.7 : 0.5;

  return (
    <div className={cn("relative min-h-full", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 -z-10",
          themePageAtmosphere(theme, surface),
        )}
        style={{ opacity: intensity }}
      />
      {atmosphereSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- theme slot artwork
        <img
          src={atmosphereSrc}
          alt=""
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
          style={{ opacity: intensity * 0.45 }}
          loading="lazy"
        />
      ) : null}
      {cornerSrc ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cornerSrc}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-0 hidden w-28 max-w-[32vw] select-none sm:block sm:w-36"
            style={{
              opacity: motifOpacity * (surface === "recipient" ? 1 : 0.65),
            }}
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cornerSrc}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 z-0 hidden w-28 max-w-[32vw] scale-x-[-1] select-none sm:block sm:w-36"
            style={{
              opacity: motifOpacity * (surface === "recipient" ? 0.85 : 0.5),
            }}
            loading="lazy"
          />
        </>
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
