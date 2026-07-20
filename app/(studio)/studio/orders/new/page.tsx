import Link from "next/link";

import { requireAdminUser } from "@/lib/auth";
import { ThemesRepository } from "@/lib/repositories/themes.repository";
import { createClient } from "@/lib/supabase/server";

import { CreateOrderForm } from "@/features/studio/components/create-order-form";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import { filterThemesForNewOrderSelection } from "@/features/themes/config/active-themes";

export const metadata = {
  title: "New Order — Celebrate Florist Studio",
  description: "Create a new order",
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
        <Link
          href={STUDIO_ROUTES.orders}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to orders
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold">New order</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create an order and bootstrap a draft experience in one step.
        </p>
      </div>

      {themes.length === 0 ? (
        <p className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No active themes found. Add themes before creating orders.
        </p>
      ) : (
        <CreateOrderForm themes={themes} />
      )}
    </div>
  );
}
