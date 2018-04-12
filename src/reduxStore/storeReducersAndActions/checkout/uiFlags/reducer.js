/** @module
 * @summary reducer for checkout ui flags.
 *
 * @author Ben
 */
import Immutable from 'seamless-immutable';

export const CHECKOUT_STAGES = Immutable({
  PICKUP: 'pickup',
  SHIPPING: 'shipping',
  BILLING: 'billing',
  REVIEW: 'review',
  CONFIRMATION: 'confirmation'
});

const defaultUiFlagsStore = Immutable({
  stage: CHECKOUT_STAGES.SHIPPING,
  isGiftOptionsEnabled: true,
  isPLCCPaymentEnabled: true,
  maxGiftCards: 5,
  isPaypalPaymentInProgress: false,
  isLoadingShippingMethods: false,
  isEditingSubform: false,
  isBillingVisited: false,
  alertMessage: null,
  initPayPalPayment: false,
  isInactivePayment: false
});

export function flagsReducer (uiFlags = defaultUiFlagsStore, action) {
  switch (action.type) {
    case 'CHECKOUT_FLAGS_SET_STAGE':
      return Immutable.merge(uiFlags, {stage: action.stage});
    case 'CHECKOUT_FLAGS_SET_ALERT_MESSAGE':
      return Immutable.merge(uiFlags, { alertMessage: action.message });
    case 'CHECKOUT_FLAGS_SET_PAYPAL_IN_PROGRESS':
      return Immutable.merge(uiFlags, {isPaypalPaymentInProgress: action.isPaypalPaymentInProgress});
    case 'CHECKOUT_FLAGS_SET_IS_GIFT_OPTIONS_ENABLED':
      return Immutable.merge(uiFlags, {isGiftOptionsEnabled: action.isGiftOptionsEnabled});
    case 'CHECKOUT_FLAGS_SET_MAX_GIFTCARDS':
      return Immutable.merge(uiFlags, {maxGiftCards: action.maxGiftCards});
    case 'CHECKOUT_FLAGS_SET_PLCC_ENABLED':
      return Immutable.merge(uiFlags, {isPLCCPaymentEnabled: action.isPLCCPaymentEnabled});
    case 'CHECKOUT_FLAGS_SET_LOAD_METHODS':
      return Immutable.merge(uiFlags, {isLoadingShippingMethods: action.isLoading});
    case 'CHECKOUT_FLAGS_SET_EDITING_SUBFORM':
      return Immutable.merge(uiFlags, {isEditingSubform: action.isEditingSubform});
    case 'CHECKOUT_FLAGS_SET_BILLING_VISITED':
      return Immutable.merge(uiFlags, {isBillingVisited: action.isBillingVisited});
    case 'CHECKOUT_FLAGS_SET_INIT_PAYPAL_PAYMENT':
      return Immutable.merge(uiFlags, {initPayPalPayment: action.initPayPalPayment});
    case 'CHECKOUT_FLAGS_SET_INACTIVE_PAYMENT':
      return Immutable.merge(uiFlags, {isInactivePayment: action.isInactivePayment});
    default:
      return uiFlags;
  }
}
