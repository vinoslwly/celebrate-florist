import type { MatchPairRow } from "@/types/database";

/** Full match payload for an experience — pairs only (message lives on `experiences`). */
export type ExperienceMatch = {
  pairs: MatchPairRow[];
};

/** Studio editor read model — pairs plus unlock message from `experiences`. */
export type MatchStudioConfig = {
  pairs: MatchPairRow[];
  finalUnlockMessage: string | null;
};

/** Draft pair row for insert/replace (no server-generated fields). */
export type MatchPairInsert = {
  sortOrder: number;
  storyText: string;
  photoSortOrder: number;
};

/** Atomic replace payload for immutable draft edits. */
export type MatchConfigReplace = {
  pairs: MatchPairInsert[];
  finalUnlockMessage: string | null;
};

/** Input shape for match configuration validation at publish/save. */
export type MatchConfigValidationInput = {
  pairs: MatchPairInsert[];
  finalUnlockMessage: string | null;
};

/** Recipient answer for a single story — not persisted (batch submit, A-2). */
export type MatchAnswerSubmission = {
  storySortOrder: number;
  selectedPhotoSortOrder: number;
};

/** Server-side grading result — stateless, no DB write. */
export type MatchGradeResult = {
  allCorrect: boolean;
  correctCount: number;
  totalPairs: number;
  /** Always present after valid submit when configured (FD-M5); score never blocks reward. */
  finalUnlockMessage: string | null;
};

/** Recipient-safe story — never includes correct photo mapping. */
export type RecipientMatchStory = {
  sortOrder: number;
  storyText: string;
};

/** Photo option for matching — slot identity only, no correct-answer linkage. */
export type RecipientMatchPhotoOption = {
  sortOrder: number;
  caption: string | null;
};

/** Match content safe to render before submission. */
export type RecipientMatchView = {
  stories: RecipientMatchStory[];
  photoOptions: RecipientMatchPhotoOption[];
};

/** Buyer preview story — same as recipient story (no mapping). */
export type PreviewMatchStory = RecipientMatchStory;

/** Buyer preview photo — uploaded photo slot, no mapping. */
export type PreviewMatchPhoto = {
  sortOrder: number;
  caption: string | null;
};

/**
 * Buyer preview match — stories, photos, structure; never correct mappings (A-3).
 * `finalUnlockMessage` is shown so buyer knows the reward copy (not a game spoiler).
 */
export type PreviewMatchView = {
  stories: PreviewMatchStory[];
  photos: PreviewMatchPhoto[];
  pairCount: number;
  finalUnlockMessage: string | null;
};
