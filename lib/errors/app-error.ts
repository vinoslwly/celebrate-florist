import { ErrorCode } from "@/lib/errors/codes";

type ApplicationErrorOptions = {
  code?: ErrorCode;
  statusCode?: number;
  cause?: unknown;
};

/**
 * Base class for all application-thrown errors.
 * Feature code should throw subclasses, not raw Error.
 */
export class ApplicationError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;

  constructor(message: string, options: ApplicationErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "ApplicationError";
    this.code = options.code ?? ErrorCode.INTERNAL;
    this.statusCode = options.statusCode ?? 500;
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, cause?: unknown) {
    super(message, {
      code: ErrorCode.VALIDATION,
      statusCode: 400,
      cause,
    });
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Authentication required") {
    super(message, {
      code: ErrorCode.UNAUTHORIZED,
      statusCode: 401,
    });
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, {
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
    });
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, {
      code: ErrorCode.NOT_FOUND,
      statusCode: 404,
    });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string, cause?: unknown) {
    super(message, {
      code: ErrorCode.CONFLICT,
      statusCode: 409,
      cause,
    });
    this.name = "ConflictError";
  }
}

export class InternalServerError extends ApplicationError {
  constructor(message = "An unexpected error occurred", cause?: unknown) {
    super(message, {
      code: ErrorCode.INTERNAL,
      statusCode: 500,
      cause,
    });
    this.name = "InternalServerError";
  }
}

export class ConfigError extends ApplicationError {
  constructor(message: string) {
    super(message, {
      code: ErrorCode.CONFIG,
      statusCode: 500,
    });
    this.name = "ConfigError";
  }
}
