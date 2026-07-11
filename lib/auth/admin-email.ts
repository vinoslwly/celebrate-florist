/**
 * Pure admin email comparison — safe to import from Edge proxy.
 * Callers supply the configured admin address; this module never
 * reads process.env directly.
 */
export function isAdminEmailMatch(
  email: string,
  configuredAdminEmail: string,
): boolean {
  return (
    email.toLowerCase().trim() === configuredAdminEmail.toLowerCase().trim()
  );
}
