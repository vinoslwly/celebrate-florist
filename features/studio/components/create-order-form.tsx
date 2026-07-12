"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import type { EventType, ExperienceMode, ThemeRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import { createOrderAction } from "@/features/studio/actions/orders";
import { EXPERIENCE_MODES } from "@/features/studio/config/experience-modes";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import { eventTypeSchema } from "@/schemas/common";

type CreateOrderFormProps = {
  themes: ThemeRow[];
};

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "graduation", label: "Graduation" },
  { value: "friendship", label: "Friendship" },
  { value: "custom", label: "Custom" },
];

export function CreateOrderForm({ themes }: CreateOrderFormProps) {
  const router = useRouter();
  const [experienceMode, setExperienceMode] =
    useState<ExperienceMode>("moments");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [themeId, setThemeId] = useState(themes[0]?.id ?? "");
  const [eventType, setEventType] = useState<EventType>("birthday");
  const [buyerWhatsapp, setBuyerWhatsapp] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [scheduledDeliveryAt, setScheduledDeliveryAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTheme = themes.find((theme) => theme.id === themeId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTheme) {
      setError("Please select a theme.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await createOrderAction({
      experienceMode,
      senderName,
      receiverName,
      themeId: selectedTheme.id,
      eventType,
      buyerWhatsapp: buyerWhatsapp || undefined,
      adminNotes: adminNotes || undefined,
      scheduledDeliveryAt: scheduledDeliveryAt
        ? new Date(scheduledDeliveryAt).toISOString()
        : undefined,
    });

    if (!result.ok) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    router.push(STUDIO_ROUTES.orderDetail(result.data.orderId));
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Experience mode</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXPERIENCE_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setExperienceMode(mode.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                experienceMode === mode.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <p className="text-sm font-semibold">{mode.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {mode.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="senderName" className="text-sm font-medium">
            Sender name
          </label>
          <input
            id="senderName"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className={inputClass}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="receiverName" className="text-sm font-medium">
            Recipient name
          </label>
          <input
            id="receiverName"
            required
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className={inputClass}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="theme" className="text-sm font-medium">
            Theme
          </label>
          <select
            id="theme"
            required
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            className={inputClass}
            disabled={isLoading}
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="eventType" className="text-sm font-medium">
            Event type
          </label>
          <select
            id="eventType"
            required
            value={eventType}
            onChange={(e) => {
              const parsed = eventTypeSchema.safeParse(e.target.value);
              if (parsed.success) {
                setEventType(parsed.data);
              }
            }}
            className={inputClass}
            disabled={isLoading}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="buyerWhatsapp" className="text-sm font-medium">
            Buyer WhatsApp (optional)
          </label>
          <input
            id="buyerWhatsapp"
            value={buyerWhatsapp}
            onChange={(e) => setBuyerWhatsapp(e.target.value)}
            className={inputClass}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="scheduledDeliveryAt" className="text-sm font-medium">
            Scheduled delivery (optional)
          </label>
          <input
            id="scheduledDeliveryAt"
            type="datetime-local"
            value={scheduledDeliveryAt}
            onChange={(e) => setScheduledDeliveryAt(e.target.value)}
            className={inputClass}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="adminNotes" className="text-sm font-medium">
          Admin notes (optional)
        </label>
        <textarea
          id="adminNotes"
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className={inputClass}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating…" : "Create order"}
        </Button>
        <Link
          href={STUDIO_ROUTES.orders}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
