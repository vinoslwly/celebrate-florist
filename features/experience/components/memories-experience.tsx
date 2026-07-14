import { MemoriesExperienceFlow } from "@/features/experience/components/memories-experience-flow";
import type { MemoriesGatePayload } from "@/features/experience/types/memories-gate.types";

type MemoriesExperienceProps = {
  gate: MemoriesGatePayload;
  experienceToken: string;
};

/** Memories recipient shell — delegates unlock orchestration to client flow (Sprint 09A Phase 6C). */
export function MemoriesExperience({
  gate,
  experienceToken,
}: MemoriesExperienceProps) {
  return (
    <MemoriesExperienceFlow gate={gate} experienceToken={experienceToken} />
  );
}
