import { VALIDATION_MESSAGES } from '../constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Kenyan format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { isValid, message }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: VALIDATION_MESSAGES.PASSWORD_MIN,
    };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, and number',
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Max size in MB (default: 5MB)
 * @returns {boolean} True if valid
 */
export const isValidFileSize = (file, maxSize = 5) => {
  const maxBytes = maxSize * 1024 * 1024;
  return file.size <= maxBytes;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if valid
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.includes(file.type);
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {string} Error message or empty string
 */
export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return VALIDATION_MESSAGES.REQUIRED;
  }
  return '';
};

/**
 * Validate number is positive
 * @param {number} value - Number to validate
 * @returns {string} Error message or empty string
 */
export const validatePositiveNumber = (value) => {
  if (isNaN(value) || value <= 0) {
    return VALIDATION_MESSAGES.NUMBER_POSITIVE;
  }
  return '';
};

export default {
  isValidEmail,
  isValidPhone,
  validatePassword,
  isValidFileSize,
  isValidFileType,
  validateRequired,
  validatePositiveNumber,
};
