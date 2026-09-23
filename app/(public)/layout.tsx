import type { CSSProperties, ReactNode } from "react";

import { MotionProvider } from "@/components/providers/motion-provider";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteNavbar } from "@/features/landing/components/site-navbar";
import { marketingFontClassName } from "@/features/landing/config/marketing-fonts";
import { websiteCssVars } from "@/features/website/config/order-link";
import { getWebsiteContent } from "@/features/website/services/get-website-content.service";

import "@/features/landing/styles/marketing.css";

export async function generateMetadata() {
  const content = await getWebsiteContent();
  return {
    title: content.brand.siteTitle,
    description: content.brand.siteDescription,
    icons: {
      icon: content.brand.faviconUrl,
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const content = await getWebsiteContent();

  return (
    <MotionProvider>
      <div
        className={`${marketingFontClassName} page-public`}
        style={websiteCssVars(content) as CSSProperties}
      >
        <a className="skip-link" href="#main">
          Langsung ke isi
        </a>
        <SiteNavbar content={content} />
        <main id="main">{children}</main>
        <SiteFooter content={content} />
      </div>
    </MotionProvider>
  );
}
