import type { ExperienceMode } from "@/types/database";

export type ExperienceModeConfig = {
  value: ExperienceMode;
  label: string;
  description: string;
  /** Sprint when live Studio editor ships; null = core only (Moments). */
  editorSprint: string | null;
};

export const EXPERIENCE_MODES: ExperienceModeConfig[] = [
  {
    value: "moments",
    label: "Moments",
    description: "Letter, gallery, and photobooth — no mini-games.",
    editorSprint: null,
  },
  {
    value: "connection",
    label: "Connection",
    description: "Couple quiz — max 6 multiple-choice questions.",
    editorSprint: null,
  },
  {
    value: "memories",
    label: "Memories",
    description: "Match the Memory — pair stories with photos.",
    editorSprint: "Sprint 09A",
  },
  {
    value: "treasures",
    label: "Treasures",
    description: "Secret envelopes — sequential reveals.",
    editorSprint: "Sprint 09B",
  },
];

export function getExperienceModeConfig(
  mode: ExperienceMode,
): ExperienceModeConfig {
  const found = EXPERIENCE_MODES.find((entry) => entry.value === mode);
  if (!found) {
    throw new Error(`Unknown experience mode: ${mode}`);
  }
  return found;
}
