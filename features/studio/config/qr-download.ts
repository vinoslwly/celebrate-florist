import { STUDIO_API_ROUTES } from "@/features/studio/config/api-routes";

export function buildExperienceQrDownloadUrl(
  experienceId: string,
  orderId: string,
): string {
  return STUDIO_API_ROUTES.experienceQrDownload(experienceId, orderId);
}
