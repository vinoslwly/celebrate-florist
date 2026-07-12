/** Photos UI shell only — upload pipeline is Sprint 07. */
export function PhotosShell() {
  const slots = [1, 2, 3, 4, 5, 6] as const;

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">Memory photos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Up to 6 photos per experience. Upload is available in Sprint 07.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {slots.map((slot) => (
          <div
            key={slot}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-center"
          >
            <span className="text-xs font-medium text-muted-foreground">
              Slot {slot}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">Empty</span>
          </div>
        ))}
      </div>
    </section>
  );
}
