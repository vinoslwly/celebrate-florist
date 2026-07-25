import { Suspense } from "react";

import { SkyThemeLabPage } from "@/features/theme-lab/components/sky-theme-lab-page";

export default function SkyThemeLabRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading Theme Lab…
        </div>
      }
    >
      <SkyThemeLabPage />
    </Suspense>
  );
}
