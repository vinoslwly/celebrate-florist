import { requireAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { CatalogStripsPanel } from "@/features/studio/components/catalog-strips-panel";
import { listCatalogStrips } from "@/features/studio/services/list-catalog-strips.service";

export const metadata = {
  title: "Strip PNG · Celebrate Studio",
  description: "Katalog overlay photobooth Celebrate Florist",
};

export default async function StudioCatalogStripsPage() {
  await requireAdminUser();
  const supabase = await createClient();
  const strips = await listCatalogStrips(supabase);

  return (
    <>
      <header className="studio-page-head">
        <div>
          <p className="eyebrow">Photobooth</p>
          <h1>Strip PNG</h1>
          <p className="muted">
            Katalog global untuk order yang memakai source katalog. Strip custom
            per order tetap di halaman order.
          </p>
        </div>
      </header>
      <CatalogStripsPanel initialStrips={strips} />
    </>
  );
}
