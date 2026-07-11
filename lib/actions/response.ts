import { getClientSafeMessage, type ApplicationError } from "@/lib/errors";

import type { ActionFailure, ActionSuccess } from "@/types/api";

export function actionSuccess<T>(data: T): ActionSuccess<T> {
  return { ok: true, data };
}

export function actionFailure(error: ApplicationError): ActionFailure {
  return {
    ok: false,
    error: {
      message: getClientSafeMessage(error),
      code: error.code,
    },
  };
}
