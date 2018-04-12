import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getSubmissionError, logErrorAndServerThrow} from '../operatorHelper';
import {getVendorAbstractors} from 'service/vendorServiceAbstractor.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getSetPlccApplicationCardActn, getSetPlccPrescreenCodeActn} from 'reduxStore/storeReducersAndActions/user/user.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {getSetPlccCardIdActn, getSetPlccCardNumberActn} from 'reduxStore/storeReducersAndActions/user/user';
import {getAddressesOperator} from '../addressesOperator';
import {getPaymentCardsOperator} from 'reduxStore/storeOperators/paymentCardsOperator';
import {PLCC_SECTIONS} from 'routing/routes/plccRoutes.js';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getSetAlertMessageActn} from '../../storeReducersAndActions/checkout/uiFlags/actionCreators';

let previous = null;
let getVendorFormOperator = function (store) {
  if (!previous || previous.store !== store) {
    previous = new VendorFormOperator(store);
  }
  return previous;
};

class VendorFormOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class whoes name that start with 'submit'
    bindAllClassMethodsToThis(this, 'submit');
  }

  get vendorServiceAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitPrescreenApplicationForm (formData) {
    return this.submitPLCCApplicationForm({
      ...formData,
      prescreen: true
    }).then((res) => {

      /* res.checkoutCouponError is an object from the errorMapping file */
      if (res.checkoutCouponError) {
        this.store.dispatch(getSetAlertMessageActn(res.checkoutCouponError.errorMessage));
      }

      /* For registered users we will need to reload their credit card and address book.
       * Backend saves the PLCC card and address to the user account. If fail do not stop checkout
      */
      if (!userStoreView.isGuest(this.store.getState())) {
        getPaymentCardsOperator(this.store).loadCreditCardsOnAccount()
          .catch((err) => logErrorAndServerThrow(this.store, 'submitPrescreenApplicationForm.getPaymentCardsOperator', err));

        getAddressesOperator(this.store).loadAddressesOnAccount()
          .catch((err) => logErrorAndServerThrow(this.store, 'submitPrescreenApplicationForm.getPaymentCardsOperator', err));
      }
    });
  }

  submitPLCCApplicationForm (formData) {
    return getAddressesOperator(this.store).submitWithOptionalVerifyAddressModal(
      'plccForm', null, formData, this.submitInstantCreditApplication);
  }

  submitInstantCreditApplication (formData) {
    let prescreenCode = plccStoreView.getPrescreenCode(this.store.getState()) || formData.prescreenCode;

    // NOTE: we can't use checkoutStoreView.isExpressCheckout(). Users can navigate back to shipping and trigger RTPS from there.
    let isOnReviewPage = checkoutStoreView.getIsReviewStage(this.store.getState());

    return this.vendorServiceAbstractors.instantCreditApplication({
      ...formData,
      ...formData.address,
      prescreenCode,
      isExpressCheckout: isOnReviewPage
    }).then((res) => {
      // check for res status
      this.store.dispatch([
        getSetPlccApplicationCardActn(res),
        getSetPlccCardIdActn(res.onFileCardId),
        getSetPlccCardNumberActn((res.cardNumber || '').substr(-4))
      ]);

      return res;
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitPLCCApplicationForm', err);
    });
  }

  submitAcceptOrDecline (formData) {
    return this.vendorServiceAbstractors.acceptOrDeclineWIC({
      prescreenCode: formData.prescreenCode,
      accepted: formData.accepted
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitAcceptOrDecline', err);
    });
  }

  submitAcceptOrDeclinePreScreen (formData) {
    return this.vendorServiceAbstractors.acceptOrDeclinePreScreenOffer({
      prescreenCode: formData.prescreenCode,
      accepted: formData.accepted
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitAcceptOrDeclinePreScreen', err);
    });
  }

  submitPrescreenCode (formData) {
    this.store.dispatch(getSetPlccPrescreenCodeActn(formData.prescreenCode));
    getRoutingOperator(this.store).gotoPage(PLCC_SECTIONS.application);

    /*
    return this.vendorServiceAbstractors.preScreenCodeValidation({
      prescreenCode: formData.prescreenCode
    }).then((res) => {
      getRoutingOperator(this.store).gotoPage(PLCC_SECTIONS.application);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitPrescreenCode', err);
    });
    */
  }
}

export {getVendorFormOperator};
