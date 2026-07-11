/**
 * Stable machine-readable error codes for Server Action responses and logs.
 * Add new codes here — never invent ad-hoc strings in feature code.
 */
export const ErrorCode = {
  VALIDATION: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL: "INTERNAL_ERROR",
  CONFIG: "CONFIG_ERROR",
  DATABASE: "DATABASE_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
