import { Fira_Code, Fraunces, Poppins } from "next/font/google";

import { VisitorMetrics } from "@/components/visitor-metrics";

import type { Metadata } from "next";
import "./globals.css";

/**
 * Brand typography, ported from the original prototype's visual
 * identity: Poppins (friendly, rounded body copy), Fraunces (warm
 * serif for headings — replaces the prototype's browser-default
 * serif fallback with an actual designed typeface), Fira Code
 * (monospace for eyebrow labels / playful "code-comment" copy).
 *
 * Weight lists are audited to match exactly what the Landing Page
 * uses (verified via grep during the Sprint 01C review) — every
 * unlisted weight is a font file the browser has to download for
 * nothing. Fira Code was previously loaded at 500/600 while every
 * usage requested `font-bold` (700), which neither weight covers;
 * fixed here alongside removing the unused Poppins 300/600/800.
 * If you add a new font-weight utility to Landing Page copy, add the
 * matching weight below or it will render synthetically bolded.
 */
const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Celebrate Florist",
  description: "Preparing beautiful moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${fraunces.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <VisitorMetrics />
      </body>
    </html>
  );
}
