import "server-only";

import type { ExperiencePhotoRow, MatchPairRow } from "@/types/database";

import type {
  PreviewMatchView,
  RecipientMatchPhotoOption,
  RecipientMatchStory,
  RecipientMatchView,
} from "@/features/match/types";

/**
 * Maps DB rows to recipient-safe stories — strips `photo_sort_order` (correct answers).
 */
export function mapPairToRecipientStory(
  pair: MatchPairRow,
): RecipientMatchStory {
  return {
    sortOrder: pair.sort_order,
    storyText: pair.story_text,
  };
}

export function mapPhotoToRecipientOption(
  photo: ExperiencePhotoRow,
): RecipientMatchPhotoOption {
  return {
    sortOrder: photo.sort_order,
    caption: photo.caption,
  };
}

/**
 * Recipient view — stories + photo pool; never exposes story→photo mappings.
 */
export function mapToRecipientMatchView(
  pairs: MatchPairRow[],
  photos: ExperiencePhotoRow[],
): RecipientMatchView {
  return {
    stories: pairs.map(mapPairToRecipientStory),
    photoOptions: photos.map(mapPhotoToRecipientOption),
  };
}

/**
 * Buyer preview — all stories, all photos, structure; no correct mappings (A-3).
 */
export function mapToPreviewMatchView(
  pairs: MatchPairRow[],
  photos: ExperiencePhotoRow[],
  finalUnlockMessage: string | null,
): PreviewMatchView {
  return {
    stories: pairs.map(mapPairToRecipientStory),
    photos: photos.map(mapPhotoToRecipientOption),
    pairCount: pairs.length,
    finalUnlockMessage,
  };
}
