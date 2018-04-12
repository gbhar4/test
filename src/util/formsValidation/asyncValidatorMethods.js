/** @module asyncValidatorMethods
 * @summary exports an object mapping asyncronous validation names to methods.
 *
 * Each such method will receive the following parameters:
 *  <code>value, values, dispatch, props, blurredField</code> where:
 *  <code>value</code> is the value of the field that triggered the validation call;
 *  <code>allValues</code>: are all the values of all the form fields;
 *  <code>dispatch</code> is the redux store dispatch method;
 *  <code>props</code> are the props passed to the form;
 *  <code>blurredField</code> is the full field name.
 *  @see the <code>asyncValidate</code> prop of redux-form for more info.
 *
 * Each such method should return a promise that either resolves (no error);
 * or rejects with an error message string, or an object mapping field names
 * to error messages (again see <code>asyncValidate</code> prop of redux-form for more info.);
 */
import {briteVerifyEmailValidator} from './briteVerifyEmailValidator.js';

export const asyncValidatorMethods = {
  asyncEmail: briteVerifyEmailValidator
};
