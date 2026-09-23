"use client";

import { useState } from "react";

import { logoutAction } from "@/features/studio/actions/auth";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await logoutAction();
    setIsLoading(false);
  }

  return (
    <button type="button" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Keluar…" : "Keluar"}
    </button>
  );
}
