import type { ExperienceMode } from "@/types/database";

import { ConnectionExperience } from "@/features/experience/components/connection-experience";
import { MemoriesExperience } from "@/features/experience/components/memories-experience";
import { MomentsExperience } from "@/features/experience/components/moments-experience";
import { TreasuresExperience } from "@/features/experience/components/treasures-experience";
import type { PublishedExperiencePayload } from "@/features/experience/services/fetch-published-experience.service";
import type { ConnectionGatePayload } from "@/features/experience/types/connection-gate.types";
import type { MemoriesGatePayload } from "@/features/experience/types/memories-gate.types";
import type {
  TreasuresGatePayload,
  TreasuresRewardPayload,
} from "@/features/experience/types/treasures-gate.types";

export type RecipientExperienceRenderProps =
  | {
      mode: "moments";
      payload: PublishedExperiencePayload;
      experienceToken: string;
    }
  | {
      mode: "connection";
      connectionGate: ConnectionGatePayload;
      experienceToken: string;
    }
  | {
      mode: "memories";
      memoriesGate: MemoriesGatePayload;
      experienceToken: string;
    }
  | {
      mode: "treasures";
      treasuresGate: TreasuresGatePayload;
      experienceToken: string;
      initialReward: TreasuresRewardPayload | null;
    };

export function RecipientExperienceView(props: RecipientExperienceRenderProps) {
  switch (props.mode) {
    case "moments":
      return <MomentsExperience payload={props.payload} />;
    case "connection":
      return (
        <ConnectionExperience
          gate={props.connectionGate}
          experienceToken={props.experienceToken}
        />
      );
    case "memories":
      return (
        <MemoriesExperience
          gate={props.memoriesGate}
          experienceToken={props.experienceToken}
        />
      );
    case "treasures":
      return (
        <TreasuresExperience
          gate={props.treasuresGate}
          experienceToken={props.experienceToken}
          initialReward={props.initialReward}
        />
      );
  }
}

export function isLiveRecipientMode(
  mode: ExperienceMode,
): mode is "moments" | "connection" | "memories" | "treasures" {
  return (
    mode === "moments" ||
    mode === "connection" ||
    mode === "memories" ||
    mode === "treasures"
  );
}
