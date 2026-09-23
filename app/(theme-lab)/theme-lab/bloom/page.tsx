import { BloomThemeLabPage } from "@/features/theme-lab/components/bloom-theme-lab-page";

/** Avoid prerendering the Suspense shell — iOS Safari can stay on that HTML. */
export const dynamic = "force-dynamic";

type BloomThemeLabRouteProps = {
  searchParams: Promise<{
    connectionScene?: string;
    memoriesScene?: string;
    treasuresScene?: string;
  }>;
};

export default async function BloomThemeLabRoute({
  searchParams,
}: BloomThemeLabRouteProps) {
  const params = await searchParams;

  return (
    <BloomThemeLabPage
      connectionScene={params.connectionScene ?? null}
      memoriesScene={params.memoriesScene ?? null}
      treasuresScene={params.treasuresScene ?? null}
    />
  );
}
