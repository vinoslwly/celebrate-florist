"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/features/studio/actions/auth";
import { STUDIO_LOGIN_FAILURE_MESSAGE } from "@/features/studio/config/auth-messages";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = "studio-login-error";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await loginAction({ email, password });

    if (!result.ok) {
      setError(STUDIO_LOGIN_FAILURE_MESSAGE);
      setIsLoading(false);
      return;
    }

    router.push(result.data.redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FieldError
        id={errorId}
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm"
      >
        {error}
      </FieldError>

      <Field>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </Field>

      <Field>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isLoading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </Field>

      <Button
        type="submit"
        className="w-full min-h-11"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Back to site
        </Link>
      </p>
    </form>
  );
}
