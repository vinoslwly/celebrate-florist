import type { WebsiteContent } from "@/features/website/config/types";

type SiteFooterProps = {
  content: WebsiteContent;
};

export function SiteFooter({ content }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p>{content.footer.copyright}</p>
        <a
          href={content.links.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
