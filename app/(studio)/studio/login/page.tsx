import { LoginForm } from "@/features/studio/components/login-form";

export const metadata = {
  title: "Studio Login — Celebrate Florist",
  description: "Admin sign in",
};

export default function StudioLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1 text-center">
          <p className="font-mono text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Celebrate Florist
          </p>
          <h1 className="font-serif text-2xl font-semibold">Studio</h1>
          <p className="text-sm text-muted-foreground">Admin sign in</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
