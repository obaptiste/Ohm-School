/**
 * Utility functions for the application
 */

/** Helper type for structured logging */
type LogLevel = "info" | "warn" | "error";

/**
 * Logs a message with a specified level
 * @param level - Log level (info, warn, error)
 * @param message - Message to log
 * @param data - Optional data to log
 */
export function log(level: LogLevel, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (data) {
    console[level === "warn" ? "warn" : level === "error" ? "error" : "log"](
      `${prefix} ${message}`,
      data
    );
  } else {
    console[level === "warn" ? "warn" : level === "error" ? "error" : "log"](
      `${prefix} ${message}`
    );
  }
}

/** Shorthand for info logging */
export function info(message: string, data?: unknown): void {
  log("info", message, data);
}

/** Shorthand for warning logging */
export function warn(message: string, data?: unknown): void {
  log("warn", message, data);
}

/** Shorthand for error logging */
export function error(message: string, data?: unknown): void {
  log("error", message, data);
}
