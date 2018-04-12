/**
 * Creates an action to store a flash message to show in the next location. The
 * message will expire when navigating from a different location than this
 * (i.e., when leaving the location subsequent to the current one).
 *
 * @param {string} message Message to save for flashing in the next location.
 * @param {string} type Type of flash message (any of the FLASH_TYPES values).
 */
export function getSetFlashMessageActn (message, type) {
  return {
    message,
    flashType: type,
    type: 'GENERAL_FLASH_SET_MESSAGE'
  };
}

/**
 * Creates an action to indicate if the current flash success message should
 * be marked for expiration.
 *
 * @param {bool} expire Whether the message should expire already.
 */
export function getSetFlashMessageExpiresNow (expire) {
  return {
    expire,
    type: 'GENERAL_FLASH_SET_EXPIRES_NOW'
  };
}
