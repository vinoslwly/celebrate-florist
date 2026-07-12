import { requireAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { DashboardActionQueue } from "@/features/studio/components/dashboard-action-queue";
import { ACTION_QUEUE_STATUSES } from "@/features/studio/config/action-queue";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";
import { todayRangeIso } from "@/features/studio/utils/dates";

export const metadata = {
  title: "Dashboard — Celebrate Florist Studio",
  description: "Studio action queue",
};

export default async function StudioDashboardPage() {
  await requireAdminUser();

  const supabase = await createClient();
  const ordersRepo = new OrdersRepository(supabase);
  const { start, end } = todayRangeIso();

  const [actionOrders, todaysDeliveries] = await Promise.all([
    ordersRepo.findMany({ status: [...ACTION_QUEUE_STATUSES] }),
    ordersRepo.findMany({
      scheduledOnOrAfter: start,
      scheduledOnOrBefore: end,
    }),
  ]);

  return (
    <DashboardActionQueue
      actionOrders={actionOrders}
      todaysDeliveries={todaysDeliveries}
    />
  );
}
