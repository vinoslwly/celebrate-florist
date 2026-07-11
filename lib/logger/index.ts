import "server-only";

import type { LogChannel, LogEntry, LogLevel } from "@/lib/logger/types";

/* eslint-disable no-console -- centralized logger; console is the sink */

const isDev = process.env.NODE_ENV === "development";

function write(entry: LogEntry) {
  const payload = {
    ...entry,
    env: process.env.NODE_ENV ?? "unknown",
  };

  if (isDev) {
    const prefix = `[${entry.channel}:${entry.level}]`;
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
    const line = `${prefix} ${entry.message}${context}`;

    switch (entry.level) {
      case "error":
        console.error(line);
        break;
      case "warn":
        console.warn(line);
        break;
      default:
        console.log(line);
    }
    return;
  }

  // Production: single-line JSON for Vercel log ingestion.
  const method =
    entry.level === "error"
      ? console.error
      : entry.level === "warn"
        ? console.warn
        : console.log;

  method(JSON.stringify(payload));
}

function log(
  level: LogLevel,
  channel: LogChannel,
  message: string,
  context?: Record<string, unknown>,
) {
  write({
    level,
    channel,
    message,
    timestamp: new Date().toISOString(),
    context,
  });
}

/** General application logging. */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    log("debug", "app", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", "app", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    log("warn", "app", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    log("error", "app", message, context),
};

/** Security-relevant events (auth failures, rate limits, etc.). */
export const securityLogger = {
  warn: (message: string, context?: Record<string, unknown>) =>
    log("warn", "security", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    log("error", "security", message, context),
};

/** Admin and system actions destined for audit trail correlation. */
export const auditLogger = {
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", "audit", message, context),
};
