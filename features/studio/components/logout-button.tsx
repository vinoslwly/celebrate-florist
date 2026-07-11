"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/studio/actions/auth";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await logoutAction();
    setIsLoading(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
