import { requireAdminUser } from "@/lib/auth";

import { WebsiteSettingsForm } from "@/features/studio/components/website-settings-form";
import { getWebsiteContent } from "@/features/website/services/get-website-content.service";

export const metadata = {
  title: "Website · Celebrate Studio",
  description: "Pengaturan halaman marketing Celebrate Florist",
};

export default async function StudioWebsiteSettingsPage() {
  await requireAdminUser();
  const content = await getWebsiteContent();

  return (
    <>
      <header className="studio-page-head">
        <div>
          <p className="eyebrow">Website</p>
          <h1>Pengaturan website</h1>
          <p className="muted">
            Teks, warna, WhatsApp, dan gambar beranda. Perubahan berlaku di
            localhost setelah disimpan — tanpa deploy.
          </p>
        </div>
      </header>
      <WebsiteSettingsForm initialContent={content} />
    </>
  );
}
