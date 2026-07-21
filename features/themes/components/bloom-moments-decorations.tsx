"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import {
  themeAtmosphereAsset,
  themeCornerDecoration,
  themeDecorativeOpacity,
  themeHeaderMotif,
} from "@/features/themes/config/theme-assets";
import {
  themeAccentText,
  themePageAtmosphere,
} from "@/features/themes/config/theme-surfaces";

type BloomMomentsDecorationsProps = {
  theme: Theme;
  className?: string;
  density?: "low" | "medium";
};

/** Soft floating Bloom décor — only when theme provides a motif asset. */
export function BloomMomentsDecorations({
  theme,
  className,
  density = "medium",
}: BloomMomentsDecorationsProps) {
  const motif = themeHeaderMotif(theme);
  if (!motif) return null;

  const count = density === "medium" ? 6 : 3;
  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + ((i * 17) % 84)}%`,
    top: `${10 + ((i * 23) % 70)}%`,
    delay: i * 0.35,
    duration: 5 + (i % 3),
  }));

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{ left: item.left, top: item.top }}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: [0, 0.75, 0.75, 0],
            y: [0, -18, -8, -24],
            rotate: [0, 6, -4, 4],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={motif}
            alt=""
            className="h-7 w-7 object-contain opacity-80"
          />
        </motion.div>
      ))}
    </div>
  );
}

type MomentsPersistentShellProps = {
  theme: Theme;
  children: ReactNode;
  className?: string;
  showBrandChip?: boolean;
  /** When true, scene owns the full visual plane (no shell atmosphere/décor). */
  bare?: boolean;
  /** Fill parent height instead of forcing 100svh (Theme Lab chrome). */
  fillParent?: boolean;
};

/** Persistent theme frame for Moments scenes — atmosphere + corners + décor. */
export function MomentsPersistentShell({
  theme,
  children,
  className,
  showBrandChip = false,
  bare = false,
  fillParent = false,
}: MomentsPersistentShellProps) {
  const atmosphereSrc = themeAtmosphereAsset(theme);
  const cornerSrc = themeCornerDecoration(theme);
  const motifOpacity = themeDecorativeOpacity(theme);
  const heightClass = fillParent ? "h-full min-h-0" : "min-h-[100svh]";

  return (
    <div
      className={cn("relative w-full overflow-hidden", heightClass, className)}
    >
      {!bare ? (
        <>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0",
              themePageAtmosphere(theme, "recipient"),
            )}
            style={{ opacity: 0.7 }}
          />
          {atmosphereSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={atmosphereSrc}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : null}
          {cornerSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cornerSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-0 hidden w-28 max-w-[30vw] sm:block sm:w-36"
                style={{ opacity: motifOpacity }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cornerSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 z-0 hidden w-28 max-w-[30vw] scale-x-[-1] sm:block sm:w-36"
                style={{ opacity: motifOpacity * 0.85 }}
              />
            </>
          ) : null}
          <BloomMomentsDecorations theme={theme} density="medium" />
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#F8E4E7]"
        />
      )}
      <div
        className={cn(
          "relative z-10 flex flex-col",
          heightClass,
          fillParent && "min-h-0",
        )}
      >
        {showBrandChip ? (
          <p
            className={cn(
              "pointer-events-none pt-6 text-center font-mono text-[11px] font-semibold tracking-[0.25em] lowercase",
              themeAccentText(theme),
            )}
          >
            celebrate
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
