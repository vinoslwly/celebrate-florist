import "server-only";

import { ValidationError } from "@/lib/errors";

import type { ExperienceMode, ExperienceRow, OrderRow } from "@/types/database";

import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import { evaluateExperienceQuiz } from "@/features/quiz/services/validate-quiz-config.service";
import type { ExperienceQuiz } from "@/features/quiz/types";
import { getExperienceModeConfig } from "@/features/studio/config/experience-modes";
import { isMemoryKeyHashVerifiable } from "@/features/studio/config/memory-code-sentinel";
import {
  MEMORIES_TREASURES_PUBLISH_BLOCKED_MESSAGE,
  type PublishChecklistItem,
} from "@/features/studio/config/publish-checklist";

import type { SupabaseClient } from "@supabase/supabase-js";

export type { PublishChecklistItem } from "@/features/studio/config/publish-checklist";

const BLOCKED_PREMIUM_MESSAGE = MEMORIES_TREASURES_PUBLISH_BLOCKED_MESSAGE;

function isPublishableMode(mode: ExperienceMode): boolean {
  return mode === "moments" || mode === "connection";
}

function isBlockedPremiumMode(mode: ExperienceMode): boolean {
  return mode === "memories" || mode === "treasures";
}

function assertSharedPublishRequirements(
  order: OrderRow,
  experience: ExperienceRow,
  options: { skipPreview?: boolean },
): void {
  if (experience.content_locked_at || experience.status !== "draft") {
    throw new ValidationError("Experience is already published.");
  }

  if (!isMemoryKeyHashVerifiable(experience.memory_key_hash)) {
    throw new ValidationError("Set a Memory Code before publishing.");
  }

  const letterComplete =
    experience.greeting_name.trim().length > 0 &&
    experience.closing_name.trim().length > 0 &&
    experience.letter_content.trim().length > 0 &&
    experience.letter_closing.trim().length > 0;

  if (!letterComplete) {
    throw new ValidationError("Complete the letter before publishing.");
  }

  const buyerApproved =
    order.status === "approved" ||
    order.status === "ready" ||
    options.skipPreview === true;

  if (!buyerApproved) {
    throw new ValidationError(
      "Buyer must approve the preview before publishing, or use Skip Preview.",
    );
  }
}

function appendConnectionQuizChecklistItems(
  items: PublishChecklistItem[],
  quiz: ExperienceQuiz,
): void {
  items.push({
    id: "quiz_questions",
    label: "Quiz questions saved",
    status: quiz.questions.length > 0 ? "pass" : "fail",
    message:
      quiz.questions.length > 0
        ? undefined
        : "Save at least one quiz question.",
  });

  items.push({
    id: "quiz_score_bands",
    label: "Score bands saved",
    status: quiz.bands.length > 0 ? "pass" : "fail",
    message:
      quiz.bands.length > 0 ? undefined : "Save at least one score band.",
  });

  const validation = evaluateExperienceQuiz(quiz);

  items.push({
    id: "quiz_validation",
    label: "Quiz configuration valid",
    status: validation.ok ? "pass" : "fail",
    message: validation.ok ? undefined : validation.message,
  });
}

export function buildPublishChecklist(
  order: OrderRow,
  experience: ExperienceRow,
  quiz: ExperienceQuiz = { questions: [], bands: [] },
): PublishChecklistItem[] {
  const items: PublishChecklistItem[] = [];
  const modeConfig = getExperienceModeConfig(experience.experience_mode);

  if (isPublishableMode(experience.experience_mode)) {
    items.push({
      id: "mode",
      label: `${modeConfig.label} mode publish`,
      status: "pass",
    });
  } else if (isBlockedPremiumMode(experience.experience_mode)) {
    items.push({
      id: "mode",
      label: `${modeConfig.label} mode publish`,
      status: "blocked",
      message: BLOCKED_PREMIUM_MESSAGE,
    });
  }

  items.push({
    id: "memory_code",
    label: "Memory Code set",
    status: isMemoryKeyHashVerifiable(experience.memory_key_hash)
      ? "pass"
      : "fail",
    message: isMemoryKeyHashVerifiable(experience.memory_key_hash)
      ? undefined
      : "Set a Memory Code before publishing.",
  });

  const letterComplete =
    experience.greeting_name.trim().length > 0 &&
    experience.closing_name.trim().length > 0 &&
    experience.letter_content.trim().length > 0 &&
    experience.letter_closing.trim().length > 0;

  items.push({
    id: "letter",
    label: "Letter content complete",
    status: letterComplete ? "pass" : "fail",
    message: letterComplete
      ? undefined
      : "Complete greeting, letter body, and closing.",
  });

  const buyerApproved = order.status === "approved" || order.status === "ready";

  items.push({
    id: "buyer_approval",
    label: "Buyer approved preview",
    status: buyerApproved ? "pass" : "fail",
    message: buyerApproved
      ? undefined
      : "Send preview and wait for buyer approval, or use Skip Preview.",
  });

  items.push({
    id: "draft",
    label: "Experience is draft",
    status:
      experience.status === "draft" && !experience.content_locked_at
        ? "pass"
        : "fail",
    message:
      experience.status === "draft" && !experience.content_locked_at
        ? undefined
        : "Experience is already published or locked.",
  });

  if (experience.experience_mode === "connection") {
    appendConnectionQuizChecklistItems(items, quiz);
  }

  return items;
}

export async function buildPublishChecklistForExperience(
  client: SupabaseClient,
  order: OrderRow,
  experience: ExperienceRow,
): Promise<PublishChecklistItem[]> {
  if (experience.experience_mode !== "connection") {
    return buildPublishChecklist(order, experience);
  }

  const quizRepo = new ExperienceQuizRepository(client);
  const quiz = await quizRepo.findCompleteByExperienceId(experience.id);
  return buildPublishChecklist(order, experience, quiz);
}

export function canPublishFromChecklist(
  items: PublishChecklistItem[],
): boolean {
  return items.every((item) => item.status === "pass");
}

export async function assertPublishAllowed(
  client: SupabaseClient,
  order: OrderRow,
  experience: ExperienceRow,
  options: { skipPreview?: boolean; quiz?: ExperienceQuiz } = {},
): Promise<void> {
  if (isBlockedPremiumMode(experience.experience_mode)) {
    throw new ValidationError(BLOCKED_PREMIUM_MESSAGE);
  }

  if (!isPublishableMode(experience.experience_mode)) {
    throw new ValidationError("This experience mode cannot be published.");
  }

  assertSharedPublishRequirements(order, experience, options);

  if (experience.experience_mode === "connection") {
    const quiz =
      options.quiz ??
      (await new ExperienceQuizRepository(client).findCompleteByExperienceId(
        experience.id,
      ));

    const validation = evaluateExperienceQuiz(quiz);
    if (!validation.ok) {
      throw new ValidationError(validation.message);
    }
  }
}

export function isPremiumMode(mode: ExperienceMode): boolean {
  return mode !== "moments";
}
