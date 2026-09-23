import { buildWhatsAppLink } from "@/lib/whatsapp";

import type { WebsiteContent } from "@/features/website/config/types";

export function websiteOrderLink(content: WebsiteContent): string {
  return buildWhatsAppLink(
    content.whatsapp.orderMessage,
    content.whatsapp.number,
  );
}

export function websiteCssVars(
  content: WebsiteContent,
): Record<string, string> {
  return {
    "--cream": content.colors.cream,
    "--rose": content.colors.rose,
    "--gold": content.colors.gold,
    "--ink": content.colors.ink,
    "--pink": content.colors.rose,
  };
}
