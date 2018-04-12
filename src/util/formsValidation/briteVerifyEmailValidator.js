/** @module briteVerifyEmailValidator
 * a validation method for email addresses using the Bright Verify service.
 */
import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
const BV_API_KEY = 'e50ab0a9-ac0b-436b-9932-2a74b9486436';
const invalidEmailErrorCodes = ['email_address_invalid', 'email_domain_invalid', 'email_account_invalid'];
const validStatuses = ['valid', 'accept_all', 'unknown'];

// Note: to avoid cors we are turning it into a jsonp
// DT-32025: only accept 'valid'
export function briteVerifyEmailValidator (emailAddress) {

  // This is For QA
  if (typeof emailAddress === 'string' && emailAddress.toLowerCase().indexOf('@yopmail.com') > -1) {
    return Promise.resolve();
  }

  // FixMe: We Need to debounce this just like we do for the search API!
  return new Promise((resolve, reject) => {
    superagent.get('https://bpi.briteverify.com/emails.json').query({
      apikey: BV_API_KEY,
      address: emailAddress
    }).use(jsonp({
      timeout: 2000
    })).then((response) => {
      let result = response.body;

      if (validStatuses.indexOf(result.status) > -1) {
        resolve();
      } else if (invalidEmailErrorCodes.indexOf(result.error_code) > -1) {
        reject(result.error_code);
      } else {
        reject(result.status);
      }

    }).catch(() =>      // call to briteverify validation failed
      /** assume email address is OK -- this validation is a nicety */
      resolve()
    );
  });
}

export function briteVerifyStatusExtraction (emailAddress) {
  return new Promise((resolve, reject) => {
    superagent.get('https://bpi.briteverify.com/emails.json').query({
      apikey: BV_API_KEY,
      address: emailAddress
    }).use(jsonp({
      timeout: 2000
    })).then((response) => {
      let result = response.body;
      resolve(`${result.status}::false:false`);
    }).catch(() => {  // call to briteverify validation failed
      /** assume email address is OK -- this validation is a nicety */
      resolve('no_response::false:false');
    });
  });
}
