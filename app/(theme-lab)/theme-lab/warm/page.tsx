import { WarmThemeLabPage } from "@/features/theme-lab/components/warm-theme-lab-page";

/** Avoid prerendering the Suspense shell — iOS Safari can stay on that HTML. */
export const dynamic = "force-dynamic";

type WarmThemeLabRouteProps = {
  searchParams: Promise<{
    noPhotos?: string;
    mode?: string;
    scene?: string;
  }>;
};

export default async function WarmThemeLabRoute({
  searchParams,
}: WarmThemeLabRouteProps) {
  const params = await searchParams;

  return (
    <WarmThemeLabPage
      noPhotos={params.noPhotos === "1"}
      mode={params.mode ?? null}
      scene={params.scene ?? null}
    />
  );
}
