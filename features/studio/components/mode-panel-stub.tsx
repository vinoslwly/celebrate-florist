import type { ExperienceMode } from "@/types/database";

import { getExperienceModeConfig } from "@/features/studio/config/experience-modes";

type ModePanelStubProps = {
  mode: ExperienceMode;
};

export function ModePanelStub({ mode }: ModePanelStubProps) {
  const config = getExperienceModeConfig(mode);

  if (!config.editorSprint) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">
          Mode: {config.label}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Core experience only — letter, photos, and Memory Code. No additional
          configuration required for Moments.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
      <h2 className="text-sm font-semibold text-foreground">
        {config.label} configuration
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{config.description}</p>
      <p className="mt-4 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground">
        Coming in {config.editorSprint}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        You can complete the core experience now. Premium editor ships in a
        later sprint.
      </p>
    </section>
  );
}
