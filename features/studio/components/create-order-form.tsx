"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import type { EventType, ExperienceMode, ThemeRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { formControlClassName } from "@/components/ui/form-control-styles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrderAction } from "@/features/studio/actions/orders";
import { getThemeMarketingLabel } from "@/features/studio/config/labels";
import { STUDIO_ROUTES } from "@/features/studio/config/routes";
import {
  getSelectableExperienceModes,
  isProductionMomentsTheme,
} from "@/features/studio/config/theme-mode-matrix";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";
import {
  themeAccent,
  themeAccentText,
} from "@/features/themes/config/theme-surfaces";
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
  const selectedThemeVisual = selectedTheme
    ? resolveThemeTokens(selectedTheme)
    : null;
  const selectableModes = getSelectableExperienceModes(
    selectedTheme?.slug ?? "",
  );
  const modeToCreate = selectableModes.some(
    (mode) => mode.value === experienceMode,
  )
    ? experienceMode
    : (selectableModes[0]?.value ?? "moments");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTheme) {
      setError("Please select a theme.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createOrderAction({
        experienceMode: modeToCreate,
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
        return;
      }

      await router.push(STUDIO_ROUTES.orderDetail(result.data.orderId));
    } catch {
      setError(
        "Could not create the order. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

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

      <FieldGroup>
        <p className="text-sm font-medium text-foreground">Experience mode</p>
        {isProductionMomentsTheme(selectedTheme?.slug ?? "") ? (
          <p className="text-xs text-muted-foreground">
            {getThemeMarketingLabel(selectedTheme?.slug ?? "")} is live as
            Moments — recipients get the full ceremony at /e/[token]. Other
            modes stay in Theme Lab.
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {selectableModes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setExperienceMode(mode.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                modeToCreate === mode.value
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
      </FieldGroup>

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="senderName">Sender name</Label>
          <Input
            id="senderName"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            disabled={isLoading}
          />
        </Field>
        <Field>
          <Label htmlFor="receiverName">Recipient name</Label>
          <Input
            id="receiverName"
            required
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            disabled={isLoading}
          />
        </Field>
      </FieldGroup>

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="theme">Theme</Label>
          <select
            id="theme"
            required
            value={themeId}
            onChange={(e) => {
              const nextId = e.target.value;
              setThemeId(nextId);
              const nextTheme = themes.find((theme) => theme.id === nextId);
              const nextModes = getSelectableExperienceModes(
                nextTheme?.slug ?? "",
              );
              const onlyMode =
                nextModes.length === 1 ? nextModes[0] : undefined;
              if (onlyMode) {
                setExperienceMode(onlyMode.value);
              }
            }}
            className={formControlClassName()}
            disabled={isLoading}
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {getThemeMarketingLabel(theme.slug, theme.name)}
              </option>
            ))}
          </select>
          {selectedThemeVisual ? (
            <p
              className="flex items-center gap-2 text-xs text-muted-foreground"
              aria-label={`Theme preview: ${getThemeMarketingLabel(selectedThemeVisual.id, selectedThemeVisual.name)}`}
            >
              <span
                className={cn(
                  "inline-block h-3 w-3 shrink-0 rounded-full border border-border",
                  themeAccent(selectedThemeVisual),
                )}
                aria-hidden
              />
              <span className={themeAccentText(selectedThemeVisual)}>
                {selectedThemeVisual.feeling} · {selectedThemeVisual.flower}
              </span>
            </p>
          ) : null}
        </Field>
        <Field>
          <Label htmlFor="eventType">Event type</Label>
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
            className={formControlClassName()}
            disabled={isLoading}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
      </FieldGroup>

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="buyerWhatsapp">Buyer WhatsApp (optional)</Label>
          <Input
            id="buyerWhatsapp"
            value={buyerWhatsapp}
            onChange={(e) => setBuyerWhatsapp(e.target.value)}
            disabled={isLoading}
          />
        </Field>
        <Field>
          <Label htmlFor="scheduledDeliveryAt">
            Scheduled delivery (optional)
          </Label>
          <Input
            id="scheduledDeliveryAt"
            type="datetime-local"
            value={scheduledDeliveryAt}
            onChange={(e) => setScheduledDeliveryAt(e.target.value)}
            disabled={isLoading}
          />
        </Field>
      </FieldGroup>

      <Field>
        <Label htmlFor="adminNotes">Admin notes (optional)</Label>
        <Textarea
          id="adminNotes"
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          disabled={isLoading}
        />
      </Field>

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
