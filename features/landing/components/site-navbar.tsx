import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/features/landing/components/mobile-nav";
import { NAV_ITEMS } from "@/features/landing/config/nav-items";
import { ORDER_LINK } from "@/features/landing/config/whatsapp-messages";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-pink-soft/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-deep to-peach text-base shadow-soft"
          >
            🌸
          </span>
          <span className="font-serif text-base font-bold tracking-tight text-foreground">
            celebrate.florist
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-bold tracking-wide text-foreground/75 uppercase transition-colors hover:text-pink-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="brand"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {/*
             * Goes straight to WhatsApp, same as every other "Order Now"
             * CTA on the page. Previously scrolled to #final-cta instead,
             * forcing an extra click before reaching WhatsApp — fixed
             * during the Sprint 01C review.
             */}
            <a href={ORDER_LINK} target="_blank" rel="noopener noreferrer">
              Order Now <span aria-hidden="true">→</span>
            </a>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
