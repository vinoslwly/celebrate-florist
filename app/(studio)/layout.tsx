import type { ReactNode } from "react";

import { marketingFontClassName } from "@/features/landing/config/marketing-fonts";
import { StudioLayoutWrapper } from "@/features/studio/components/studio-layout-wrapper";

import "@/features/landing/styles/marketing.css";
import "@/features/studio/styles/studio.css";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className={marketingFontClassName}>
      <StudioLayoutWrapper>{children}</StudioLayoutWrapper>
    </div>
  );
}
