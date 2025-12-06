/**
 * Environment validation module for production readiness
 * Validates required environment variables and provides type-safe access
 *
 * Requirements: 1.1, 1.2, 1.3
 */

/**
 * Required server-side environment variables (not exposed to client)
 */
export const requiredServerEnvVars = [
  'OPENAI_API_KEY',
  'CLERK_SECRET_KEY',
] as const;

/**
 * Required public environment variables (accessible in client)
 */
export const requiredPublicEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
] as const;

export type ServerEnvVar = (typeof requiredServerEnvVars)[number];
export type PublicEnvVar = (typeof requiredPublicEnvVars)[number];

/**
 * Result of environment validation
 */
export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  errors: string[];
}

/**
 * Validates that all required environment variables are defined
 *
 * @param env - The environment object to validate (defaults to process.env)
 * @returns EnvValidationResult with validation status and any missing variables
 */
export function validateEnv(
  env: Record<string, string | undefined> = process.env
): EnvValidationResult {
  const missingVars: string[] = [];
  const errors: string[] = [];

  // Check server-side environment variables
  for (const varName of requiredServerEnvVars) {
    if (!env[varName] || env[varName]?.trim() === '') {
      missingVars.push(varName);
      errors.push(`Missing required server environment variable: ${varName}`);
    }
  }

  // Check public environment variables
  for (const varName of requiredPublicEnvVars) {
    if (!env[varName] || env[varName]?.trim() === '') {
      missingVars.push(varName);
      errors.push(`Missing required public environment variable: ${varName}`);
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    errors,
  };
}

/**
 * Validates environment and throws an error if validation fails
 * Use this at application startup to fail fast
 *
 * @param env - The environment object to validate (defaults to process.env)
 * @throws Error with details about missing environment variables
 */
export function assertEnvValid(
  env: Record<string, string | undefined> = process.env
): void {
  const result = validateEnv(env);

  if (!result.isValid) {
    const errorMessage = [
      'Environment validation failed!',
      '',
      'Missing environment variables:',
      ...result.missingVars.map((v) => `  - ${v}`),
      '',
      'Please ensure all required environment variables are set.',
      'See .env.example for the required variables.',
    ].join('\n');

    throw new Error(errorMessage);
  }
}

/**
 * Get a required server environment variable
 * Throws if the variable is not defined
 *
 * @param name - The name of the environment variable
 * @returns The value of the environment variable
 */
export function getServerEnv(name: ServerEnvVar): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

/**
 * Get a required public environment variable
 * Throws if the variable is not defined
 *
 * @param name - The name of the environment variable
 * @returns The value of the environment variable
 */
export function getPublicEnv(name: PublicEnvVar): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required public environment variable: ${name}`);
  }
  return value;
}
