/**
 * Interface/contract definitions for API responses and service layers.
 * These describe the shapes expected from the backend.
 */

/**
 * @typedef {Object} ApiResponse
 * @property {any} data
 * @property {string} [message]
 * @property {boolean} [success]
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {number} count
 * @property {string|null} next
 * @property {string|null} previous
 * @property {any[]} results
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} access
 * @property {string} refresh
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {'landowner'|'lessee'|'dealer'} role
 * @property {string} [phone_number]
 */
