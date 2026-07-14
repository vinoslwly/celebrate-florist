import "server-only";

import { ValidationError } from "@/lib/errors";

import type { ExperienceMode, ExperienceRow, OrderRow } from "@/types/database";

import { ExperienceMatchRepository } from "@/features/match/repositories/experience-match.repository";
import { evaluateExperienceMatch } from "@/features/match/services/validate-match-config.service";
import type { MatchStudioConfig } from "@/features/match/types";
import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import { evaluateExperienceQuiz } from "@/features/quiz/services/validate-quiz-config.service";
import type { ExperienceQuiz } from "@/features/quiz/types";
import { getExperienceModeConfig } from "@/features/studio/config/experience-modes";
import { isMemoryKeyHashVerifiable } from "@/features/studio/config/memory-code-sentinel";
import type { PublishChecklistItem } from "@/features/studio/config/publish-checklist";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperienceEnvelopesRepository } from "@/features/treasures/repositories/experience-envelopes.repository";
import { evaluateExperienceEnvelopes } from "@/features/treasures/services/validate-envelope-config.service";
import type { EnvelopeStudioConfig } from "@/features/treasures/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export type { PublishChecklistItem } from "@/features/studio/config/publish-checklist";

export type PublishChecklistContext = {
  quiz?: ExperienceQuiz;
  match?: MatchStudioConfig;
  envelopes?: EnvelopeStudioConfig;
  uploadedPhotoSortOrders?: number[];
};

function isPublishableMode(mode: ExperienceMode): boolean {
  return (
    mode === "moments" ||
    mode === "connection" ||
    mode === "memories" ||
    mode === "treasures"
  );
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

function appendMemoriesMatchChecklistItems(
  items: PublishChecklistItem[],
  match: MatchStudioConfig,
  uploadedPhotoSortOrders: number[],
): void {
  items.push({
    id: "match_pairs",
    label: "Match pairs saved",
    status: match.pairs.length >= 2 ? "pass" : "fail",
    message:
      match.pairs.length >= 2
        ? undefined
        : "Save at least 2 match pairs before publishing.",
  });

  items.push({
    id: "match_unlock_message",
    label: "Final unlock message saved",
    status: match.finalUnlockMessage?.trim() ? "pass" : "fail",
    message: match.finalUnlockMessage?.trim()
      ? undefined
      : "Save a final unlock message before publishing.",
  });

  const validation = evaluateExperienceMatch(
    { pairs: match.pairs },
    match.finalUnlockMessage,
    uploadedPhotoSortOrders,
  );

  items.push({
    id: "match_validation",
    label: "Match configuration valid",
    status: validation.ok ? "pass" : "fail",
    message: validation.ok ? undefined : validation.message,
  });
}

function appendTreasuresEnvelopeChecklistItems(
  items: PublishChecklistItem[],
  envelopes: EnvelopeStudioConfig,
  uploadedPhotoSortOrders: number[],
): void {
  items.push({
    id: "envelope_count",
    label: "Envelopes saved",
    status: envelopes.envelopes.length >= 2 ? "pass" : "fail",
    message:
      envelopes.envelopes.length >= 2
        ? undefined
        : "Save at least 2 envelopes before publishing.",
  });

  const validation = evaluateExperienceEnvelopes(
    { envelopes: envelopes.envelopes },
    uploadedPhotoSortOrders,
  );

  items.push({
    id: "envelope_validation",
    label: "Envelope configuration valid",
    status: validation.ok ? "pass" : "fail",
    message: validation.ok ? undefined : validation.message,
  });
}

export function buildPublishChecklist(
  order: OrderRow,
  experience: ExperienceRow,
  context: PublishChecklistContext = {},
): PublishChecklistItem[] {
  const quiz = context.quiz ?? { questions: [], bands: [] };
  const match = context.match ?? { pairs: [], finalUnlockMessage: null };
  const envelopes = context.envelopes ?? { envelopes: [] };
  const uploadedPhotoSortOrders = context.uploadedPhotoSortOrders ?? [];

  const items: PublishChecklistItem[] = [];
  const modeConfig = getExperienceModeConfig(experience.experience_mode);

  if (isPublishableMode(experience.experience_mode)) {
    items.push({
      id: "mode",
      label: `${modeConfig.label} mode publish`,
      status: "pass",
    });
  } else {
    items.push({
      id: "mode",
      label: `${modeConfig.label} mode publish`,
      status: "fail",
      message: "This experience mode cannot be published.",
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

  if (experience.experience_mode === "memories") {
    appendMemoriesMatchChecklistItems(items, match, uploadedPhotoSortOrders);
  }

  if (experience.experience_mode === "treasures") {
    appendTreasuresEnvelopeChecklistItems(
      items,
      envelopes,
      uploadedPhotoSortOrders,
    );
  }

  return items;
}

export async function buildPublishChecklistForExperience(
  client: SupabaseClient,
  order: OrderRow,
  experience: ExperienceRow,
): Promise<PublishChecklistItem[]> {
  if (experience.experience_mode === "connection") {
    const quizRepo = new ExperienceQuizRepository(client);
    const quiz = await quizRepo.findCompleteByExperienceId(experience.id);
    return buildPublishChecklist(order, experience, { quiz });
  }

  if (experience.experience_mode === "memories") {
    const matchRepo = new ExperienceMatchRepository(client);
    const photosRepo = new ExperiencePhotosRepository(client);
    const [matchData, photos] = await Promise.all([
      matchRepo.findCompleteByExperienceId(experience.id),
      photosRepo.findByExperienceId(experience.id),
    ]);

    return buildPublishChecklist(order, experience, {
      match: {
        pairs: matchData.pairs,
        finalUnlockMessage: experience.final_unlock_message,
      },
      uploadedPhotoSortOrders: photos.map((photo) => photo.sort_order),
    });
  }

  if (experience.experience_mode === "treasures") {
    const envelopesRepo = new ExperienceEnvelopesRepository(client);
    const photosRepo = new ExperiencePhotosRepository(client);
    const [envelopes, photos] = await Promise.all([
      envelopesRepo.findEnvelopesByExperienceId(experience.id),
      photosRepo.findByExperienceId(experience.id),
    ]);

    return buildPublishChecklist(order, experience, {
      envelopes: { envelopes },
      uploadedPhotoSortOrders: photos.map((photo) => photo.sort_order),
    });
  }

  return buildPublishChecklist(order, experience);
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

  if (experience.experience_mode === "memories") {
    const matchRepo = new ExperienceMatchRepository(client);
    const photosRepo = new ExperiencePhotosRepository(client);
    const [matchData, photos] = await Promise.all([
      matchRepo.findCompleteByExperienceId(experience.id),
      photosRepo.findByExperienceId(experience.id),
    ]);

    const validation = evaluateExperienceMatch(
      matchData,
      experience.final_unlock_message,
      photos.map((photo) => photo.sort_order),
    );

    if (!validation.ok) {
      throw new ValidationError(validation.message);
    }
  }

  if (experience.experience_mode === "treasures") {
    const envelopesRepo = new ExperienceEnvelopesRepository(client);
    const photosRepo = new ExperiencePhotosRepository(client);
    const [envelopes, photos] = await Promise.all([
      envelopesRepo.findEnvelopesByExperienceId(experience.id),
      photosRepo.findByExperienceId(experience.id),
    ]);

    const validation = evaluateExperienceEnvelopes(
      { envelopes },
      photos.map((photo) => photo.sort_order),
    );

    if (!validation.ok) {
      throw new ValidationError(validation.message);
    }
  }
}

export function isPremiumMode(mode: ExperienceMode): boolean {
  return mode !== "moments";
}
