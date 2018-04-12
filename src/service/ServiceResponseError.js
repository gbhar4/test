/** @module ServiceResponseError
 * @summary an Error class wrapping a superagent response.
 *
 * @author Ben
 */
import ExtendableError from 'es6-error';

export class ServiceResponseError extends ExtendableError {

  /**
   * @param {object} response A superagent response object.
   */
  constructor (response) {
    super('API service call response with text reporting an error');
    this.response = response;
  }
}
