import { Suspense } from "react";

import { WarmThemeLabPage } from "@/features/theme-lab/components/warm-theme-lab-page";

export default function WarmThemeLabRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading Theme Lab…
        </div>
      }
    >
      <WarmThemeLabPage />
    </Suspense>
  );
}
