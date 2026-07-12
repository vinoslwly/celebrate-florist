import Link from "next/link";

import { ExperienceModeBadge } from "@/features/studio/components/experience-mode-badge";
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

type OrdersTableProps = {
  orders: OrderWithExperience[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        No orders match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Recipient</th>
            <th className="px-4 py-3 font-medium">Mode</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Delivery</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <Link
                  href={STUDIO_ROUTES.orderDetail(order.id)}
                  className="font-mono text-xs font-medium hover:underline"
                >
                  {order.order_number}
                </Link>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{order.receiver_name}</p>
                <p className="text-xs text-muted-foreground">
                  From {order.sender_name}
                </p>
              </td>
              <td className="px-4 py-3">
                <ExperienceModeBadge mode={order.experience_mode} />
              </td>
              <td className="px-4 py-3 capitalize text-muted-foreground">
                {formatStatus(order.status)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDeliveryDate(order.scheduled_delivery_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
