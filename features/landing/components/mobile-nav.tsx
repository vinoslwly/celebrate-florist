"use client";

import { useState } from "react";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/features/landing/config/nav-items";

/**
 * Client island for the mobile navigation drawer. Isolated from
 * SiteNavbar (a Server Component) so only this small piece of
 * interactivity ships client-side JavaScript.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Celebrate Florist</SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 px-4"
        >
          {NAV_ITEMS.map((item) => (
            <SheetClose asChild key={item.href}>
              <a
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </a>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
