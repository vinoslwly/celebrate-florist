"use client";

import { useState, type ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { buildNavItems } from "@/features/landing/config/nav-items";
import { websiteOrderLink } from "@/features/website/config/order-link";
import type { WebsiteContent } from "@/features/website/config/types";

function NavAnchor({
  href,
  external,
  children,
  onClick,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick}>
      {children}
    </Link>
  );
}

type SiteNavbarProps = {
  content: WebsiteContent;
};

export function SiteNavbar({ content }: SiteNavbarProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const navItems = buildNavItems(content);
  const orderLink = websiteOrderLink(content);
  const logoIsSvg = content.brand.logoUrl.toLowerCase().includes(".svg");

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/">
          <Image
            className="brand-logo"
            src={content.brand.logoUrl}
            alt="Celebrate Florist"
            width={40}
            height={40}
            unoptimized={logoIsSvg}
          />
          <span className="brand-text">
            <span className="brand-celebrate">Celebrate</span>
            <span className="brand-florist">Florist</span>
          </span>
        </Link>
        <nav className="nav-desktop" aria-label="Utama">
          {navItems.map((item) => (
            <NavAnchor
              key={item.label}
              href={item.href}
              external={item.external}
            >
              {item.label}
            </NavAnchor>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="btn btn-brand btn-sm hide-sm"
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Let&apos;s Celebrate →
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav-toggle-icon" aria-hidden="true">
              <span />
            </span>
            <span className="nav-toggle-label">Menu</span>
          </button>
        </div>
      </div>
      <div id="mobile-nav" className="mobile-nav" hidden={!open}>
        {navItems.map((item) => (
          <NavAnchor
            key={item.label}
            href={item.href}
            external={item.external}
            onClick={close}
          >
            {item.label}
          </NavAnchor>
        ))}
        <a
          className="btn btn-brand"
          href={orderLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          Let&apos;s Celebrate →
        </a>
      </div>
    </header>
  );
}
