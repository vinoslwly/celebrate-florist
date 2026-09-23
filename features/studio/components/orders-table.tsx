import Link from "next/link";

import {
  formatStudioDate,
  formatStudioStatus,
  getThemeMarketingLabel,
  studioStatusClassName,
} from "@/features/studio/config/labels";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import type { OrderWithExperience } from "@/features/studio/repositories/orders.repository";

type OrdersTableProps = {
  orders: OrderWithExperience[];
  themeLabels: Record<string, string>;
};

export function OrdersTable({ orders, themeLabels }: OrdersTableProps) {
  if (orders.length === 0) {
    return <p className="muted">Tidak ada order yang cocok dengan saringan.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Penerima</th>
            <th>Pengirim</th>
            <th>Tema</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Dibuat</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={STUDIO_ROUTES.orderDetail(order.id)}>
                  {order.order_number}
                </Link>
              </td>
              <td>{order.receiver_name}</td>
              <td>{order.sender_name}</td>
              <td>
                {getThemeMarketingLabel(themeLabels[order.theme_id] ?? "", "—")}
              </td>
              <td>{order.experience_mode}</td>
              <td>
                <span className={studioStatusClassName(order.status)}>
                  {formatStudioStatus(order.status)}
                </span>
              </td>
              <td>
                <time dateTime={order.created_at}>
                  {formatStudioDate(order.created_at)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
