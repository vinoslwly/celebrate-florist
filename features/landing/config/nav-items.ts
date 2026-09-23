import type { WebsiteContent } from "@/features/website/config/types";

export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export function buildNavItems(content: WebsiteContent): NavItem[] {
  return [
    { href: "#what-is-celebrate", label: "Tentang" },
    { href: content.links.bouquetUrl, label: "Bouquet", external: true },
    { href: "#experience", label: "Experience" },
    { href: "#how-it-works", label: "Proses" },
    { href: content.links.demoHref, label: "Demo" },
    { href: "#faq", label: "FAQ" },
  ];
}
