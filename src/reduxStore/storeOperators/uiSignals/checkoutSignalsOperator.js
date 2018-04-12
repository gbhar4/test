import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {getSetCheckoutStageActn, getSetIsEditingSubformActn, CHECKOUT_STAGES, CHECKOUT_STAGE_PROP_TYPE, getSetInitPayPalPayment} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {CHECKOUT_SECTIONS} from 'routing/routes/checkoutRoutes';

export {CHECKOUT_STAGES, CHECKOUT_STAGE_PROP_TYPE};

let previous = null;
export function getCheckoutSignalsOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new CheckoutSignalsOperator(store);
  }
  return previous;
}

class CheckoutSignalsOperator {
  constructor (store) {
    this.store = store;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  routeToStage (requestedStage, isAllowForward) {
    let state = this.store.getState();
    let currentStage = checkoutStoreView.getCheckoutStage(state);
    if (requestedStage === currentStage) return;       // nothing to do

    let availableStages = this.getAvailableStages();
    let currentFound = false;
    let requestedFound = false;
    let routingOperator = getRoutingOperator(this.store);
    for (let stage of availableStages) {
      currentFound = currentFound || stage === currentStage;
      if (stage !== requestedStage) continue;

      requestedFound = true;
      if (isAllowForward || !currentFound) {      // allowed to move forward or moving backwards
        this.moveToStage(requestedStage, true);
      } else {      // trying to move forward when not allowed to
        routingOperator.replaceLocation(CHECKOUT_SECTIONS[currentStage]);
      }
      break;
    }
    if (!requestedFound) {    // requested stage is not available (or illegal)
      routingOperator.replaceLocation(CHECKOUT_SECTIONS[currentStage]);
    }
  }

  getAvailableStages () {
    let state = this.store.getState();
    let result = [CHECKOUT_STAGES.BILLING, CHECKOUT_STAGES.REVIEW];
    if (cartStoreView.getIsOrderHasShipping(state)) {
      result.unshift(CHECKOUT_STAGES.SHIPPING);
    }
    if (cartStoreView.getIsOrderHasPickup(state)) {
      result.unshift(CHECKOUT_STAGES.PICKUP);
    }
    return result;
  }

  moveToStage (stageName, isReplace) {
    this.store.dispatch([
      getSetIsEditingSubformActn(null),
      getSetCheckoutStageActn(stageName)
    ]);
    if (isReplace) {
      getRoutingOperator(this.store).replaceLocation(CHECKOUT_SECTIONS[stageName]);
    } else {
      getRoutingOperator(this.store).pushLocation(CHECKOUT_SECTIONS[stageName]);
    }
  }

  openPickupSectionForm (isReplace) {
    return this.moveToStage(CHECKOUT_STAGES.PICKUP, isReplace);
  }

  openShippingSectionForm (isReplace) {
    return this.moveToStage(CHECKOUT_STAGES.SHIPPING, isReplace);
  }

  openBillingSectionForm (isReplace) {
    return this.moveToStage(CHECKOUT_STAGES.BILLING, isReplace);
  }

  openReviewSectionForm (isReplace) {
    return this.moveToStage(CHECKOUT_STAGES.REVIEW, isReplace);
  }

  setIsEditingSubform (isInsideSubform) {
    return this.store.dispatch(getSetIsEditingSubformActn(isInsideSubform));
  }

  setInitPayPalPayment (startPaymentWithPayPal) {
    // Flag to to start payment using paypal button
    this.store.dispatch([getSetInitPayPalPayment(startPaymentWithPayPal)]);
  }
}
