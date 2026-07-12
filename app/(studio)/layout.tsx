import type { ReactNode } from "react";

import { StudioLayoutWrapper } from "@/features/studio/components/studio-layout-wrapper";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <StudioLayoutWrapper>{children}</StudioLayoutWrapper>;
}
