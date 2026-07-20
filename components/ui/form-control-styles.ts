import { cn } from "@/lib/utils";

/** Shared Celebrate form control surface — matches existing Studio input styling. */
export function formControlClassName(className?: string) {
  return cn(
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    className,
  );
}
