import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdminUser } from "@/lib/auth";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

import { env } from "@/config/env";

import { fetchMatchConfig } from "@/features/match/services/fetch-match-config.service";
import type { MatchStudioConfig } from "@/features/match/types";
import { ExperienceQuizRepository } from "@/features/quiz/repositories/experience-quiz.repository";
import { OrderEditorForm } from "@/features/studio/components/order-editor-form";
import { extractAdminMemoryCode } from "@/features/studio/config/memory-code-admin-ref";
import { buildExperienceQrDownloadUrl } from "@/features/studio/config/qr-download";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import { ExperiencePhotoboothStripsRepository } from "@/features/studio/repositories/experience-photobooth-strips.repository";
import { ExperiencePhotosRepository } from "@/features/studio/repositories/experience-photos.repository";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { listCatalogStrips } from "@/features/studio/services/list-catalog-strips.service";
import {
  buildPublishChecklistForExperience,
  canPublishFromChecklist,
} from "@/features/studio/services/publish-validation.service";
import { fetchEnvelopeConfig } from "@/features/treasures/services/fetch-envelope-config.service";
import type { EnvelopeStudioConfig } from "@/features/treasures/types";

export const metadata = {
  title: "Order — Celebrate Florist Studio",
  description: "Edit order and experience draft",
};

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  await requireAdminUser();

  const { id } = await params;
  const supabase = await createClient();
  const ordersRepo = new OrdersRepository(supabase);
  const experiencesRepo = new ExperiencesRepository(supabase);
  const photosRepo = new ExperiencePhotosRepository(supabase);
  const stripsRepo = new ExperiencePhotoboothStripsRepository(supabase);
  const quizRepo = new ExperienceQuizRepository(supabase);

  const [order, experience] = await Promise.all([
    ordersRepo.findById(id),
    experiencesRepo.findByOrderId(id),
  ]);

  if (!order || !experience) {
    notFound();
  }

  const photos = await photosRepo.findByExperienceId(experience.id);
  const photoboothStrips = await stripsRepo.findByExperienceId(experience.id);
  const catalogStrips = await listCatalogStrips(supabase);
  const photoboothStripPreviewUrls: Record<string, string> = {};
  await Promise.all(
    photoboothStrips.map(async (strip) => {
      photoboothStripPreviewUrls[strip.id] = await createSignedReadUrl(
        supabase,
        StorageBucket.PHOTOBOOTH_STRIPS,
        strip.storage_path,
      );
    }),
  );
  const themesRepo = new ThemesRepository(supabase);
  const theme = await themesRepo.findById(experience.theme_id);
  const initialQuiz =
    experience.experience_mode === "connection"
      ? await quizRepo.findCompleteByExperienceId(experience.id)
      : { questions: [], bands: [] };
  const initialMatch: MatchStudioConfig =
    experience.experience_mode === "memories"
      ? await fetchMatchConfig(supabase, {
          orderId: order.id,
          experienceId: experience.id,
        })
      : { pairs: [], finalUnlockMessage: null };
  const initialEnvelopes: EnvelopeStudioConfig =
    experience.experience_mode === "treasures"
      ? await fetchEnvelopeConfig(supabase, {
          orderId: order.id,
          experienceId: experience.id,
        })
      : { envelopes: [] };
  const checklistItems = await buildPublishChecklistForExperience(
    supabase,
    order,
    experience,
  );
  const canPublish = canPublishFromChecklist(checklistItems);
  const adminMemoryCodeReference = extractAdminMemoryCode(order.admin_notes);
  const publishedRecipientUrl =
    experience.status === "published"
      ? `${env.NEXT_PUBLIC_APP_URL}/e/${experience.experience_token}`
      : null;
  const qrDownloadUrl = experience.qr_storage_path
    ? buildExperienceQrDownloadUrl(experience.id, order.id)
    : null;

  return (
    <div className="space-y-4">
      <Link
        href={STUDIO_ROUTES.orders}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to orders
      </Link>
      <OrderEditorForm
        order={order}
        experience={experience}
        photos={photos}
        initialPhotoboothStrips={photoboothStrips}
        photoboothStripPreviewUrls={photoboothStripPreviewUrls}
        catalogStrips={catalogStrips.map((strip) => ({
          id: strip.id,
          name: strip.display_name,
          url: strip.publicUrl,
        }))}
        initialQuiz={initialQuiz}
        initialMatch={initialMatch}
        initialEnvelopes={initialEnvelopes}
        checklistItems={checklistItems}
        canPublish={canPublish}
        adminMemoryCodeReference={adminMemoryCodeReference}
        publishedRecipientUrl={publishedRecipientUrl}
        qrDownloadUrl={qrDownloadUrl}
        themeSlug={theme?.slug ?? ""}
      />
    </div>
  );
}
