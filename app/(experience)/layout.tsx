import type { ReactNode } from "react";

export default function ExperienceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <main>{children}</main>
    </div>
  );
}
