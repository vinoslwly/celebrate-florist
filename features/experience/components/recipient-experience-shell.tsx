import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import { ThemePageAtmosphere } from "@/features/themes/components/theme-page-atmosphere";
import { themeHeaderMotif } from "@/features/themes/config/theme-assets";
import {
  themeAccentText,
  themeHaloClass,
} from "@/features/themes/config/theme-surfaces";

type RecipientExperienceShellProps = {
  theme: Theme;
  greetingName: string;
  children: ReactNode;
  className?: string;
};

/** Shared recipient page frame — warm atmosphere, ceremonial header, generous rhythm. */
export function RecipientExperienceShell({
  theme,
  greetingName,
  children,
  className,
}: RecipientExperienceShellProps) {
  const headerMotif = themeHeaderMotif(theme);

  return (
    <ThemePageAtmosphere theme={theme} surface="recipient">
      <div
        className={cn(
          "relative mx-auto max-w-3xl space-y-8 px-4 py-10 sm:space-y-10 sm:py-12",
          className,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-4 top-0 h-48 rounded-b-[2rem]",
            themeHaloClass(theme),
          )}
          aria-hidden
        />
        <header className="relative space-y-2 text-center">
          {headerMotif ? (
            // eslint-disable-next-line @next/next/no-img-element -- optional theme slot
            <img
              src={headerMotif}
              alt=""
              aria-hidden
              className="mx-auto h-12 w-12 object-contain sm:h-14 sm:w-14"
              loading="lazy"
            />
          ) : (
            <p
              className="text-4xl"
              aria-hidden
              data-production-pending="theme-mood-indicator"
            >
              {theme.emoji}
            </p>
          )}
          <p
            className={cn(
              "font-mono text-xs font-bold tracking-widest uppercase",
              themeAccentText(theme),
            )}
          >
            {theme.name} · A gift for you
          </p>
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
            {greetingName}
          </h1>
        </header>
        {children}
      </div>
    </ThemePageAtmosphere>
  );
}
