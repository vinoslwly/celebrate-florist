import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import { themeGiftClasses } from "@/features/themes/config/theme-surfaces";

export type GiftTileState = "closed" | "opened" | "loading";
export type GiftTileKind = "standard" | "final";

export function giftDisplayName(index: number): string {
  return `Gift ${index + 1}`;
}

type GiftStateLabelProps = {
  state: GiftTileState;
  kind?: GiftTileKind;
  className?: string;
};

/** Visible state text — not emoji-dependent. */
export function GiftStateLabel({
  state,
  kind = "standard",
  className,
}: GiftStateLabelProps) {
  const label =
    state === "loading"
      ? "Opening…"
      : state === "opened"
        ? kind === "final"
          ? "Opened · Final gift"
          : "Opened gift"
        : kind === "final"
          ? "Closed · Final gift"
          : "Closed gift";

  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {label}
    </span>
  );
}

type GiftFinalBadgeProps = {
  className?: string;
  theme?: Theme;
};

export function GiftFinalBadge({ className, theme }: GiftFinalBadgeProps) {
  const classes = theme ? themeGiftClasses(theme) : null;

  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        classes
          ? cn(classes.finalBorder, "bg-background/80", classes.accentText)
          : "border-pink-ink/40 bg-pink-soft/30 text-pink-ink",
        className,
      )}
    >
      Final gift
    </span>
  );
}

type GiftMotifProps = {
  state: GiftTileState;
  kind?: GiftTileKind;
  size?: "sm" | "md";
  className?: string;
  theme?: Theme;
};

/** Simple CSS present motif — Production Pending slot for future artwork. */
export function GiftMotif({
  state,
  kind = "standard",
  size = "md",
  className,
  theme,
}: GiftMotifProps) {
  const isOpen = state === "opened";
  const isFinal = kind === "final";
  const dimension = size === "sm" ? "h-9 w-9" : "h-12 w-12";
  const classes = theme ? themeGiftClasses(theme) : null;

  return (
    <div
      aria-hidden
      className={cn(
        "relative rounded-lg border-2 bg-background shadow-sm",
        dimension,
        isFinal
          ? (classes?.finalBorder ?? "border-pink-ink/50")
          : (classes?.standardBorder ?? "border-primary/35"),
        isOpen && "bg-primary/5",
        isFinal && isOpen && (classes?.finalRing ?? "ring-2 ring-pink-ink/25"),
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-1.5 top-1 h-2 rounded-sm bg-peach/80",
          isOpen && "-translate-y-0.5 opacity-70",
        )}
      />
      <div
        className={cn(
          "absolute inset-y-2 left-1/2 w-0.5 -translate-x-1/2 opacity-45",
          classes ? classes.ribbon : "bg-primary/45",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 opacity-45",
          classes ? classes.ribbon : "bg-primary/45",
        )}
      />
    </div>
  );
}

export function giftAccessibleName(options: {
  displayNumber: number;
  isOpened: boolean;
  isFinal: boolean;
  isLoading?: boolean;
}): string {
  const name = giftDisplayName(options.displayNumber - 1);
  if (options.isLoading) {
    return `${name} — opening`;
  }
  if (options.isOpened) {
    return options.isFinal
      ? `${name}, final gift — opened, tap to view again`
      : `${name}, opened gift, tap to view again`;
  }
  return options.isFinal
    ? `${name}, final gift — closed, tap to open`
    : `${name}, closed gift, tap to open`;
}
