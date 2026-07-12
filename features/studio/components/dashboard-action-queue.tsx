import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ExperienceModeBadge } from "@/features/studio/components/experience-mode-badge";
import { ACTION_QUEUE_STATUS_SET } from "@/features/studio/config/action-queue";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import type { OrderWithExperience } from "@/features/studio/repositories/orders.repository";

function formatDeliveryDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(status: string): string {
  return status.replaceAll("_", " ");
}

type DashboardActionQueueProps = {
  actionOrders: OrderWithExperience[];
  todaysDeliveries: OrderWithExperience[];
};

function OrderQueueList({
  orders,
  emptyMessage,
}: {
  orders: OrderWithExperience[];
  emptyMessage: string;
}) {
  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y divide-border rounded-xl border border-border">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={STUDIO_ROUTES.orderDetail(order.id)}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs text-muted-foreground">
                {order.order_number}
              </p>
              <p className="font-medium">{order.receiver_name}</p>
              <p className="text-sm text-muted-foreground">
                From {order.sender_name}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ExperienceModeBadge mode={order.experience_mode} />
              <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
                {formatStatus(order.status)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DashboardActionQueue({
  actionOrders,
  todaysDeliveries,
}: DashboardActionQueueProps) {
  const filteredActionOrders = actionOrders.filter((order) =>
    ACTION_QUEUE_STATUS_SET.has(order.status),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders needing action and today&apos;s scheduled deliveries.
          </p>
        </div>
        <Button asChild>
          <Link href={STUDIO_ROUTES.ordersNew}>New order</Link>
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Orders needing action</h2>
        <OrderQueueList
          orders={filteredActionOrders}
          emptyMessage="No orders need action right now."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">
          Today&apos;s scheduled deliveries
        </h2>
        {todaysDeliveries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No deliveries scheduled for today.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {todaysDeliveries.map((order) => (
              <li key={order.id}>
                <Link
                  href={STUDIO_ROUTES.orderDetail(order.id)}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{order.receiver_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDeliveryDate(order.scheduled_delivery_at)}
                    </p>
                  </div>
                  <ExperienceModeBadge mode={order.experience_mode} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
