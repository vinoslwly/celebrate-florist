import type { ErrorCode } from "@/lib/errors";

/** Successful Server Action response. */
export type ActionSuccess<T> = {
  ok: true;
  data: T;
};

/** Failed Server Action response — safe to return to the client. */
export type ActionFailure = {
  ok: false;
  error: {
    message: string;
    code: ErrorCode;
  };
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;
