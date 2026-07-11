import {
  ApplicationError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors/codes";

import type { PostgrestError } from "@supabase/supabase-js";

/** Generic message safe to return to clients for unexpected failures. */
export const GENERIC_CLIENT_ERROR_MESSAGE = "Something went wrong.";

/**
 * Maps a Supabase PostgREST error to an ApplicationError subclass.
 * Repositories call this — they never throw raw PostgrestError.
 */
export function mapSupabaseError(error: PostgrestError): ApplicationError {
  switch (error.code) {
    case "PGRST116":
      return new NotFoundError();
    case "23505":
      return new ConflictError(
        "A record with this value already exists",
        error,
      );
    case "23503":
      return new ValidationError("Referenced record does not exist", error);
    case "23514":
      return new ValidationError("Data violates a business rule", error);
    case "42501":
      return new ApplicationError("Insufficient database privileges", {
        code: ErrorCode.FORBIDDEN,
        statusCode: 403,
        cause: error,
      });
    default:
      return new InternalServerError(GENERIC_CLIENT_ERROR_MESSAGE, error);
  }
}

/**
 * Normalizes any thrown value into an ApplicationError.
 * Server Action helpers use this in catch blocks.
 *
 * Unknown errors receive a generic client message; the original error
 * is preserved as `cause` for server-side logging.
 */
export function toApplicationError(error: unknown): ApplicationError {
  if (error instanceof ApplicationError) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(GENERIC_CLIENT_ERROR_MESSAGE, error);
  }

  return new InternalServerError(GENERIC_CLIENT_ERROR_MESSAGE, error);
}

/**
 * Returns the message safe to expose in API/Server Action responses.
 * Internal details from 5xx errors are never forwarded to clients.
 */
export function getClientSafeMessage(error: ApplicationError): string {
  if (error.statusCode >= 500) {
    return GENERIC_CLIENT_ERROR_MESSAGE;
  }

  return error.message;
}

/**
 * Returns the message to write to server logs.
 * Prefers the underlying cause over the sanitized client message.
 */
export function getLogMessage(error: ApplicationError): string {
  if (error.cause instanceof Error) {
    return error.cause.message;
  }

  return error.message;
}
