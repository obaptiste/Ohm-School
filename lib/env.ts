/**
 * Environment validation utilities.
 * Ensures required environment variables are present at runtime.
 */

const requiredEnvVars = ["DATABASE_URL"];

/**
 * Validates that all required environment variables are set.
 * Throws an error if any are missing.
 * @throws Error if required environment variables are not set
 */
export function validateEnvironment(): void {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    const missingStr = missing.join(", ");
    throw new Error(
      `Missing required environment variables: ${missingStr}. ` +
        `Please ensure these are set before running the application.`
    );
  }
}

/**
 * Gets the database URL with validation.
 * @returns The DATABASE_URL environment variable
 * @throws Error if DATABASE_URL is not set
 */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please configure your database connection string."
    );
  }
  return url;
}
