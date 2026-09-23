"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

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
    <form onSubmit={handleSubmit} className="stack" noValidate>
      {error ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <label htmlFor="email">
        Email
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </label>

      <label htmlFor="password">
        Kata sandi
        <input
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
      </label>

      <button
        className="btn btn-brand btn-lg"
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? "Masuk…" : "Masuk"}
      </button>
    </form>
  );
}
