import "server-only";

import { requireAdminUser } from "@/lib/actions/auth";
import { actionFailure, actionSuccess } from "@/lib/actions/response";
import { toApplicationError, getLogMessage } from "@/lib/errors";
import { logger } from "@/lib/logger";

import type { ActionResult } from "@/types/api";

type ActionOptions = {
  /** Log unexpected errors. Defaults to true. */
  logErrors?: boolean;
};

/**
 * Wraps a Server Action body with consistent error handling.
 * Returns a typed ActionResult instead of throwing to the client.
 *
 * @example
 * export async function myAction(input: unknown) {
 *   return withActionHandler(async () => {
 *     const data = validateActionInput(schema, input);
 *     return doWork(data);
 *   });
 * }
 */
export async function withActionHandler<T>(
  fn: () => Promise<T>,
  options: ActionOptions = {},
): Promise<ActionResult<T>> {
  const { logErrors = true } = options;

  try {
    const data = await fn();
    return actionSuccess(data);
  } catch (error) {
    const appError = toApplicationError(error);

    if (logErrors && appError.statusCode >= 500) {
      logger.error(getLogMessage(appError), {
        code: appError.code,
        cause:
          appError.cause instanceof Error ? appError.cause.message : undefined,
      });
    }

    return actionFailure(appError);
  }
}

/**
 * Runs an authenticated admin-only Server Action.
 * Combines requireAdminUser + withActionHandler.
 */
export async function withAdminAction<T>(
  fn: () => Promise<T>,
  options?: ActionOptions,
): Promise<ActionResult<T>> {
  return withActionHandler(async () => {
    await requireAdminUser();
    return fn();
  }, options);
}
