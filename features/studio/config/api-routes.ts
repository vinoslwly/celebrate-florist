export const STUDIO_API_ROUTES = {
  experienceQrDownload: (experienceId: string, orderId: string) =>
    `/api/studio/experiences/${experienceId}/qr?orderId=${orderId}` as const,
} as const;
