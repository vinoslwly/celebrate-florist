import Link from "next/link";

import {
  formatStudioDate,
  formatStudioStatus,
  studioStatusClassName,
} from "@/features/studio/config/labels";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import type { OrderWithExperience } from "@/features/studio/repositories/orders.repository";

type DashboardActionQueueProps = {
  actionOrders: OrderWithExperience[];
  todaysDeliveries: OrderWithExperience[];
};

export function DashboardActionQueue({
  actionOrders,
  todaysDeliveries,
}: DashboardActionQueueProps) {
  return (
    <>
      <header className="studio-page-head">
        <div>
          <p className="eyebrow">Hari ini</p>
          <h1>Antrian tindakan</h1>
          <p className="muted">Order yang masih perlu dikerjakan hari ini.</p>
        </div>
        <Link className="btn btn-brand" href={STUDIO_ROUTES.ordersNew}>
          Order baru
        </Link>
      </header>

      <section className="studio-panel">
        <h2>Perlu perhatian</h2>
        {actionOrders.length === 0 ? (
          <p className="muted">Tidak ada order yang perlu perhatian.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Penerima</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Pengantaran</th>
                </tr>
              </thead>
              <tbody>
                {actionOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={STUDIO_ROUTES.orderDetail(order.id)}>
                        {order.order_number}
                      </Link>
                    </td>
                    <td>{order.receiver_name}</td>
                    <td>{order.experience_mode}</td>
                    <td>
                      <span className={studioStatusClassName(order.status)}>
                        {formatStudioStatus(order.status)}
                      </span>
                    </td>
                    <td>
                      <time dateTime={order.scheduled_delivery_at ?? undefined}>
                        {formatStudioDate(order.scheduled_delivery_at)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="studio-panel">
        <h2>Pengantaran hari ini</h2>
        {todaysDeliveries.length === 0 ? (
          <p className="muted">Tidak ada pengantaran terjadwal hari ini.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Penerima</th>
                  <th>Mode</th>
                  <th>Pengantaran</th>
                </tr>
              </thead>
              <tbody>
                {todaysDeliveries.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={STUDIO_ROUTES.orderDetail(order.id)}>
                        {order.order_number}
                      </Link>
                    </td>
                    <td>{order.receiver_name}</td>
                    <td>{order.experience_mode}</td>
                    <td>
                      <time dateTime={order.scheduled_delivery_at ?? undefined}>
                        {formatStudioDate(order.scheduled_delivery_at)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
