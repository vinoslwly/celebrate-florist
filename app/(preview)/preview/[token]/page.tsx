import { notFound } from "next/navigation";

import { ConfigError } from "@/lib/errors";

import { BuyerPreviewShell } from "@/features/preview/components/buyer-preview-shell";
import { fetchBuyerPreview } from "@/features/preview/services/fetch-buyer-preview.service";

export const metadata = {
  title: "Buyer preview — Celebrate Florist",
  description: "Review your bouquet experience before publish",
};

type PreviewPageProps = {
  params: Promise<{ token: string }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { token } = await params;

  let payload;
  try {
    payload = await fetchBuyerPreview(token);
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    notFound();
  }

  return <BuyerPreviewShell payload={payload} />;
}
