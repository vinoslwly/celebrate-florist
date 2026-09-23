import type { ReactNode } from "react";

export default function ExperienceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100svh] overflow-x-clip bg-gradient-to-b from-background via-warmwhite to-muted/50">
      <main>{children}</main>
    </div>
  );
}
