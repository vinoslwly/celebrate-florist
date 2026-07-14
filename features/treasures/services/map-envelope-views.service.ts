import "server-only";

import type {
  ExperienceEnvelopeRow,
  ExperiencePhotoRow,
} from "@/types/database";

import { computeEnvelopeProgress } from "@/features/treasures/services/compute-envelope-progress.service";
import type {
  PreviewEnvelopeItem,
  PreviewEnvelopeView,
  RecipientEnvelopeGateView,
  RecipientEnvelopeShell,
} from "@/features/treasures/types";

export function mapToRecipientEnvelopeShell(
  envelope: ExperienceEnvelopeRow,
  openedSortOrders: Set<number>,
): RecipientEnvelopeShell {
  return {
    sortOrder: envelope.sort_order,
    isFinal: envelope.is_final,
    isOpened: openedSortOrders.has(envelope.sort_order),
  };
}

/**
 * Recipient gate view — envelope shells and opened state only (A-4).
 * Never includes message text or signed photo URLs.
 */
export function mapToRecipientEnvelopeGateView(
  envelopes: ExperienceEnvelopeRow[],
  openedSortOrders: number[],
): RecipientEnvelopeGateView {
  const opened = new Set(openedSortOrders);
  const envelopeSortOrders = envelopes.map((envelope) => envelope.sort_order);
  const progress = computeEnvelopeProgress(
    openedSortOrders.length,
    envelopes.length,
    openedSortOrders,
    envelopeSortOrders,
  );

  return {
    envelopes: envelopes.map((envelope) =>
      mapToRecipientEnvelopeShell(envelope, opened),
    ),
    ...progress,
  };
}

function mapPhotoToPreviewEnvelopePhoto(
  photo: ExperiencePhotoRow,
  signedUrl: string,
): PreviewEnvelopeItem["photo"] {
  return {
    sortOrder: photo.sort_order,
    caption: photo.caption,
    signedUrl,
  };
}

/**
 * Buyer preview — full FD-T5 envelope content for buyer approval.
 * Includes message and signed photo when present.
 */
export function mapToPreviewEnvelopeView(
  envelopes: ExperienceEnvelopeRow[],
  photosBySortOrder: Map<number, ExperiencePhotoRow>,
  signedUrlsBySortOrder: Map<number, string>,
): PreviewEnvelopeView {
  const items: PreviewEnvelopeItem[] = envelopes.map((envelope) => {
    const photoSortOrder = envelope.photo_sort_order;
    const photoRow =
      photoSortOrder !== null
        ? photosBySortOrder.get(photoSortOrder)
        : undefined;
    const signedUrl =
      photoSortOrder !== null
        ? signedUrlsBySortOrder.get(photoSortOrder)
        : undefined;

    return {
      sortOrder: envelope.sort_order,
      isFinal: envelope.is_final,
      messageText: envelope.message_text,
      photo:
        photoRow && signedUrl
          ? mapPhotoToPreviewEnvelopePhoto(photoRow, signedUrl)
          : null,
    };
  });

  return {
    envelopes: items,
    envelopeCount: envelopes.length,
  };
}
