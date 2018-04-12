/** @module ServiceError
 * @summary an Error class describing a service abstractor call error.
 * Objects of this type are the value that a promise returned by dynamic service
 * abstractor should reject with.
 *
 * @author Ben
 */
import ExtendableError from 'es6-error';

export class ServiceError extends ExtendableError {

  /**
   * @param {string}  errorCodes A comma separated list of error codes.
   * @param {object} errorMessages A simple object that maps names to error messages.
   *                       the names are usually form field names. The special
   *                       name _error is used to store an error that is not associated.
   *                       with a specific field.
   * @param {number}  networkStatusCode an optional HTTP response status code.
   */
  constructor (errorCodes, errorMessages, networkStatusCode) {
    super('API service call failed');

    this.errorCodes = errorCodes;
    this.errorMessages = errorMessages;
    this.networkStatusCode = networkStatusCode;
  }
}
