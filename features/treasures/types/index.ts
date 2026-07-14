import type { ExperienceEnvelopeRow } from "@/types/database";

import type { EnvelopeItemInput } from "@/schemas/studio-envelope";

/** Full envelope payload for an experience — content rows only. */
export type ExperienceEnvelopes = {
  envelopes: ExperienceEnvelopeRow[];
};

/** Studio editor read model — full envelope rows including FD-T5 fields. */
export type EnvelopeStudioConfig = {
  envelopes: ExperienceEnvelopeRow[];
};

/** Input shape for envelope configuration validation at publish/save. */
export type EnvelopeConfigValidationInput = {
  envelopes: EnvelopeItemInput[];
};

/** Recipient gate shell — structure and opened state only (A-4). */
export type RecipientEnvelopeShell = {
  sortOrder: number;
  isFinal: boolean;
  isOpened: boolean;
};

/** Recipient gate view — no hidden envelope body, no signed photos, no reward. */
export type RecipientEnvelopeGateView = {
  envelopes: RecipientEnvelopeShell[];
  openedCount: number;
  envelopeCount: number;
  rewardEligible: boolean;
};

/** Signed photo delivered only via per-envelope fetch (A-4). */
export type RecipientEnvelopePhoto = {
  sortOrder: number;
  caption: string | null;
  signedUrl: string;
};

/** Single envelope content — message, photo, or both (FD-T5). */
export type RecipientEnvelopeContent = {
  sortOrder: number;
  messageText: string | null;
  photo: RecipientEnvelopePhoto | null;
};

/** Per-envelope open response — content plus computed progress. */
export type OpenEnvelopeResult = {
  content: RecipientEnvelopeContent;
  progress: EnvelopeProgress;
  wasAlreadyOpened: boolean;
};

/** Dynamically computed progress — no DB completion flags (FD-T4). */
export type EnvelopeProgress = {
  openedCount: number;
  envelopeCount: number;
  rewardEligible: boolean;
};

/** CF-R2-A replay reset result — server-only, no UI surface. */
export type CompleteTreasuresJourneyResult = {
  reset: boolean;
};

/** Buyer preview photo for an envelope slot (FD-T5 full content). */
export type PreviewEnvelopePhoto = {
  sortOrder: number;
  caption: string | null;
  signedUrl: string;
};

/** Buyer preview envelope — full message + photo for approval (FD-T5). */
export type PreviewEnvelopeItem = {
  sortOrder: number;
  isFinal: boolean;
  messageText: string | null;
  photo: PreviewEnvelopePhoto | null;
};

/** Buyer preview view — full envelope content; no recipient open state. */
export type PreviewEnvelopeView = {
  envelopes: PreviewEnvelopeItem[];
  envelopeCount: number;
};

export type EnvelopeConfigEvaluation =
  { ok: true } | { ok: false; message: string };
