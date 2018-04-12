import Immutable from 'seamless-immutable';

let defaultState = Immutable({
  uiFlags: {
    activeAuthForm: null,           // see AUTHENTICATION_MODAL_FORM_IDS in src/reduxStore/storeOperators/uiSignals/cartSignalsOperator.js
    isBackToLoginEnabled: false,
    /* This is used for the 'back to login' button. Keeps history of what modal you came from.
     *  isCheckoutModalActive = true means the continue as guest button will be visiable. (Citro) */
    isCheckoutLoginModalActive: false
  }
});

const authReducer = function (auth = defaultState, action) {
  switch (action.type) {
    case 'AUTH_OPERATION_ACTIVE_FORM':
      return Immutable.setIn(auth, ['uiFlags', 'activeAuthForm'], action.activeForm);
    case 'AUTH_OPERATION_SET_IS_BACK_ENABLED':
      return Immutable.setIn(auth, ['uiFlags', 'isBackToLoginEnabled'], action.isBackToLoginEnabled);
    case 'AUTH_OPERATION_SET_IS_CHECKOUT_MODAL_ACTIVE':
      return Immutable.setIn(auth, ['uiFlags', 'isCheckoutLoginModalActive'], action.isCheckoutLoginModalActive);
    default:
      return auth;
  }
};

export {authReducer};
