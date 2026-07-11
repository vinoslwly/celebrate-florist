import { requireAdminUser } from "@/lib/auth";

import { LogoutButton } from "@/features/studio/components/logout-button";

export const metadata = {
  title: "Studio — Celebrate Florist",
  description: "Admin workspace",
};

export default async function StudioHomePage() {
  const user = await requireAdminUser();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Celebrate Florist
          </p>
          <h1 className="font-serif text-2xl font-semibold">Studio</h1>
        </div>
        <LogoutButton />
      </header>

      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="mt-1 font-medium">{user.email}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Order and experience tools will appear here in upcoming sprints.
        </p>
      </section>
    </main>
  );
}
