import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {PAGES} from 'routing/routes/pages';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {getVendorFormOperator} from 'reduxStore/storeOperators/formOperators/vendorFormOperator';
import {PLCC_OFFER_STATUS,
  getSetPlccEligibleActn,
  getSetPlccPrescreenCodeActn,
  getSetPlccStatusActn,
  getSetPlccApplicationStatusActn
} from 'reduxStore/storeReducersAndActions/user/user';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {getSetIsLoadedActn as getSetIsPromosLoadedActn} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {getSetAlertMessageActn} from 'reduxStore/storeReducersAndActions/checkout/uiFlags/actionCreators';

export const MODAL_IDS = {
  plccPromoModalId: 'PlccOperator_plccPromoModalId',
  plccFormModalId: 'PlccOperator_plccFormModalId',
  wicPromoModalId: 'PlccOperator_wicModalId',
  wicFormModalId: 'PlccOperator_wicFormModalId'
};

let previous = null;
export function getPlccOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new PlccOperator(store);
  }
  return previous;
}

class PlccOperator {
  constructor (store) {
    this.store = store;

    bindAllClassMethodsToThis(this);
  }

  declinePlccOffer () {
    return Promise.resolve(getRoutingOperator(this.store).gotoPage(PAGES.webInstantCredit));
  }

  optionalPlccOfferModal (isEligible, prescreenCode) {
    this.store.dispatch([
      getSetPlccEligibleActn(isEligible),
      getSetPlccPrescreenCodeActn(prescreenCode)
    ]);

    // let state = this.store.getState();
    // let status = plccStoreView.getStatus(state);
    // if (isEligible && status === PLCC_OFFER_STATUS.PENDING) {

    if (isEligible) {
      // offer not yet shown, show it
      return this.openPlccOfferModal();
    } else {
      return Promise.resolve();
    }
  }

  openPlccOfferModal () {
    return new Promise((resolve, reject) => {
      // REVIEW: not sure why addresses stores the callbacks in the store, this way seems more straight forward
      this.resolveModalPromise = resolve;
      this.rejectModalPromise = reject;
      getGeneralOperator(this.store).openCustomModal(MODAL_IDS.plccPromoModalId);
    });
  }

  dismissPlccModal () {
    getGeneralOperator(this.store).closeCustomModal();

    // either succeded, or closed in the middle, in any case
    // we need to resolve the pending promise
    let dismissPlccModalPromiseResult = this.resolveModalPromise && this.resolveModalPromise();
    this.resolveModalPromise = null;

    // DT-32526
    // Error message is hidden behind modal
    // So we need to wait until modal is closed to start the timer and clear the message
    let checkoutAlertMessage = checkoutStoreView.getAlertMessage(this.store.getState());
    if (checkoutAlertMessage) {
      setTimeout(() => {
        this.store.dispatch(getSetAlertMessageActn(null));
      }, 3000);
    }

    return dismissPlccModalPromiseResult;
  }

  submitAcceptWicOffer () {
    getGeneralOperator(this.store).openCustomModal(MODAL_IDS.wicFormModalId);
  }

  dismissWicModal () {
    getGeneralOperator(this.store).closeCustomModal();

    // FIXME: this is a hack because we're reusing the same component for all types of plcc forms
    // and 1 of them uses a promise (plcc form),
    // we should have different operators and containers for the 3 of them to make them simpler
    // (wic full screen, wic modal, plcc modal)
    return Promise.resolve();
  }

  submitAcceptPlccOffer () {
    // call backend service and then show the form
    let prescreenCode = plccStoreView.getPrescreenCode(this.store.getState());

    return getVendorFormOperator(this.store).submitAcceptOrDeclinePreScreen({
      prescreenCode: prescreenCode,
      accepted: true
    }).then(() => {
      getGeneralOperator(this.store).openCustomModal(MODAL_IDS.plccFormModalId);
      this.store.dispatch([
        getSetPlccStatusActn(PLCC_OFFER_STATUS.ACCEPTED)
      ]);
    });
  }

  submitDeclinePlccOffer () {
    // call backend service and then show the form
    let prescreenCode = plccStoreView.getPrescreenCode(this.store.getState());

    return getVendorFormOperator(this.store).submitAcceptOrDeclinePreScreen({
      prescreenCode: prescreenCode,
      accepted: false
    }).then(() => {
      getGeneralOperator(this.store).closeCustomModal();
      this.store.dispatch([
        getSetIsPromosLoadedActn(false), // invalidate coupons cache so that the next time drawer opens we show new promos
        getSetPlccStatusActn(PLCC_OFFER_STATUS.DECLINED)
      ]);

      let plccModalPromiseResult = this.resolveModalPromise && this.resolveModalPromise();
      this.resolveModalPromise = null;

      return plccModalPromiseResult;
    });
  }

  restartPlccApplication () {
    window.location.reload();
  }

  dismissErrorModal () {
    this.store.dispatch([getSetPlccApplicationStatusActn('invalid')]);
  }

}
