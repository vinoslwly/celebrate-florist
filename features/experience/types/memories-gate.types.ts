import type { ThemeRow } from "@/types/database";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  MatchGradeResult,
  RecipientMatchStory,
} from "@/features/match/types";

/**
 * Safe experience fields for Memories Phase A (gate) payload.
 * Excludes letter fields and final_unlock_message (FD-M5 gate separation).
 */
export type MemoriesGateExperience = {
  id: string;
  greeting_name: string;
  theme_id: string;
  experience_mode: "memories";
};

/** Photo option for gate — signed URL for cinematic reveal; no correct-answer linkage. */
export type MemoriesGatePhotoOption = {
  sortOrder: number;
  caption: string | null;
  signedUrl: string;
};

/** Match content safe for Phase A — stories + masked photo display data only. */
export type MemoriesGateMatchView = {
  stories: RecipientMatchStory[];
  photoOptions: MemoriesGatePhotoOption[];
};

/** Phase A — initial Memories recipient load (match game only, no reward content). */
export type MemoriesGatePayload = {
  experience: MemoriesGateExperience;
  theme: ThemeRow;
  match: MemoriesGateMatchView;
};

/** Letter fields delivered only in Phase B after successful match submit. */
export type MemoriesRewardLetter = {
  greetingName: string;
  letterContent: string;
  letterClosing: string;
  closingName: string;
};

/** Phase B — reward content unlocked after match submit (FD-M5 — always on valid submit). */
export type MemoriesRewardPayload = {
  unlockMessage: string;
  letter: MemoriesRewardLetter;
  photos: PublishedPhoto[];
};

/** Full Memories submit response — grade result plus reward payload (Sprint 09A Phase 6A). */
export type MemoriesSubmitResult = {
  result: MatchGradeResult;
  reward: MemoriesRewardPayload;
};
