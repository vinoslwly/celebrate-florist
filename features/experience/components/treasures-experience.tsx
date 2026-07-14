import type { TreasuresGatePayload } from "@/features/experience/types/treasures-gate.types";
import type { TreasuresRewardPayload } from "@/features/experience/types/treasures-gate.types";
import { TreasuresExperienceFlow } from "@/features/treasures/components/treasures-experience-flow";

type TreasuresExperienceProps = {
  gate: TreasuresGatePayload;
  experienceToken: string;
  initialReward: TreasuresRewardPayload | null;
};

/** Treasures recipient shell — delegates orchestration to client flow (Sprint 09B Phase 6). */
export function TreasuresExperience({
  gate,
  experienceToken,
  initialReward,
}: TreasuresExperienceProps) {
  return (
    <TreasuresExperienceFlow
      gate={gate}
      experienceToken={experienceToken}
      initialReward={initialReward}
    />
  );
}
