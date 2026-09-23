import Link from "next/link";

import { requireAdminUser } from "@/lib/auth";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { createClient } from "@/lib/supabase/server";

import { CreateOrderForm } from "@/features/studio/components/create-order-form";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import { filterThemesForNewOrderSelection } from "@/features/themes/config/active-themes";

export const metadata = {
  title: "Order baru · Celebrate Studio",
  description: "Buat order baru",
};

export default async function NewOrderPage() {
  await requireAdminUser();

  const supabase = await createClient();
  const themesRepo = new ThemesRepository(supabase);
  const themes = filterThemesForNewOrderSelection(
    await themesRepo.findAllActive(),
  );

  return (
    <div className="space-y-6">
      <div>
        <Link href={STUDIO_ROUTES.orders} className="muted">
          ← Semua order
        </Link>
        <p className="eyebrow">Order</p>
        <h1>Order baru</h1>
        <p className="muted">
          Buat order dan draft experience dalam satu langkah.
        </p>
      </div>

      {themes.length === 0 ? (
        <p className="muted">
          Belum ada tema aktif. Tambah tema sebelum membuat order.
        </p>
      ) : (
        <CreateOrderForm themes={themes} />
      )}
    </div>
  );
}
