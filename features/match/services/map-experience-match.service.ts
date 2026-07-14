import type {
  ExperienceMatch,
  MatchConfigValidationInput,
  MatchPairInsert,
} from "@/features/match/types";

export function mapMatchPairRowToInsert(
  pair: ExperienceMatch["pairs"][number],
): MatchPairInsert {
  return {
    sortOrder: pair.sort_order,
    storyText: pair.story_text,
    photoSortOrder: pair.photo_sort_order,
  };
}

export function mapExperienceMatchToValidationInput(
  match: ExperienceMatch,
  finalUnlockMessage: string | null,
): MatchConfigValidationInput {
  return {
    pairs: match.pairs.map(mapMatchPairRowToInsert),
    finalUnlockMessage,
  };
}
