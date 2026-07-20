import type { ExperienceMode } from "@/types/database";

import { ExperienceSurfaceCard } from "@/features/experience/components/experience-surface-card";
import { getExperienceModeConfig } from "@/features/studio/config/experience-modes";

type RecipientModeUnavailableProps = {
  mode: ExperienceMode;
};

export function RecipientModeUnavailable({
  mode,
}: RecipientModeUnavailableProps) {
  const config = getExperienceModeConfig(mode);

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <ExperienceSurfaceCard tone="recipient" className="text-center">
        <h1 className="font-serif text-2xl font-semibold">Coming soon</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The {config.label} experience is not yet available for recipients.
        </p>
      </ExperienceSurfaceCard>
    </div>
  );
}
