import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AuthenticationErrorMessage} from './AuthenticationErrorMessage.jsx';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onOpenForgotPassword: storeOperators.globalSignalsOperator.openForgotPasswordForm,
    isRememberedUser: userStoreView.isRemembered(state)
  };
}

let AuthenticationErrorMessageContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToProps)(AuthenticationErrorMessage);
export {AuthenticationErrorMessageContainer};
