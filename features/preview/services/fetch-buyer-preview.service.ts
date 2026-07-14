import "server-only";

import { NotFoundError } from "@/lib/errors";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";

import { fetchPreviewMatch } from "@/features/match/services/fetch-preview-match.service";
import { PreviewLinksRepository } from "@/features/preview/repositories/preview-links.repository";
import type { BuyerPreviewPayload } from "@/features/preview/types";
import { fetchPreviewQuiz } from "@/features/quiz/services/fetch-preview-quiz.service";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { fetchPreviewEnvelopes } from "@/features/treasures/services/fetch-preview-envelopes.service";

export async function fetchBuyerPreview(
  previewToken: string,
): Promise<BuyerPreviewPayload> {
  const admin = createAdminClient();
  const previewRepo = new PreviewLinksRepository(admin);
  const experiencesRepo = new ExperiencesRepository(admin);
  const ordersRepo = new OrdersRepository(admin);
  const photosRepo = new ExperiencePhotosRepository(admin);
  const themesRepo = new ThemesRepository(admin);

  const previewLink = await previewRepo.findActiveByToken(previewToken);
  if (!previewLink) {
    throw new NotFoundError("Preview link not found");
  }

  const experience = await experiencesRepo.findById(previewLink.experience_id);
  if (!experience) {
    throw new NotFoundError("Experience not found");
  }

  const order = await ordersRepo.findById(experience.order_id);
  if (!order) {
    throw new NotFoundError("Order not found");
  }

  const [theme, photos] = await Promise.all([
    themesRepo.findById(experience.theme_id),
    photosRepo.findByExperienceId(experience.id),
  ]);

  if (!theme) {
    throw new NotFoundError("Theme not found");
  }

  const signedPhotos = await Promise.all(
    photos.map(async (photo) => ({
      ...photo,
      signedUrl: await createSignedReadUrl(
        admin,
        StorageBucket.EXPERIENCE_PHOTOS,
        photo.storage_path,
      ),
    })),
  );

  const quiz =
    experience.experience_mode === "connection"
      ? await fetchPreviewQuiz(experience.id)
      : undefined;

  const match =
    experience.experience_mode === "memories"
      ? await fetchPreviewMatch(experience.id)
      : undefined;

  const envelopes =
    experience.experience_mode === "treasures"
      ? await fetchPreviewEnvelopes(experience.id)
      : undefined;

  return {
    order,
    experience,
    theme,
    photos: signedPhotos,
    previewToken,
    quiz,
    match,
    envelopes,
  };
}
