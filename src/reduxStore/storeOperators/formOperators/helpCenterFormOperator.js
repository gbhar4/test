import {getHelpCenterAbstractor} from 'service/helpCenterServiceAbstractor';
import {getSubmissionError} from '../operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

let previous = null;
let getHelpCenterFormOperator = function (store) {
  if (!previous || previous.store !== store) {
    previous = new HelpCenterFormOperator(store);
  }
  return previous;
};

class HelpCenterFormOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class whoes name that start with 'submit'
    bindAllClassMethodsToThis(this, 'submit');
  }

  get helpCenterServiceAbstractor () {
    return getHelpCenterAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitContactUsForm (formData) {
    // NOTE: formData should have firstName, lastName, emailAddress, confirmEmail, phoneNumber, subject, reasonCode, message
    return this.helpCenterServiceAbstractor.sendEmailForContactUs(formData).catch((err) => {
      throw getSubmissionError(this.store, 'submitContactUsForm', err);
    });
  }
}

export {getHelpCenterFormOperator};
