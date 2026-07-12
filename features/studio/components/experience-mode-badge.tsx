import { cn } from "@/lib/utils";

import type { ExperienceMode } from "@/types/database";

import { getExperienceModeConfig } from "@/features/studio/config/experience-modes";

type ExperienceModeBadgeProps = {
  mode: ExperienceMode;
  className?: string;
};

export function ExperienceModeBadge({
  mode,
  className,
}: ExperienceModeBadgeProps) {
  const config = getExperienceModeConfig(mode);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground",
        className,
      )}
    >
      {config.label}
    </span>
  );
}
