import { Suspense } from "react";

import Link from "next/link";

import { requireAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import { OrdersListFilters } from "@/features/studio/components/orders-list-filters";
import { OrdersTable } from "@/features/studio/components/orders-table";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { dayRangeIso } from "@/features/studio/utils/dates";
import { orderStatusSchema } from "@/schemas/common";
import { experienceModeSchema } from "@/schemas/experience-mode";

export const metadata = {
  title: "Orders — Celebrate Florist Studio",
  description: "Manage orders",
};

type OrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    mode?: string;
    deliveryDate?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  await requireAdminUser();

  const params = await searchParams;
  const supabase = await createClient();
  const ordersRepo = new OrdersRepository(supabase);

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

  const orders = await ordersRepo.findMany(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and filter all orders.
          </p>
        </div>
        <Button asChild>
          <Link href={STUDIO_ROUTES.ordersNew}>New order</Link>
        </Button>
      </div>

      <Suspense fallback={null}>
        <OrdersListFilters />
      </Suspense>

      <OrdersTable orders={orders} />
    </div>
  );
}
