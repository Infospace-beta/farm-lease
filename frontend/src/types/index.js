/**
 * Shared type/shape definitions for the Farm Lease application.
 * Using JSDoc for type documentation (migrate to TypeScript as needed).
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'landowner'|'lessee'|'dealer'|'admin'} role
 * @property {string} [phone_number]
 */

/**
 * @typedef {Object} Land
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} size_acres
 * @property {number} price_per_acre
 * @property {string} location
 * @property {'available'|'leased'|'pending'} status
 * @property {number} owner
 */

/**
 * @typedef {Object} LeaseRequest
 * @property {number} id
 * @property {number} land
 * @property {number} lessee
 * @property {'pending'|'approved'|'rejected'} status
 * @property {string} start_date
 * @property {string} end_date
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} stock
 * @property {number} dealer
 */
