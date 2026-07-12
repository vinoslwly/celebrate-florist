import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { OrderEditorForm } from "@/features/studio/components/order-editor-form";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import { ExperiencesRepository } from "@/features/studio/repositories/experiences.repository";
import { OrdersRepository } from "@/features/studio/repositories/orders.repository";

export const metadata = {
  title: "Order — Celebrate Florist Studio",
  description: "Edit order and experience draft",
};

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  await requireAdminUser();

  const { id } = await params;
  const supabase = await createClient();
  const ordersRepo = new OrdersRepository(supabase);
  const experiencesRepo = new ExperiencesRepository(supabase);

  const [order, experience] = await Promise.all([
    ordersRepo.findById(id),
    experiencesRepo.findByOrderId(id),
  ]);

  if (!order || !experience) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Link
        href={STUDIO_ROUTES.orders}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to orders
      </Link>
      <OrderEditorForm order={order} experience={experience} />
    </div>
  );
}
