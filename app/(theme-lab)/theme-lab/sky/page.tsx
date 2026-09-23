import { SkyThemeLabPage } from "@/features/theme-lab/components/sky-theme-lab-page";

/** Avoid prerendering the Suspense shell — iOS Safari can stay on that HTML. */
export const dynamic = "force-dynamic";

type SkyThemeLabRouteProps = {
  searchParams: Promise<{
    noPhotos?: string;
    mode?: string;
    scene?: string;
  }>;
};

export default async function SkyThemeLabRoute({
  searchParams,
}: SkyThemeLabRouteProps) {
  const params = await searchParams;

  return (
    <SkyThemeLabPage
      noPhotos={params.noPhotos === "1"}
      mode={params.mode ?? null}
      scene={params.scene ?? null}
    />
  );
}
