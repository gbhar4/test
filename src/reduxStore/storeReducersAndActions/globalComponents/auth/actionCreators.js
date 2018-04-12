export function getSetAuthActiveFormActn (activeForm) {
  return {
    activeForm: activeForm,
    type: 'AUTH_OPERATION_ACTIVE_FORM'
  };
}

export function getSetIsAuthBackToLoginEnabledActn (isBackToLoginEnabled) {
  return {
    isBackToLoginEnabled: isBackToLoginEnabled,
    type: 'AUTH_OPERATION_SET_IS_BACK_ENABLED'
  };
}

export function getSetIsCheckoutLoginModalActiveAction (isCheckoutLoginModalActive) {
  return {
    isCheckoutLoginModalActive: isCheckoutLoginModalActive,
    type: 'AUTH_OPERATION_SET_IS_CHECKOUT_MODAL_ACTIVE'
  };
}
