/** Grace window after first successful recipient access (founder decision). */
export const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

/** HttpOnly cookie storing trusted device session for recipient routes. */
export const SESSION_COOKIE_NAME = "cf_experience_session";

/** Trusted device session lifetime after Memory Code verification. */
export const SESSION_DURATION_MS = 365 * 24 * 60 * 60 * 1000;

/** Failed Memory Code attempts allowed per experience + IP per hour. */
export const MAX_MEMORY_CODE_ATTEMPTS_PER_HOUR = 5;

export const MEMORY_CODE_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/** Basic IP throttle for /e/* routes in proxy.ts (requests per minute). */
export const PROXY_RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const PROXY_MAX_REQUESTS_PER_WINDOW = 120;
