import type { ExperienceRow } from "@/types/database";

import type { ConnectionRewardLetter } from "@/features/experience/types/connection-gate.types";

/**
 * Maps Phase B reward letter to ExperienceRow fields for LetterView.
 * LetterView reads only greeting/letter/closing fields — unused columns are empty.
 */
export function rewardLetterToExperienceRow(
  letter: ConnectionRewardLetter,
): ExperienceRow {
  return {
    id: "",
    order_id: "",
    theme_id: "",
    experience_token: "",
    greeting_name: letter.greetingName,
    closing_name: letter.closingName,
    event_type: "custom",
    experience_mode: "connection",
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
    created_at: "",
    updated_at: "",
  };
}
