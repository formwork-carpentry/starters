/**
 * @module config
 * @description Application configuration - all values driven by environment variables.
 *
 * @example
 * ```ts
 * // Access via container:
 * const config = container.make<Config>('config');
 * config.get('app.name');  // reads APP_NAME from .env
 * config.get('app.debug'); // reads APP_DEBUG from .env
 * ```
 */

/**
 * Build the application config object from environment variables.
 *
 * @param {Function} env - Environment variable reader (e.g., process.env[key] ?? fallback)
 * @returns {Record<string, unknown>} Configuration object
 */
export function appConfig(env: (key: string, fallback?: string) => string): Record<string, unknown> {
  return {
    name: env('APP_NAME', 'CarpenterFullstack'),
    env: env('APP_ENV', 'development'),
    debug: env('APP_DEBUG', 'true') === 'true',
    port: parseInt(env('APP_PORT', '3000'), 10),
    url: env('APP_URL', 'http://localhost:3000'),
    key: env('APP_KEY', ''),
  };
}
