import { ConnectionExperienceFlow } from "@/features/experience/components/connection-experience-flow";
import type { ConnectionGatePayload } from "@/features/experience/types/connection-gate.types";

type ConnectionExperienceProps = {
  gate: ConnectionGatePayload;
  experienceToken: string;
};

/** Connection recipient shell — delegates unlock orchestration to client flow (Sprint 08R-B). */
export function ConnectionExperience({
  gate,
  experienceToken,
}: ConnectionExperienceProps) {
  return (
    <ConnectionExperienceFlow gate={gate} experienceToken={experienceToken} />
  );
}
