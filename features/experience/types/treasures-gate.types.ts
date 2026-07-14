import type { ThemeRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type { RecipientEnvelopeGateView } from "@/features/treasures/types";

/**
 * Safe experience fields for Treasures Phase A (gate) payload.
 * Excludes letter fields and envelope hidden content (A-4).
 */
export type TreasuresGateExperience = {
  id: string;
  greeting_name: string;
  theme_id: string;
  experience_mode: "treasures";
};

/** Phase A — initial Treasures recipient load (envelope shells only, no reward). */
export type TreasuresGatePayload = {
  experience: TreasuresGateExperience;
  theme: ThemeRow;
  envelopes: RecipientEnvelopeGateView;
};

/** Letter fields delivered only in Phase B after all envelopes opened (FD-T4). */
export type TreasuresRewardLetter = {
  greetingName: string;
  letterContent: string;
  letterClosing: string;
  closingName: string;
};

/** Phase B — reward content when all envelopes opened (letter + gallery). */
export type TreasuresRewardPayload = {
  letter: TreasuresRewardLetter;
  photos: PublishedPhoto[];
};
