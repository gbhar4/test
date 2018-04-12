/** @module
 * @summary action crerators for manipulating checkout ui flags.
 *
 * @author Ben
 */

export function getSetCheckoutStageActn (stage) {
  return {
    stage,
    type: 'CHECKOUT_FLAGS_SET_STAGE'
  };
}

export function getSetIsPaypalPaymentInProgress (isPaypalPaymentInProgress) {
  return {
    isPaypalPaymentInProgress,
    type: 'CHECKOUT_FLAGS_SET_PAYPAL_IN_PROGRESS'
  };
}

export function getSetIsGiftOptionsEnabled (isGiftOptionsEnabled) {
  return {
    isGiftOptionsEnabled,
    type: 'CHECKOUT_FLAGS_SET_IS_GIFT_OPTIONS_ENABLED'
  };
}

export function getSetMaxGiftCardsActn (maxGiftCards) {
  return {
    maxGiftCards,
    type: 'CHECKOUT_FLAGS_SET_MAX_GIFTCARDS'
  };
}

export function getSetIsPLCCPaymentEnabledEnabledActn (isPLCCPaymentEnabled) {
  return {
    isPLCCPaymentEnabled,
    type: 'CHECKOUT_FLAGS_SET_PLCC_ENABLED'
  };
}

export function getSetIsLoadingShippingMethodsActn (isLoading) {
  return {
    isLoading,
    type: 'CHECKOUT_FLAGS_SET_LOAD_METHODS'
  };
}

export function getSetIsEditingSubformActn (isEditingSubform) {
  return {
    isEditingSubform,
    type: 'CHECKOUT_FLAGS_SET_EDITING_SUBFORM'
  };
}

export function getSetIsBillingVisitedActn (isBillingVisited) {
  return {
    isBillingVisited,
    type: 'CHECKOUT_FLAGS_SET_BILLING_VISITED'
  };
}

export function getSetAlertMessageActn (message) {
  return {
    message,
    type: 'CHECKOUT_FLAGS_SET_ALERT_MESSAGE'
  };
}

export function getSetInitPayPalPayment (initPayPalPayment) {
  return {
    initPayPalPayment,
    type: 'CHECKOUT_FLAGS_SET_INIT_PAYPAL_PAYMENT'
  };
}

export function getSetIsInactivePaymentActn (isInactivePayment) {
  return {
    isInactivePayment,
    type: 'CHECKOUT_FLAGS_SET_INACTIVE_PAYMENT'
  };
}
