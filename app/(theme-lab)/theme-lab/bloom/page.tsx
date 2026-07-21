import { Suspense } from "react";

import { BloomThemeLabPage } from "@/features/theme-lab/components/bloom-theme-lab-page";

export default function BloomThemeLabRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading Theme Lab…
        </div>
      }
    >
      <BloomThemeLabPage />
    </Suspense>
  );
}
