import type { ExperienceRow } from "@/types/database";

import type { TreasuresRewardLetter } from "@/features/experience/types/treasures-gate.types";

/** Maps Phase B reward letter to ExperienceRow fields for LetterView. */
export function rewardLetterToExperienceRow(
  letter: TreasuresRewardLetter,
): ExperienceRow {
  return {
    id: "",
    order_id: "",
    theme_id: "",
    experience_token: "",
    greeting_name: letter.greetingName,
    closing_name: letter.closingName,
    event_type: "custom",
    experience_mode: "treasures",
    quiz_title: null,
    final_unlock_message: null,
    letter_content: letter.letterContent,
    letter_closing: letter.letterClosing,
    memory_key_hash: "",
    status: "published",
    is_opened: true,
    is_locked: false,
    locked_reason: null,
    qr_storage_path: null,
    content_locked_at: null,
    first_opened_at: null,
    last_accessed_at: null,
    published_at: null,
    archived_at: null,
    photobooth_strip_source: "catalog",
    ending_message:
      "Hadiah ini milikmu. Buka lagi kapan saja —\nkenangannya tetap di sini.",
    created_at: "",
    updated_at: "",
  };
}
