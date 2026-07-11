export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogChannel = "app" | "security" | "audit";

export type LogEntry = {
  level: LogLevel;
  channel: LogChannel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
};
