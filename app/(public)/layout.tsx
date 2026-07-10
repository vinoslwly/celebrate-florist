import type { ReactNode } from "react";

import { MotionProvider } from "@/components/providers/motion-provider";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteNavbar } from "@/features/landing/components/site-navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen flex-col">
        <SiteNavbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </MotionProvider>
  );
}
