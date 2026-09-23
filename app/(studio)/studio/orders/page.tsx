import { Suspense } from "react";

import Link from "next/link";

import { requireAdminUser } from "@/lib/auth";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { createClient } from "@/lib/supabase/server";

import { OrdersListFilters } from "@/features/studio/components/orders-list-filters";
import { OrdersTable } from "@/features/studio/components/orders-table";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { dayRangeIso } from "@/features/studio/utils/dates";
import { orderStatusSchema } from "@/schemas/common";
import { experienceModeSchema } from "@/schemas/experience-mode";

export const metadata = {
  title: "Order · Celebrate Studio",
  description: "Kelola order Celebrate Florist",
};

type OrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    mode?: string;
    deliveryDate?: string;
    q?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  await requireAdminUser();

  const params = await searchParams;
  const supabase = await createClient();
  const ordersRepo = new OrdersRepository(supabase);
  const themesRepo = new ThemesRepository(supabase);

  const filters: Parameters<OrdersRepository["findMany"]>[0] = {};

  if (params.status) {
    const parsedStatus = orderStatusSchema.safeParse(params.status);
    if (parsedStatus.success) {
      filters.status = [parsedStatus.data];
    }
  }

  if (params.mode) {
    const parsedMode = experienceModeSchema.safeParse(params.mode);
    if (parsedMode.success) {
      filters.experienceMode = parsedMode.data;
    }
  }

  if (params.deliveryDate) {
    const { start, end } = dayRangeIso(params.deliveryDate);
    filters.scheduledOnOrAfter = start;
    filters.scheduledOnOrBefore = end;
  }

  const [orders, themes] = await Promise.all([
    ordersRepo.findMany(filters),
    themesRepo.findAllActive(),
  ]);

  const themeLabels = Object.fromEntries(
    themes.map((theme) => [theme.id, theme.slug]),
  );

  const query = params.q?.trim().toLowerCase();
  const visibleOrders = query
    ? orders.filter((order) => {
        const haystack =
          `${order.order_number} ${order.receiver_name} ${order.sender_name}`.toLowerCase();
        return haystack.includes(query);
      })
    : orders;

  return (
    <>
      <header className="studio-page-head">
        <div>
          <p className="eyebrow">Order</p>
          <h1>Semua order</h1>
          <p className="muted">
            Cari, saring, lalu buka order untuk mengedit experience.
          </p>
        </div>
        <Link className="btn btn-brand" href={STUDIO_ROUTES.ordersNew}>
          Order baru
        </Link>
      </header>

      <Suspense fallback={null}>
        <OrdersListFilters />
      </Suspense>

      <OrdersTable orders={visibleOrders} themeLabels={themeLabels} />
    </>
  );
}
