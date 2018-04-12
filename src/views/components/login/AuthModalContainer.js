/**
 * @module AuthModalContainer
 * @author Agu
 * Exports the container component for the AuthModal component, connecting state
 * to AuthModal props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView.js';
import {AUTHENTICATION_MODAL_FORM_IDS, getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {AuthModal} from './AuthModal.jsx';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  let activeForm = globalSignalsStoreView.getAuthActiveForm(state);
  let submitLoginOperator = (activeForm === AUTHENTICATION_MODAL_FORM_IDS.LOGIN_FOR_CHECKOUT)
    ? storeOperators.cartOperator.submitLogin
    : storeOperators.userFormOperator.submitLogin;
  let submitCreateAccountOperator = storeOperators.userFormOperator.submitRegister;
  let submitForgotPasswordOperator = storeOperators.userFormOperator.submitForgotPasswordEmailRequest;

  return {
    activeForm: activeForm,
    isRemembered: userStoreView.isRemembered(state),
    isOpen: globalSignalsStoreView.getIsAuthVisible(state),
    backToLogInVisible: globalSignalsStoreView.getIsAuthBackToLoginEnabled(state),
    checkoutLoginNotification: globalSignalsStoreView.getAuthNotification(state),
    globalSignalsOperator: storeOperators.globalSignalsOperator,
    cartOperator: storeOperators.cartOperator,
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US',

    submitLogin: (formData) => {
      return submitLoginOperator(formData).then(() => storeOperators.globalSignalsOperator.closeAuthModal());
    },

    submitCreateAccount: submitCreateAccountOperator,
    submitResetPassword: (formData) => submitForgotPasswordOperator(formData, true),

    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state)
  };
}

let AuthModalContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator,
  userFormOperator: getUserFormOperator,
  cartOperator: getCartOperator
}, mapStateToProps)(AuthModal);

export {AuthModalContainer};
