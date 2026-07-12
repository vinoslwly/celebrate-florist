import type { PublishChecklistItem } from "@/features/studio/config/publish-checklist";

type PublishChecklistProps = {
  items: PublishChecklistItem[];
};

function statusColor(status: PublishChecklistItem["status"]): string {
  switch (status) {
    case "pass":
      return "text-emerald-600";
    case "fail":
      return "text-destructive";
    case "blocked":
      return "text-amber-600";
  }
}

function statusLabel(status: PublishChecklistItem["status"]): string {
  switch (status) {
    case "pass":
      return "Ready";
    case "fail":
      return "Missing";
    case "blocked":
      return "Blocked";
  }
}

export function PublishChecklist({ items }: PublishChecklistProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold">Pre-publish checklist</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        All items must be ready before Publish is enabled.
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{item.label}</p>
              {item.message ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.message}
                </p>
              ) : null}
            </div>
            <span
              className={`shrink-0 text-xs font-semibold uppercase ${statusColor(item.status)}`}
            >
              {statusLabel(item.status)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
