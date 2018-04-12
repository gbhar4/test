/**
@module Help Center Service Abstractors
*/
import {endpoints} from './endpoints.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';

let previous = null;
export function getHelpCenterAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new HelpCenterDynamicAbstractor(apiHelper);
  }
  return previous;
}

class HelpCenterDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

/**
 * @function sendEmailForContactUs
 * @param {string}firstName - This is the users firstName
 * @param {string}lastName - This is the users lastName
 * @param {string}emailAddress - This is the users email
 * @param {string}confirmEmail - This is the confirmation email feild
 * @param {string}phoneNumber - This is the users phone number
 * @param {string}subject - This is the subject feild
 * @param {string}reasonCode - This is the reasonCode that the user selected
 * @param {string}message - This is the message that the user has entered
 * @param {string}orderNumber - This is the order number that the user has entered (optional)
 * @param {string}trackingNumber - This is the order tracking number that the user has entered (optional)
 * @param {string}storeAddress - This is the store name or address that the user has entered (optional)
 * @param {string}giftCardNumber - This is the gift card or merchandinse number that the user has entered (optional)
 */
  sendEmailForContactUs (formData) {
    let payload = {
      body: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.emailAddress,
        confirmEmail: formData.confirmEmailAddress,
        phoneNumber: formData.phoneNumber,
        subject: formData.subject,
        reasonCode: formData.reasonCode,
        message: formData.message,
        orderNumber: formData.orderNumber || '',
        trackingNumber: formData.orderTrackingNumber || '',
        storeAddress: formData.storeNameOrAddress || '',
        giftCardNumber: formData.merchandiseNumber || ''
      },
      webService: endpoints.sendEmailForContactUs
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return {success: true};
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }
}
