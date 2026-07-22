import type { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme Lab — Celebrate Florist",
  robots: { index: false, follow: false },
};

export default function ThemeLabLayout({ children }: { children: ReactNode }) {
  return children;
}
