"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { OrderStatus } from "@/types/database";

import { EXPERIENCE_MODES } from "@/features/studio/config/experience-modes";
import { experienceModeSchema } from "@/schemas/experience-mode";

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "designing", label: "Designing" },
  { value: "preview_sent", label: "Preview sent" },
  { value: "approved", label: "Approved" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
];

const inputClass =
  "rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function OrdersListFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "";
  const mode = searchParams.get("mode") ?? "";
  const deliveryDate = searchParams.get("deliveryDate") ?? "";

  function updateFilters(next: {
    status?: string;
    mode?: string;
    deliveryDate?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();
    router.push(query ? `/studio/orders?${query}` : "/studio/orders");
  }

  return (
    <form
      className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-1">
        <label
          htmlFor="status"
          className="text-xs font-medium text-muted-foreground"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className={inputClass}
        >
          <option value="">All</option>
          {ORDER_STATUSES.map((entry) => (
            <option key={entry.value} value={entry.value}>
              {entry.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="mode"
          className="text-xs font-medium text-muted-foreground"
        >
          Mode
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              updateFilters({ mode: "" });
              return;
            }
            const parsed = experienceModeSchema.safeParse(value);
            if (parsed.success) {
              updateFilters({ mode: parsed.data });
            }
          }}
          className={inputClass}
        >
          <option value="">All</option>
          {EXPERIENCE_MODES.map((entry) => (
            <option key={entry.value} value={entry.value}>
              {entry.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="deliveryDate"
          className="text-xs font-medium text-muted-foreground"
        >
          Delivery date
        </label>
        <input
          id="deliveryDate"
          type="date"
          value={deliveryDate}
          onChange={(e) => updateFilters({ deliveryDate: e.target.value })}
          className={inputClass}
        />
      </div>

      {(status || mode || deliveryDate) && (
        <button
          type="button"
          onClick={() =>
            updateFilters({ status: "", mode: "", deliveryDate: "" })
          }
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear filters
        </button>
      )}
    </form>
  );
}
