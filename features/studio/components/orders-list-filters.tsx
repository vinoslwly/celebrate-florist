"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { EXPERIENCE_MODES } from "@/features/studio/config/experience-modes";
import { ORDER_STATUS_FILTERS } from "@/features/studio/config/labels";
import { experienceModeSchema } from "@/schemas/experience-mode";

export function OrdersListFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const mode = searchParams.get("mode") ?? "";
  const deliveryDate = searchParams.get("deliveryDate") ?? "";

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();
    const nextQuery = String(formData.get("q") ?? "").trim();
    const nextStatus = String(formData.get("status") ?? "");
    const nextMode = String(formData.get("mode") ?? "");
    const nextDate = String(formData.get("deliveryDate") ?? "");

    if (nextQuery) params.set("q", nextQuery);
    if (nextStatus) params.set("status", nextStatus);
    if (nextMode) {
      const parsed = experienceModeSchema.safeParse(nextMode);
      if (parsed.success) params.set("mode", parsed.data);
    }
    if (nextDate) params.set("deliveryDate", nextDate);

    const qs = params.toString();
    router.push(qs ? `/studio/orders?${qs}` : "/studio/orders");
  }

  return (
    <form className="filters" action={applyFilters}>
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Nama atau ORD-…"
        aria-label="Nama atau ORD-…"
      />
      <select name="status" defaultValue={status} aria-label="Status">
        <option value="">Semua status</option>
        {ORDER_STATUS_FILTERS.map((entry) => (
          <option key={entry.value} value={entry.value}>
            {entry.label}
          </option>
        ))}
      </select>
      <select name="mode" defaultValue={mode} aria-label="Mode">
        <option value="">Semua mode</option>
        {EXPERIENCE_MODES.map((entry) => (
          <option key={entry.value} value={entry.value}>
            {entry.label}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="deliveryDate"
        defaultValue={deliveryDate}
        aria-label="Tanggal pengantaran"
      />
      <button className="btn btn-brand" type="submit">
        Saring
      </button>
    </form>
  );
}
